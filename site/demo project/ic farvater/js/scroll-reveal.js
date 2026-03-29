// Scroll Reveal — fade-in + slide-up on scroll
(function() {
  'use strict';

  var SELECTORS = [
    '.section-header',
    '.service-row',
    '.service-block',
    '.product-card',
    '.cat-card',
    '.stat',
    '.cert-card',
    '.contact-info__group',
    '.contact-form',
    '.mission__content',
    '.product-detail__content',
    '.map-section',
    '.products-grid__row',
    '.catalog__grid-row'
  ];

  function init() {
    var elements = document.querySelectorAll(SELECTORS.join(','));
    if (!elements.length) return;

    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add('reveal');
    }

    if (!('IntersectionObserver' in window)) {
      for (var j = 0; j < elements.length; j++) {
        elements[j].classList.add('reveal--visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add('reveal--visible');
          observer.unobserve(entries[k].target);
        }
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    for (var n = 0; n < elements.length; n++) {
      observer.observe(elements[n]);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
