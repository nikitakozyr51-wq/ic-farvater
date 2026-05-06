# Articles & Books — Выжимки

11 статей и 3 книги, разобранные по существенным правилам. Каждая запись: ключевая идея → как применить к IC Farvater.

---

## Книги

### Müller-Brockmann «Grid Systems in Graphic Design» (1981)

PDF: `D:/Загрузки/pdf/grid_systems_in_graphic_design.pdf` (PDF — image-only, не извлекается текст; правила взяты из Hurlburt translation и канонических знаний)

**8 правил для split-секций** (текст + изображение):

1. **Один модуль = высота строки body-текста.** Все размеры (отступы, gap, высота фото) кратны модулю. Если line-height = 24px, всё снапится к 24/48/72/96.
2. **Высота фото = целое число строк текста.** Никаких `height: 530px` от балды. Низ фото должен ложиться на baseline соседней колонки.
3. **Аспекты только модульные:** 1:1, 2:3, 3:4. Не произвольные.
4. **Текст 45–60 символов на строку.** ~520px при 16px Inter line-height 1.5. Шире — нечитаемо.
5. **Заголовок и body — одна левая линия.** Расстояние 1–2 модуля (24–48px). Не больше.
6. **Вертикаль: всё прижато к ВЕРХУ, не центру и не space-between.** Самое важное правило.
7. **Outer margins ≥ 2× inner gutter.** У нас 60px container vs 24px gap → ratio 2.5 ✓.
8. **6 / 8 / 12 columns и точка.** 50/50 = 6+6 (или 5/7 для асимметрии).

**Bonus rule #9:** Headline ≤ width соседнего изображения. Связывает две половины в одно целое.

---

### Allen Hurlburt «The Grid» (1978, русский перевод)

PDF: `D:/Загрузки/pdf/Allen_Khyorlbert_Setka_1.pdf`

Прямые цитаты подтверждают Müller-Brockmann:
- «Квадраты естественно группируются в горизонтальные и вертикальные прямоугольники с отношением сторон 1:2, 2:3, 3:4.»
- «Если headline 48 pt, его линия 4 модуля; если 6 pt — половина модуля.»
- 15 цицеро (~60mm) при 9pt — оптимум.

**Применить:** наша 16px body line-height 1.5 = 24px модуль. Headline 40px ≈ 1.67 модуля → округлить до 48px (2 модуля) для строгой системы.

---

### Matthis Rousselle «Le Minimalisme Web» (Livre Blanc)

PDF: `D:/Загрузки/pdf/Livre Blanc Matthis Rousselle.pdf`

**5 правил для веб:**

1. **3 цвета + нейтральный.** Один primary, один secondary, один tertiary. Варьировать через прозрачность. Никогда больше.
2. **2 typeface.** Один heading, один body. Match выбора с product semantics: serif для luxury/editorial, sans-serif для modern e-commerce.
3. **«Tri» (sort) на каждый feature.** Главная цель страницы в 1–2 предложениях. Удалить всё, что не ведёт к ней.
4. **Empty space — это навигация.** Не заполнять «потому что есть». Whitespace сигнализирует «modernity and luxury». Один headline, один параграф, одна кнопка.
5. **Считать каждое слово.** Krug + Norman: omit unnecessary words.

**Применить к IC Farvater:** уже выполняется по 1, 2 (даже жёстче — один Inter), 4. Пункт 3 — повод подумать «что главное на главной» (продать ЭКБ?).

---

## Статьи

### [NN/g — Characteristics of Minimalism](https://www.nngroup.com/articles/characteristics-minimalism/)

Empirical study of 112 минималистичных сайтов. **5 характеристик** (каждая в 75%+ samples):

| Характеристика | Frequency |
|---|---|
| Flat patterns and textures | 96% |
| Limited / monochromatic palette | 95% |
| Restricted features | 87% |
| Maximised negative space | 84% |
| Dramatic typography | 75% |

**Применить:** IC Farvater spec выполняет 4 из 5. Пятая — **dramatic typography** — недокручена. H1 72px на десктопе нормально; H2 40px **робкий** для Swiss-стиля. Можно идти в 56–64px.

---

### [Heydon Pickering — Every Layout: Stack](https://every-layout.dev/layouts/stack/)

CSS-паттерн «Stack» управляет вертикальным spacing через **родителя**, не через детей.

```css
.stack > * + * { margin-block-start: 1.5rem; }
```

«Owl» selector (`* + *`) выбирает все children кроме первого. Spacing должен равняться body line-height — создаёт vertical rhythm rooted в text.

