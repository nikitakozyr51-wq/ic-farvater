// capacitor-variant.js — Детальная страница варианта СВЧ-конденсатора
// Hash: #<slug>:<index>

(function () {
  'use strict';

  const hash = (window.location.hash || '').replace('#', '');
  const [slug, idxStr] = hash.split(':');
  const idx = parseInt(idxStr, 10);

  if (!slug || isNaN(idx) || typeof CAPACITOR_SERIES === 'undefined') return;

  const series = CAPACITOR_SERIES.find(s => s.slug === slug);
  if (!series || !series.items[idx]) {
    document.getElementById('cv-name').textContent = 'ВАРИАНТ НЕ НАЙДЕН';
    return;
  }

  const item = series.items[idx];
  document.title = item.name + ' — IC FARVATER';

  const seriesLink = document.getElementById('cv-series-link');
  seriesLink.textContent = 'СЕРИЯ ' + series.name;
  seriesLink.href = 'products.html#capacitors/' + slug;

  const h1 = item.displayName || item.name;
  document.getElementById('cv-name').textContent = h1;
  document.getElementById('cv-subcategory').textContent =
    'СЕРИЯ ' + series.name +
    (item.partnumber ? ' · ' + item.partnumber : '') +
    (series.tu ? ' · ' + series.tu : '');

  const img = document.getElementById('cv-image');
  img.src = series.image || '../assets/images/products/capacitors.webp';
  img.alt = item.name;

  document.getElementById('cv-description').textContent = series.description || '';

  const specs = [];
  specs.push(['СЕРИЯ', series.name]);
  if (item.partnumber)  specs.push(['ПАРТНОМЕР', item.partnumber]);
  if (item.capacitance) specs.push(['ЁМКОСТЬ, ПФ', item.capacitance]);
  if (item.code)        specs.push(['КОД ЁМКОСТИ', item.code]);
  if (item.case)        specs.push(['КОРПУС', item.case]);
  if (item.tolerance)   specs.push(['ТОЧНОСТЬ', item.tolerance]);
  if (item.voltage)     specs.push(['НАПРЯЖЕНИЕ, В', item.voltage]);
  if (item.temp)        specs.push(['ТЕМПЕРАТУРА', item.temp]);
  if (series.tu)        specs.push(['ТУ', series.tu]);

  const specsEl = document.getElementById('cv-specs');
  specsEl.innerHTML = specs.map(([k, v]) =>
    '<div class="product-detail__spec-row">' +
      '<span class="product-detail__spec-key">' + esc(k) + '</span>' +
      '<span class="product-detail__spec-value">' + esc(v) + '</span>' +
    '</div>'
  ).join('');

  document.getElementById('cv-back').href = 'products.html#capacitors/' + slug;

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }
})();
