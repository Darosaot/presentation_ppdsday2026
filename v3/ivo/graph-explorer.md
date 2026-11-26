<!-- .slide: data-background-iframe="https://api.public-procurement-data-space.europa.eu/data-explorer/graph-explorer" data-background-interactive data-preload data-background-crop-top="317, 233 below 1140, 229 below 996, 225 below 961" -->

Note:
HOW THIS SLIDE IS MADE
- A live-page background, like the Data Explorer slide: data-background-iframe is the page, data-background-interactive lets it take clicks, data-preload loads it a few slides ahead.
- data-background-crop-top cuts the PPDS header and the page title off, so the slide starts 8px above the Graph Explorer's own tabs (Home, Inspect, Customize). The header is shorter in narrower windows, hence the four values (measured November 2026). Delete the attribute to show the whole page.
- common/plugin/liveBackground.js does the cropping and explains how to measure. Gallery template T27.
- The Home tab's carousel sizes itself to the frame, which is taller than the slide by the crop, so its text sits in the lower half. Inspect has no address of its own, so the slide can't open on it.
