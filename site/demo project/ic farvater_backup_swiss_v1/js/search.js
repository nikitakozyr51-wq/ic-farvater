/**
 * Search — product search functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    filterProducts(query);
  });
});

function filterProducts(query) {
  const cards = document.querySelectorAll('#productsGrid .card');

  cards.forEach(card => {
    const title = card.querySelector('.card__title')?.textContent.toLowerCase() || '';
    const text = card.querySelector('.card__text')?.textContent.toLowerCase() || '';
    const match = title.includes(query) || text.includes(query);
    card.style.display = match ? '' : 'none';
  });
}
