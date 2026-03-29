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
- **Адрес:** ул. Беринга, д. 1-А, оф. 46-Н, г. Санкт-Петербург, 199397
- **Телефон:** +7 (996) 778-88-42
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
**Строго 5 размеров** — никаких других (запрещены 11px, 16px, 32px, 50px и т.д.).

| Токен | px | Вес | Letter-spacing | Где |
|-------|----|-----|----------------|-----|
| `--text-72` | 72px | 500 | -2px | Главный заголовок страницы (один на страницу) |
| `--text-40` | 40px | 500 | -1px | Заголовки секций |
| `--text-24` | 24px | 500 | -0.5px | Список услуг, подзаголовки |
| `--text-14` | 14px | 400 | 0 | Тело, навигация, описания |
| `--text-12` | 12px | 600 | +1px | UPPERCASE метки, счётчики |

### Жёсткие правила типографики
- Только эти 5 размеров — любой другой запрещён
- Заголовки H1/H2/H3 — weight 500, UPPERCASE, отрицательный letter-spacing
- Метки/счётчики — 12px, weight 600, UPPERCASE, letter-spacing +1px
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
| `--color-text-muted` | `#8C96AB` | Вторичный текст, метки |
| `--color-border` | `#D7D3CB` | Все разделители |

### Жёсткие правила цветов
- **Нет отдельного акцентного цвета** — кнопки = `--color-text` (`#112F6E`)
- **Активный фильтр/пункт** = префикс `(•)`, неактивный = без префикса, цвет `--color-text-muted`
- Старые цвета `#0033FF`, `#FFFFFF` (белый фон), `#000000` (чёрный текст) больше не используются

---

## Spacing Rules
Контейнер: 120px горизонтально (desktop), 24px (mobile).

| Где | Значение |
|-----|----------|
| Между секциями | 80px |
| Gap внутри секций | 48px |
| Gap карточек | 16px |
| Container padding desktop | 120px |
| Container padding mobile | 24px |
| Header height desktop | 64px |
| Header height mobile | 56px |

---

## Desktop vs Mobile — Правила контента

| Аспект | Desktop | Mobile |
|--------|---------|--------|
| Регистр описаний | UPPERCASE | Sentence case |
| Цвет текста | `#112F6E` | `#112F6E` |
| Нумерация услуг | В скобках: `(02)`, `(03)` | Без скобок: `01`, `02` |
| Описания | Длинные, формальные | Короткие, живые |
| Теги услуг | Текст через ` / ` | Pill с рамкой `--color-border` |
| Hero бренд | `IC FARVATER` (латиница) | Другой заголовок |
| Сертификаты | 2 карточки (ISO 9001:2015, Аккредитация) | 3 карточки (ГОСТ РВ, ИСО 9001, Военный реестр) |

## Правила сетки по секциям

| Страница | Секция | Desktop | Mobile |
|----------|--------|---------|--------|
| Главная | Услуги | 4 строки | Скрыто |
| Главная | Stats | Скрыто | 2 блока (5+, 500+) |
| О компании | Certs | 2 карточки | 3 карточки |
| Услуги | 3-я услуга | "ПРЯМЫЕ ПОСТАВКИ ЭЛЕКТРОННЫХ КОМПОНЕНТОВ" | "ПОЛНЫЙ ЦИКЛ ПРОИЗВОДСТВА" |
| Каталог | Фильтры | Sidebar, 7 категорий | 3 pill: ВСЕ, РАЗЪЁМЫ, СВЧ |

---

## Coding Conventions
- Все файлы в кодировке UTF-8
- CSS классы в формате BEM: `block__element--modifier`
- Отступы: 2 пробела
- HTML атрибуты: двойные кавычки
- Изображения: всегда `alt`, `loading="lazy"` для каталога
- `mobile.css` подключается через `media="(max-width: 768px)"` — не через JS
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
1. **Сначала макет в Pencil** — утверждаем в `pencil-new.pen`, проверяем скриншотом
2. **Потом HTML/CSS** — переносим один в один
3. **Проверка:** сверяем отступы, цвета и типографику с правилами выше

### Pencil-файл
- **Файл:** `pencil-new.pen` (открывается через Pencil MCP в VS Code)
- **Ширина макета:** 1440px (desktop), 390px (mobile)
- **Padding:** 120px desktop, 24px mobile

#### Фреймы Desktop
| ID | Страница |
|----|----------|
| `bbLsF` | IC Farvater — Main Page |
| `f83cg` | About Page |
| `ItVWl` | Services Page |
| `FOq5p` | Products Page |
| `Iblg8` | Contacts Page |
| `TUJwy` | Product Detail Page |
| `RsFCk` | 404 Page |

#### Фреймы Mobile
| ID | Страница |
|----|----------|
| `WPq9h` | Mobile — Главная |
| `kT3Fj` | Mobile — Меню |
| `V6jv1` | Mobile — Каталог |
| `lgELV` | Mobile — Карточка |
| `xZh1f` | Mobile — О компании |
| `x9utE` | Mobile — Услуги |
| `2BfHx` | Mobile — Контакты |

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
