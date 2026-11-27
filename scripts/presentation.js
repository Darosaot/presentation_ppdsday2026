// Reveal's named slide routes omit a trailing slash. Accept shared links that
// include one (such as #/data-explorer/) before it reads the initial URL.
if (location.hash.startsWith('#/') && location.hash.length > 2 && /\/$/.test(location.hash)) {
  history.replaceState(null, '', location.pathname + location.search + location.hash.replace(/\/+$/, ''));
}

Reveal.initialize({
  hash: true, fragmentInURL: true, history: true,
  // The arrows show only while a framed page has the keyboard (see below).
  controls: true, controlsTutorial: false, progress: false, slideNumber: false,
  width: 1600, height: 900, margin: 0, center: false,
  transition: 'fade',
  plugins: [RevealMarkdown, PPDSSparqlEditor, LiveBackground, PPDSMenuCallouts, RevealNotes, RevealZoom, RemoteSPARQLEditor, RevealMath.KaTeX],
  katex: { version: '0.18.7', ignoredTags: ['script','noscript','style','textarea','pre','code'] }
});
// A click into a framed page (a live background or the dashboard) gives that
// page the keyboard: arrow keys and Space then go to it, and the browser does
// not pass them on to the deck. While that lasts, Reveal's arrows show at the
// bottom right; clicking one moves the deck and gives it the keyboard back.
// The delay keeps them hidden on slides that take the keyboard back at once
// (data-background-deck-keys). They stay up while the mouse button is down, or
// the press that gives the keyboard back would hide the arrow it is clicking.
(() => {
  const deck = Reveal.getRevealElement();
  let pressing = false;
  const pageHasKeys = () => {
    const el = document.activeElement;
    return el?.tagName === 'IFRAME' && deck.contains(el);
  };
  const update = () => { if (!pressing) deck.classList.toggle('page-has-keys', pageHasKeys()); };
  document.addEventListener('pointerdown', () => { pressing = true; }, true);
  document.addEventListener('pointerup', () => { pressing = false; setTimeout(update); }, true);
  window.addEventListener('blur', () => setTimeout(update, 300));
  window.addEventListener('focus', update);
  document.addEventListener('focusin', update);
  Reveal.on('slidechanged', update);
})();
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
