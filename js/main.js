/**
 * Main JS — shared logic across all pages
 * Mobile menu, smooth scroll, common interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initHeaderSearch();
  initCertAccordion();
  initServiceAccordion();
  initContactForm();
  initCookieBanner();
});

/** Hide header on scroll-down, reveal on scroll-up */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > lastY && y > 120) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
      lastY = y;
      ticking = false;
    });
  }, { passive: true });
}

/** Header pill search — redirect to products or trigger catalog */
function initHeaderSearch() {
  const form = document.querySelector('.header__search');
  if (!form) return;

  const input = form.querySelector('.header__search-input');
  if (!input) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    const onProducts = window.location.pathname.includes('products.html');
    if (onProducts) {
      const catalogInput = document.querySelector('.catalog__search-input');
      if (catalogInput) {
        catalogInput.value = q;
        catalogInput.dispatchEvent(new Event('input', { bubbles: true }));
        const catalog = document.querySelector('.catalog, .section--catalog');
        if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const base = window.location.pathname.includes('/pages/') ? 'products.html' : 'pages/products.html';
      window.location.href = `${base}?search=${encodeURIComponent(q)}`;
    }
    input.value = '';
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

/** Contact form → mailto */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    const body = [
      `Имя: ${name}`,
      `Email: ${email}`,
      phone ? `Телефон: ${phone}` : '',
      `\nСообщение:\n${message}`,
    ].filter(Boolean).join('\n');

    const mailto = `mailto:info@ic-farvater.ru`
      + `?subject=${encodeURIComponent('Заявка с сайта IC Farvater — ' + name)}`
      + `&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  });
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

/** Service accordion — one open at a time */
function initServiceAccordion() {
  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.service-item__header');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('service-item--open');

      // Close all
      items.forEach(i => {
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
  if (localStorage.getItem('cookieAccepted') === 'true') {
    banner.classList.add('cookie-banner--hidden');
    return;
  }
  banner.classList.remove('cookie-banner--hidden');
  const btn = banner.querySelector('.cookie-banner__btn');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      banner.classList.add('cookie-banner--hidden');
    });
  }
}

