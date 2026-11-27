```ppds-sparql-editor-templates
# title: Notices with their TED links

PREFIX epo: <http://data.europa.eu/a4g/ontology#>

SELECT DISTINCT ?notice ?identifierValue ?noticeTEDuri
WHERE {
  VALUES (?identifierPattern ?yearGroup ?numberGroup) {
    ("^(20[0-9]{2})/S [0-9]{1,3}-0*([1-9][0-9]*)$" "$1" "$2")
    ("^0*([1-9][0-9]*)-(20[0-9]{2})$" "$2" "$1")
  }
  ?notice a epo:Notice .
  ?notice epo:hasID/epo:hasIdentifierValue ?identifierValue .
  FILTER regex(?identifierValue, ?identifierPattern)
  BIND (replace(?identifierValue, ?identifierPattern, ?yearGroup) AS ?yearPart)
  BIND (replace(?identifierValue, ?identifierPattern, ?numberGroup) AS ?numberPart)
  BIND (IRI(CONCAT("https://ted.europa.eu/en/notice/-/detail/", ?numberPart, "-", ?yearPart)) AS ?noticeTEDuri)
}
LIMIT 5
```
