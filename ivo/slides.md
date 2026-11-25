 
<div class="slide-frame">

<div class="fill-center" style="flex-direction: column;">
<span class="title-main" style="white-space: nowrap; margin: 0.1em 0 0.25em;">New PPDS Services</span>
</div>

<div class="byline" style="font-size: 0.65em;">

  [Ivo Velitchkov](https://velitchkov.eu) | 1<sup>st</sup> of December | PPDS Day | Brussels
  </div>

</div>

Note:
TO DO BEFORE THE TALK (delete each line when done; delete this note last)
- [ ] Apart from the title, QR and Data Explorer slides, the content is still the ISWC talk (Façade-X, decoupled graph construction); replace it with the new services.
- [ ] Byline: link "PPDS Day" to the event page, if there is one.
- [ ] The five PPDS slides (Data Explorer, Data Catalogue, Graph Explorer, the two SPARQL editors): they load the live site, so they need the network in the room. Check what the offline package does with a background iframe before relying on it.
- [ ] Data Catalogue, Graph Explorer and SPARQL editor slides: their crop is measured from the live pages (November 2026). Look at them again shortly before the talk; if a PPDS page has changed, update data-background-crop-top on the catalogue and Graph Explorer slides, and CROP in common/plugin/ppdsSPARQLEditor.js for the two editors.
- [ ] Data Explorer slide: its arrows aim at the new PPDS menu (Home, Data Catalogue, Dashboard, Graph Explorer, Query Service). Shortly before the talk, check the live menu; if PPDS hasn't reordered it, set data-ppds-menu on that slide to the order it has (see its note).
- [ ] Present from a private window: the SPARQL editors then open with one tab each. In a normal window, every template picked or query changed in a rehearsal leaves an extra tab; close them with their ✖.
- [ ] On 1 December: list the deck (node common/tools/list-deck.js ppds/day-2026), rerun update-meta.js if title, venue or date changed (--force-card for the card), push only when ready.
- [ ] After any change: node common/tools/check-slides.js ppds/day-2026/slides.md, then rebuild the offline copy (node common/tools/pack-offline.js ppds/day-2026 --zip).

---
## the slides <!-- .element: class="title-center" -->

<!-- style="width: 308px !important" -->

<img src="https://kvistgaard.github.io/slides/assets/qr-ppds-day-2026.svg" class="qr-code"   />

[kvistgaard.github.io/slides/ppds/day-2026](https://kvistgaard.github.io/slides/ppds/day-2026/)

---

## PPDS Data Flow

<img src="https://kvistgaard.github.io/slides/assets/ppds-pipeline-ppds-day-2026.svg ">

---

<!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/home" data-background-interactive data-preload data-ppds-menu="Home, Data Catalogue, Dashboard, Graph Explorer, Query Service" -->

<div>
<span class="fragment" data-callout="Data Catalogue" data-callout-at="-10 140">What is in PPDS?</span>
<span class="fragment" data-callout="Dashboard" data-callout-at="70 230" data-callout-not-new>Analytics</span>
<span class="fragment" data-callout="Graph Explorer" data-callout-at="300 150">Notices as graph facets</span>
<span class="fragment" data-callout="Query Service" data-callout-at="270 -26">Ask Anything</span>
<span class="fragment" data-callout-clear></span>
</div>

Note:
HOW THIS SLIDE IS MADE
- A live-page background, like the Data Catalogue slide after it: data-background-iframe is the page, data-background-interactive lets it take clicks, data-preload loads it a few slides ahead.
- Five clicks. Each of the first four shows a balloon, draws its arrow to a tab of the PPDS menu, and puts a "New" badge on that tab, except Dashboard (data-callout-not-new); the fifth clears them all. common/plugin/ppdsMenuCallouts.js draws them from the spans above, which never show.
- data-ppds-menu is the order of the PPDS tabs on the day, and the arrows aim at it. It holds the new order, so until PPDS reorders its menu the arrows and badges land one tab off. If the site still has the old order on the day, write that in instead: Home, Dashboard, Data Catalogue, Query Service, Graph Explorer.
- data-callout-at places each balloon: its centre, in px from the bottom centre of its tab, right then down. The text of a span is its balloon's text; a <br> breaks the line.
- The window must be at least 1140px wide; narrower, the PPDS menu folds into a button and the callouts don't show.

---

<!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/data-catalogue" data-background-interactive data-preload data-background-crop-top="212, 128 below 1140" -->

Note:
HOW THIS SLIDE IS MADE
- A live-page background, like the Data Explorer slide before it: data-background-iframe is the page, data-background-interactive lets it take clicks, data-preload loads it a few slides ahead.
- data-background-crop-top cuts the PPDS header off: the page moves up 212px, or 128px in a window narrower than 1140px, where the header is shorter (measured November 2026). Delete the attribute to show the whole page.
- common/plugin/liveBackground.js does the cropping and explains how to measure. Gallery template T27.

---

<!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/graph-explorer" data-background-interactive data-preload data-background-crop-top="317, 233 below 1140, 229 below 996, 225 below 961" -->

Note:
HOW THIS SLIDE IS MADE
- A live-page background, like the Data Explorer slide: data-background-iframe is the page, data-background-interactive lets it take clicks, data-preload loads it a few slides ahead.
- data-background-crop-top cuts the PPDS header and the page title off, so the slide starts 8px above the Graph Explorer's own tabs (Home, Inspect, Customize). The header is shorter in narrower windows, hence the four values (measured November 2026). Delete the attribute to show the whole page.
- common/plugin/liveBackground.js does the cropping and explains how to measure. Gallery template T27.
- The Home tab's carousel sizes itself to the frame, which is taller than the slide by the crop, so its text sits in the lower half. Inspect has no address of its own, so the slide can't open on it.

---

```ppds-sparql-editor-templates
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT *
WHERE {
  ?sub ?pred ?obj .
}
LIMIT 10
```

Note:
THE TEMPLATE MENU ON THIS SLIDE
- How it is made: the fence is shorthand for a live-page background (gallery T27). common/plugin/ppdsSPARQLEditor.js turns it into the Query Service page with the fence's query in its URL, cropped to start at the template menu; ppdsSPARQLEditor.js holds the crop values.
- The live PPDS Query Service, so the room needs the network.
- The editor opens with the page's own sample query, already run.
- Picking a template replaces the query but does not run it: press Run.
- Clear brings the sample query back.

---

```ppds-sparql-editor
PREFIX epo: <http://data.europa.eu/a4g/ontology#>

SELECT DISTINCT ?procedure ?title
WHERE {
  ?procedure a epo:Procedure .
  ?procedure epo:hasTitle ?title .
}
LIMIT 10
```

Note:
THE QUERY ON THIS SLIDE
- The query is written in the fence on this slide in slides.md and passed to the live PPDS Query Service (public endpoint), so the room needs the network. common/plugin/ppdsSPARQLEditor.js turns the fence into a live-page background (gallery T27), cropped to start at the editor's tabs.
- No ";" in the query: the PPDS page cuts it off at the first one. Repeat the subject instead of a predicate list. The browser console warns if one slips in.
- The page runs the query as soon as it loads, a few slides ahead, so the results are already there when the slide opens. Run runs it again.
- The fence is in the editor's own layout (on screen the PREFIX lines fold into "↔"). To change the query, run it on the PPDS page and copy it back from the editor: in any other layout the editor adds a tab every time the deck loads.


---

## SPARQL is like assembling Lego blocks

Blocks (triple patterns) are snapped on the common variable<!-- .element: data-fragment-index="1" class="fragment align-left text-small"--> <br>

Example: From role to country code<!-- .element: data-fragment-index="2" class="fragment align-left text-small"-->

![alt](https://kvistgaard.github.io/slides/assets/sparql-lego-ppds.svg)<!-- .element: data-fragment-index="3" class="fragment" -->



<div class="d-flex flex-gap-small">
<div data-fragment-index="3" class="fragment flex-fill-equal align-left d-block" style="font-size:2.5rem; ">

```sparql
SELECT * {
    ?rope a epo:Buyer .
    ?role epo:playedBy ?organisation .
    ?organisation epo:registeredAddress ?address .
    ?address epo:hasCountryCode ?countryCode .
}
```

---
## Query Service user options


<ul class="term-list" style="--term-gloss-gap: 0; --term-item-gap: 1.3em;">
  <li class="fragment" data-fragment-index="1">
    <span class="term"><b>Query library:</b> select and run</span>
    <span class="gloss">Select a query from the library and change a parameter as needed</span>
  </li>
  <li class="fragment" data-fragment-index="2">
    <span class="term"><b>Use AI:</b> point your agent to the <a href=https://github.com/OP-TED/ePO/tree/release/3.1.0>ontology</a> and the library</span>
    <span class="gloss">An integrated service is planned for 2027</span>
  </li>
  <li class="fragment" data-fragment-index="3">
    <span class="term"><b>Learn SPARQL:</b> free PPDS-focused course</span>
    <span class="gloss">PPDS members can enrol to a PPDS SPARQL training course</span>
  </li>
</ul>

---

## More SPARQL resources

<br>
<ul class="list-unstyled margin-3">
<b>General on SPARQL</b><br>

[SPARQL Wiki](https://kvistgaard.github.io/sparql)
<br>
[SPARQL Course](https://eulearn.europa.eu/ilp/pages/description.jsf#/users/@self/catalogues/115340/coursetemplates/62308155/description)

<br>
<b>Specific for querying ePO graphs</b><br>

[Assembling graph patterns like Lego blocks](https://kvistgaard.github.io/slides/querying-pp-graphs/ted/)
Workshop slides: [Part 1](https://kvistgaard.github.io/slides/querying-pp-graphs/part1/), [Part 2](https://kvistgaard.github.io/slides/querying-pp-graphs/part2/)
</ul>
