# Design System Rules — Минималистичный веб-дизайн

База правил для IC Farvater. Источники: Müller-Brockmann «Grid Systems», Hurlburt «The Grid», Rousselle «Le Minimalisme Web», NN/g, Refactoring UI, Every Layout, Practical Typography (Butterick), Brad Frost «Atomic Design».

---

## 1. Модульная сетка (Grid)

### Правило 1.1 — Один модуль = высота строки body-текста
Müller-Brockmann: «Высота квадратного модуля грида = font-size + leading body-текста.»
- У нас body = 16px, line-height 1.6 → модуль ≈ **24–26px**
- Округляем: **базовый модуль = 24px**
- Все вертикальные размеры (padding, gap, height) должны быть кратны 24

### Правило 1.2 — Spacing-scale через base unit 8px
Refactoring UI / Tailwind / Material:
```
--space-4:   4px   (микро-нюанс, редко)
--space-8:   8px   (внутри лейбла, иконки)
--space-16: 16px   (gap карточек, между inline-элементами)
--space-24: 24px   (gap внутри секции)
--space-32: 32px   (gap между title-row и body)
--space-48: 48px   (gap между крупными блоками)
--space-64: 64px   (большие отступы)
--space-80: 80px   (section padding-y)
--space-120: 120px (margin между секциями десктоп)
```
**Не использовать значения вне scale.** Если что-то «не вписывается» — пересмотреть лейаут, не добавлять `--space-37`.

### Правило 1.3 — 12-колоночный grid контента
- Container max-width: **1320px** (внутри 1440 viewport с padding 60px)
- 12 columns × 88px col + 11 gutters × 24px = 1320 (модулярно)
- Можно 8-колоночную: 8 × 144px col + 7 × 24px gutter = 1320

Müller-Brockmann требует **выбора** числа колонок. 6 / 8 / 12 — стандарт.

### Правило 1.4 — Внешние margin ≥ 2× внутренний gutter
(Tschichold canon, Hurlburt p.73)
- Container side-padding 60px, внутренний gutter 24px → 60 / 24 = 2.5 ✓
- На мобиле: padding 24px, gutter 12px → 2.0 ✓

### Правило 1.5 — Аспекты только модульные
Картинки и плашки — **только** соотношения 1:1 / 2:3 / 3:4 / 4:5 / 16:9. Никаких произвольных (например 1320:580 → лучше заменить на 16:9 = 1280:720 или 21:9).

---

## 2. Типография

### Правило 2.1 — Один шрифт, два веса (Rousselle + Butterick)
- **Inter** для всего
- Веса: **400 (body), 500 (title), 600 (label)**
- Не добавлять 300, 700, italic — если очень нужно акцентировать, используй weight 500 → 600 переход

### Правило 2.2 — Размеры типографического масштаба (4-step)
Müller-Brockmann + Butterick: соседние уровни должны различаться **минимум в 1.25×**, лучше 1.5×.

| Роль | Desktop | Tablet | Mobile | Вес | LSP |
|------|---------|--------|--------|-----|-----|
| Hero H1 | 72px | 56px | 40px | 500 | −2 / −1.5 / −1 |
| Section H2 | 40px | 32px | 28px | 500 | −1 / −0.5 / −0.5 |
| Subtitle H3 | 24px | 20px | 18px | 500 | −0.5 / −0.5 / 0 |
| Body | 16px | 16px | 16px | 400 | 0 |
| Label/Counter | 14px | 14px | 14px | 600 | +1 |

Ratio 72/40 = 1.8, 40/24 = 1.67, 24/16 = 1.5, 16/14 = 1.14 — три из четырёх соблюдают правило 1.25×, пара 16/14 — на грани (label маленький, ОК).

### Правило 2.3 — Line-height по роли
- Display (H1, H2): **1.05–1.15** (тугой leading для drama)
- Body: **1.6–1.7** (просторный для чтения)
- Label/UI: **1.0–1.2** (компактный)

Butterick: «Line-height should be 120%–145% of font-size for body text on screen. 130% is a good default.»

