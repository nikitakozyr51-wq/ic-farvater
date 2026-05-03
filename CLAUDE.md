# IC Farvater — Website Redesign

## Project Overview
Редизайн сайта компании-дистрибьютора "IC Фарватер" (латиницей).
Многостраничный сайт на чистом HTML + CSS + JS (без фреймворков).

## Tech Stack
- **HTML5** — семантическая разметка
- **CSS3** — кастомные свойства (CSS variables), Flexbox, Grid, адаптив через media queries
- **JavaScript (ES6+)** — vanilla JS, модули
- **Шрифты** — Inter (Google Fonts)
- **Без сборщиков** — проект работает как есть, без npm/webpack/vite

## Project Structure
```
ic farvater/
├── index.html              # Главная страница
├── pages/
│   ├── about.html          # О компании
│   ├── services.html       # Услуги
│   ├── products.html       # Каталог продуктов
│   ├── product-detail.html # Карточка продукта (шаблон)
│   └── contacts.html       # Контакты
├── css/
│   ├── reset.css           # CSS reset / normalize
│   ├── variables.css       # CSS-переменные (цвета, шрифты, отступы)
│   ├── base.css            # Базовые стили (типографика, body)
│   ├── components.css      # Компоненты (кнопки, карточки, навигация)
│   ├── layout.css          # Сетка и лейаут
│   ├── mobile.css          # Мобильные стили (max-width: 768px)
│   └── pages/              # Стили для конкретных страниц
├── js/
│   ├── main.js             # Общая логика (навигация, мобильное меню)
│   ├── products.js         # Логика каталога продуктов
│   └── catalog.js          # Фильтрация и поиск
├── assets/
│   ├── images/             # Изображения сайта
│   └── fonts/              # Локальные шрифты (если нужны)
└── CLAUDE.md               # Этот файл
```

## Data Source
- **Компания:** ООО «Айси Фарватер», интегратор ЭКБ, Санкт-Петербург
- **Адрес:** ул. Беринга, д. 1-А, оф. 46-Н, г. Санкт-Петербург, 199406
- **Телефон:** +7 996 778-88-42
- **Email:** info@ic-farvater.ru, sale@ic-farvater.ru
- **Режим:** пн.–пт. 10:00–18:00
- **Продукция:** Микросхемы, разъёмы (ЕТ-серии), преобразователи напряжения (ИРТЫШ, ВОЛГА, ЕНИСЕЙ, КАМА), СВЧ-конденсаторы (ARC70), СВЧ-транзисторы LDMOS, печатные платы
- **Услуги:** Прямые поставки ЭКБ, испытательная лаборатория, импортозамещение, кабельные сборки

## Design Direction
- **Стиль:** Swiss International Typographic Style + редакционный минимализм
- **Референсы:** quadrantcapital.io (типографический минимализм, воздух), Esmée Van Arden (uppercase каталог, радио-фильтры, сетка)
- **НЕ референс:** ekb-test.ru — оттуда берём ТОЛЬКО данные, НИКОГДА дизайн
- **Сетка:** CSS Grid для каталога, Flexbox для компонентов

---

## Typography Rules
Шрифт — **Inter** везде. Все заголовки — **UPPERCASE**.
Масштабирование по Swiss-принципу (base unit 8px, коэффициент ~0.78 tablet / ~0.56 mobile).

### Размеры по брейкпоинтам

| Роль | Токен | Desktop (1440) | Tablet (1024) | Mobile (390) | Вес | Letter-spacing |
|------|-------|----------------|---------------|--------------|-----|----------------|
| Hero H1 | `--text-hero` | 72px | 56px | 40px | 500 | -2px / -1.5px / -1px |
| Section H2 | `--text-section` | 40px | 32px | 28px | 500 | -1px / -0.5px / -0.5px |
| Subtitle H3 | `--text-subtitle` | 24px | 20px | 18px | 500 | -0.5px / -0.5px / 0 |
| Body | `--text-body` | 16px | 16px | 16px | 400 | 0 |
| Label | `--text-label` | 14px | 14px | 14px | 600 | +1px |

### Жёсткие правила типографики
- Только размеры из таблицы выше — любой другой запрещён
- Заголовки H1/H2/H3 — weight 500, UPPERCASE, отрицательный letter-spacing
- Метки/счётчики — 14px, weight 600, UPPERCASE, letter-spacing +1px
- Body и Label не масштабируются — одинаковы на всех брейкпоинтах
- **Никаких теней** — ни `box-shadow`, ни `text-shadow`
- **Никаких скруглений** — `border-radius: 0` везде, **кроме кнопок** (pill: `border-radius: 100px`)

---

## Color System
Активная палитра — **бежево-синяя**.

| Токен | Значение | Назначение |
|-------|----------|------------|
| `--color-bg` | `#F5F3EF` | Фон страницы |
| `--color-bg-alt` | `#E9E8EB` | Карточки, заглушки фото |
| `--color-text` | `#112F6E` | Основной текст |
| `--color-text-muted` | `#6B7A94` | Вторичный текст, метки |
| `--color-border` | `#D7D3CB` | Все разделители |

### Жёсткие правила цветов
- **Нет отдельного акцентного цвета** — кнопки = `--color-text` (`#112F6E`)
- **Активный фильтр/пункт** = префикс `(•)`, неактивный = без префикса, цвет `--color-text-muted`
- Старые цвета `#0033FF`, `#FFFFFF` (белый фон), `#000000` (чёрный текст) больше не используются

