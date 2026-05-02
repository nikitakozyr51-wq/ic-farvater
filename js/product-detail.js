// Product Detail — renders product from PRODUCTS array based on URL hash
(function() {
  'use strict';

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function getProductId() {
    var hash = window.location.hash.replace('#', '');
    return parseInt(hash, 10) || null;
  }

  function render() {
    var id = getProductId();
    if (!id || typeof PRODUCTS === 'undefined') return;

    var index = -1;
    var product = null;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) {
        product = PRODUCTS[i];
        index = i;
        break;
      }
    }

    if (!product) return;

    // Title
    document.title = product.name + ' — IC Фарватер';

    // Page top
    var nameEl = document.getElementById('pd-name');
    var countEl = document.getElementById('pd-count');
    var catEl = document.getElementById('pd-breadcrumb-cat');
    var subEl = document.getElementById('pd-subcategory');

    if (nameEl) nameEl.textContent = product.name;
    if (countEl) countEl.textContent = '(' + pad(index + 1) + ')';
    if (catEl) catEl.textContent = product.category.toUpperCase();
    if (subEl) {
      var sub = product.subcategory || '';
      var parts = sub.split('/');
      subEl.textContent = (parts[parts.length - 1] || '').trim().toUpperCase();
    }

    // Image
    var imgEl = document.getElementById('pd-image');
    if (imgEl) {
      if (product.image) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
        imgEl.onerror = function() { this.style.display = 'none'; };
      } else {
        imgEl.style.display = 'none';
      }
    }

    // Description
    var descEl = document.getElementById('pd-description');
    if (descEl) descEl.textContent = product.description || '';

    // Specs
    var specsEl = document.getElementById('pd-specs');
    if (specsEl && product.specs) {
      var html = '';
      var keys = Object.keys(product.specs);
      for (var j = 0; j < keys.length; j++) {
        html += '<div class="product-detail__spec-row">' +
          '<span class="product-detail__spec-key">' + keys[j].toUpperCase() + '</span>' +
          '<span class="product-detail__spec-value">' + product.specs[keys[j]].toUpperCase() + '</span>' +
          '</div>';
      }
      specsEl.innerHTML = html;
    }
  }

  function initPriceDrawer() {
    var btn = document.querySelector('.product-detail__btn');
    var drawer = document.getElementById('priceDrawer');
    var overlay = document.getElementById('priceDrawerOverlay');
    var closeBtn = document.getElementById('priceDrawerClose');
    var productNameEl = document.getElementById('drawerProductName');
    var form = document.getElementById('priceDrawerForm');
    var success = document.getElementById('priceDrawerSuccess');

    if (!btn || !drawer) return;

    function openDrawer() {
      var nameEl = document.getElementById('pd-name');
      if (productNameEl && nameEl) productNameEl.textContent = nameEl.textContent;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
    });

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        form.hidden = true;
        if (success) success.hidden = false;
        setTimeout(function() {
          closeDrawer();
          setTimeout(function() {
            form.hidden = false;
            if (success) success.hidden = true;
            form.reset();
          }, 420);
        }, 2800);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      render();
      initPriceDrawer();
    });
  } else {
    render();
    initPriceDrawer();
  }
  window.addEventListener('hashchange', render);
})();