**Применить:** все секционные внутренние spacing на IC Farvater можно вывести из одного `.stack` класса с overrides — устраняет ad-hoc margin-top везде.

---

### [Heydon Pickering — Every Layout: Sidebar](https://every-layout.dev/layouts/sidebar/)

Two-element layout — один fixed-width, другой flex. CSS:
```css
.sidebar { display: flex; flex-wrap: wrap; gap: 1rem; }
.sidebar > :last-child { flex-grow: 999; flex-basis: 0; min-inline-size: 50%; }
```
Container-aware, без media queries.

**Применить:** идеальный паттерн для catalog page sidebar (240px) + grid. На главной — для text+image splits.

---

### [Heydon Pickering — Every Layout: Switcher](https://every-layout.dev/layouts/switcher/)

Layout, который switches от horizontal к vertical в зависимости от ширины — **на основе container**, не viewport. Использует `flex-basis: calc((threshold - 100%) * 999)`.

**Применить:** hero CTA + secondary link могут switcher-ить на узких screens.

---

### [NN/g — Sticky Headers](https://www.nngroup.com/articles/sticky-headers/)

- Не более **10% viewport height** (≈ 60–80px на 900px screen).
- 50–60px ideal на mobile.
- Использовать `position: sticky`, не JS.
- Добавлять `html { scroll-padding-top: <header-height>; }` чтобы anchor links не прятались.
- Hide-on-scroll-down / show-on-scroll-up — приемлемо для editorial; pure-static — тоже OK.

**Применить:** наши 64px desktop / 56px mobile корректны. Добавить `scroll-padding-top: 64px` на html (если ещё нет).

---

### [Refactoring UI summary (Adam Wathan, Steve Schoger)](https://medium.com/design-bootcamp/top-20-key-points-from-refactoring-ui-by-adam-wathan-steve-schoger-d81042ac9802)

**3 lever иерархии (в порядке приоритета):**
1. **Size** — самое мощное для spatial separation.
2. **Weight** — лучшее для inline/sibling элементов на том же размере.
3. **Color** — muted gray для secondary, никогда lighter accent.

> «Leave a bit more white space than needed when you design and then adjust accordingly.»

**Применить:** section labels (counters, «(01)») должны использовать weight + color, не size, чтобы оставаться subordinate к H2.

---

### [F-Pattern vs Z-Pattern](https://medium.com/design-bootcamp/f-patterns-vs-z-patterns-228104ec2be1)

Eye-tracking research, NN/g 2006:
- **F-pattern** — dense text pages (blogs, search results, catalog). Critical info top-left + along left edge.
- **Z-pattern** — sparse pages (homepages, landing). Eye traces top-left → top-right → diagonal → bottom-right.
- **Layer-cake** — well-structured pages с clear H2s. Eye делает horizontal scan на каждом heading. **Это цель для Swiss/editorial.**

**Применить к IC Farvater main:** Z-pattern в hero (logo TL, CTA TR or BR), layer-cake from there down (H2 left + content + arrow CTA right per section).

---

### [Smashing — Informative and Usable Footers](https://www.smashingmagazine.com/2009/06/informative-and-usable-footers-in-web-design/)

> «The column layout improves scannability, with each column beginning with a strong and unmistakable title. Most importantly, show the hierarchy of the content.»

- Footer должен иметь свой design, который fits остальной site.
- Strong column titles.
- Whitespace draws eye к каждому блоку.
- Heavy padding top + bottom.
- Sitemap-style links для SEO.

