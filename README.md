# New possibilities in the PPDS

The [v3 presentation](PPDS_New_Possibilities_v3.html) is a single Reveal.js deck with 19 slides. It combines Daniel's dashboard and AI slides with Ivo's original Markdown slides, animations, and custom Reveal plugins. The [v2 deck](PPDS_New_Possibilities_v2.html) remains the published version while v3 is reviewed.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/PPDS_New_Possibilities_v3.html`. A web server is required because Reveal fetches the Markdown slides. For a direct slide or animation step, use a URL such as `#/sparql-lego/2`. Left/right arrows and Space navigate the deck and its fragments. `N` opens speaker notes.

## Edit v3

- Edit Daniel's slide HTML in `PPDS_New_Possibilities_v3.html` and shared layout rules in `v3.css`.
- Edit Ivo's slide content and fragments in `v3/ivo/*.md`. The original source is preserved in `ivo/`.
- Edit the custom plugins in `vendor/ivo-common/plugin/`. The local plugin copies let contributors run and test v3 without Ivo's separate site.
- `scripts/migrate-v3.mjs` records the one-time v2-to-v3 migration. **Do not rerun it after editing v3:** it regenerates the HTML and Markdown from v2 and overwrites v3 changes.

The two dashboards and Ivo's tool slides use live PPDS services. The working dashboard requires login. The catalogue and SPARQL results depend on the external PPDS service, so an upstream error can appear in the iframe even when the deck loads correctly. Clicking inside a cross-origin iframe gives it keyboard focus; click outside the iframe to return arrow/Space control to Reveal.

The current GitHub Pages landing page (`index.html`) still points to v2. Switch it to v3 only after the deck has been reviewed.
