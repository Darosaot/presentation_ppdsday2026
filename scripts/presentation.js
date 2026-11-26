Reveal.initialize({
  hash: true, fragmentInURL: true, history: true,
  controls: false, progress: false, slideNumber: false,
  width: 1600, height: 900, margin: 0, center: false,
  transition: 'fade',
  plugins: [RevealMarkdown, PPDSSparqlEditor, LiveBackground, PPDSMenuCallouts, RevealNotes, RevealZoom, RemoteSPARQLEditor, RevealMath.KaTeX],
  katex: { version: '0.18.7', ignoredTags: ['script','noscript','style','textarea','pre','code'] }
});
Reveal.on('ready', () => {
  document.querySelectorAll('code').forEach(block => {
    block.classList.forEach(cls => {
      if (!cls.startsWith('language-')) block.classList.add('language-' + cls);
    });
  });
  Prism.highlightAll();
});
document.querySelectorAll('[data-jump]').forEach(card => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  const go = () => Reveal.slide(Number(card.dataset.jump));
  card.addEventListener('click', go);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); go(); }
  });
});
