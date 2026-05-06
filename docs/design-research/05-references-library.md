# References Library — Сайты и системы

Анализ 16 сайтов и систем, разобранных по паттернам, применимым к IC Farvater. Ресёрч 2026-05-06.

Каждая запись: ключевой паттерн → как применить к нашим секциям.

---

## E-commerce минимализм

### [In Common With](https://incommonwith.com)
Lighting brand, Brooklyn.
- **Ключевой паттерн:** нет hero — открывается прямо каталогом. Single-column модульный stack. Карточки чередуются image-left / text-right в 2-колоночном ритме.
- **Типографика:** крупные section-titles в sentence case, просторный line-height.
- **Footer:** мульти-колоночный, с 2 физическими адресами, social, build credits — высокий editorial-уровень.
- **Применить:** альтернированная 2-колоночная структура product cards — кандидат для секций «Дистрибьютор» / «Кабельные сборки». Footer credits row («Designed by / Built by») — Swiss editorial-троп, можно перенять для company info.

### [Artifacts](https://artifacts.is)
Curated collection platform.
- **Ключевой паттерн:** нумерованные секции — три «numbered sections» представляют features платформы.
- **Stats:** «539 + Curated Items / 637 + Active Members / 19 + Categories» — counter + plus-sign + label, всё uppercase.
- **Применить:** stats/counter формат — кандидат для «О компании» mini-stats («12 + лет / 200 + наименований ЭКБ / 50 + поставщиков»). Three-numbered-section pattern маппится на три product-категории на главной.

### [Mytopicals](https://mytopicals.com)
Skincare brand.
- **Ключевой паттерн:** editorial badges на product cards — «Back in stock», «New», «Best Seller», «1M units sold» — мелкие, uppercase, 14px.
- **Палитра:** пастельная, navy text.
- **Применить:** badge pattern для каталога ЭКБ — «В наличии», «Под заказ», «Аналог», «Импортозамещение». Один slot top-left на карточке.

### [Oracal](https://oracal.world)
Wellness drinks.
- **Ключевой паттерн:** 3-card 1:1 product grid + 5-column footer.
- **Bonus:** три brand pillars (Arise / Repose / Tools) представлены **только текстом** + одно-предложение — никаких иконок.
- **Применить:** текстовые «pillars» подойдут для «Услуги» intro paragraph. Front+back product photo pair — для microcircuit datasheet thumbnails.

### [Gardinex](https://gardinex.com)
Шведские шторы на заказ.
- **Ключевой паттерн:** 6-column category carousel + bestseller carousel + альтернированные splits.
- **Tile aspect:** 1:1.3 портрет (чуть выше квадрата).
- **Шрифт:** serif headings + sans body (НЕ наш стиль, но layout-последовательность B2B-каталога идентична).
- **Применить:** альтернированные text+image splits хорошо настроены — image и text вертикально центрированы, ~80–96px между секциями.

### [Aesop](https://aesop.com) (recall — fetch denied)
Косметика.
- **Ключевой паттерн:** editorial restraint, content-led. Высокая фотография, текстовые headlines, узкие центрированные content blocks альтернируются с full-bleed product photos.
- **Footer:** 4-column (Help / About / Stay In Touch / Locations).
- **Eyebrow labels:** all-caps section labels 14–16px над headings.
- **Применить:** маленький uppercase eyebrow выше каждого H2 (`(02) КАТЕГОРИЯ`) — это ровно Aesop pattern.

### [Norse Store](https://norse-store.com) (recall — fetch denied)
Fashion.
- **Editorial uppercase nav,** 4-col grid, 1:1 product photos на plaster-grey background.
- **Применить:** подтверждает бежево-серую палитру IC Farvater. Используем тот же приём.

---

## Editorial / Knowledge

### [Are.na](https://www.are.na)
Knowledge platform.
- **Ключевой паттерн:** минимальный hero + value-prop в двух коротких предложениях + прозрачная pricing-grid.
- **Header:** только Are.na / Log in / Sign up.
- **Hero copy:** «A toolkit for assembling new worlds from the scraps of the old».
- **Pricing:** две чистых tier'а ($70/yr, free guest с 200-block лимитом).
- **Editorial Philosophy:** четыре принципа в усваиваемых блоках.
- **Применить:** four-principle «Editorial Philosophy» паттерн — правильная форма для «О компании» или «Импортозамещение» — четыре коротких параграфа с одним принципом каждый, без декорации.

