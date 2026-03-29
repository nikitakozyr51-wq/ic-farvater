// Catalog — product rendering, sidebar sort/filter/search
(function() {
  'use strict';

  var state = {
    sort: 'recommended',
    category: null,
    search: '',
    filters: {
      manufacturer: [],
      package: []
    }
  };

  var browseMode = true;
  var showAllMode = false;
  var staticGrid = null;
  var dynamicContainer = null;
  var sidebarCatButtons = null;


  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  // --- Category key ↔ value mapping ---

  var categoryMap = {
    'microchips': 'Микросхемы',
    'connectors': 'Разъёмы',
    'converters': 'Преобразователи напряжения',
    'capacitors': 'СВЧ-конденсаторы',
    'transistors': 'СВЧ-транзисторы',
    'pcb': 'Печатные платы',
  };

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
    return showAllMode ||
      state.sort !== 'recommended' ||
      state.category !== null ||
      state.search !== '' ||
      state.filters.manufacturer.length > 0 ||
      state.filters.package.length > 0;
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

  // --- Activate category (from card click or sidebar) ---

  function activateCategory(catKey) {
    if (catKey === 'all') {
      state.category = null;
      showAllMode = true;
    } else {
      var catValue = catKey ? (categoryMap[catKey] || null) : null;
      state.category = catValue;
      showAllMode = false;
    }

    // Sync sidebar buttons
    if (sidebarCatButtons) {
      sidebarCatButtons.forEach(function(r) { r.classList.remove('sidebar__radio--active'); });
      if (catKey) {
        sidebarCatButtons.forEach(function(r) {
          if (r.getAttribute('data-category') === catKey) {
            r.classList.add('sidebar__radio--active');
          }
        });
      }
    }

    updateView();
  }

  // --- Filtering ---

  var manufacturerKeywords = {
    'ЭКБ ТЕСТ': ['ЭКБ ТЕСТ', 'ET'],
    'ИРТЫШ': ['ИРТЫШ'],
    'ВОЛГА': ['ВОЛГА'],
    'ЕНИСЕЙ': ['ЕНИСЕЙ'],
    'КАМА': ['КАМА']
  };

  function matchesManufacturer(product, mfr) {
    var keywords = manufacturerKeywords[mfr] || [mfr];
    var text = (product.name + ' ' + (product.subcategory || '') + ' ' + product.description).toUpperCase();
    for (var i = 0; i < keywords.length; i++) {
      if (text.indexOf(keywords[i].toUpperCase()) !== -1) return true;
    }
    return false;
  }

  function matchesPackage(product, pkg) {
    var specs = product.specs || {};
    var corpus = (specs['Тип корпуса'] || specs['Корпус'] || '').toUpperCase();
    return corpus.indexOf(pkg.toUpperCase()) !== -1;
  }

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

      if (state.filters.manufacturer.length > 0) {
        var mfrOk = false;
        for (var m = 0; m < state.filters.manufacturer.length; m++) {
          if (matchesManufacturer(p, state.filters.manufacturer[m])) { mfrOk = true; break; }
        }
        if (!mfrOk) continue;
      }

      if (state.filters.package.length > 0) {
        var pkgOk = false;
        for (var k = 0; k < state.filters.package.length; k++) {
          if (matchesPackage(p, state.filters.package[k])) { pkgOk = true; break; }
        }
        if (!pkgOk) continue;
      }

      results.push({ product: p, index: i });
    }

    // Sort
    if (state.sort === 'name-asc') {
      results.sort(function(a, b) { return a.product.name.localeCompare(b.product.name, 'ru'); });
    } else if (state.sort === 'name-desc') {
      results.sort(function(a, b) { return b.product.name.localeCompare(a.product.name, 'ru'); });
    }

    return results;
  }

  // --- Rendering ---

  var isMobile = window.innerWidth <= 768;

  function renderCard(item) {
    var p = item.product;
    var idx = item.index;
    var imgHtml = p.image
      ? '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\'">'
      : '';
    var descHtml = isMobile
      ? '<p class="product-card__desc">' + p.category + '</p>'
      : '';
    return '<a href="product-detail.html#' + p.id + '" class="product-card">' +
      '<div class="product-card__img">' + imgHtml + '</div>' +
      '<div class="product-card__info">' +
        '<div class="product-card__info-top">' +
          '<span class="product-card__name">' + p.name.toUpperCase() + '</span>' +
          (isMobile ? '' : '<span class="product-card__count">(' + pad(idx + 1) + ')</span>') +
        '</div>' +
        descHtml +
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

    // If single category selected, show with category title
    if (state.category) {
      var html = '<div class="catalog__category-section">';
      html += '<h2 class="catalog__category-title">' + state.category.toUpperCase() +
        ' <span class="title-count">(' + pad(items.length) + ')</span></h2>';
      html += '<div class="catalog__products-row">';
      for (var i = 0; i < items.length; i++) {
        html += renderCard(items[i]);
      }
      html += '</div></div>';
      dynamicContainer.innerHTML = html;
      return;
    }

    // On mobile: flat grid, no category headers
    if (isMobile) {
      var htmlM = '<div class="catalog__products-row">';
      for (var f = 0; f < items.length; f++) {
        htmlM += renderCard(items[f]);
      }
      htmlM += '</div>';
      dynamicContainer.innerHTML = htmlM;
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
      for (var n = 0; n < list.length; n++) {
        html2 += renderCard(list[n]);
      }
      html2 += '</div></div>';
    }
    dynamicContainer.innerHTML = html2;
  }

  // --- Sidebar: sort ---

  function initSort() {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;
    var splitGroup = sidebar.querySelector('.sidebar__group--split');
    if (!splitGroup) return;
    var sortCol = splitGroup.querySelector('.sidebar__col:not(.sidebar__col--right)');
    if (!sortCol) return;

    var radios = sortCol.querySelectorAll('.sidebar__radio');
    radios.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var wasActive = btn.classList.contains('sidebar__radio--active');
        radios.forEach(function(r) { r.classList.remove('sidebar__radio--active'); });
        if (wasActive) {
          state.sort = 'recommended';
        } else {
          btn.classList.add('sidebar__radio--active');
          state.sort = btn.getAttribute('data-sort') || 'recommended';
        }
        updateView();
      });
    });
  }

  // --- Sidebar: category (right column) ---

  function initCategory() {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;
    var splitGroup = sidebar.querySelector('.sidebar__group--split');
    if (!splitGroup) return;
    var catCol = splitGroup.querySelector('.sidebar__col--right');
    if (!catCol) return;

    sidebarCatButtons = catCol.querySelectorAll('.sidebar__radio');

    sidebarCatButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var wasActive = btn.classList.contains('sidebar__radio--active');
        if (wasActive) {
          activateCategory(null);
        } else {
          var key = btn.getAttribute('data-category') || null;
          activateCategory(key);
        }
      });
    });
  }

  // --- Sidebar: filter groups (multi-select toggle) ---

  function initFilterGroups() {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;
    var groups = sidebar.querySelectorAll('.sidebar__group:not(.sidebar__group--split)');

    groups.forEach(function(group) {
      var label = group.querySelector('.sidebar__label');
      var groupName = label ? label.textContent.trim().toUpperCase() : '';
      var filterKey = null;

      if (groupName.indexOf('ПРОИЗВОДИТЕЛЬ') !== -1) filterKey = 'manufacturer';
      else if (groupName.indexOf('КОРПУС') !== -1) filterKey = 'package';
      // Применение — нет данных в PRODUCTS, только визуальный toggle

      var radios = group.querySelectorAll('.sidebar__radio');

      radios.forEach(function(btn) {
        btn.addEventListener('click', function() {
          btn.classList.toggle('sidebar__radio--active');
          if (filterKey) {
            state.filters[filterKey] = [];
            group.querySelectorAll('.sidebar__radio--active').forEach(function(a) {
              state.filters[filterKey].push(a.textContent.trim());
            });
          }
          updateClearButton();
          updateView();
        });
      });

    });
  }

  function resetAll() {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;
    sidebar.querySelectorAll('.sidebar__radio--active').forEach(function(r) {
      r.classList.remove('sidebar__radio--active');
    });
    state.sort = 'recommended';
    state.category = null;
    state.search = '';
    state.filters.manufacturer = [];
    state.filters.package = [];
    showAllMode = false;
    var input = document.querySelector('.catalog__search-input');
    if (input) input.value = '';
    updateClearButton();
    updateView();
  }

  function updateClearButton() {
    var sidebar = document.getElementById('catalog-sidebar');
    if (!sidebar) return;
    var count = sidebar.querySelectorAll('.sidebar__radio--active').length;
    var countEl = document.getElementById('sidebar-count');
    if (countEl) countEl.textContent = count;
    var clearBtn = sidebar.querySelector('.sidebar__clear');
    if (clearBtn) clearBtn.textContent = 'СБРОСИТЬ ФИЛЬТРЫ';
  }

  // --- Static category cards click → activate filter ---

  function initCategoryCards() {
    if (!staticGrid) return;
    var cards = staticGrid.querySelectorAll('.cat-card[data-category]');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var key = card.getAttribute('data-category');
        activateCategory(key);
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
    if (typeof PRODUCTS === 'undefined') return;
    staticGrid = document.getElementById('products-grid');
    if (!staticGrid) return;

    dynamicContainer = document.createElement('div');
    dynamicContainer.id = 'catalog-products';
    dynamicContainer.className = 'catalog__all-products';
    dynamicContainer.style.display = 'none';
    staticGrid.parentNode.insertBefore(dynamicContainer, staticGrid.nextSibling);

    initSort();
    initCategory();
    initFilterGroups();
    initCategoryCards();
    initSearch();

    // On mobile, auto-show all products (flat grid instead of category cards)
    if (window.innerWidth <= 768) {
      activateCategory('all');
    }

    // Activate category from URL hash (e.g. products.html#connectors)
    var hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (hash && categoryMap[hash]) {
      activateCategory(hash);
    }

    var resetBtn = document.getElementById('sidebar-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        resetAll();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
