/**
 * Main JS — shared logic across all pages
 * Mobile menu, smooth scroll, common interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initServiceAccordion();
  initCertAccordion();
});

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

/** Service accordion toggle */
function initServiceAccordion() {
  document.querySelectorAll('.service-item__header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.service-item');
      const isOpen = item.classList.toggle('service-item--open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });
}