**Применить:** наш 4-col footer нуждается в strong uppercase titles (уже spec'd как Label 14px / weight 600 / +1 letter-spacing — корректно).

---

### [UX Planet — 8-Point Grid System](https://uxplanet.org/everything-you-should-know-about-8-point-grid-system-in-ux-design-b69cb945b18d)

- Все UI dimensions в multiples of 8: `4, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 120, 160`.
- 4px разрешён только для icon-text gaps.
- Material Design — 4dp baseline + 8dp components.
- Token names: `xs=8, s=16, m=24, l=32, xl=48, 2xl=64, 3xl=80, 4xl=120`.

**Применить:** наша spacing scale уже aligns. Аудит любых custom margins что не 8-multiple.

---

### [Designlab — Grid System History](https://designlab.com/blog/grid-systems-history-ux-ui-layout)

- **Web standard:** 12 columns (most flexible — делится на halves, thirds, quarters, sixths).
- Альтернативы: 9 (rare), 16 (denser editorial).
- **Gutter:** 24–32px desktop, 16–24px tablet, 16px mobile.
- **Container max-width:** 1200–1440px.
- Müller-Brockmann rule: всё spacing должно derive из baseline grid.

**Применить:** body line-height 1.5 × 16px = 24px — driver всех section gaps (24, 48, 72, 96, 120 — единственные legal значения).

---

### [Spencer Mortensen — The Typographic Scale](https://spencermortensen.com/articles/typographic-scale/)

**6 common ratios:**

| Ratio | Name | Hierarchy feel |
|---|---|---|
| 1.125 | Major Second | Tight, B2B/SaaS |
| 1.2 | Minor Third | Editorial body |
| 1.25 | Major Third | Default — Material, Tailwind |
| 1.333 | Perfect Fourth | Confident editorial |
| 1.5 | Perfect Fifth | Magazine, dramatic |
| 1.618 | Golden | Most musical |

**IC Farvater текущая scale (16 → 24 → 40 → 72)** имеет ratios 1.5×, 1.66×, 1.8× — **inconsistent and growing**.

**Применить:** затянуть к одному ratio:
- 1.5 → 16/24/40/64
- 1.25 → 16/20/28/40/56/72

---

### [Smashing — Sticky Headers + Full-Height Combination](https://www.smashingmagazine.com/2024/09/sticky-headers-full-height-elements-tricky-combination/)

При `100vh` hero — sticky header вызывает overlap. Решение: `calc(100vh - 64px)` для hero.

**Применить:** наш hero fixed 780px — не concern. Но знать на будущее.

---

### [Justinmind — White Space Design](https://www.justinmind.com/blog/white-space-design/)

- **Macro whitespace** = между секциями. Defines hierarchy.
- **Micro whitespace** = внутри linеs и между letters. Defines comprehension.
- Оба required, оба intentional.

**Применить:** macro у нас good (80–120px). Micro нуждается в audit:
- letter-spacing на body — 0 ✓
- letter-spacing на Label — +1 ✓
- line-height для body — должен быть explicit (1.5–1.6 для 16px).

---

### [GitHub Primer — Counter Label](https://primer.style/components/counter-label/)

- Counter всегда paired с adjacent contextual text — `(01) Разъёмы`, никогда `(01)` alone.
- В **3–5 item series** — beyond it становятся noise.
- 12–14px, weight 400–500, color muted.
- Common formats: `01`, `01.`, `(01)`, `— 01`, `№01`. Pick one project-wide.

**Применить:** мы уже используем `(NN)`. Соблюдать. На IC Farvater использовать на: product category headers, services list, footer column titles. Skip on hero и CTA.

---

### [Swiss Confederation Web Style Guide](https://swiss.github.io/styleguide/en/typography.html)

Государственный стайл-гайд Швейцарии для веб (типографический минимализм).

- Только H1–H4 visually distinct; H5/H6 — pro forma.
- **Никогда не стилизовать более 4 heading levels.**
- Body line-height 1.5–1.6.
- Inter / Roboto / Helvetica family — predefined.

**Применить:** на IC Farvater уже только до H3 — соответствует. H4 не нужен.

---

## Application Map

| Источник | Главное правило | Применение к IC Farvater |
|---|---|---|
| Müller-Brockmann | Все размеры кратны body line-height | 24px модуль везде |
| Müller-Brockmann | top-aligned в split-секциях | Уже исправлено в Pencil |
| Hurlburt | Аспекты 1:1, 2:3, 3:4 | Заменить произвольные на эти |
| Rousselle | 3 цвета + нейтральный | ✓ Уже соблюдается |
| NN/g Minimalism | Dramatic typography (75%) | H2 → 56–64px |
| Pickering Stack | margin через родителя | Refactor section internals |
| Pickering Sidebar | flex-grow:999 на content | Catalog page sidebar |
| NN/g Sticky | scroll-padding-top: 64px | Добавить если нет |
| Refactoring UI | Size > weight > color | Counter — weight, не size |
| F/Z/Layer-cake | Layer-cake для editorial | Чёткие H2 на каждой секции |
| 8-point grid | Все dim multiples of 8 | ✓ Уже соблюдается |
| Spencer Mortensen | Single ratio | Затянуть scale к 1.5× |
| Primer Counter | Counter + text always | ✓ Уже выполняется |

---

## TODO для будущих ресёрчей

- [ ] Прочитать целиком Brad Frost «Atomic Design» — atoms / molecules / organisms / templates / pages
- [ ] Butterick «Practical Typography» — раздел про font pairings
- [ ] Tufte «The Visual Display of Quantitative Information» — для возможного раздела с инфографикой
- [ ] Krug «Don't Make Me Think» — usability для catalog navigation
- [ ] Norman «The Design of Everyday Things» — affordances для interactive items (search, accordion)
