// connector-series.js — Страница серии разъёмов
// Читает slug из hash, рендерит карточки вариантов с расшифровкой

(function () {
  'use strict';

  const slug = (window.location.hash || '').replace('#', '');
  if (!slug || typeof CONNECTOR_SERIES === 'undefined') return;

  const series = CONNECTOR_SERIES.find(s => s.slug === slug);
  if (!series) {
    document.querySelector('.series-page__title-row').innerHTML =
      '<h1 class="series-page__title">СЕРИЯ НЕ НАЙДЕНА</h1>';
    return;
  }

  // ── Title & meta ──
  document.title = series.name + ' — IC FARVATER';
  document.getElementById('sp-breadcrumb').textContent = series.name;
  document.getElementById('sp-title').textContent = series.name;
  document.getElementById('sp-count').textContent = '(' + String(series.count).padStart(2, '0') + ')';
  document.getElementById('sp-tu').textContent = series.tu || '';
  document.getElementById('sp-desc').textContent = series.description || '';

  // ── Parser ──
  const parser = ConnectorParsers.getParser(slug);
  const hasParser = parser.columns.length > 0;

  // ── Build parsed rows ──
  const rows = series.items.map(item => ({
    item,
    parsed: hasParser ? parser.parse(item.name) : null
  }));

  // ── Type filter (Вилка/Розетка) ──
  const filtersEl = document.getElementById('sp-filters');
  let typeFilter = 'all';

  const typeField = hasParser
    ? (parser.columns.includes('Часть') ? 'Часть' : parser.columns.includes('Тип') ? 'Тип' : null)
    : null;

  if (typeField) {
    const types = new Set();
    rows.forEach(r => { if (r.parsed && r.parsed[typeField]) types.add(r.parsed[typeField]); });
    if (types.size > 1) {
      filtersEl.appendChild(createFilterBtn('ВСЕ', 'all', true));
      types.forEach(t => filtersEl.appendChild(createFilterBtn(t.toUpperCase(), t, false)));
    }
  }

  function createFilterBtn(label, value, active) {
    const btn = document.createElement('button');
    btn.className = 'series-page__filter-btn' + (active ? ' series-page__filter-btn--active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      typeFilter = value;
      filtersEl.querySelectorAll('.series-page__filter-btn').forEach(b =>
        b.classList.toggle('series-page__filter-btn--active', b === btn)
      );
      render();
    });
    return btn;
  }

  // ── Search ──
  const searchInput = document.getElementById('sp-search');
  let searchQuery = '';
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toUpperCase();
    render();
  });

  // ── Render ──
  const gridEl = document.getElementById('sp-grid');
  const emptyEl = document.getElementById('sp-empty');
  const imageSrc = series.image || '../assets/images/products/connectors.png';

  function render() {
    const filtered = rows.filter(r => {
      if (typeFilter !== 'all' && typeField && r.parsed) {
        if (r.parsed[typeField] !== typeFilter) return false;
      }
      if (searchQuery && !r.item.name.toUpperCase().includes(searchQuery)) return false;
      return true;
    });

    gridEl.innerHTML = '';
    if (filtered.length === 0) {
      emptyEl.style.display = '';
      return;
    }
    emptyEl.style.display = 'none';

    const fragment = document.createDocumentFragment();
    filtered.forEach(r => fragment.appendChild(buildCard(r)));
    gridEl.appendChild(fragment);
  }

  function buildCard(row) {
    const card = document.createElement('div');
    card.className = 'variant-card';

    const specsHtml = hasParser && row.parsed
      ? parser.columns.map(col =>
          '<div class="variant-card__spec">' +
            '<span class="variant-card__spec-key">' + esc(col) + '</span>' +
            '<span class="variant-card__spec-val">' + esc(row.parsed[col] || '—') + '</span>' +
          '</div>'
        ).join('')
      : [
          ['Тип', row.item.type],
          ['ТУ', row.item.tu]
        ].filter(p => p[1]).map(p =>
          '<div class="variant-card__spec">' +
            '<span class="variant-card__spec-key">' + esc(p[0]) + '</span>' +
            '<span class="variant-card__spec-val">' + esc(p[1]) + '</span>' +
          '</div>'
        ).join('');

    card.innerHTML =
      '<div class="variant-card__img">' +
        '<img src="' + esc(imageSrc) + '" alt="' + esc(row.item.name) + '" loading="lazy">' +
      '</div>' +
      '<div class="variant-card__info">' +
        '<h3 class="variant-card__name">' + esc(row.item.name) + '</h3>' +
        '<div class="variant-card__specs">' + specsHtml + '</div>' +
      '</div>';

    return card;
  }

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }

  render();
})();
