/**
 * Main JS — shared logic across all pages
 * Mobile menu, smooth scroll, common interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderSearch();
  initActiveNavLink();
  initCertAccordion();
  initServiceAccordion();
  initContactForm();
  initCookieBanner();
  initProductCarousels();
});

/** Header search toggle — open on icon click, redirect on submit */
function initHeaderSearch() {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.header__search-toggle');
  const box = document.querySelector('.header__search-box');
  const input = document.querySelector('.header__search-input');
  const submit = document.querySelector('.header__search-submit');

  if (!header || !toggle || !box || !input) return;

  function openSearch() {
    header.classList.add('header--search-open');
    box.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => input.focus());
  }

  function closeSearch() {
    header.classList.remove('header--search-open');
    box.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    input.value = '';
  }

  function doSearch() {
    const q = input.value.trim();
    if (!q) { closeSearch(); return; }
    const base = window.location.pathname.includes('/pages/') ? 'products.html' : 'pages/products.html';
    window.location.href = `${base}?search=${encodeURIComponent(q)}`;
  }

  toggle.addEventListener('click', () => {
    header.classList.contains('header--search-open') ? closeSearch() : openSearch();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') closeSearch();
  });

  if (submit) submit.addEventListener('click', doSearch);

  document.addEventListener('click', (e) => {
    if (header.classList.contains('header--search-open') && !e.target.closest('.header__search-wrap')) {
      closeSearch();
    }
  });
}

/** Mobile burger menu toggle */
function initMobileMenu() {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('header__nav--open');
    burger.classList.toggle('header__burger--open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  nav.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('header__nav--open');
      burger.classList.remove('header__burger--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/** Highlight the nav link matching current page or hash */
function initActiveNavLink() {
  const links = document.querySelectorAll('.header__link');
  if (!links.length) return;

  function syncHash() {
    const hash = window.location.hash;
    if (!hash) return;
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('header__link--active', href === hash || href.endsWith(hash));
    });
  }

  syncHash();
  window.addEventListener('hashchange', syncHash);
}

/** Contact form → /scripts/send.php */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = form.querySelector('.contact-form__submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    if (btn) { btn.disabled = true; btn.textContent = 'ОТПРАВКА...'; }
    removeFormMessage(form);

    try {
      const res = await fetch('/scripts/send.php', { method: 'POST', body: data });
      const json = await res.json();

      if (json.ok) {
        showFormMessage(form, 'Спасибо! Мы свяжемся с вами в течение рабочего дня.', true);
        form.reset();
      } else {
        showFormMessage(form, json.error || 'Произошла ошибка. Попробуйте позже.', false);
      }
    } catch {
      showFormMessage(form, 'Нет соединения с сервером. Напишите нам: info@ic-farvater.ru', false);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'ОТПРАВИТЬ'; }
    }
  });
}

function showFormMessage(form, text, success) {
  const el = document.createElement('p');
  el.className = 'contact-form__msg contact-form__msg--' + (success ? 'ok' : 'err');
  el.textContent = text;
  form.appendChild(el);
}

function removeFormMessage(form) {
  form.querySelectorAll('.contact-form__msg').forEach(el => el.remove());
}

/** Cert accordion toggle */
function initCertAccordion() {
  document.querySelectorAll('.cert-row__header').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.cert-row');
      const isOpen = row.classList.toggle('cert-row--open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });
}

/** Service accordion — one open at a time, scoped per group */
function initServiceAccordion() {
  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.service-item__header');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const group = item.parentElement;
      const isOpen = item.classList.contains('service-item--open');

      // Close siblings within the same group
      group.querySelectorAll(':scope > .service-item').forEach(i => {
        i.classList.remove('service-item--open');
        const b = i.querySelector('.service-item__header');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('service-item--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/** Cookie consent banner */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  const choice = localStorage.getItem('cookieConsent');
  if (choice === 'accepted' || choice === 'rejected' || localStorage.getItem('cookieAccepted') === 'true') {
    banner.classList.add('cookie-banner--hidden');
    return;
  }
  banner.classList.remove('cookie-banner--hidden');
  banner.querySelectorAll('[data-cookie-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-cookie-action');
      localStorage.setItem('cookieConsent', action === 'accept' ? 'accepted' : 'rejected');
      banner.classList.add('cookie-banner--hidden');
    });
  });
}

/** Product carousel — infinite loop via DOM cloning (desktop only) */
function initProductCarousels() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.product-carousel').forEach(carousel => {
    const track = carousel.querySelector('.product-carousel__track');
    const grid = track && track.querySelector('.product-cards-grid');
    const btnPrev = carousel.querySelector('.product-carousel__btn--prev');
    const btnNext = carousel.querySelector('.product-carousel__btn--next');

    if (!track || !grid || !btnPrev || !btnNext) return;

    const originals = Array.from(grid.querySelectorAll('.product-card-v2'));
    const N = originals.length;
    if (N === 0) return;

    // Build [N clones][N originals][N clones] = 3N cards for seamless loop
    const before = originals.map(c => { const cl = c.cloneNode(true); cl.setAttribute('aria-hidden', 'true'); return cl; });
    const after  = originals.map(c => { const cl = c.cloneNode(true); cl.setAttribute('aria-hidden', 'true'); return cl; });
    originals[0].before(...before);
    grid.append(...after);

    let index = N; // start at original set

    function getStep() {
      const cards = grid.querySelectorAll('.product-card-v2');
      return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    }

    function goTo(i, animate) {
      index = i;
      if (!animate) {
        grid.style.transition = 'none';
        grid.style.transform = `translateX(-${index * getStep()}px)`;
        grid.getBoundingClientRect();
        requestAnimationFrame(() => { grid.style.transition = ''; });
      } else {
        grid.style.transform = `translateX(-${index * getStep()}px)`;
      }
    }

    grid.addEventListener('transitionend', () => {
      if (index >= N * 2) goTo(index - N, false);
      else if (index < N) goTo(index + N, false);
    });

    btnPrev.addEventListener('click', () => goTo(index - 1, true));
    btnNext.addEventListener('click', () => goTo(index + 1, true));

    goTo(N, false);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goTo(N, false), 150);
    });
  });
}

