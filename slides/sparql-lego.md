<!-- .slide: class="compact-title-slide lego-slide" -->
## SPARQL is like assembling Lego blocks

Blocks (triple patterns) are snapped on the common variable<!-- .element: data-fragment-index="1" class="fragment align-left text-small"--> <br>

Example: From role to country code<!-- .element: data-fragment-index="2" class="fragment align-left text-small"-->

![SPARQL triple patterns connected like Lego blocks](assets/diagrams/sparql-lego.svg)<!-- .element: data-fragment-index="3" class="fragment" -->



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

</div>
</div>
