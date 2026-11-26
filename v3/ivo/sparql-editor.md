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