### Правило 2.4 — Letter-spacing
- Display (большие): **отрицательный** (−0.5 до −2px). Чем больше шрифт — тем больше отрицательный. Inter в большом размере выглядит «разреженным» по умолчанию.
- Body: **0** (нейтрально)
- Uppercase Label/Counter: **+1px** (uppercase теряет ритм без LSP, нужно компенсировать)

Müller-Brockmann: «Заголовок и параграф разделяются 1–2 модулями (24–48px), не больше».

### Правило 2.5 — Длина строки
Hurlburt / Butterick: **45–75 символов на строку** для body. На десктопе с 16px Inter это `max-width: 60ch ≈ 520–640px`.
- Если split-секция — текст-колонка не шире 600px. Сколько остаётся — отдаём картинке.
- **Не растягивать body на полную ширину 1320px.** Это плохо читается.

### Правило 2.6 — UPPERCASE везде — оправдан только для labels и нав
- ✓ Counter `(01)`
- ✓ Section title `РАЗЪЁМЫ`
- ✓ Nav links
- ✗ Body text uppercase — **анти-паттерн** (медленнее читается на 18%, NN/g 2017). На IC Farvater body тоже uppercase — это эстетический выбор, но для длинных абзацев теряется читаемость.
  - **Компромисс:** uppercase на коротких body (1–2 строки), Title Case или sentence на длинных (3+ строк).

---

## 3. Цвет

### Правило 3.1 — 3 цвета + нейтральный (Rousselle)
- **Primary:** `#112F6E` (dark blue) — заголовки, основной текст, primary CTA
- **Background:** `#F5F3EF` (warm beige) — фон страницы
- **Bg-alt:** `#E9E8EB` (cool grey) — карточки, плашки картинок
- **Muted:** `#6B7A94` (blue-grey) — second-level text, counter, desc
- **Border:** `#D7D3CB` (warm grey) — все hairlines

Это уже 5, но `--bg-alt` и `--border` — оттенки нейтрального. Соблюдается.

### Правило 3.2 — Никакого «акцентного цвета»
Нет красного / зелёного / оранжевого. CTA = `--color-text` (тот же синий, что и заголовки). Refactoring UI: «accent должен быть редким и означать что-то — у нас CTA уже редкий». **Не добавляй жёлтый/красный/оранжевый «для внимания».**

### Правило 3.3 — Активные/неактивные через префикс или color-shift
- Активный фильтр / active-link: `(•) text` или `--color-text`
- Неактивный: без префикса, `--color-text-muted`

Это шаблон Esmée Van Arden / quadrantcapital.io.

### Правило 3.4 — Контрастность WCAG
- `#112F6E` на `#F5F3EF` → 11.5:1 ✓ (AAA)
- `#6B7A94` на `#F5F3EF` → 4.0:1 — на границе AA для small text. Использовать только для **labels 14px+ weight 500+** и **больших заголовков**, не для body 16px (где надо 4.5:1).
  - **Если muted-text появляется в body 16px** — повысить до `#586482` (4.7:1) или использовать на 18px+.

---

## 4. Spacing внутри элементов

### Правило 4.1 — Padding кнопок
Refactoring UI:
- Pill-button: `padding: 14px 28px` (по высоте 14, по горизонтали ×2)
- На внутренний padding: высота / 2 = 14px при тексте 14px line-height 1.0

### Правило 4.2 — Padding карточек
- Внутренние карточки (product-card): `padding-top: 16px` (между картинкой и подписью). Без horizontal padding (картинка full-bleed внутри).
- Контентные карточки (bottom-card): `gap: 16px` между img и title, без padding (вся плашка — это карточка).

### Правило 4.3 — Padding секций
- Section vertical padding: **80px** (десктоп), **60px** (tablet), **48px** (mobile)
- Section horizontal padding = container padding: **60–120px** (desktop), 40px (tablet), 24px (mobile)

---

## 5. Иерархия (Hierarchy)

### Правило 5.1 — Размер + вес + цвет
Refactoring UI: «Не пытайся показать иерархию **только** размером. Используй вес и цвет тоже.»
- Title: 40px **weight 500** color `--text`
- Counter: 14px **weight 600** color `--muted`
- Body: 16px weight 400 color `--text`

