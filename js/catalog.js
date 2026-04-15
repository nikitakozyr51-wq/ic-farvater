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

  function syncHash() {
    var hash = '';
    if (state.category === 'Разъёмы') {
      hash = state.seriesSlug ? 'connectors/' + state.seriesSlug : 'connectors';
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

  function renderConnectorSeriesList() {
    if (typeof CONNECTOR_SERIES === 'undefined') {
      dynamicContainer.innerHTML = '<p class="catalog__empty">ДАННЫЕ НЕ ЗАГРУЖЕНЫ</p>';
      return;
    }
    var groups = { main: [], additional: [], dev: [] };
    for (var i = 0; i < CONNECTOR_SERIES.length; i++) {
      var s = CONNECTOR_SERIES[i];
      (groups[s.group] || groups.main).push(s);
    }
    var labels = { main: 'ОСНОВНЫЕ СЕРИИ', additional: 'ДОПОЛНИТЕЛЬНЫЕ СЕРИИ', dev: 'В РАЗРАБОТКЕ' };
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
        html += '<a href="#connectors/' + esc(srs.slug) + '" class="product-card" data-series="' + esc(srs.slug) + '">' +
          '<div class="product-card__img">' + img + '</div>' +
          '<div class="product-card__info">' +
            '<span class="product-card__name">' + esc(srs.name) + '</span>' +
            '<span class="product-card__count">(' + srs.count + ')</span>' +
          '</div>' +
        '</a>';
      }
      html += '</div></div>';
    }
    dynamicContainer.innerHTML = html;
  }

  function renderConnectorSeriesDetail() {
    var series = CONNECTOR_SERIES.find(function(s) { return s.slug === state.seriesSlug; });
    if (!series) {
      state.seriesSlug = null;
      renderConnectorSeriesList();
      return;
    }

    var parser = (typeof ConnectorParsers !== 'undefined') ? ConnectorParsers.getParser(series.slug) : { columns: [], parse: function() { return null; } };
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

    var filtered = rows.filter(function(r) {
      if (state.seriesType !== 'all' && typeField && r.parsed && r.parsed[typeField] !== state.seriesType) return false;
      if (state.seriesSearch && r.item.name.toUpperCase().indexOf(state.seriesSearch) === -1) return false;
      return true;
    });

    var imageSrc = series.image || '../assets/images/products/connectors.png';

    var html = '<div class="catalog__category-section catalog__series-view">';
    html += '<div class="catalog__series-head">';
    html += '<h2 class="catalog__category-title">' + esc(series.name) +
      ' <span class="title-count">(' + pad(series.count) + ')</span></h2>';
    if (series.tu) html += '<p class="catalog__series-tu">' + esc(series.tu) + '</p>';
    if (series.description) html += '<p class="catalog__series-desc">' + esc(series.description) + '</p>';
    html += '</div>';

    html += '<div class="catalog__series-controls">';
    html += '<div class="catalog__series-search"><input type="text" id="series-search-input" class="catalog__series-search-input" placeholder="ПОИСК ПО НАИМЕНОВАНИЮ..." value="' + esc(state.seriesSearch) + '"></div>';
    if (types.length > 1) {
      html += '<div class="catalog__series-filters">';
      html += '<button type="button" class="series-filter-btn' + (state.seriesType === 'all' ? ' series-filter-btn--active' : '') + '" data-type="all">ВСЕ</button>';
      types.forEach(function(t) {
        html += '<button type="button" class="series-filter-btn' + (state.seriesType === t ? ' series-filter-btn--active' : '') + '" data-type="' + esc(t) + '">' + esc(t.toUpperCase()) + '</button>';
      });
      html += '</div>';
    }
    html += '</div>';

    if (filtered.length === 0) {
      html += '<p class="catalog__empty">НЕТ РЕЗУЛЬТАТОВ</p>';
    } else {
      html += '<div class="catalog__products-row">';
      filtered.forEach(function(r) {
        html += '<a href="connector-variant.html#' + esc(series.slug) + ':' + r.idx + '" class="product-card">' +
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

    var searchInput = document.getElementById('series-search-input');
    if (searchInput) {
      var timer = null;
      searchInput.addEventListener('input', function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          state.seriesSearch = searchInput.value.trim().toUpperCase();
          renderConnectorSeriesDetail();
          var el = document.getElementById('series-search-input');
          if (el) { el.focus(); var v = el.value; el.value = ''; el.value = v; }
        }, 200);
      });
    }
    dynamicContainer.querySelectorAll('.series-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.seriesType = btn.getAttribute('data-type');
        renderConnectorSeriesDetail();
      });
    });
  }

  function renderConnectors() {
    if (state.seriesSlug) renderConnectorSeriesDetail();
    else renderConnectorSeriesList();
  }

  function render() {
    if (!dynamicContainer) return;

    if (state.category === 'Разъёмы') {
      renderConnectors();
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
    if (catKey === 'connectors' && parts[1]) {
      activateCategory('connectors');
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
