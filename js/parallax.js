/* ===== Parallax & Scroll Animations — quadrantcapital.io style ===== */

(function () {
  'use strict';

  /* --- Hero parallax: translate + fade on scroll --- */
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');

  if (hero && heroContent) {
    let ticking = false;

    function updateHero() {
      const scrollY = window.scrollY;
      const heroH = hero.offsetHeight;

      if (scrollY < heroH) {
        const translateY = scrollY * 0.25;
        heroContent.style.transform = `translateY(${translateY}px)`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHero);
        ticking = true;
      }
    }, { passive: true });
  }

  /* --- Reveal on scroll: elements fade-in + slide-up --- */
  const reveals = document.querySelectorAll(
    '.section-header, .products-grid__row, .card, .product-card,' +
    '.service-block, .mission__content, .stats-grid .stat, .certs-grid .cert-card,' +
    '.contact-info__group, .contact-form, .map-section,' +
    '.catalog__top-inner, .catalog__sidebar, .catalog__grid-row,' +
    '.about__top-inner, .services__top-inner, .contacts__top-inner'
  );

  /* Set initial hidden state via JS (no flash of unstyled content) */
  reveals.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)';
    el.style.willChange = 'opacity, transform';
  });

  /* Stagger children within rows */
  document.querySelectorAll('.products-grid__row, .catalog__grid-row, .certs-grid').forEach(function (row) {
    var cards = row.children;
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.transitionDelay = (i * 0.12) + 's';
    }
  });

  /* Service blocks stagger */
  document.querySelectorAll('.service-block').forEach(function (block, i) {
    block.style.transitionDelay = (i * 0.1) + 's';
  });

  /* Stats stagger */
  document.querySelectorAll('.stats-grid .stat, .stat').forEach(function (stat, i) {
    stat.style.transitionDelay = (i * 0.1) + 's';
  });

  /* Footer columns stagger */
  var footerCols = document.querySelectorAll('.footer__grid .footer__col');
  footerCols.forEach(function (col) {
    col.style.opacity = '0';
    col.style.transform = 'translateY(24px)';
    col.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  /* IntersectionObserver for reveal */
  if ('IntersectionObserver' in window) {
    var allAnimated = Array.from(reveals).concat(Array.from(footerCols));

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    allAnimated.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything */
    reveals.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    footerCols.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* --- Section parallax: subtle vertical shift for images --- */
  var parallaxImages = document.querySelectorAll(
    '.product-card__img, .cat-card__img, .mission__image, .service-block__image, .cert-card__img'
  );

  if (parallaxImages.length > 0) {
    var imgTicking = false;

    function updateParallaxImages() {
      var scrollY = window.scrollY;
      var viewH = window.innerHeight;

      parallaxImages.forEach(function (img) {
        var rect = img.getBoundingClientRect();
        if (rect.top < viewH && rect.bottom > 0) {
          var center = rect.top + rect.height / 2;
          var offset = (center - viewH / 2) * 0.06;
          img.style.transform = 'translateY(' + offset + 'px)';
        }
      });
      imgTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!imgTicking) {
        requestAnimationFrame(updateParallaxImages);
        imgTicking = true;
      }
    }, { passive: true });
  }

  /* --- Smooth page-top title parallax (inner pages) --- */
  var pageTitle = document.querySelector(
    '.catalog__title, .about__title, .services__title, .contacts__title'
  );

  if (pageTitle && !hero) {
    var titleTicking = false;

    function updatePageTitle() {
      var scrollY = window.scrollY;
      if (scrollY < 400) {
        pageTitle.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
        pageTitle.style.opacity = Math.max(1 - scrollY / 500, 0.3);
      }
      titleTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!titleTicking) {
        requestAnimationFrame(updatePageTitle);
        titleTicking = true;
      }
    }, { passive: true });
  }

})();