Counter мельче, но weight 600 не даёт ему «потеряться» рядом с title.

### Правило 5.2 — Один primary CTA на экране (Refactoring UI)
- Только одна solid-кнопка в видимой части экрана
- Остальные — outline (secondary) или text-link (tertiary)
- Если в hero есть «ПОДОБРАТЬ КОМПОНЕНТЫ» (solid white), то «КАТАЛОГ» в Разъёмы должен быть outline или text-link.

### Правило 5.3 — Закон близости (Gestalt / NN/g)
Заголовок и описание — **одна группа**: gap 16–24px между ними.
Описание и кнопка — **другая группа**: gap 32–48px между ними.
Большие gap'ы (60+) сигнализируют «новая секция».

---

## 6. Whitespace и плотность

### Правило 6.1 — Whitespace — это структура, не «остаток»
Müller-Brockmann: «Empty space должно быть таким же продуманным, как content.»
- Если справа от текста большой пустой пятак — это **спецально**. Не заполнять.
- Если две картинки имеют разную высоту — разница тоже OK, она read как «эта тяжелее».

### Правило 6.2 — Density контролируется section-by-section
- Editorial-секции (hero, banner): низкая плотность (один title + одна кнопка)
- Product-секции: средняя (4 карточки + header)
- Services-секции: высокая (4 аккордеона + длинные тексты внутри)

---

## 7. Микровзаимодействия

### Правило 7.1 — Hover только когда есть link/action
- Карточки: scale (1.02–1.06) на image OR translateY (-6px) на whole card — выбрать одно
- Buttons: invert fill (background ↔ color) — Aesop, Norse Store
- Links: underline OR opacity 0.7 — выбрать одно

### Правило 7.2 — Transition timing
- Быстрые (80–200ms): hover на ссылках (color change)
- Средние (200–400ms): hover на кнопках (background change)
- Медленные (400–800ms): hover на изображениях (scale, transform)
- Cubic-bezier `(0.16, 1, 0.3, 1)` — стандартный «easing-out-expo»

### Правило 7.3 — Никаких теней
CLAUDE.md явно: «Никаких теней — ни box-shadow, ни text-shadow». Это Swiss-правило. Глубину создаём через цвет (background-shift) и spacing, не через blur.

---

## 8. Border и разделители

### Правило 8.1 — 1px hairline border везде
- `1px solid var(--color-border)` (`#D7D3CB`) — единственная толщина бордера
- Не использовать 2px / 3px — это «утолщает» дизайн

### Правило 8.2 — Border-bottom как section separator
Между секциями — либо ничего, либо тонкая `1px` линия. Никогда `2px` и никогда margin + padding одновременно (они создают двойной разрыв).

### Правило 8.3 — Никаких border-radius (кроме pills)
- Карточки, плашки, поля ввода — `border-radius: 0`
- Кнопки — `border-radius: 100px` (full pill)
- Search-box — full pill, как кнопки
- Иконки в кружочке (если есть) — circle

---

## 9. Чек-лист перед мерджем

Когда правишь новую секцию, проверить:

- [ ] Все размеры из spacing-scale (8/16/24/32/48/64/80/120)?
- [ ] Все типо-размеры из таблицы 2.2?
- [ ] Только 3 веса шрифта (400/500/600)?
- [ ] Цвета только из палитры (5 токенов)?
- [ ] Использован Grid (макро) + Flex (микро) — не наоборот?
- [ ] Ни одного `width: NNNpx` или `height: NNNpx` (кроме изображений с aspect-ratio)?
- [ ] Заголовок и body — top-aligned, не space-between?
- [ ] Аспект изображения 1:1 / 2:3 / 3:4 / 4:5 / 16:9?
- [ ] `aspect-ratio` вместо `height: NNNpx`?
- [ ] Один primary CTA в видимой части?
- [ ] Title-row имеет border-bottom (если это section-header)?
- [ ] Counter (NN) если это product-секция?
- [ ] Hover не дёргает layout (только цвет / transform)?

Если хоть один — нет, не мерджить.
