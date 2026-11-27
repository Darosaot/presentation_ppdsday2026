<!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/home" data-background-interactive data-background-deck-keys data-preload data-ppds-menu="Home, Data Catalogue, Dashboard, Graph Explorer, Query Service" -->

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
- Five clicks. Each of the first four shows a balloon, draws its arrow to a tab of the PPDS menu, and puts a "New" badge on that tab, except Dashboard (data-callout-not-new); the fifth clears them all. vendor/reveal/plugin/ppdsMenuCallouts.js draws them from the spans above, which never show.
- data-ppds-menu is the order of the PPDS tabs on the day, and the arrows aim at it. It holds the new order, so until PPDS reorders its menu the arrows and badges land one tab off. If the site still has the old order on the day, write that in instead: Home, Dashboard, Data Catalogue, Query Service, Graph Explorer.
- data-callout-at places each balloon: its centre, in px from the bottom centre of its tab, right then down. The text of a span is its balloon's text; a <br> breaks the line.
- The window must be at least 1140px wide; narrower, the PPDS menu folds into a button and the callouts don't show.
