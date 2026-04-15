# SEO-аудит IC Farvater

**Дата:** 2026-04-13
**URL:** https://nikitakozyr51-wq.github.io/ic-farvater/
**Конкурент:** chipdip.ru
**SEO Health Score:** 18/100

## Приоритетный план

### Неделя 1 — Critical
- [ ] Создать `robots.txt`
- [ ] Создать `sitemap.xml`
- [ ] Добавить `<meta name="description">` на все 5 страниц
- [ ] Добавить `<link rel="canonical">` на все страницы
- [ ] Добавить JSON-LD: Organization + WebSite + BreadcrumbList
- [ ] Оптимизировать тексты главной страницы для SEO (копирайтинг)

### Неделя 2 — High
- [ ] Добавить Open Graph теги на все страницы
- [ ] Убрать `no-cache` мета-теги
- [ ] Оптимизировать `products.js` (578KB — разбить или lazy load)
- [ ] Исправить дублированный H1 на главной
- [ ] Добавить `async`/`defer` на внешние скрипты (lenis, gsap)

### Неделя 3-4 — Medium
- [ ] Переименовать изображения в осмысленные имена (9CN77.png -> hero-microelectronics.png)
- [ ] Добавить favicon
- [ ] Добавить `preload` для шрифта Inter
- [ ] Добавить Product schema для товаров
- [ ] Создать `llms.txt` для AI-поисковиков
- [ ] Добавить hreflang="ru"
- [ ] Добавить `<meta name="theme-color">`

### Backlog — Low
- [ ] Добавить `aria-label` на интерактивные элементы
- [ ] Добавить `rel="noopener"` на внешние ссылки
- [ ] Переработать product-detail.html для SSR-контента

## Проблемы по категориям

### Technical SEO (15/100)
- Нет robots.txt (404)
- Нет sitemap.xml (404)
- Нет canonical тегов
- Cache-Control: no-cache блокирует кэширование
- Весь каталог рендерится через JS — не виден ботам

### Content Quality (20/100)
- Нет meta description
- Title теги не оптимизированы под ключевые слова
- Два H1 на главной
- Контент на русском без hreflang

### Schema (0/100)
- Ноль структурированных данных

### Performance (35/100)
- products.js 578KB блокирует рендеринг
- Внешние скрипты без async/defer
- Шрифт без preload

### AI Search Readiness (5/100)
- Нет robots.txt правил для AI-краулеров
- Нет llms.txt
- JS-рендеринг скрывает контент от AI

### Images (25/100)
- Хеш-имена файлов
- product-detail: пустой alt
- Нет favicon
