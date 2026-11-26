/**
 * The PPDS SPARQL editor as a slide background, with a query already in it.
 *
 *   ```ppds-sparql-editor
 *   SELECT * WHERE { ?s ?p ?o } LIMIT 10
 *   ```
 *
 * A fenced block marked ppds-sparql-editor becomes the background of its slide:
 * the PPDS Query Service page, cropped to its editor, with the block's query
 * loaded. The block itself is removed; speaker notes stay. The page runs the
 * query as soon as it loads, and data-preload loads it a few slides ahead, so
 * the results are there when the slide opens. Run runs it again.
 *
 * Mark the block ppds-sparql-editor-templates instead to keep the page's
 * "Select a query template" menu above the editor. Picking a template fills
 * the editor but does not run it. Don't leave the block empty: the page runs
 * the empty query and shows an error box under the editor.
 *
 * The block is shorthand for a live-page slide (liveBackground.js): this
 * plugin writes the slide's data-background-iframe, with the query in its
 * URL, and its data-background-crop-top, from CROP below, and liveBackground.js
 * does the rest. Other PPDS pages, which take no query, are written as
 * live-page slides directly.
 *
 * Same idea as remoteSPARQLEditor.js in querying-pp-graphs (a fence in, a live
 * editor out), with two differences forced by the PPDS site:
 *
 * - It frames the real page, not a bare editor of our own. The PPDS endpoint
 *   sends no Access-Control-Allow-Origin header, so a Yasgui page served from
 *   github.io would show the query but never get results. Only a page served
 *   from the PPDS origin can run it.
 * - The query travels in the URL (?query=...), which the page's Yasgui reads on
 *   load (its populateFromUrl option, on by default).
 *
 * WRITE QUERIES WITHOUT ";" – repeat the subject instead of a predicate list.
 * On load the page's Angular router rewrites the URL and turns every %3B back
 * into ";", and Yasgui's URL parser (jsuri) splits parameters at ";", so the
 * query arrives cut off at its first semicolon. No encoding survives this; only
 * PPDS can fix it. The plugin warns in the console when a query has one. The
 * fragment (#query=) is worse: Angular also unescapes "&" and "+" there.
 *
 * WRITE QUERIES IN THE EDITOR'S OWN LAYOUT – the one it shows after a run, as
 * in the fence in ppds/day-2026. Yasgui keeps its tabs in the browser's storage
 * and reformats a query when it runs it. On load it looks for a tab holding
 * exactly the query in the URL; if the layouts differ it finds none and adds a
 * new tab, so the tabs pile up with every load of the slide. Changing a query
 * on stage, or picking a template, does the same once, at the next load. All
 * the slides share one set of tabs, since they all load the same page.
 *
 * List this plugin after RevealMarkdown and before LiveBackground.
 */
const PPDSSparqlEditor = (() => {
	const PAGE = "https://api.public-procurement-data-space.europa.eu/data-explorer/query-service";

	// data-background-crop-top values, measured on the live page in November
	// 2026. The site's header changes at 1140px and 996px, and the page's Clear
	// button wraps under its menu below 961px; narrower than 768px is not
	// covered. If PPDS changes the page, measure again.
	const CROP = {
		// to the top of .yasgui-host, where the editor's tabs start
		editor: "455, 371 below 1140, 367 below 996, 419 below 961",
		// to 8px above .query-controls, the template menu
		templates: "349, 265 below 1140, 261 below 996",
	};

	return {
		id: "ppds-sparql-editor",
		init(reveal) {
			const fences = ["ppds-sparql-editor", "ppds-sparql-editor-templates"];
			reveal
				.getRevealElement()
				.querySelectorAll(fences.map((f) => `code.${f}, code.language-${f}`).join(", "))
				.forEach((code) => {
					const slide = code.closest("section");
					const query = code.textContent.trim();
					const templates = /(^|\s)(language-)?ppds-sparql-editor-templates(\s|$)/.test(code.className);
					if (!query) console.warn("ppds-sparql-editor: empty query; the page will run it and show an error (see ppdsSPARQLEditor.js)");
					if (query.includes(";")) console.warn(`ppds-sparql-editor: this query will arrive cut off at its first ";" (see ppdsSPARQLEditor.js):\n${query}`);
					slide.setAttribute("data-background-iframe", `${PAGE}?query=${encodeURIComponent(query)}`);
					slide.setAttribute("data-background-interactive", "");
					slide.setAttribute("data-preload", "");
					slide.setAttribute("data-background-crop-top", templates ? CROP.templates : CROP.editor);
					// The page puts its cursor in the editor as soon as it loads.
					slide.setAttribute("data-background-grabs-focus", "");
					(code.closest("pre") || code).remove();
				});
		},
	};
})();
