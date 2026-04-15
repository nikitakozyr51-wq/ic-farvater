// connector-variant.js — Детальная страница варианта разъёма
// Hash: #<slug>:<index> → рендерит по образцу product-detail.html

(function () {
  'use strict';

  const hash = (window.location.hash || '').replace('#', '');
  const [slug, idxStr] = hash.split(':');
  const idx = parseInt(idxStr, 10);

  if (!slug || isNaN(idx) || typeof CONNECTOR_SERIES === 'undefined') return;

  const series = CONNECTOR_SERIES.find(s => s.slug === slug);
  if (!series || !series.items[idx]) {
    document.getElementById('cv-name').textContent = 'ВАРИАНТ НЕ НАЙДЕН';
    return;
  }

  const item = series.items[idx];
  const parser = ConnectorParsers.getParser(slug);
  const hasParser = parser.columns.length > 0;
  const parsed = hasParser ? parser.parse(item.name) : null;

  document.title = item.name + ' — IC FARVATER';

  const seriesLink = document.getElementById('cv-series-link');
  seriesLink.textContent = series.name;
  seriesLink.href = 'products.html#connectors/' + slug;

  document.getElementById('cv-name').textContent = item.name;
  document.getElementById('cv-subcategory').textContent = series.name + (series.tu ? ' · ' + series.tu : '');

  const img = document.getElementById('cv-image');
  const typeField = parser && parser.columns
    ? (parser.columns.indexOf('Часть') !== -1 ? 'Часть' : parser.columns.indexOf('Тип') !== -1 ? 'Тип' : null)
    : null;
  const itemType = (parsed && typeField && parsed[typeField]) || item.type || '';
  const byType = series.imageByType || {};
  function pickVariantImage() {
    if (byType[itemType]) return byType[itemType];
    if (/^Вилка/i.test(itemType) && byType['Вилка']) return byType['Вилка'];
    if (/^Розетка/i.test(itemType) && byType['Розетка']) return byType['Розетка'];
    return series.image || '../assets/images/products/connectors.png';
  }
  img.src = pickVariantImage();
  img.alt = item.name;

  document.getElementById('cv-description').textContent =
    (series.description || '') + (item.type ? ' Тип: ' + item.type + '.' : '');

  // Specs: ТУ + tип + parsed columns
  const specsEl = document.getElementById('cv-specs');
  const specs = [];
  specs.push(['СЕРИЯ', series.name]);
  if (item.type) specs.push(['ТИП', item.type]);
  if (item.tu || series.tu) specs.push(['ТУ', item.tu || series.tu]);
  if (parsed) {
    parser.columns.forEach(col => {
      const v = parsed[col];
      if (v && v !== '—') specs.push([col.toUpperCase(), v]);
    });
  }

  specsEl.innerHTML = specs.map(([k, v]) =>
    '<div class="product-detail__spec-row">' +
      '<span class="product-detail__spec-key">' + esc(k) + '</span>' +
      '<span class="product-detail__spec-value">' + esc(v) + '</span>' +
    '</div>'
  ).join('');

  document.getElementById('cv-back').href = 'products.html#connectors/' + slug;

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }
})();
