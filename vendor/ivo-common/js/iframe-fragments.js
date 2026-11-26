/*
 * iframe-fragments.js — parent side of the reveal ↔ iframe fragment bridge.
 *
 * Reveal.js fragments only affect elements inside the reveal document; an
 * <iframe> is a separate document reveal cannot touch. This bridges the two:
 * it watches reveal's own fragment events and tells the embedded page which
 * steps are currently on, via postMessage. The embedded page reacts with
 * common/js/reveal-iframe-receiver.js.
 *
 * On a slide, mark the iframe and add one fragment placeholder per click,
 * each naming the step(s) it switches on:
 *
 *   <iframe data-fragment-iframe src="figure.html"></iframe>
 *   <span class="fragment" data-iframe-step="1"></span>
 *   <span class="fragment" data-iframe-step="2"></span>
 *   <span class="fragment" data-iframe-step="3"></span>
 *
 * The value is a list of step numbers: "3", "3 4", "3,4" or a range "3-5".
 * A step is on while any visible placeholder names it, so:
 *   - delete the "3" placeholder and step 3 never shows, the others keep
 *     their numbers;
 *   - write "3 4" on one placeholder and steps 3 and 4 appear on one click;
 *   - list them in any order, or give the placeholders data-fragment-index
 *     to interleave them with the slide's other fragments.
 *
 * A placeholder with no value (legacy markup) is numbered by its position
 * among the value-less placeholders of its group: the first is step 1, the
 * next step 2, and so on. Do not mix the two forms in one group.
 *
 * The message carries `steps`, the sorted list of steps that are on, and
 * `step`, the highest of them (0 when none), for pages that only track a
 * count. State is recomputed from the DOM on every event (not incremented),
 * so forward, backward, and hash-jump navigation all stay in sync — the same
 * approach as annotations.js.
 *
 * Multiple animated iframes on one slide: give each iframe and its
 * placeholders a matching data-fragment-group="name". With no group, all
 * data-iframe-step placeholders on the slide drive every data-fragment-iframe
 * on the slide.
 *
 * Placeholders should not take up space; custom5.css hides them. Decks on an
 * older stylesheet add style="display:none;" to each one.
 */
(function () {
	"use strict";

	var MSG = "reveal:iframe-step";

	function post(iframe, steps) {
		try {
			if (iframe.contentWindow) {
				iframe.contentWindow.postMessage(
					{ type: MSG, step: steps.length ? steps[steps.length - 1] : 0, steps: steps },
					"*"
				);
			}
		} catch (e) {
			/* cross-origin or not-yet-loaded — ignored; a later sync will retry */
		}
	}

	// "3", "3 4", "3,4", "3-5" → [3, 4, 5]. Anything unparsable is dropped.
	function parseSteps(value) {
		var out = [];
		var tokens = value.split(/[\s,]+/);
		for (var i = 0; i < tokens.length; i++) {
			var m = /^(\d+)(?:-(\d+))?$/.exec(tokens[i]);
			if (!m) continue;
			var a = parseInt(m[1], 10);
			var b = m[2] ? parseInt(m[2], 10) : a;
			for (var n = Math.min(a, b); n <= Math.max(a, b); n++) out.push(n);
		}
		return out;
	}

	// The steps a placeholder switches on: its explicit list, or its ordinal
	// among the value-less placeholders of the group.
	function stepsOf(span, counter) {
		var value = (span.getAttribute("data-iframe-step") || "").trim();
		if (value) return parseSteps(value);
		counter.n += 1;
		return [counter.n];
	}

	// For one iframe on a slide, collect the steps named by its visible
	// placeholders, and send them.
	function syncIframe(slide, iframe) {
		var group = iframe.getAttribute("data-fragment-group");
		var selector = group
			? '.fragment[data-iframe-step][data-fragment-group="' + group + '"]'
			: ".fragment[data-iframe-step]";
		var spans = slide.querySelectorAll(selector);
		var on = {};
		var counter = { n: 0 };
		for (var i = 0; i < spans.length; i++) {
			var steps = stepsOf(spans[i], counter);
			if (!spans[i].classList.contains("visible")) continue;
			for (var j = 0; j < steps.length; j++) on[steps[j]] = true;
		}
		var list = Object.keys(on).map(Number).sort(function (a, b) { return a - b; });
		post(iframe, list);
	}

	function syncSlide(slide) {
		if (!slide) return;
		var iframes = slide.querySelectorAll("iframe[data-fragment-iframe]");
		for (var i = 0; i < iframes.length; i++) syncIframe(slide, iframes[i]);
	}

	function syncCurrent() {
		if (typeof Reveal === "undefined") return;
		syncSlide(Reveal.getCurrentSlide());
	}

	function init() {
		if (typeof Reveal === "undefined") {
			setTimeout(init, 100);
			return;
		}

		Reveal.on("ready", syncCurrent);
		Reveal.on("slidechanged", syncCurrent);
		Reveal.on("fragmentshown", syncCurrent);
		Reveal.on("fragmenthidden", syncCurrent);

		// A newly-loaded iframe may have missed the events above; resend once it
		// loads. Capture phase because <iframe> load does not bubble.
		document.addEventListener(
			"load",
			function (e) {
				var t = e.target;
				if (t && t.tagName === "IFRAME" && t.hasAttribute("data-fragment-iframe")) {
					var slide = t.closest ? t.closest("section") : null;
					if (slide) syncSlide(slide);
					else syncCurrent();
				}
			},
			true
		);

		// The receiver announces itself when it is ready; answer with the
		// current state. Handles the iframe loading after reveal fired.
		window.addEventListener("message", function (event) {
			if (event.data && event.data.type === "reveal:iframe-ready") {
				syncCurrent();
			}
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
