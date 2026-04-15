// converter-variant.js — Детальная страница варианта преобразователя
// Hash: #<slug>:<index>

(function () {
  'use strict';

  const hash = (window.location.hash || '').replace('#', '');
  const [slug, idxStr] = hash.split(':');
  const idx = parseInt(idxStr, 10);

  if (!slug || isNaN(idx) || typeof CONVERTER_SERIES === 'undefined') return;

  const series = CONVERTER_SERIES.find(s => s.slug === slug);
  if (!series || !series.items[idx]) {
    document.getElementById('cv-name').textContent = 'ВАРИАНТ НЕ НАЙДЕН';
    return;
  }

  const item = series.items[idx];
  document.title = item.name + ' — IC FARVATER';

  const seriesLink = document.getElementById('cv-series-link');
  seriesLink.textContent = 'СЕРИЯ ' + series.name;
  seriesLink.href = 'products.html#converters/' + slug;

  document.getElementById('cv-name').textContent = item.name;
  document.getElementById('cv-subcategory').textContent =
    'СЕРИЯ ' + series.name + (item.type ? ' · ' + item.type : '');

  const img = document.getElementById('cv-image');
  img.src = series.image || '../assets/images/products/converters.webp';
  img.alt = item.name;

  document.getElementById('cv-description').textContent = series.description || '';

  const specs = [];
  specs.push(['СЕРИЯ', series.name]);
  if (item.subseries)  specs.push(['ПОДСЕРИЯ', item.subseries]);
  if (item.partnumber) specs.push(['ПАРТНОМЕР', item.partnumber]);
  if (item.type)       specs.push(['ТИП', item.type]);
  if (item.vin)        specs.push(['ВХОДНОЕ НАПРЯЖЕНИЕ, В', item.vin]);
  if (item.vout)       specs.push(['ВЫХОДНОЕ НАПРЯЖЕНИЕ, В', item.vout]);
  if (item.power)      specs.push(['МОЩНОСТЬ, ВТ', item.power]);
  if (item.current)    specs.push(['МАКС. ТОК, А', item.current]);
  if (item.case)       specs.push(['КОРПУС', item.case]);
  if (item.size)       specs.push(['РАЗМЕРЫ, ММ', item.size]);
  if (item.temp)       specs.push(['ТЕМПЕРАТУРА', item.temp]);

  const specsEl = document.getElementById('cv-specs');
  specsEl.innerHTML = specs.map(([k, v]) =>
    '<div class="product-detail__spec-row">' +
      '<span class="product-detail__spec-key">' + esc(k) + '</span>' +
      '<span class="product-detail__spec-value">' + esc(v) + '</span>' +
    '</div>'
  ).join('');

  document.getElementById('cv-back').href = 'products.html#converters/' + slug;

  function esc(str) {
    const d = document.createElement('div');
    d.textContent = str == null ? '' : String(str);
    return d.innerHTML;
  }
})();
