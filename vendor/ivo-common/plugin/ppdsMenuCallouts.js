/**
 * Callouts on the PPDS menu, over a live-page slide: a blurred balloon, an
 * arrow drawn from it to one of the menu's tabs, then a "New" badge on that
 * tab's top right corner. One click per callout; they stay until a last
 * click clears them all and leaves the page as it was.
 *
 *   <!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/home" data-background-interactive data-preload data-ppds-menu="Home, Data Catalogue, Dashboard, Graph Explorer, Query Service" -->
 *
 *   <div>
 *   <span class="fragment" data-callout="Data Catalogue" data-callout-at="-10 140">What is in PPDS?</span>
 *   <span class="fragment" data-callout="Query Service" data-callout-at="270 -26">Ask Anything</span>
 *   <span class="fragment" data-callout-clear></span>
 *   </div>
 *
 * data-ppds-menu   the tabs of the PPDS menu, left to right, as the live
 *                  page has them on the day. Reorder it if the site changes.
 * data-callout     the tab the arrow points to; the span's text is the
 *                  balloon's (a <br> in it breaks the line).
 * data-callout-at  where the balloon's centre is, in px from the bottom
 *                  centre of its tab: right, then down (negative: left, up).
 *                  Measured in a window up to 860px high; a taller window
 *                  makes balloons and distances up to 1.25 times larger.
 * data-callout-bend   optional: how much the arrow curves, 0 for straight,
 *                  negative to curve the other way (default 0.2).
 * data-callout-not-new  optional: no "New" badge, for a tab that isn't new.
 * data-callout-clear  the click that clears them all.
 *
 * The spans are only placeholders and never show; the balloons are drawn
 * over the slide's background, in the page's own pixels.
 *
 * WHERE THE TABS ARE. The page comes from another site, so the deck can't
 * look inside it; this file computes where its tabs are instead, from the
 * menu's layout and each tab's width, measured on the live page in November
 * 2026 (TAB_WIDTH and MENU below). A tab with a new name, or a changed
 * menu, needs a new measurement: in DevTools on the PPDS page,
 * $$("a.ecl-menu__link").map(a => [a.innerText, a.getBoundingClientRect()]).
 * The page's scrollbar narrows it and moves the menu; the plugin measures
 * the scrollbar of the browser it runs in. A data-background-crop-top on the
 * slide (liveBackground.js) moves the menu up by the crop.
 *
 * In a window narrower than 1140px the PPDS menu folds into a button, so
 * there are no tabs to point at: the callouts don't show, and the console
 * says so.
 *
 * List this plugin after RevealMarkdown.
 */
