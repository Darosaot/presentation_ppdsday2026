// Reveal's named slide routes omit a trailing slash. Accept shared links that
// include one (such as #/data-explorer/) before it reads the initial URL.
if (location.hash.startsWith('#/') && location.hash.length > 2 && /\/$/.test(location.hash)) {
  history.replaceState(null, '', location.pathname + location.search + location.hash.replace(/\/+$/, ''));
}

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