---

## Spacing Rules
Все отступы кратны base unit 8px (Swiss grid).

| Параметр | Desktop (1440) | Tablet (1024) | Mobile (390) |
|----------|----------------|---------------|--------------|
| Container padding | 120px / 60px | 40px | 24px |
| Между секциями | 80px | 60px | 48px |
| Gap внутри секций | 48px | 32px | 24px |
| Gap карточек | 16px | 16px | 12px |
| Header height | 64px | 64px | 56px |

---

## Image Rules
Все изображения секций и товаров — **квадрат или близко к квадрату** (aspect-ratio ≈ 1:1).
Изображение масштабируется вместе с контейнером, **не обрезается**.

| Параметр | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| object-fit | `contain` | `contain` | `contain` |
| Карточка товара | 280×280 | 220×220 | 160×160 |
| sec4top / Mission | 600×600 | 400×400 | 342×342 (full-width) |
| Hero | 1440×780 (banner) | 1024×600 | 390×400 |
| Product Banner | 1200×720 | 944×500 | 342×400 |
| Map | 1200×1000 | 944×600 | 342×300 |

### Жёсткие правила изображений
- `object-fit: cover` запрещён для контентных изображений
- Изображения-заглушки (placeholder) — фон `--color-bg-alt` (#E9E8EB)
- Все изображения `loading="lazy"` в HTML (кроме hero)

---

## Responsive — единый контент на всех устройствах
Мобильная и планшетная версии = точная копия десктопа по контенту.
Никаких различий в тексте, количестве секций или элементов между брейкпоинтами.

### Адаптация лейаутов
| Элемент | Desktop (1440) | Tablet (1024) | Mobile (390) |
|---------|----------------|---------------|--------------|
| Header | logo + nav inline | logo + burger | logo + burger |
| Двухколоночные блоки | row | row (50/50) | column (stacked) |
| Карточки товаров | 4 в ряд | 2 в ряд | 2 в ряд |
| Sidebar каталога | sidebar 240px | sidebar 200px | pill-фильтры сверху |
| Footer grid | 4 колонки | 2 колонки | 2 колонки |

### Высоты секций
| Элемент | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hero | 780px | 600px | 400px |
| sec4top | 600px | 450px | auto (stacked) |
| Product Banner | 720px | 500px | 400px |
| Map | 1000px | 600px | 300px |

---

## Coding Conventions
- Все файлы в кодировке UTF-8
- CSS классы в формате BEM: `block__element--modifier`
- Отступы: 2 пробела
- HTML атрибуты: двойные кавычки
- Изображения: всегда `alt`, `loading="lazy"` для каталога
- `mobile.css` подключается через `media="(max-width: 768px)"` — не через JS
- `tablet.css` подключается через `media="(min-width: 769px) and (max-width: 1024px)"` — если нужен
- Версионирование кэша: `?v=N` в `<link>` на CSS/JS файлы

### Visibility классы
```css
/* В mobile.css */
.desktop-only { display: none !important; }
.mobile-only  { display: block !important; }
.mobile-only--flex   { display: flex !important; }
.mobile-only--inline { display: inline-flex !important; }
```

---

## Workflow
1. **Сначала макет в Pencil** — утверждаем в `ic farvater.pen`, проверяем скриншотом
2. **Потом HTML/CSS** — переносим один в один
3. **Проверка:** сверяем отступы, цвета и типографику с правилами выше

### Pencil-файл
- **Файл:** `ic farvater.pen` (`/D:/Загрузки/Downloads/ic farvater.pen`, открывается через Pencil MCP в VS Code)
- **Ширина макета:** 1440px (desktop), 1024px (tablet), 390px (mobile)
- **Padding:** 60–120px desktop, 40px tablet, 24px mobile

#### Фреймы Desktop (1440px)
| ID | Страница |
|----|----------|
| `Ns26c` | IC Farvater — Main Page |
| `Q6E76` | About |
| `KMFNi` | Products Page |
| `W3oj8` | Product Detail |
| `HJty4` | Contacts |

#### Фреймы Tablet (1024px)
| ID | Страница |
|----|----------|
| `b7RXn` | Tablet — Главная |
| `gDOOk` | Tablet — О компании |
| `QoHf2` | Tablet — Каталог |
| `j8h6y` | Tablet — Карточка товара |
| `tC6O5` | Tablet — Контакты |

#### Фреймы Mobile (390px)
| ID | Страница |
|----|----------|
| `XqqmZ` | Mobile — Главная |
| `MlENF` | Mobile — Меню |
| `X3Cjv` | Mobile — О компании |
| `xEgU3` | Mobile — Каталог |
| `mPQ4E` | Mobile — Карточка товара |
| `IlduO` | Mobile — Контакты |

---

## External Tools

### Pencil MCP
Для работы с `.pen` файлами: `batch_get`, `batch_design`, `get_screenshot`.
Файл зашифрован — читать только через MCP, не через `Read`/`Grep`.

### UI/UX Pro Max (`.claude/skills/ui-ux-pro-max-skill/`)
База данных: 67 стилей, 161 палитра, 57 пар шрифтов, 99 UX-правил.
```bash
python "D:\site\site\demo project\ic farvater\.claude\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\search.py" "<запрос>" --domain <style|color|typography|landing|ux|product|chart>
```
