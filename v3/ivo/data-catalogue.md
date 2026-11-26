<!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/data-catalogue" data-background-interactive data-preload data-background-crop-top="212, 128 below 1140" -->

Note:
HOW THIS SLIDE IS MADE
- A live-page background, like the Data Explorer slide before it: data-background-iframe is the page, data-background-interactive lets it take clicks, data-preload loads it a few slides ahead.
- data-background-crop-top cuts the PPDS header off: the page moves up 212px, or 128px in a window narrower than 1140px, where the header is shorter (measured November 2026). Delete the attribute to show the whole page.
- common/plugin/liveBackground.js does the cropping and explains how to measure. Gallery template T27.