const PPDSMenuCallouts = (() => {
	// The live PPDS page, November 2026. Each tab is a link, 1px apart; the
	// menu sits in a 1304px-wide centred column, or 32px from the left edge
	// of a narrower page.
	const TAB_WIDTH = {
		Home: 61.67, // bold: the current page
		Dashboard: 97.8,
		"Data Catalogue": 131.5,
		"Query Service": 123,
		"Graph Explorer": 128.37,
	};
	const MENU = { column: 1304, margin: 32, gap: 1, top: 160, bottom: 212, minWindow: 1140 };

	const ACCENT = "#f07c00";
	const STYLE = `
.reveal .slides [data-callout], .reveal .slides [data-callout-clear] { display: none !important; }
.ppds-callouts { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
.ppds-callouts svg.pc-arrows { position: absolute; left: 0; top: 0; overflow: visible; }
.ppds-callouts .pc-line { fill: none; stroke: ${ACCENT}; stroke-linecap: round; }
.ppds-callouts .pc-head { fill: ${ACCENT}; }
.ppds-callouts .pc-balloon {
	position: absolute; box-sizing: border-box;
	display: flex; align-items: center; justify-content: center;
	border-radius: 50%; border: 3px solid ${ACCENT};
	background: rgba(255, 255, 255, 0.55);
	-webkit-backdrop-filter: blur(7px) saturate(1.1);
	backdrop-filter: blur(7px) saturate(1.1);
	box-shadow: 0 6px 22px rgba(0, 10, 60, 0.22);
	color: #0b1440; font-weight: 600; line-height: 1.15; text-align: center;
}
.ppds-callouts .pc-balloon span { display: inline-block; max-width: 6.5em; text-wrap: balance; }
.ppds-callouts .pc-badge { position: absolute; width: 42px; height: 42px; margin: -21px 0 0 -21px; }
.ppds-callouts .pc-badge svg { position: absolute; inset: 0; overflow: visible; }
.ppds-callouts .pc-badge polygon { fill: #ffc400; stroke: ${ACCENT}; stroke-width: 1.5; stroke-linejoin: round; }
.ppds-callouts .pc-badge b {
	position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
	font: 800 11px/1 Arial, sans-serif; letter-spacing: 0.04em; color: #1a1300;
}

/* Hidden: everything leaves at once. */
.ppds-callouts .pc-balloon { opacity: 0; transform: scale(0.85); transition: opacity 0.25s, transform 0.25s; }
.ppds-callouts .pc-line { transition: stroke-dashoffset 0.2s, opacity 0.2s; opacity: 0; }
.ppds-callouts .pc-head { opacity: 0; transition: opacity 0.2s; }
.ppds-callouts .pc-badge { opacity: 0; transform: scale(0) rotate(-40deg); transition: opacity 0.2s, transform 0.2s; }

/* Shown, in order: balloon, arrow, head, badge. */
.ppds-callouts .on.pc-balloon { opacity: 1; transform: none; transition: opacity 0.35s, transform 0.35s; }
.ppds-callouts .on .pc-line { opacity: 1; stroke-dashoffset: 0 !important; transition: stroke-dashoffset 0.6s ease-in-out 0.3s, opacity 0s 0.3s; }
.ppds-callouts .on .pc-head { opacity: 1; transition: opacity 0.12s 0.85s; }
.ppds-callouts .on.pc-badge { opacity: 1; transform: none; transition: opacity 0.15s 1s, transform 0.45s cubic-bezier(0.34, 1.7, 0.64, 1) 1s; }`;

	const SVG = "http://www.w3.org/2000/svg";
	const svgEl = (name, attrs = {}) => {
		const el = document.createElementNS(SVG, name);
		for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
		return el;
	};

	// A 12-point starburst around (0,0).
	const starPoints = (r, inner = 0.8, n = 12) =>
		Array.from({ length: 2 * n }, (_, i) => {
			const a = (Math.PI * i) / n - Math.PI / 2;
			const rr = i % 2 ? r * inner : r;
			return `${(rr * Math.cos(a)).toFixed(2)},${(rr * Math.sin(a)).toFixed(2)}`;
		}).join(" ");

	// Width of the PPDS page's scrollbar in this browser. The page styles it
	// 10px wide, a rule only Chromium browsers follow, so a probe page with the
	// same rule measures it.
	let scrollbar = 0;
	function measureScrollbar(then) {
		const f = document.createElement("iframe");
		f.style.cssText = "position:absolute;left:-9999px;top:0;width:200px;height:200px;border:0;visibility:hidden";
		f.srcdoc = "<!doctype html><style>html::-webkit-scrollbar{width:10px}</style><body style='margin:0;height:2000px'>";
		f.onload = () => {
			try {
				scrollbar = f.contentWindow.innerWidth - f.contentDocument.documentElement.clientWidth;
			} catch (e) {
				/* keep 0 */
			}
			f.remove();
			then();
		};
		document.body.appendChild(f);
	}

	// Tab rectangles in the page's pixels, by name.
	function tabs(order, width) {
		const page = width - scrollbar;
		let x = Math.max(MENU.margin, (page - MENU.column) / 2) + MENU.gap;
		const out = {};
		for (const name of order) {
			const w = TAB_WIDTH[name];
			if (w == null) {
				console.warn(`data-ppds-menu: no width for the tab "${name}"; known tabs: ${Object.keys(TAB_WIDTH).join(", ")} (see ppdsMenuCallouts.js)`);
				return null;
			}
			out[name] = { left: x, right: x + w, top: MENU.top, bottom: MENU.bottom };
			x += w + MENU.gap;
		}
		return out;
	}

	function build(slide, bg) {
		const layer = document.createElement("div");
		layer.className = "ppds-callouts";
		const arrows = svgEl("svg", { class: "pc-arrows" });
		layer.appendChild(arrows);
		const parts = [...slide.querySelectorAll("[data-callout]")].map((src) => {
			const balloon = document.createElement("div");
			balloon.className = "pc-balloon";
			const text = document.createElement("span");
			text.innerHTML = src.innerHTML;
			balloon.appendChild(text);
			const arrow = svgEl("g");
			const line = svgEl("path", { class: "pc-line" });
			const head = svgEl("path", { class: "pc-head" });
			arrow.append(line, head);
			arrows.appendChild(arrow);
			const badge = document.createElement("div");
			badge.className = "pc-badge";
			const star = svgEl("svg", { viewBox: "-21 -21 42 42" });
			star.appendChild(svgEl("polygon", { points: starPoints(20) }));
			const label = document.createElement("b");
			label.textContent = "NEW";
			badge.append(star, label);
			layer.append(balloon);
			if (!src.hasAttribute("data-callout-not-new")) layer.append(badge);
			return { src, balloon, text, arrow, line, head, badge };
		});
		bg.appendChild(layer);
		return { layer, arrows, parts };
	}

	function layout(slide, built, bg) {
		const W = bg.clientWidth;
		const H = bg.clientHeight;
		const order = slide.getAttribute("data-ppds-menu").split(",").map((s) => s.trim()).filter(Boolean);
		const where = W >= MENU.minWindow && tabs(order, W);
		built.layer.style.display = where ? "" : "none";
		if (!where) {
			if (W && W < MENU.minWindow) console.warn(`ppdsMenuCallouts: the window is ${W}px wide; below ${MENU.minWindow}px the PPDS menu folds into a button, so the callouts don't show`);
			return;
		}
		const crop = parseFloat(getComputedStyle(bg).getPropertyValue("--crop-top")) || 0;
		const s = Math.min(1.25, Math.max(1, H / 860));
		built.layer.style.fontSize = `${24 * s}px`;
		built.arrows.setAttribute("width", W);
		built.arrows.setAttribute("height", H);

		for (const p of built.parts) {
			const name = p.src.getAttribute("data-callout");
			const tab = where[name];
			const hide = !tab;
			for (const el of [p.balloon, p.badge]) el.style.display = hide ? "none" : "";
			p.arrow.style.display = hide ? "none" : "";
			if (hide) {
				console.warn(`data-callout="${name}": not a tab in data-ppds-menu`);
				continue;
			}
			const top = tab.top - crop;
			const bottom = tab.bottom - crop;

			// Balloon: an ellipse round the text, its corners on the ellipse.
			const tw = p.text.offsetWidth;
			const th = p.text.offsetHeight;
			const rx = (tw * Math.SQRT2) / 2 + 14 * s;
			const ry = (th * Math.SQRT2) / 2 + 10 * s;
			const [ax, ay] = (p.src.getAttribute("data-callout-at") || "0 140").split(/[\s,]+/).map(Number);
			let cx = (tab.left + tab.right) / 2 + ax * s;
			const cy = bottom + ay * s;
			cx = Math.min(W - rx - 12, Math.max(rx + 12, cx)); // keep it on screen
			Object.assign(p.balloon.style, { left: `${cx - rx}px`, top: `${cy - ry}px`, width: `${2 * rx}px`, height: `${2 * ry}px` });

			// Target: the tab's side if the balloon is beside the menu,
			// otherwise its bottom edge, below the label.
			let tx, ty;
			if (cy - ry * 0.5 < bottom && (cx > tab.right || cx < tab.left)) {
				tx = cx > tab.right ? tab.right + 2 : tab.left - 2;
				ty = top + (bottom - top) * 0.62;
			} else {
				const inset = (tab.right - tab.left) * 0.25;
				tx = Math.min(tab.right - inset, Math.max(tab.left + inset, cx));
				ty = bottom + 2;
			}

			// Start on the ellipse, facing the target, with a small gap.
			const dx0 = tx - cx;
			const dy0 = ty - cy;
			const k = 1 / Math.hypot(dx0 / rx, dy0 / ry);
			const d0 = Math.hypot(dx0, dy0);
			const sx = cx + dx0 * k + (dx0 / d0) * 6 * s;
			const sy = cy + dy0 * k + (dy0 / d0) * 6 * s;

			// A gentle curve: steep arrows bow right, flat ones bow down.
			const dx = tx - sx;
			const dy = ty - sy;
			const len = Math.hypot(dx, dy);
			let nx = -dy / len;
			let ny = dx / len;
			if (Math.abs(dy) >= Math.abs(dx) ? nx < 0 : ny < 0) [nx, ny] = [-nx, -ny];
			const bend = parseFloat(p.src.getAttribute("data-callout-bend") ?? "0.2");
			const qx = (sx + tx) / 2 + nx * bend * len;
			const qy = (sy + ty) / 2 + ny * bend * len;

			// Head along the curve's last direction; the line stops inside it.
			let ux = tx - qx;
			let uy = ty - qy;
			const ul = Math.hypot(ux, uy);
			ux /= ul;
			uy /= ul;
			const hl = 17 * s;
			const hw = 8.5 * s;
			const ex = tx - ux * hl * 0.7;
			const ey = ty - uy * hl * 0.7;
			const r = (v) => v.toFixed(1);
			p.line.setAttribute("d", `M${r(sx)},${r(sy)} Q${r(qx)},${r(qy)} ${r(ex)},${r(ey)}`);
			p.line.style.strokeWidth = `${3.5 * s}px`;
			const total = p.line.getTotalLength();
			p.line.style.strokeDasharray = `${total} ${total}`;
			p.line.style.strokeDashoffset = `${total}`;
			const bx = tx - ux * hl;
			const by = ty - uy * hl;
			p.head.setAttribute("d", `M${r(tx)},${r(ty)} L${r(bx - uy * hw)},${r(by + ux * hw)} L${r(bx + uy * hw)},${r(by - ux * hw)} Z`);

			// Badge on the tab's top right corner.
			Object.assign(p.badge.style, { left: `${tab.right - 6}px`, top: `${top - 2}px` });
		}
	}

	// Which callouts are on: each follows its own placeholder, unless the
	// clearing one is showing too.
	function update(slide, built) {
		const cleared = [...slide.querySelectorAll("[data-callout-clear]")].some((el) => el.classList.contains("visible"));
		for (const p of built.parts) {
			const on = !cleared && p.src.classList.contains("visible");
			for (const el of [p.balloon, p.arrow, p.badge]) el.classList.toggle("on", on);
		}
	}

	return {
		id: "ppds-menu-callouts",
		init(reveal) {
			const slides = [...reveal.getRevealElement().querySelectorAll("section[data-ppds-menu]")];
			if (!slides.length) return;
			const css = document.createElement("style");
			css.textContent = STYLE;
			document.head.appendChild(css);

			const built = new Map();
			let measured = false;
			// The background is rebuilt if Reveal re-syncs; build again then.
			const get = (slide) => {
				const bg = reveal.getSlideBackground(slide);
				if (!bg) return null;
				let b = built.get(slide);
				if (!b || !bg.contains(b.layer)) {
					b = build(slide, bg);
					built.set(slide, b);
				}
				return { b, bg };
			};
			const refresh = (relayout) => {
				const slide = reveal.getCurrentSlide();
				if (!slides.includes(slide) || !measured) return;
				const got = get(slide);
				if (!got) return;
				if (relayout) layout(slide, got.b, got.bg);
				update(slide, got.b);
			};

			reveal.on("ready", () => {
				slides.forEach(get);
				measureScrollbar(() => {
					measured = true;
					refresh(true);
				});
			});
			reveal.on("slidechanged", () => refresh(true));
			reveal.on("resize", () => refresh(true));
			reveal.on("fragmentshown", () => refresh(false));
			reveal.on("fragmenthidden", () => refresh(false));
		},
	};
})();
