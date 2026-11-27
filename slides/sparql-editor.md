```ppds-sparql-editor
# title: What do public buyers procure?

PREFIX bif: <bif:>
PREFIX contract-nature: <http://publications.europa.eu/resource/authority/contract-nature/>
PREFIX country: <http://publications.europa.eu/resource/authority/country/>
PREFIX epo-ppds-ap: <http://data.europa.eu/gx2/epo-ppds-ap#>

SELECT ?country ?procedures ?natureLabel ?geometry ?wktColor ?wktTooltip
WHERE {
  {
    SELECT ?country (sum(IF(?nature = contract-nature:works, 1, 0)) AS ?works) (sum(IF(?nature = contract-nature:services, 1, 0)) AS ?services)
  (sum(IF(?nature = contract-nature:supplies, 1, 0)) AS ?supplies)
    WHERE {
      {
        SELECT DISTINCT ?country ?nature (COALESCE(?procedureMaster, ?procedure) AS ?deduplicatedProcedure)
        WHERE {
          GRAPH <https://data.europa.eu/a4g/graph/dgGrow/inference> {
            ?procedure epo-ppds-ap:fromBuyerCountry ?country .
            ?procedure epo-ppds-ap:hasContractNatureType ?nature .
          }
          FILTER (?nature IN (contract-nature:works, contract-nature:services, contract-nature:supplies))
          OPTIONAL {
            GRAPH <https://data.europa.eu/a4g/graph/masterID/dgGrow> {
              ?procedure epo-ppds-ap:masterID ?procedureMaster .
            }
          }
        }
      }
    }
    GROUP BY ?country
  }
  VALUES (?country ?longitude ?latitude) {
    (country:AUT 14.1 47.6)
    (country:BEL 4.7 50.6)
    (country:BGR 25.2 42.8)
    (country:CYP 33.2 35.1)
    (country:CZE 15.3 49.7)
    (country:DEU 10.4 51.1)
    (country:DNK 9.3 56.0)
    (country:EST 25.8 58.7)
    (country:GRC 21.7 39.6)
    (country:ESP -3.6 40.4)
    (country:FIN 26.3 64.5)
    (country:FRA 2.5 46.6)
    (country:HRV 18.0 45.5)
    (country:HUN 19.4 47.2)
    (country:IRL -8.1 53.2)
    (country:ISL -19.0 64.8)
    (country:ITA 12.6 42.8)
    (country:LIE 9.6 47.1)
    (country:LTU 23.9 55.3)
    (country:LUX 6.1 49.8)
    (country:LVA 26.4 56.6)
    (country:MLT 14.4 35.9)
    (country:NLD 5.3 52.2)
    (country:NOR 9.5 61.5)
    (country:POL 19.4 52.1)
    (country:PRT -8.0 39.7)
    (country:ROU 25.0 45.8)
    (country:SWE 14.4 60.6)
    (country:SVN 14.8 46.1)
    (country:SVK 19.5 48.7)
  }
  VALUES (?natureLabel ?wktColor ?worksBefore ?servicesBefore ?isWorks ?isServices ?isSupplies) {
    ("works" "darkorange" 0 0 1 0 0)
    ("services" "seagreen" 1 0 0 1 0)
    ("supplies" "steelblue" 1 1 0 0 1)
  }
  VALUES ?tens { 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 }
  VALUES ?units { 0 1 2 3 4 5 6 7 8 9 }
  BIND (?works + ?services + ?supplies AS ?procedures)
  BIND (?worksBefore * ?works + ?servicesBefore * ?services AS ?sliceStart)
  BIND (?sliceStart + ?isWorks * ?works + ?isServices * ?services + ?isSupplies * ?supplies AS ?sliceEnd)
  BIND ((10 * ?tens + ?units + 0.5) / 180 AS ?position)
  FILTER (?position * ?procedures >= ?sliceStart && ?position * ?procedures < ?sliceEnd)
  BIND (2 * bif:pi() * ?position AS ?angle)
  BIND (0.03 * bif:sqrt(?procedures) AS ?radius)
  BIND (bif:st_linestring(bif:st_point(?longitude, ?latitude), bif:st_point(?longitude + ?radius * bif:sin(?angle), ?latitude + ?radius * bif:cos(?angle) * bif:cos(?latitude * bif:pi() / 180))) AS ?geometry)
  BIND (CONCAT(STRAFTER(str(?country), str(country:)), ": ", str(?procedures), " procedures, works ", str(round(100.0 * ?works / ?procedures)), "%, services ", str(round(100.0 * ?services / ?procedures)), "%, supplies ", str(round(100.0 * ?supplies / ?procedures)), "%") AS ?wktTooltip)
}
```

Note:

