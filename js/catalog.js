// Catalog — product rendering, sidebar filter/search (v2)
(function() {
  'use strict';

  var state = {
    sort: 'recommended',
    category: null,
    search: ''
  };

  var browseMode = true;
  var showAllMode = false;
  var staticGrid = null;
  var dynamicContainer = null;

  var categoryMap = {
    'microchips': 'Микросхемы',
    'connectors': 'Разъёмы',
    'converters': 'Преобразователи напряжения',
    'capacitors': 'СВЧ-конденсаторы',
    'transistors': 'СВЧ-транзисторы',
    'pcb': 'Печатные платы'
  };

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  // --- Mode switching ---

  function enterFilterMode() {
    if (!browseMode) return;
    browseMode = false;
    if (staticGrid) staticGrid.style.display = 'none';
    if (dynamicContainer) dynamicContainer.style.display = '';
  }

  function enterBrowseMode() {
    if (browseMode) return;
    browseMode = true;
    if (staticGrid) staticGrid.style.display = '';
    if (dynamicContainer) dynamicContainer.style.display = 'none';
  }

  function hasActiveFilters() {
    return showAllMode || state.category !== null || state.search !== '';
  }

  function updateView() {
    updateClearButton();
    if (hasActiveFilters()) {
      enterFilterMode();
      render();
    } else {
      enterBrowseMode();
    }
  }

  // --- Category ---

  function activateCategory(catKey) {
    if (catKey === 'all') {
      state.category = null;
      showAllMode = true;
    } else {
      state.category = catKey ? (categoryMap[catKey] || null) : null;
      showAllMode = false;
    }

    // Sync radio buttons
    var radios = document.querySelectorAll('.filter-radio[data-category]');
    radios.forEach(function(r) { r.classList.remove('filter-radio--active'); });
    if (catKey) {
      radios.forEach(function(r) {
        if (r.getAttribute('data-category') === catKey) r.classList.add('filter-radio--active');
      });
    }

    updateView();
  }

  // --- Filtering ---

  function getFiltered() {
    if (typeof PRODUCTS === 'undefined') return [];
    var results = [];

    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i];
      if (state.category && p.category !== state.category) continue;
      if (state.search) {
        var q = state.search.toLowerCase();
        var hay = (p.name + ' ' + p.description + ' ' + p.category + ' ' + (p.subcategory || '')).toLowerCase();
        if (hay.indexOf(q) === -1) continue;
      }
      results.push({ product: p, index: i });
    }

    if (state.sort === 'name-asc') {
      results.sort(function(a, b) { return a.product.name.localeCompare(b.product.name, 'ru'); });
    } else if (state.sort === 'name-desc') {
      results.sort(function(a, b) { return b.product.name.localeCompare(a.product.name, 'ru'); });
    }

    return results;
  }

  // --- Rendering ---

  function renderCard(item) {
    var p = item.product;
    var idx = item.index;
    var imgHtml = p.image
      ? '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\'">'
      : '';
    return '<a href="product-detail.html#' + p.id + '" class="product-card">' +
      '<div class="product-card__img">' + imgHtml + '</div>' +
      '<div class="product-card__info">' +
        '<span class="product-card__name">' + p.name.toUpperCase() + '</span>' +
        '<span class="product-card__count">(' + pad(idx + 1) + ')</span>' +
      '</div>' +
    '</a>';
  }

  function render() {
    if (!dynamicContainer) return;
    var items = getFiltered();

    if (items.length === 0) {
      dynamicContainer.innerHTML = '<p class="catalog__empty">НИЧЕГО НЕ НАЙДЕНО</p>';
      return;
    }

    if (state.category) {
      var html = '<div class="catalog__category-section">';
      html += '<h2 class="catalog__category-title">' + state.category.toUpperCase() +
        ' <span class="title-count">(' + pad(items.length) + ')</span></h2>';
      html += '<div class="catalog__products-row">';
      for (var i = 0; i < items.length; i++) html += renderCard(items[i]);
      html += '</div></div>';
      dynamicContainer.innerHTML = html;
      return;
    }

    // Group by category
    var order = ['Микросхемы', 'Разъёмы', 'Преобразователи напряжения', 'СВЧ-конденсаторы', 'СВЧ-транзисторы', 'Печатные платы'];
    var groups = {};
    for (var j = 0; j < items.length; j++) {
      var cat = items[j].product.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(items[j]);
    }

    var html2 = '';
    for (var c = 0; c < order.length; c++) {
      var name = order[c];
      var list = groups[name];
      if (!list || list.length === 0) continue;
      html2 += '<div class="catalog__category-section">';
      html2 += '<h2 class="catalog__category-title">' + name.toUpperCase() +
        ' <span class="title-count">(' + pad(list.length) + ')</span></h2>';
      html2 += '<div class="catalog__products-row">';
      for (var n = 0; n < list.length; n++) html2 += renderCard(list[n]);
      html2 += '</div></div>';
    }
    dynamicContainer.innerHTML = html2;
  }

  // --- Sidebar: accordion toggle ---

  function initFilterGroups() {
    var groups = document.querySelectorAll('.filter-group__header');
    groups.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        var items = btn.nextElementSibling;
        if (items) items.style.display = expanded ? 'none' : '';
      });
    });
  }

  // --- Sidebar: category radios ---

  function initCategoryRadios() {
    var radios = document.querySelectorAll('.filter-radio[data-category]');
    radios.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key = btn.getAttribute('data-category');
        activateCategory(key);
      });
    });
  }

  // --- Clear / reset ---

  function resetAll() {
    document.querySelectorAll('.filter-radio--active').forEach(function(r) {
      r.classList.remove('filter-radio--active');
    });
    // Set "ВСЕ" as active
    var allBtn = document.querySelector('.filter-radio[data-category="all"]');
    if (allBtn) allBtn.classList.add('filter-radio--active');

    state.sort = 'recommended';
    state.category = null;
    state.search = '';
    showAllMode = false;
    var input = document.querySelector('.catalog__search-input');
    if (input) input.value = '';
    updateClearButton();
    updateView();
  }

  function updateClearButton() {
    var active = document.querySelectorAll('.filter-radio--active:not([data-category="all"])');
    var countEl = document.getElementById('sidebar-count');
    if (countEl) countEl.textContent = active.length;
  }

  // --- Static category cards click ---

  function initCategoryCards() {
    if (!staticGrid) return;
    staticGrid.querySelectorAll('.cat-card[data-category]').forEach(function(card) {
      card.addEventListener('click', function() {
        var cat = card.getAttribute('data-category');
        // Разъёмы → отдельная страница
        if (cat === 'connectors') {
          window.location.href = 'connectors.html';
          return;
        }
        activateCategory(cat);
      });
    });
  }

  // --- Search ---

  function initSearch() {
    var input = document.querySelector('.catalog__search-input');
    if (!input) return;
    var timer = null;
    input.addEventListener('input', function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        state.search = input.value.trim();
        updateView();
      }, 250);
    });
  }

  // --- Init ---

  function init() {
    staticGrid = document.getElementById('products-grid');
    if (!staticGrid) return;

    if (typeof PRODUCTS !== 'undefined') {
      dynamicContainer = document.createElement('div');
      dynamicContainer.id = 'catalog-products';
      dynamicContainer.className = 'catalog__all-products';
      dynamicContainer.style.display = 'none';
      staticGrid.parentNode.insertBefore(dynamicContainer, staticGrid.nextSibling);
    }

    initFilterGroups();
    initCategoryRadios();
    initCategoryCards();
    initSearch();

    var resetBtn = document.getElementById('sidebar-reset');
    if (resetBtn) resetBtn.addEventListener('click', resetAll);

    // Hash navigation
    var hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (hash && categoryMap[hash]) {
      activateCategory(hash);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
