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
- How it is made: the fence is shorthand for a live-page background (gallery T27). vendor/reveal/plugin/ppdsSPARQLEditor.js turns it into the Query Service page with the fence's query in its URL, cropped to start at the template menu; ppdsSPARQLEditor.js holds the crop values.
- The live PPDS Query Service, so the room needs the network.
- The editor opens with the page's own sample query, already run.
- Picking a template replaces the query but does not run it: press Run.
- Clear brings the sample query back.
