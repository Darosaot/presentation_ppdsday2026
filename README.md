# PPDS Day 2026 — New possibilities

The [published presentation](https://darosaot.github.io/presentation_ppdsday2026/) is a 19-slide Reveal.js deck covering the PPDS data flow, dashboards, exploration tools, SPARQL, and AI. The former v2 URL redirects here and maps its old slide links; the previous source remains in Git history.

## Present and test

Run `python3 -m http.server 8000` in the repository root, then open `http://localhost:8000/`. Reveal loads the Markdown slides through HTTP, so opening the HTML as a local file is insufficient.

Use left/right arrows or Space to move through the deck and its animations. Each slide and fragment has a direct URL, for example `#/sparql-lego/2`. Press `N` for speaker notes.

## Edit

- `PPDS_New_Possibilities_v3.html`: slide order and HTML slides.
- `slides/*.md`: editable Markdown slides and Reveal fragments.
- `styles/presentation.css` and `styles/reveal-layout.css`: presentation design and layout overrides.
- `scripts/presentation.js`: Reveal setup and slide interactions.
- `assets/`: diagrams, AI artwork, and branding.
- `vendor/reveal/plugin/`: locally included PPDS Reveal plugins. See [dependency provenance](vendor/README.md).

The HTML includes Open Graph and Schema.org `PresentationDigitalDocument` metadata, following the [source deck's](https://kvistgaard.github.io/slides/ppds/day-2026/) approach to discoverable presentations.

## Live services

The dashboards and tool slides load live PPDS services. The working dashboard requires login; catalogue figures and SPARQL responses depend on the external service. On the Data Explorer slide, Reveal regains keyboard focus after a service click. On the other interactive slides, a click into the page gives it the keyboard, and grey arrows appear at the bottom right. Click one to move on, and the arrow keys and Space work again. Leaving the full-screen map (F10 or Esc) also gives the keyboard back.
