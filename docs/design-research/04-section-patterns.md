# Section Patterns — Рецепты лейаутов

Конкретные паттерны для каждого типа секции. Каждый паттерн = HTML/CSS-снаряд, готовый к копированию.

Источники паттернов: minimal.gallery (regrocery, Topicals, In Common With, Artifacts, Gardinex, Norse Store, Aesop), Linear, Vercel, Stripe, Pentagram, Quadrant Capital. Книги: Müller-Brockmann, Hurlburt, Refactoring UI, Every Layout.

---

## 1. Hero — Full-bleed photo + bottom-anchored content

**Когда использовать:** главная страница, лендинг продукта.

**Источники:** Aesop, Norse Store, In Common With, Topicals.

### Структура
```html
<section class="hero">
  <img src="..." class="hero__bg" alt="">
  <div class="container">
    <div class="hero__content">
      <h1 class="hero__title">…</h1>
      <p class="hero__sub">…</p>
      <a href="…" class="hero__btn">CTA</a>
    </div>
  </div>
</section>
```

### CSS
```css
.hero {
  position: relative;
  height: 720px;        /* модуль: 30 × 24 */
  display: flex;
  align-items: flex-end;
  padding-bottom: 96px; /* 4 × 24 */
  overflow: hidden;
}
.hero__bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: left center;
  z-index: 0;
}
.hero .container { position: relative; z-index: 1; }
.hero__content {
  display: flex;
  flex-direction: column;
  gap: 24px;            /* H1 → sub: один модуль */
}
.hero__btn {
  margin-top: 16px;     /* sub → CTA: дополнительный gap */
  align-self: flex-start;
}
```

### Принципы
- **Контент в нижней трети** — Aesop / Norse подход. «Tension between sky and ground.»
- **Максимум 3 элемента**: title + sub + 1 CTA. Не больше.
- **CTA `align-self: flex-start`** — кнопка не растягивается на всю ширину.
- **Никаких absolute top:NNNpx** на детях — flex column решает.

### Анти-паттерн
```css
/* ПЛОХО */
.hero__title { position: absolute; top: 280px; left: 60px; }
.hero__sub   { position: absolute; top: 532px; left: 60px; }
.hero__btn   { position: absolute; top: 634px; left: 60px; }
```
При смене длины title — всё разъезжается. Хрупко.

---

## 2. Section Header (универсальный шаблон)

**Когда использовать:** перед каждой контентной секцией.

**Источники:** Pentagram, Quadrant Capital, regrocery, Esmée Van Arden.

### Структура
```html
<header class="section-header">
  <div class="section-header__top">
    <h2 class="section-header__title">РАЗЪЁМЫ</h2>
    <span class="section-header__counter">(01)</span>
  </div>
  <p class="section-header__desc">…</p>
</header>
```

### CSS
```css
.section-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 48px;
}
.section-header__top {
  display: flex;
  align-items: flex-start;  /* counter висит на одной baseline с title */
  gap: 8px;
  /* OR: justify-content: space-between для counter справа */
}
.section-header__title {
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -1px;
  text-transform: uppercase;
}
.section-header__counter {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin-top: 0.25em;       /* лёгкий optical adjust */
}
.section-header__desc {
  font-size: 16px;
  line-height: 1.6;
  max-width: 60ch;          /* НЕ растягивать на всю ширину */
  color: var(--color-text-muted);
  text-transform: uppercase;
}
```

### Варианты counter-расположения

**A. Inline после title** (Pentagram, наш `.section-header-v2__top`):
```css
.section-header__top { gap: 8px; align-items: flex-start; }
```

**B. Counter в правом верхнем углу** (Quadrant Capital):
```css
.section-header__top { justify-content: space-between; }
```

**C. Counter на отдельной строке сверху** (Are.na, regrocery):
```html
<span class="section-header__counter">(01)</span>
<h2 class="section-header__title">…</h2>
```
с `flex-direction: column; gap: 8px` на `.section-header__top`.

---

## 3. Text + Image Split (50/50 или асимметричный)

