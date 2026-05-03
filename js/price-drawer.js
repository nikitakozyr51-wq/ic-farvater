// Price Request Drawer — universal, injects itself on any page with .product-detail__btn
(function() {
  'use strict';

  function getPageTitle() {
    var ids = ['pd-name', 'cv-name', 'mcd-name', 'tr-name', 'pcb-name'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    var h1 = document.querySelector('h1');
    return h1 ? h1.textContent.trim() : '';
  }

  function injectDrawer() {
    if (document.getElementById('priceDrawer')) return;
    var html =
      '<div class="price-drawer" id="priceDrawer" aria-hidden="true" role="dialog" aria-label="Запросить цену">' +
        '<div class="price-drawer__overlay" id="priceDrawerOverlay"></div>' +
        '<div class="price-drawer__panel">' +
          '<div class="price-drawer__header">' +
            '<span class="price-drawer__label">ЗАПРОСИТЬ ЦЕНУ</span>' +
            '<button class="price-drawer__close" id="priceDrawerClose" type="button" aria-label="Закрыть">' +
              '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">' +
                '<path d="M2 2L18 18M18 2L2 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
          '<div class="price-drawer__product-name" id="drawerProductName"></div>' +
          '<form class="price-drawer__form" id="priceDrawerForm" novalidate>' +
            '<label class="price-drawer__field"><span class="price-drawer__field-label">ИМЯ</span>' +
              '<input type="text" class="price-drawer__input" name="name" required autocomplete="name"></label>' +
            '<label class="price-drawer__field"><span class="price-drawer__field-label">ЭЛЕКТРОННАЯ ПОЧТА</span>' +
              '<input type="email" class="price-drawer__input" name="email" required autocomplete="email"></label>' +
            '<label class="price-drawer__field"><span class="price-drawer__field-label">ТЕЛЕФОН</span>' +
              '<input type="tel" class="price-drawer__input" name="phone" autocomplete="tel"></label>' +
            '<label class="price-drawer__field"><span class="price-drawer__field-label">КОММЕНТАРИЙ К ЗАПРОСУ</span>' +
              '<textarea class="price-drawer__textarea" name="message"></textarea></label>' +
            '<label class="price-drawer__consent">' +
              '<input type="checkbox" name="consent" required>' +
              '<span>Согласен(на) на обработку персональных данных в соответствии с <a href="privacy-policy.html">Политикой конфиденциальности</a></span>' +
            '</label>' +
            '<button type="submit" class="price-drawer__submit">ОТПРАВИТЬ ЗАПРОС</button>' +
          '</form>' +
          '<div class="price-drawer__success" id="priceDrawerSuccess">' +
            '<span class="price-drawer__success-title">ЗАПРОС ОТПРАВЛЕН</span>' +
            '<p class="price-drawer__success-text">Мы свяжемся с вами в течение рабочего дня.</p>' +
          '</div>' +
          '<div class="price-drawer__contacts">' +
            '<div class="price-drawer__contact-group">' +
              '<span class="price-drawer__contact-label">ТЕЛЕФОН</span>' +
              '<a href="tel:+79967788842" class="price-drawer__contact-value">+7 (996) 778-88-42</a>' +
            '</div>' +
            '<div class="price-drawer__contact-group">' +
              '<span class="price-drawer__contact-label">КОММЕРЧЕСКИЙ ОТДЕЛ</span>' +
              '<a href="mailto:sale@ic-farvater.ru" class="price-drawer__contact-value">sale@ic-farvater.ru</a>' +
            '</div>' +
            '<div class="price-drawer__contact-group">' +
              '<span class="price-drawer__contact-label">РЕЖИМ РАБОТЫ</span>' +
              '<span class="price-drawer__contact-value">пн.–пт. 10:00–18:00</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function init() {
    var btns = document.querySelectorAll('.product-detail__btn');
    if (!btns.length) return;

    injectDrawer();

    var drawer = document.getElementById('priceDrawer');
    var overlay = document.getElementById('priceDrawerOverlay');
    var closeBtn = document.getElementById('priceDrawerClose');
    var productNameEl = document.getElementById('drawerProductName');
    var form = document.getElementById('priceDrawerForm');
    var success = document.getElementById('priceDrawerSuccess');

    var labelEl = drawer.querySelector('.price-drawer__label');
    function openDrawer(e) {
      productNameEl.textContent = getPageTitle();
      if (labelEl && e && e.currentTarget) labelEl.textContent = e.currentTarget.textContent.trim();
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    for (var i = 0; i < btns.length; i++) {
      if (!btns[i].getAttribute('type')) btns[i].setAttribute('type', 'button');
      btns[i].addEventListener('click', openDrawer);
    }
    overlay.addEventListener('click', closeDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      form.style.display = 'none';
      success.classList.add('is-visible');
      setTimeout(function() {
        closeDrawer();
        setTimeout(function() {
          form.style.display = '';
          success.classList.remove('is-visible');
          form.reset();
        }, 420);
      }, 2800);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
