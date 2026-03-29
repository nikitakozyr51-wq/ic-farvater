import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('e:/site/ekb_test_products.json', 'utf8'));

const jsContent = `// Каталог продуктов ИК Фарватер
// Данные с ekb-test.ru — ${data.length} продуктов, 6 категорий

const PRODUCTS = ${JSON.stringify(data, null, 2)};

const CATEGORIES = [
  { label: 'Все', value: null },
  { label: 'Микросхемы', value: 'Микросхемы' },
  { label: 'Разъёмы', value: 'Разъёмы' },
  { label: 'Преобразователи', value: 'Преобразователи напряжения' },
  { label: 'СВЧ-конденсаторы', value: 'СВЧ-конденсаторы' },
  { label: 'СВЧ-транзисторы', value: 'СВЧ-транзисторы' },
  { label: 'Печатные платы', value: 'Печатные платы' }
];

let currentCategory = null;
let currentSearch = '';

function getFilteredProducts() {
  return PRODUCTS.filter(function(p) {
    const matchCat = !currentCategory || p.category === currentCategory;
    const q = currentSearch.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });
}

function renderProductCard(product) {
  const imgTag = product.image
    ? '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy">'
    : '';
  const hasImg = product.image ? '' : ' product-card__img--empty';

  const specEntries = Object.entries(product.specs || {}).slice(0, 3);
  const specsHtml = specEntries.map(function(entry) {
    return '<div class="product-card__spec"><span>' + entry[0] + ':</span> ' + entry[1] + '</div>';
  }).join('');

  const desc = product.description.length > 130
    ? product.description.slice(0, 130) + '…'
    : product.description;

  return '<article class="product-card">' +
    '<div class="product-card__img' + hasImg + '">' + imgTag + '</div>' +
    '<div class="product-card__body">' +
    '<div class="product-card__category">' + (product.subcategory || product.category) + '</div>' +
    '<h3 class="product-card__name">' + product.name + '</h3>' +
    '<p class="product-card__desc">' + desc + '</p>' +
    '<div class="product-card__specs">' + specsHtml + '</div>' +
    '<div class="product-card__footer">' +
    '<a href="' + product.url + '" target="_blank" rel="noopener" class="btn btn--outline btn--sm">Подробнее</a>' +
    '<a href="product-detail.html?id=' + product.id + '" class="btn btn--primary btn--sm">Запросить цену</a>' +
    '</div>' +
    '</div>' +
    '</article>';
}

function renderProducts(container) {
  if (!container) return;
  const filtered = getFilteredProducts();
  if (filtered.length === 0) {
    container.innerHTML = '<p class="products-empty">Ничего не найдено</p>';
    return;
  }
  container.innerHTML = filtered.map(renderProductCard).join('');
}

function renderCategoryTabs(container) {
  if (!container) return;
  container.innerHTML = CATEGORIES.map(function(cat) {
    const count = cat.value ? PRODUCTS.filter(function(p) { return p.category === cat.value; }).length : PRODUCTS.length;
    const active = currentCategory === cat.value ? ' active' : '';
    const val = cat.value || '';
    return '<button class="category-tab' + active + '" data-category="' + val + '">' + cat.label + ' <span class="category-tab__count">' + count + '</span></button>';
  }).join('');

  container.querySelectorAll('.category-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentCategory = btn.dataset.category || null;
      container.querySelectorAll('.category-tab').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const grid = document.getElementById('products-grid');
      renderProducts(grid);
    });
  });
}

function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('input', function(e) {
    currentSearch = e.target.value;
    const grid = document.getElementById('products-grid');
    renderProducts(grid);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('products-grid');
  const tabs = document.getElementById('category-tabs');
  if (tabs) renderCategoryTabs(tabs);
  if (grid) renderProducts(grid);
  initSearch();
});
`;

writeFileSync('e:/site/demo project/ic farvater/js/products.js', jsContent, 'utf8');
console.log('products.js written, size:', jsContent.length, 'chars');
