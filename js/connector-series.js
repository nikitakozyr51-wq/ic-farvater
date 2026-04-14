// connector-series.js — Страница серии разъёмов
// Читает slug из hash, рендерит таблицу с расшифровкой

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

  // Build columns: # + Наименование + parsed columns (or Тип + ТУ for basic)
  const columns = ['#', 'НАИМЕНОВАНИЕ'];
  if (hasParser) {
    columns.push(...parser.columns);
  } else {
    columns.push('ТИП', 'ТУ');
  }

  // ── Parse all items ──
  const rows = series.items.map((item, i) => {
    const parsed = hasParser ? parser.parse(item.name) : null;
    return { idx: i + 1, item, parsed };
  });

  // ── Render table header ──
  const thead = document.getElementById('sp-thead');
  const headerRow = document.createElement('tr');
  columns.forEach((col, ci) => {
    const th = document.createElement('th');
    th.textContent = col;
    if (ci > 0) {
      th.dataset.sort = ci;
    }
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // ── Type filter (Вилка/Розетка) ──
  const filtersEl = document.getElementById('sp-filters');
  let typeFilter = 'all';

  // Find if parsed data has Часть or Тип field
  const typeField = hasParser
    ? (parser.columns.includes('Часть') ? 'Часть' : parser.columns.includes('Тип') ? 'Тип' : null)
    : null;

  if (typeField) {
    const types = new Set();
    rows.forEach(r => {
      if (r.parsed && r.parsed[typeField]) types.add(r.parsed[typeField]);
    });
    if (types.size > 1) {
      const allBtn = createFilterBtn('ВСЕ', 'all', true);
      filtersEl.appendChild(allBtn);
      types.forEach(t => {
        filtersEl.appendChild(createFilterBtn(t.toUpperCase(), t, false));
      });
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
      renderRows();
    });
    return btn;
  }

  // ── Search ──
  const searchInput = document.getElementById('sp-search');
  let searchQuery = '';
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toUpperCase();
    renderRows();
  });

  // ── Sort ──
  let sortCol = null;
  let sortDir = 'asc';

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th[data-sort]');
    if (!th) return;
    const ci = parseInt(th.dataset.sort);
    if (sortCol === ci) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortCol = ci;
      sortDir = 'asc';
    }
    thead.querySelectorAll('th').forEach(t => t.classList.remove('sort-asc', 'sort-desc'));
    th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    renderRows();
  });

  // ── Render ──
  const tbody = document.getElementById('sp-tbody');
  const emptyEl = document.getElementById('sp-empty');

  function getRowValues(row) {
    const vals = [String(row.idx), row.item.name];
    if (hasParser && row.parsed) {
      parser.columns.forEach(col => vals.push(row.parsed[col] || '—'));
    } else if (!hasParser) {
      vals.push(row.item.type || '—', row.item.tu || '—');
    } else {
      parser.columns.forEach(() => vals.push('—'));
    }
    return vals;
  }

  function renderRows() {
    // Filter
    let filtered = rows.filter(r => {
      // Type filter
      if (typeFilter !== 'all' && typeField && r.parsed) {
        if (r.parsed[typeField] !== typeFilter) return false;
      }
      // Search
      if (searchQuery) {
        if (!r.item.name.toUpperCase().includes(searchQuery)) return false;
      }
      return true;
    });

    // Sort
    if (sortCol !== null) {
      filtered.sort((a, b) => {
        const va = getRowValues(a)[sortCol] || '';
        const vb = getRowValues(b)[sortCol] || '';
        // Try numeric
        const na = parseFloat(va);
        const nb = parseFloat(vb);
        let cmp;
        if (!isNaN(na) && !isNaN(nb)) {
          cmp = na - nb;
        } else {
          cmp = va.localeCompare(vb, 'ru');
        }
        return sortDir === 'desc' ? -cmp : cmp;
      });
    }

    // Render
    tbody.innerHTML = '';
    if (filtered.length === 0) {
      emptyEl.style.display = '';
      return;
    }
    emptyEl.style.display = 'none';

    const fragment = document.createDocumentFragment();
    filtered.forEach(r => {
      const tr = document.createElement('tr');
      const vals = getRowValues(r);
      vals.forEach(v => {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
  }

  renderRows();
})();