**Когда использовать:** «о компании», «наш сервис», «расскажем о…»

**Источники:** In Common With (50/50), Artifacts (50/50), Gardinex (60/40 image-heavy), Topicals (40/60 text-heavy).

### Структура
```html
<section class="split">
  <div class="split__text">
    <header class="split__header">
      <h2>ЗАГОЛОВОК</h2>
      <span class="counter">(02)</span>
    </header>
    <p class="split__body">…</p>
    <a class="split__cta">CTA</a> <!-- опционально -->
  </div>
  <div class="split__image">
    <img src="…" alt="">
  </div>
</section>
```

### CSS
```css
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* или 5fr 7fr для асимметрии */
  gap: 48px;
  align-items: start;               /* КРИТИЧНО — не stretch, не center */
  padding: 80px 60px;
}
.split__text {
  display: flex;
  flex-direction: column;
  gap: 24px;                        /* heading ↔ body: плотно */
}
.split__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}
.split__image {
  aspect-ratio: 1 / 1;              /* НЕ height: NNNpx */
  width: 100%;
  background: var(--color-bg-alt);
}
.split__image img {
  width: 100%; height: 100%;
  object-fit: cover;                /* для крупных декоративных фото */
  /* OR: object-fit: contain — для каталожных */
}
```

### Принципы
1. **`align-items: start`** — заголовок текстовой колонки на одной baseline с верхом картинки.
2. **`grid` для макро-сплита**, не `flex`.
3. **`gap: 24px`** между title-блоком и body — единая группа.
4. **Текст короче картинки — это ОК.** Не растягивать body чтобы «дотянуться до низа». Whitespace внизу — структура.
5. **`aspect-ratio`** вместо `height: NNNpx`.

### Анти-паттерн (наш текущий код до правок)
```css
.split__text {
  height: fill_container;
  justify-content: space-between; /* ← это и есть бага */
}
```
Title прижат к верху, body к низу, между ними дыра.

---

## 4. Product Card Grid (4 в ряд)

**Когда использовать:** каталог товаров на главной.

**Источники:** regrocery, Esmée Van Arden, Norse Store, Topicals.

### Структура
```html
<div class="product-grid">
  <a class="product-card" href="…">
    <div class="product-card__img">
      <img src="…" alt="…" loading="lazy">
    </div>
    <span class="product-card__name">ET-2RMG</span>
  </a>
  <!-- × 4 -->
</div>
```

