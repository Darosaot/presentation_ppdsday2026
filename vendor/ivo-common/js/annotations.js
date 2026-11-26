(function() {
  'use strict';



  // Show an annotation (underline and/or note)
  function showAnnotation(element) {
    const id = element.getAttribute('data-annotation-id');

    // Get custom margin and section defaults
    const section = element.closest('section');
    const customMargin = section ? section.getAttribute('data-annotation-margin') : null;
    const sectionColor = section ? section.getAttribute('data-annotation-color') : null;
    const sectionNoteColor = section ? section.getAttribute('data-annotation-note-color') : null;

    // Compute effective colors: element overrides section
    const colorAttr = element.getAttribute('data-annotation-color') || sectionColor || null;
    let noteColorAttr = element.getAttribute('data-annotation-note-color') || sectionNoteColor || null;
    if (!noteColorAttr && colorAttr) noteColorAttr = colorAttr;

    // Apply section-level defaults (if any)
    if (section) {
      if (sectionColor) section.style.setProperty('--annotation-color', sectionColor);
      else section.style.removeProperty('--annotation-color');
      if (sectionNoteColor) section.style.setProperty('--annotation-note-color', sectionNoteColor);
      else section.style.removeProperty('--annotation-note-color');
    }

    // Apply per-annotation variables so this underline/note pair can be colored independently
    if (colorAttr) element.style.setProperty('--annotation-color', colorAttr);
    else element.style.removeProperty('--annotation-color');

    // Add visible class to the underline
    element.classList.add('visible');

    // Show associated note if exists (scope to section)
    const noteEl = section ? section.querySelector(`.annotation-note[data-annotation-id="${id}"]`) : document.querySelector(`.annotation-note[data-annotation-id="${id}"]`);
    if (noteEl) {
      // Apply note color for this specific note
      if (noteColorAttr) noteEl.style.setProperty('--annotation-note-color', noteColorAttr);
      else noteEl.style.removeProperty('--annotation-note-color');

      // Position note relative to the annotated text
      const rect = element.getBoundingClientRect();
      // Prefer the annotated-content container, but fall back to the section or reveal container
      const container = element.closest('.annotated-content') || section || document.querySelector('.reveal') || document.body;
      const parentRect = container.getBoundingClientRect();

      // Calculate relative position
      const relativeTop = rect.top - parentRect.top + (rect.height / 2);
      noteEl.style.top = `${relativeTop}px`;

      // Apply custom margin if specified
      if (customMargin) {
        noteEl.style.right = `-${customMargin}px`;
      }

      requestAnimationFrame(() => {
        noteEl.classList.add('visible');
      });
    }
  }

  // Hide an annotation
  function hideAnnotation(element) {
    const id = element.getAttribute('data-annotation-id');

    element.classList.remove('visible');

    const section = element.closest('section');
    const noteEl = section ? section.querySelector(`.annotation-note[data-annotation-id="${id}"]`) : document.querySelector(`.annotation-note[data-annotation-id="${id}"]`);
    if (noteEl) {
      noteEl.classList.remove('visible');
    }
  }

  // Remove per-annotation inline variables when hiding
  function cleanupAnnotationVars(element) {
    try {
      element.style.removeProperty('--annotation-color');
      const id = element.getAttribute('data-annotation-id');
      const section = element.closest('section');
      const noteEl = section ? section.querySelector(`.annotation-note[data-annotation-id="${id}"]`) : document.querySelector(`.annotation-note[data-annotation-id="${id}"]`);
      if (noteEl) noteEl.style.removeProperty('--annotation-note-color');
    } catch (e) {
      // ignore
    }
  }

  // Apply section-level color variables from data attributes
  function applySectionColors(section) {
    if (!section) return;
    const color = section.getAttribute('data-annotation-color');
    const noteColor = section.getAttribute('data-annotation-note-color');
    if (color) section.style.setProperty('--annotation-color', color);
    else section.style.removeProperty('--annotation-color');
    if (noteColor) section.style.setProperty('--annotation-note-color', noteColor);
    else section.style.removeProperty('--annotation-note-color');
  }

  // Update all positions (on resize/scroll)
  function updateAllPositions() {
    document.querySelectorAll('.annotate-underline.visible').forEach(el => {
      const section = el.closest('section');
      const noteEl = section ? section.querySelector(`.annotation-note[data-annotation-id="${el.getAttribute('data-annotation-id')}"]`) : document.querySelector(`.annotation-note[data-annotation-id="${el.getAttribute('data-annotation-id')}"]`);
      if (noteEl && noteEl.classList.contains('visible')) {
        const rect = el.getBoundingClientRect();
        // Prefer the annotated-content container, but fall back to the section or reveal container
        const container = el.closest('.annotated-content') || section || document.querySelector('.reveal') || document.body;
        const parentRect = container.getBoundingClientRect();
        const relativeTop = rect.top - parentRect.top + (rect.height / 2) - 10;
        noteEl.style.top = `${relativeTop}px`;
      }
    });
  }

  // Clear all annotations (on slide change)
  function clearAnnotations() {
    document.querySelectorAll('.annotate-underline.visible').forEach(el => {
      el.classList.remove('visible');
      cleanupAnnotationVars(el);
    });

    document.querySelectorAll('.annotation-note.visible').forEach(el => {
      el.classList.remove('visible');
      // also remove per-note inline color var
      try { el.style.removeProperty('--annotation-note-color'); } catch (e) {}
    });
  }

  // Initialize when DOM is ready
  function init() {
    // Wait for Reveal to be available
    if (typeof Reveal === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    // Listen for fragment events (scope queries to the current slide)
    Reveal.on('fragmentshown', event => {
      const fragment = event.fragment;

      // Check if this fragment triggers an annotation
      const annotationId = fragment.getAttribute('data-triggers-annotation');
      if (annotationId) {
        const section = fragment.closest('section');
        const target = section ? section.querySelector(`.annotate-underline[data-annotation-id="${annotationId}"]`) : document.querySelector(`.annotate-underline[data-annotation-id="${annotationId}"]`);
        if (target) {
          showAnnotation(target);
        }
      }
    });

    Reveal.on('fragmenthidden', event => {
      const fragment = event.fragment;
      const annotationId = fragment.getAttribute('data-triggers-annotation');
      if (annotationId) {
        const section = fragment.closest('section');
        const target = section ? section.querySelector(`.annotate-underline[data-annotation-id="${annotationId}"]`) : document.querySelector(`.annotate-underline[data-annotation-id="${annotationId}"]`);
        if (target) {
          hideAnnotation(target);
          cleanupAnnotationVars(target);
        }
      }
    });

    // Apply section colors when presentation is ready
    Reveal.on('ready', event => {
      const slide = (event && event.currentSlide) || document.querySelector('.slides section.present');
      applySectionColors(slide);
    });

    // Clear annotations and apply colors on slide change
    Reveal.on('slidechanged', event => {
      const slide = (event && event.currentSlide) || (event && event.slide) || document.querySelector('.slides section.present');
      applySectionColors(slide);
      clearAnnotations();
    });

    // Update positions on resize
    window.addEventListener('resize', updateAllPositions);
    window.addEventListener('scroll', updateAllPositions);
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();