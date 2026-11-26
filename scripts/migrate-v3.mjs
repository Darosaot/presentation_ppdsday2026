// One-time migration. The generated v3 HTML is the editable source afterwards.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const v2 = await readFile('PPDS_New_Possibilities_v2.html', 'utf8');
const ivo = await readFile('ivo/index.html', 'utf8');
const markdown = await readFile('ivo/slides.md', 'utf8');
const css = v2.match(/<style>([\s\S]*?)<\/style>/)?.[1];
const sections = [...v2.matchAll(/<section class="slide\b[\s\S]*?<\/section>/g)]
  .map(match => match[0]).filter(section => !section.includes('skip-slide'));
const ivoSections = markdown.split(/^---\s*$/m);
if (!css || sections.length !== 19 || ivoSections.length !== 11) {
  throw new Error(`Unexpected source structure: ${sections.length} slides, ${ivoSections.length} Ivo sections`);
}

const ids = [
  'intro', 'data-flow', 'service-architecture', 'data-explorer',
  'clean-vehicles', 'working-dashboard', 'data-catalogue',
  'query-service', 'graph-explorer', 'sparql-editor', 'sparql-lego',
  'query-options', 'sparql-resources', 'future-ai', 'semantics-ai',
  'ai-in-ppds', 'chatbot', 'fraud-detection', 'feedback'
];
const ivoBySlide = new Map([[1, 2], [3, 3], [6, 4], [7, 6], [8, 5], [9, 7], [10, 8], [11, 9], [12, 10]]);
await mkdir('v3/ivo', { recursive: true });
const slideMarkup = await Promise.all(sections.map(async (source, index) => {
  const title = source.match(/data-title="([^"]*)"/)?.[1] || ids[index];
  const ivoIndex = ivoBySlide.get(index);
  if (ivoIndex !== undefined) {
    const file = `v3/ivo/${ids[index]}.md`;
    const local = ivoSections[ivoIndex]
      .replaceAll('https://kvistgaard.github.io/slides/assets/ppds-pipeline-ppds-day-2026.svg ', 'vendor/ivo-assets/ppds-pipeline-ppds-day-2026.svg')
      .replaceAll('https://kvistgaard.github.io/slides/assets/sparql-lego-ppds.svg', 'vendor/ivo-assets/sparql-lego-ppds.svg');
    await writeFile(file, local.trim() + '\n');
    return `<section id="${ids[index]}" class="ivo-slide" data-title="${title}" data-markdown="${file}" data-separator-notes="^Note:"></section>`;
  }
  return source
    .replace('<section class="slide', `<section id="${ids[index]}" class="slide`)
    .replaceAll('class="speaker-notes"', 'class="notes"')
    .replaceAll('class="slide blue title-slide active"', 'class="slide blue title-slide"');
}));

const ivoStyles = ivo.match(/<style>([\s\S]*?)<\/style>/)?.[1]
  .split('/* In the integrated deck')[0] || '';
const output = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>New possibilities in the PPDS — Reveal v3</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="vendor/ivo-common/dist/reset.css">
<link rel="stylesheet" href="vendor/ivo-common/dist/reveal.css">
<link rel="stylesheet" href="vendor/ivo-common/dist/theme/white.css">
<link rel="stylesheet" href="vendor/ivo-common/prism/themes/github.css">
<link rel="stylesheet" href="vendor/ivo-common/css/custom5.css">
<link rel="stylesheet" href="vendor/ivo-common/css/figures.css">
<style>${css}\n${ivoStyles}</style>
<link rel="stylesheet" href="v3.css">
</head>
<body>
<div class="reveal"><div class="slides">
${slideMarkup.join('\n')}
</div></div>
<script src="vendor/ivo-common/dist/reveal.js"></script>
<script src="vendor/ivo-common/plugin/notes/notes.js"></script>
<script src="vendor/ivo-common/plugin/zoom/zoom.js"></script>
<script src="vendor/ivo-common/plugin/markdown/markdown.js"></script>
<script src="vendor/ivo-common/plugin/math/math.js"></script>
<script src="vendor/ivo-common/prism/prism.js"></script>
<script src="vendor/ivo-common/prism/prism-sparql.min.js"></script>
<script src="vendor/ivo-common/plugin/remoteSPARQLEditor.js"></script>
<script src="vendor/ivo-common/plugin/ppdsSPARQLEditor.js"></script>
<script src="vendor/ivo-common/plugin/liveBackground.js"></script>
<script src="vendor/ivo-common/plugin/ppdsMenuCallouts.js"></script>
<script src="vendor/ivo-common/js/annotations.js"></script>
<script src="vendor/ivo-common/js/iframe-fragments.js"></script>
<script>
Reveal.initialize({
  hash: true, fragmentInURL: true, history: true,
  controls: false, progress: false, slideNumber: false,
  width: 1600, height: 900, margin: 0, center: false,
  transition: 'fade',
  plugins: [RevealMarkdown, PPDSSparqlEditor, LiveBackground, PPDSMenuCallouts, RevealNotes, RevealZoom, RemoteSPARQLEditor, RevealMath.KaTeX],
  katex: { version: '0.18.7', ignoredTags: ['script','noscript','style','textarea','pre','code'] }
});
Reveal.on('ready', () => { document.querySelectorAll('code').forEach(block => block.classList.forEach(cls => { if(!cls.startsWith('language-')) block.classList.add('language-'+cls) })); Prism.highlightAll(); });
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => window.open(b.dataset.open, '_blank', 'noopener')));
document.querySelectorAll('[data-jump]').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  const go = () => Reveal.slide(Number(card.dataset.jump));
  card.addEventListener('click', go);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); go(); }
  });
});
document.querySelectorAll('.marker').forEach(m => m.addEventListener('click', () => m.classList.toggle('on')));
</script>
</body></html>\n`;
await writeFile('PPDS_New_Possibilities_v3.html', output);
console.log(`Wrote v3 with ${sections.length} slides`);