### CSS
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.product-card { text-decoration: none; color: inherit; }
.product-card__img {
  aspect-ratio: 1 / 1;
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.product-card__img img {
  width: 100%; height: 100%;
  object-fit: contain;        /* каталог — не обрезать */
  object-position: center;
  transition: transform 0.4s ease;
}
.product-card:hover .product-card__img img {
  transform: scale(1.06);
}
.product-card__name {
  display: block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}
```

### Принципы
- **Квадратный аспект** (1:1) — Müller-Brockmann модульность.
- **`object-fit: contain`** — товар целиком, не обрезается. У regrocery именно так.
- **Серая плашка `--color-bg-alt`** — товар «лежит на полке».
- **Подпись 14px weight 600 uppercase** — лейбл, не заголовок.
- **Только название, без цены/desc** — на главной, для overview. Для catalog page можно добавить.

### Hover
- Только scale на изображении (1.06)
- НЕ translateY на карточке (это для крупных bottom-cards)
- НЕ изменение opacity/color на name (только если карточка intent disabled)

---

## 5. Full-width Banner with Overlay

**Когда использовать:** highlight группы товаров (Преобразователи), ключевая категория.

**Источники:** Norse Store, Aesop, Topicals «featured collection».

### Структура
```html
<section class="banner">
  <div class="container">
    <div class="banner__wrap">
      <img src="…" alt="" class="banner__img">
      <div class="banner__content">
        <span class="banner__label">ВЫСОКОНАДЁЖНЫЕ РЕШЕНИЯ</span>
        <h2 class="banner__title">ПРЕОБРАЗОВАТЕЛИ НАПРЯЖЕНИЯ</h2>
        <div class="banner__btns">
          <a class="btn-pill btn-pill--solid">ПОДРОБНЕЕ</a>
          <a class="btn-pill btn-pill--outline">КАТАЛОГ</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

### CSS
```css
.banner__wrap {
  position: relative;
  overflow: hidden;
}
.banner__img {
  width: 100%;
  aspect-ratio: 16 / 9;        /* или 21/9 для cinematic */
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.banner__wrap:hover .banner__img {
  transform: scale(1.02);
}
.banner__content {
  position: absolute;
  bottom: 60px; left: 60px;     /* или top для top-anchor */
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1;
}
.banner__label {
  font-size: 14px; font-weight: 600;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
}
.banner__title {
  font-size: 40px; font-weight: 500;
  letter-spacing: -1px;
  color: #F5F3EF;
  text-transform: uppercase;
}
.banner__btns {
  display: flex; gap: 12px;
  margin-top: 8px;              /* доп gap перед кнопками */
}
```

### Принципы
- **Label сверху title** — kicker-паттерн. Метка «о чём это», title — что именно.
- **Bottom-anchor 60px** — стандарт editorial. Top-anchor возможен, но реже.
- **2 кнопки разной priority**: solid (primary action) + outline (secondary).
- **Aspect 16:9 или 21:9** (1.78–2.33) — никаких произвольных 1320:580.

---

## 6. Two-Card Side-by-Side

**Когда использовать:** «два направления / два сервиса» рядом (Импортозамещение).

**Источники:** Stripe «for X / for Y», Linear pricing, Aesop pair-cards.

### Структура
```html
<section class="pair">
  <header class="section-header"><!-- as above --></header>
  <div class="pair__grid">
    <a class="pair-card">
      <div class="pair-card__img"><img src="…"></div>
      <h3 class="pair-card__title">ПОДБОР АНАЛОГОВ</h3>
      <p class="pair-card__desc">…</p>
    </a>
    <!-- × 2 -->
  </div>
</section>
```

### CSS
```css
.pair__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.pair-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-decoration: none; color: inherit;
}
.pair-card__img {
  aspect-ratio: 4 / 5;          /* портрет — кинематографично */
  background: var(--color-bg-alt);
  overflow: hidden;
}
.pair-card__img img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.pair-card__title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.pair-card__desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-muted);
}
```

### Принципы
- **Aspect 4:5** (или 3:4) — портрет, не квадрат. Карточки выглядят весомее.
- **Title 16px > desc 14px** — иерархия через размер + вес.
- **Hover минимальный** — opacity на title или подчёркивание. Не translateY.

---

## 7. Services List (with accordion)

**Когда использовать:** список услуг / FAQ / details.

**Источники:** Quadrant Capital (services list), Linear FAQ, Stripe documentation index.

### Структура
```html
<section class="services">
  <div class="services__left">
    <header class="section-header">
      <div class="section-header__top">
        <h2>УСЛУГИ</h2>
        <span class="counter">(05)</span>
      </div>
      <p class="section-header__desc">…</p>
    </header>
    <a class="btn-pill btn-pill--solid">СВЯЗАТЬСЯ</a>
  </div>
  <div class="services__right">
    <details class="service-item" open>
      <summary>ПРЯМЫЕ ПОСТАВКИ</summary>
      <div class="service-item__body">…</div>
    </details>
    <!-- × N -->
  </div>
</section>
```

### CSS
```css
.services {
  display: grid;
  grid-template-columns: 1fr 2fr;   /* асимметрия 33/67 */
  gap: 80px;
  padding: 80px 60px;
}
.services__left {
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-self: start;                /* НЕ stretch */
}
.service-item {
  border-bottom: 1px solid var(--color-border);
  padding: 24px 0;
}
.service-item summary {
  font-size: 16px; font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  list-style: none;                 /* убрать стрелку браузера */
  display: flex;
  justify-content: space-between;
}
.service-item__body {
  padding-top: 16px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-muted);
}
```

### Принципы
- **Асимметрия 1:2** — Quadrant Capital и Linear ровно так делают (узкий «входной» столбец + широкий «контентный»).
- **`<details><summary>`** — нативная семантика, бесплатные accessibility и keyboard-handling. Не делать на JS button-aria.
- **Border-bottom между item** — список читается как список, не как стопка.
- **Раскрытие по клику** — но первый item можно держать `open` по умолчанию (пользователь видит, что это раскрывается).

---

## 8. Footer (Inverted, multi-column)

**Когда использовать:** footer любой страницы.

**Источники:** Stripe, Linear, Vercel, regrocery.

### Структура
```html
<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__top">
      <div class="footer__contacts">…</div>
      <nav class="footer__col"><!-- nav links 1 --></nav>
      <nav class="footer__col"><!-- nav links 2 --></nav>
      <nav class="footer__col"><!-- nav links 3 --></nav>
    </div>
    <div class="footer__brand">IC FARVATER</div>
    <div class="footer__bottom">
      <span>© 2026</span>
      <span>Legal links</span>
    </div>
  </div>
</footer>
```

### CSS
```css
.footer {
  background: var(--color-text);   /* dark blue */
  color: var(--color-bg);
  padding: 80px 60px 40px;
}
.footer__top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;  /* contacts шире */
  gap: 48px;
  padding-bottom: 64px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}
.footer__brand {
  font-size: clamp(80px, 18vw, 240px);  /* responsive display */
  font-weight: 500;
  letter-spacing: -4px;
  margin: 64px 0;
}
.footer__bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.7;
}
```

### Принципы
- **4 колонки** на десктопе, 2 на tablet, 1 на mobile.
- **Большой brand-text** — closure / signature. Stripe, Linear ставят brand 100–240px.
- **Inverted color** — footer ≠ header в палитре. Контраст «cap» (закрытие) страницы.
- **Hairline opacity 0.15** на тёмном фоне — субтильно. На светлом было бы `--color-border`.

---

## 9. Buttons (Pill)

### Variants
```css
.btn-pill {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 100px;
  text-decoration: none;
  transition: background 0.25s, color 0.25s, border-color 0.25s;
  cursor: pointer;
}

/* Primary: solid */
.btn-pill--solid {
  background: var(--color-text);
  color: var(--color-bg);
  border: 1px solid var(--color-text);
}
.btn-pill--solid:hover {
  background: transparent;
  color: var(--color-text);
}

/* Secondary: outline */
.btn-pill--outline {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-text);
}
.btn-pill--outline:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

/* On dark background — invert */
.btn-pill--white-solid { background: var(--color-bg); color: var(--color-text); border-color: var(--color-bg); }
.btn-pill--white-outline { background: transparent; color: var(--color-bg); border-color: var(--color-bg); }
```

### Принципы
- **Hover: invert** (background ↔ color) — Aesop / Norse паттерн.
- **Никаких скруглений кроме 100px (full pill).** Не 8px, не 4px.
- **Letter-spacing +1px** на uppercase — обязательно.
- **One primary per screen** — Refactoring UI.

---

## 10. Carousel (Product Carousel)

**Когда использовать:** product-row с >4 карточками на мобиле, на десктопе тоже если 7+.

**Источники:** regrocery (`/All` page показывает все, без карусели), Norse Store, Topicals.

### Принципы
- **На десктопе с ≤4 товарами — НЕ карусель.** Просто grid 4 колонки.
- **На мобиле — горизонтальный scroll** через `overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px;`. Без JS.
- **Стрелки prev/next** — только если ≥5 карточек на десктопе. Иначе они декоративные (некуда пейджить).
- **Стрелки 40×40 SVG** — стандарт. Position:
  - снизу под grid (наш случай) — OK
  - по бокам overlay (Aesop) — выглядит «премиальнее», но требует z-index юстировки
- **Выбрать одно** и держаться. Не миксить.

---

## Что не покрыто этим файлом

- Mobile breakpoints — отдельный документ
- Animations / micro-interactions — частично в design-system-rules.md секция 7
- Forms — будет позже когда понадобится
- Modal / Dialog — будет позже