### [Quadrant Capital](https://quadrantcapital.io) (recall — fetch denied)
- Typographic minimalism, lots of air, editorial restraint.
- Counter справа сверху от title паттерн.
- Подтверждает Swiss-эстетику.

---

## B2B SaaS / Tech

### [Linear](https://linear.app) (recall — fetch denied)
B2B SaaS, gold-standard минимализма.
- Dark theme, Inter font, oversized hero text (90px+), feature cards на тонких 1px borders.
- Sections отделены 96–128px whitespace, без декоративных теней.
- **Применить:** подтверждает Inter+borderless подход IC Farvater. Можно увеличить hero H1 с 72 до 80–90px для большей презенсии.

### [Stripe](https://stripe.com) (recall — fetch denied)
B2B payments.
- Tight 8/16px micro-spacing в code blocks, generous 96px macro-spacing между секциями.
- Color-coded gradients ТОЛЬКО в hero (никогда в body).
- 4-column footer с сильными category titles.
- **Сигнал:** в B2B цвет резервируется для diagrams и brand moments, не для chrome.

### [Vercel](https://vercel.com) (recall — fetch denied)
- All-monochrome до hero gradient. Geist Sans (близкий cousin Inter).
- **Hero pattern:** massive headline + 1-line subhead + два CTA (primary + ghost).
- **Feature grid 3-col** с 1px borders.
- **Footer:** компактный, 4 колонки.

### [Framer](https://www.framer.com) (recall — fetch denied)
Marketing site.
- **Pattern worth borrowing:** каждая секция имеет крошечный eyebrow label (uppercase, 12–14px) + H2 + 1-line description, потом demo.
- **Применить:** маппится прямо на наш section header pattern.

---

## Architecture / Design firms

### [Pentagram](https://www.pentagram.com) (recall — fetch denied)
Design firm.
- **Ключевой паттерн:** project grid использует асимметричные tile sizes (некоторые span 2 cols).
- All uppercase H1 hero, 1px hairlines as the only chrome.
- **Применить:** product grid мог бы позволить occasional 2-col spans для «флагман» товаров (e.g., микросхема aligned next to banner).

---

## Системы и фреймворки

### [GitHub Primer Counter Label](https://primer.style/components/counter-label/)
Reference design system.
- **Ключевой паттерн:** counter label **всегда** парится с текстом. Никогда «голый» counter.
- **Sizing:** 12–14px, neutral background.
- **Применить:** в IC Farvater counters в section headers должны читаться `(01) РАЗЪЁМЫ`, никогда просто `(01)`.

### [Mueller Grid System](https://muellergridsystem.com/)
Reference grid implementation, named после Müller-Brockmann.
- Configurable column widths, gutter widths, baseline grids.
- **Применить:** sanity check что наши spacing tokens align с established systems.

### [B2B Webflow showcase](https://www.overpass.studio/blog/best-b2b-examples)
Aggregator.
- Подтверждает 2026 trends: bold typography, dynamic grid layouts, minimal but expressive.
- **Сигнал:** минимализм в B2B ≠ скучно.

### [99designs B2B inspiration](https://99designs.com/inspiration/websites/b2b)
Aggregator.
- Подтверждает паттерны: clean grids, restricted palettes, search/filter prominence для distributor сайтов.

---

## Сводная таблица — какой реф для какой нашей секции

| Наша секция | Главные референсы |
|---|---|
| Header | Linear, Stripe, Vercel — sticky 64px, opaque, hairline border on scroll |
| Hero | Aesop (eyebrow + H1 + sub + 1 CTA, bottom-anchor), Linear (massive H1), Norse Store |
| Разъёмы / СВЧ (4-card grid) | regrocery, Norse Store, In Common With (alternating 2-col) |
| Дистрибьютор ЭКБ (split) | In Common With, Artifacts, Gardinex (50/50 + top-align) |
| Кабельные сборки (split) | Те же + Aesop alternating |
| Преобразователи (banner) | Gardinex bottom-left lockup, Aesop split panel |
| Импортозамещение (2-card) | Stripe «for X / for Y», Aesop pair-cards |
| Услуги (list/accordion) | Stripe services list (counter + name + arrow), Quadrant Capital, Linear FAQ |
| Footer | Aesop 4-col, Stripe, Linear, In Common With (credits row) |

---

## Папка скриншотов

`/D:/Загрузки/рефы/`:
- screencapture-regrocery-co (главная)
- screencapture-regrocery-co-collection-all (каталог)
- screencapture-regrocery-co-product-brixy-deodorant (карточка товара)
