/**
 * A live web page as a slide background, with the site's header cropped off.
 *
 *   <!-- .slide: data-background-iframe="https://example.org/page" data-background-interactive data-preload data-background-crop-top="212, 128 below 1140" -->
 *
 * The first three attributes are Reveal's own: the page fills the slide,
 * responds to clicks (data-background-interactive) and loads a few slides
 * ahead (data-preload). This plugin adds two things.
 *
 * CROP. data-background-crop-top moves the page up by that many pixels, so
 * the slide starts below the site's header; the frame grows by the same
 * amount, so nothing is lost at the bottom. A site's header usually changes
 * height with the width of the window, and a background is as wide as the
 * window, so the value can change at the site's breakpoints:
 *
 *   "212"                    212px at every width
 *   "212, 128 below 1140"    212px, and 128px in a window narrower than 1140px
 *
 * To measure: open the page itself at the width you will present at, find
 * the top of the first thing the slide should show (in DevTools,
 * element.getBoundingClientRect().top), and use that number. Then narrow
 * the window until the header changes, and measure again on each side of
 * the step. Leave the attribute out to show the whole page.
 *
 * KEYBOARD. A background page can take the keyboard: once clicked, or by
 * putting its cursor somewhere as soon as it loads, which with data-preload
 * happens a few slides early. Keys then go to a page that isn't showing, and
 * the deck (or a presenter's clicker) stops moving. So the deck takes the
 * keyboard back whenever a page has it while its slide is not showing. For a
 * page that grabs the cursor on load, add data-background-grabs-focus, and
 * the deck also takes back the first focus after each load. A click into a
 * page on its own slide keeps the keyboard there, for typing; the on-screen
 * arrow, or any slide change, gives it back to the deck. For a page that is
 * clicked but never typed in, add data-background-deck-keys, and the deck
 * takes the keyboard back just after each click, once the page has handled
 * it (a link it follows included). A page that goes full screen, as the PPDS
 * editor's results do with F10, gives the keyboard back to the deck when it
 * leaves full screen (F10 again, or Esc).
 *
 * A page that refuses to be framed (X-Frame-Options or a CSP frame-ancestors
 * rule) stays blank; x.com is one. The page is live, so the room needs the
 * network.
 *
 * List this plugin after RevealMarkdown, and after any plugin that writes
 * these attributes (ppdsSPARQLEditor.js does). Reveal starts plugins one at a
 * time, so by then the slides are HTML, and the backgrounds are not built yet.
 */
const LiveBackground = (() => {
	// "212, 128 below 1140" → CSS for one background, widest first so that the
	// narrower rules come later and win.
	function cropRules(value, cls) {
		const steps = value.split(",").map((part) => {
			const m = part.trim().match(/^(\d+)(?:px)?(?:\s+below\s+(\d+)(?:px)?)?$/);
			if (!m) throw new Error(part.trim());
			return { crop: +m[1], below: m[2] ? +m[2] : Infinity };
		});
		steps.sort((a, b) => b.below - a.below);
		return steps.map(({ crop, below }) => {
			const rule = `.reveal .slide-background.${cls} { --crop-top: ${crop}px; }`;
			return below === Infinity ? rule : `@media (max-width: ${below - 1}.98px) { ${rule} }`;
		});
	}

	// Reveal sizes a background iframe with inline styles, hence !important.
	const STYLE = `
.reveal .slide-background.live-crop iframe {
	position: absolute;
	left: 0;
	top: calc(-1 * var(--crop-top)) !important;
	height: calc(100% + var(--crop-top)) !important;
	max-height: none !important;
}
.reveal:focus { outline: none; }`;

	function keepKeyboard(reveal) {
		const deck = reveal.getRevealElement();
		const settled = new WeakSet(); // frames whose on-load grab has been undone
		const ours = (el) => el?.tagName === "IFRAME" && el.closest(".backgrounds .slide-background");
		const grabsFocus = (frame) => frame.closest(".slide-background.live-grabs-focus");
		const deckKeys = (frame) => frame.closest(".slide-background.live-deck-keys");
		const showing = (frame) => frame.closest(".slide-background").classList.contains("present");
		const reclaim = () => {
			deck.tabIndex = -1;
			deck.focus({ preventScroll: true });
		};

		// A frame's load event does not bubble, but it does pass the capture phase.
		deck.addEventListener("load", (e) => ours(e.target) && settled.delete(e.target), true);

		// Focus moving into a frame blurs this window.
		window.addEventListener("blur", () =>
			setTimeout(() => {
				const frame = document.activeElement;
				if (!ours(frame)) return;
				if (grabsFocus(frame) && !settled.has(frame)) {
					settled.add(frame);
					reclaim();
				} else if (!showing(frame)) reclaim();
				else if (deckKeys(frame)) {
					// Let the iframe finish its click (including link navigation) first.
					setTimeout(() => {
						if (document.activeElement === frame && showing(frame)) reclaim();
					}, 150);
				}
			})
		);

		reveal.on("slidechanged", () => {
			const frame = document.activeElement;
			if (ours(frame) && !showing(frame)) reclaim();
		});

		// A frame in full screen is this document's fullscreenElement. Watch for
		// it to leave, rather than for the full screen to end: the deck itself
		// may be in full screen underneath.
		let fullFrame = null;
		document.addEventListener("fullscreenchange", () => {
			const el = document.fullscreenElement;
			if (ours(el)) fullFrame = el;
			else if (fullFrame) {
				fullFrame = null;
				if (ours(document.activeElement)) reclaim();
			}
		});
	}

	return {
		id: "live-background",
		init(reveal) {
			const rules = [];
			const marks = []; // [slide, classes for its background]
			reveal
				.getRevealElement()
				.querySelectorAll("section[data-background-iframe]")
				.forEach((slide, i) => {
					const classes = [];
					const crop = slide.getAttribute("data-background-crop-top");
					if (crop) {
						try {
							rules.push(...cropRules(crop, `live-crop-${i}`));
							classes.push("live-crop", `live-crop-${i}`);
						} catch (bad) {
							console.warn(`data-background-crop-top="${crop}": can't read "${bad.message}"; expected e.g. "212, 128 below 1140" (see liveBackground.js)`);
						}
					}
					if (slide.hasAttribute("data-background-grabs-focus")) classes.push("live-grabs-focus");
					if (slide.hasAttribute("data-background-deck-keys")) classes.push("live-deck-keys");
					if (classes.length) marks.push([slide, classes]);
				});

			const css = document.createElement("style");
			css.textContent = rules.join("\n") + STYLE;
			document.head.appendChild(css);

			reveal.on("ready", () => marks.forEach(([slide, classes]) => reveal.getSlideBackground(slide)?.classList.add(...classes)));
			keepKeyboard(reveal);
		},
	};
})();
