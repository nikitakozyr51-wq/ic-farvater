// connectors-catalog.js — Рендер карточек серий на connectors.html

(function () {
  'use strict';

  if (typeof CONNECTOR_SERIES === 'undefined') return;

  const mainGrid = document.getElementById('cc-main-grid');
  const addGrid = document.getElementById('cc-add-grid');
  const devGrid = document.getElementById('cc-dev-grid');
  if (!mainGrid) return;

  const grids = { main: mainGrid, additional: addGrid, dev: devGrid };
  let totalItems = 0;

  CONNECTOR_SERIES.forEach(series => {
    const grid = grids[series.group];
    if (!grid) return;

    totalItems += series.count;

    const card = document.createElement('a');
    card.className = 'conn-card';
    card.href = 'connector-series.html#' + series.slug;

    card.innerHTML =
      '<h3 class="conn-card__name">' + escHtml(series.name) + '</h3>' +
      '<span class="conn-card__count">(' + String(series.count).padStart(2, '0') + ')</span>' +
      '<p class="conn-card__desc">' + escHtml(series.description) + '</p>' +
      (series.tu ? '<span class="conn-card__tu">' + escHtml(series.tu) + '</span>' : '');

    grid.appendChild(card);
  });

  // Total count
  const countEl = document.getElementById('cc-total-count');
  if (countEl) {
    countEl.textContent = '(' + totalItems + ')';
  }

  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
})();
