// Catalog — product rendering, sidebar filter/search (v2)
(function() {
  'use strict';

  var state = {
    sort: 'recommended',
    category: null,
    search: '',
    seriesSlug: null,
    seriesType: 'all',
    seriesSearch: ''
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
    state.seriesSlug = null;
    state.seriesType = 'all';
    state.seriesSearch = '';
    if (typeof hideSeriesTypeFilter === 'function') hideSeriesTypeFilter();
    syncHash();

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

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  // --- Series categories: routing + data sources ---
  var SERIES_CATEGORIES = {
    'Разъёмы':                   { key: 'connectors', data: 'CONNECTOR_SERIES', variant: 'connector-variant.html', fallbackImg: '../assets/images/products/connectors.webp', parser: function(slug){ return (typeof ConnectorParsers !== 'undefined') ? ConnectorParsers.getParser(slug) : { columns: [], parse: function(){ return null; } }; } },
    'Преобразователи напряжения':{ key: 'converters', data: 'CONVERTER_SERIES', variant: 'converter-variant.html', fallbackImg: '../assets/images/products/converters.webp', parser: null },
    'СВЧ-конденсаторы':          { key: 'capacitors', data: 'CAPACITOR_SERIES', variant: 'capacitor-variant.html', fallbackImg: '../assets/images/products/capacitors.webp', parser: null }
  };
  var SERIES_GROUP_LABELS = {
    connectors: { main: 'ОСНОВНЫЕ СЕРИИ', additional: 'ДОПОЛНИТЕЛЬНЫЕ СЕРИИ', dev: 'В РАЗРАБОТКЕ' },
    converters: { main: 'ОСНОВНЫЕ СЕРИИ', additional: 'ДОПОЛНИТЕЛЬНЫЕ СЕРИИ', dev: 'В РАЗРАБОТКЕ' },
    capacitors: { main: 'ОСНОВНЫЕ СЕРИИ', additional: 'ДОПОЛНИТЕЛЬНЫЕ СЕРИИ', dev: 'В РАЗРАБОТКЕ' }
  };

  function currentSeriesCategory() {
    return SERIES_CATEGORIES[state.category] || null;
  }

  function syncHash() {
    var hash = '';
    var sc = currentSeriesCategory();
    if (sc) {
      hash = state.seriesSlug ? sc.key + '/' + state.seriesSlug : sc.key;
    } else if (showAllMode) {
      hash = 'all';
    } else if (state.category) {
      for (var key in categoryMap) {
        if (categoryMap[key] === state.category) { hash = key; break; }
      }
    }
    var target = hash ? ('#' + hash) : ' ';
    if (window.location.hash !== target) {
      history.replaceState(null, '', hash ? ('#' + hash) : window.location.pathname);
    }
  }

  function renderSeriesList() {
    hideSeriesTypeFilter();
    var sc = currentSeriesCategory();
    if (!sc) return;
    var DATA = window[sc.data];
    if (typeof DATA === 'undefined') {
      dynamicContainer.innerHTML = '<p class="catalog__empty">ДАННЫЕ НЕ ЗАГРУЖЕНЫ</p>';
      return;
    }
    var groups = { main: [], additional: [], dev: [] };
    for (var i = 0; i < DATA.length; i++) {
      var s = DATA[i];
      (groups[s.group] || groups.main).push(s);
    }
    var labels = SERIES_GROUP_LABELS[sc.key];
    var order = ['main', 'additional', 'dev'];
    var html = '';
    for (var k = 0; k < order.length; k++) {
      var key = order[k];
      var list = groups[key];
      if (!list || list.length === 0) continue;
      html += '<div class="catalog__category-section' + (key === 'dev' ? ' catalog__category-section--dev' : '') + '">';
      html += '<h2 class="catalog__category-title">' + labels[key] +
        ' <span class="title-count">(' + pad(list.length) + ')</span></h2>';
      html += '<div class="catalog__products-row">';
      for (var n = 0; n < list.length; n++) {
        var srs = list[n];
        var img = srs.image
          ? '<img src="' + esc(srs.image) + '" alt="' + esc(srs.name) + '" loading="lazy" onerror="this.style.display=\'none\'">'
          : '';
        html += '<a href="#' + sc.key + '/' + esc(srs.slug) + '" class="product-card" data-series="' + esc(srs.slug) + '">' +
          '<div class="product-card__img">' + img + '</div>' +
          '<div class="product-card__info">' +
            '<span class="product-card__name">' + esc(srs.name) + '</span>' +
            '<span class="product-card__count">' + (srs.count > 0 ? '(' + srs.count + ')' : 'в разработке') + '</span>' +
          '</div>' +
        '</a>';
      }
      html += '</div></div>';
    }
    dynamicContainer.innerHTML = html;
  }

  function renderSeriesDetail() {
    var sc = currentSeriesCategory();
    if (!sc) return;
    var DATA = window[sc.data];
    if (typeof DATA === 'undefined') return;
    var series = DATA.find(function(s) { return s.slug === state.seriesSlug; });
    if (!series) {
      state.seriesSlug = null;
      hideSeriesTypeFilter();
      renderSeriesList();
      return;
    }

    var parser = sc.parser ? sc.parser(series.slug) : { columns: [], parse: function() { return null; } };
    var hasParser = parser.columns.length > 0;
    var typeField = hasParser
      ? (parser.columns.indexOf('Часть') !== -1 ? 'Часть' : parser.columns.indexOf('Тип') !== -1 ? 'Тип' : null)
      : null;

    var rows = series.items.map(function(item, idx) {
      return { item: item, idx: idx, parsed: hasParser ? parser.parse(item.name) : null };
    });

    var types = [];
    if (typeField) {
      var seen = {};
      rows.forEach(function(r) {
        if (r.parsed && r.parsed[typeField] && !seen[r.parsed[typeField]]) {
          seen[r.parsed[typeField]] = true;
          types.push(r.parsed[typeField]);
        }
      });
    }

    if (types.length > 1) showSeriesTypeFilter(types);
    else hideSeriesTypeFilter();

    var filtered = rows.filter(function(r) {
      if (state.seriesType !== 'all' && typeField && r.parsed && r.parsed[typeField] !== state.seriesType) return false;
      return true;
    });

    var fallbackImg = series.image || sc.fallbackImg;
    var imgByType = series.imageByType || {};
    function pickImage(row) {
      var t = (row.parsed && typeField && row.parsed[typeField]) || row.item.type || '';
      if (imgByType[t]) return imgByType[t];
      if (/^Вилка/i.test(t) && imgByType['Вилка']) return imgByType['Вилка'];
      if (/^Розетка/i.test(t) && imgByType['Розетка']) return imgByType['Розетка'];
      return fallbackImg;
    }

    var html = '<div class="catalog__category-section catalog__series-view">';
    html += '<h2 class="catalog__category-title">' + esc(series.name) +
      ' <span class="title-count">(' + pad(filtered.length) + ')</span></h2>';

    if (filtered.length === 0) {
      html += '<p class="catalog__empty">НЕТ РЕЗУЛЬТАТОВ</p>';
    } else {
      html += '<div class="catalog__products-row">';
      filtered.forEach(function(r) {
        var imageSrc = pickImage(r);
        html += '<a href="' + sc.variant + '#' + esc(series.slug) + ':' + r.idx + '" class="product-card">' +
          '<div class="product-card__img"><img src="' + esc(imageSrc) + '" alt="' + esc(r.item.name) + '" loading="lazy"></div>' +
          '<div class="product-card__info">' +
            '<span class="product-card__name">' + esc(r.item.name) + '</span>' +
          '</div>' +
        '</a>';
      });
      html += '</div>';
    }
    html += '</div>';
    dynamicContainer.innerHTML = html;
  }

  // --- Sidebar: dynamic "ТИП" group for connector series ---

  function showSeriesTypeFilter(types) {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;
    var group = document.getElementById('series-type-group');
    if (!group) {
      group = document.createElement('div');
      group.className = 'filter-group';
      group.id = 'series-type-group';
      group.setAttribute('data-filter', 'series-type');
      var clearRow = sidebar.querySelector('.filter-clear-row');
      sidebar.insertBefore(group, clearRow);
    }
    var buttonsHtml = '<button class="filter-radio' + (state.seriesType === 'all' ? ' filter-radio--active' : '') + '" data-series-type="all">ВСЕ</button>';
    types.forEach(function(t) {
      buttonsHtml += '<button class="filter-radio' + (state.seriesType === t ? ' filter-radio--active' : '') + '" data-series-type="' + esc(t) + '">' + esc(t.toUpperCase()) + '</button>';
    });
    group.innerHTML =
      '<button class="filter-group__header" aria-expanded="true">' +
        '<span class="filter-group__name">ТИП</span>' +
        '<svg class="filter-group__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>' +
      '</button>' +
      '<div class="filter-group__items">' + buttonsHtml + '</div>';

    group.querySelector('.filter-group__header').addEventListener('click', function(e) {
      var btn = e.currentTarget;
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      var items = btn.nextElementSibling;
      if (items) items.style.display = expanded ? 'none' : '';
    });
    group.querySelectorAll('[data-series-type]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.seriesType = btn.getAttribute('data-series-type');
        renderSeriesDetail();
      });
    });
  }

  function hideSeriesTypeFilter() {
    var group = document.getElementById('series-type-group');
    if (group && group.parentNode) group.parentNode.removeChild(group);
  }

  function renderSeriesCategory() {
    if (state.seriesSlug) renderSeriesDetail();
    else renderSeriesList();
  }

  function render() {
    if (!dynamicContainer) return;

    if (currentSeriesCategory()) {
      renderSeriesCategory();
      return;
    }

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

    applyHash();
    window.addEventListener('hashchange', applyHash);
  }

  function applyHash() {
    var hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (!hash) return;
    var parts = hash.split('/');
    var catKey = parts[0];
    if ((catKey === 'connectors' || catKey === 'converters' || catKey === 'capacitors') && parts[1]) {
      activateCategory(catKey);
      state.seriesSlug = parts[1];
      render();
      return;
    }
    if (categoryMap[catKey] || catKey === 'all') {
      activateCategory(catKey);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
