# Design Research — IC Farvater

База знаний по минималистичному веб-дизайну для проекта IC Farvater. Готова к импорту в Obsidian.

**Создана:** 2026-05-06
**Статус:** активная (дополняется)

---

## Структура

### Аудиты и правки
- [01 — Аудит главной 2026-05-06](./01-page-audit-2026-05-06.md) — полный разбор index.html секция за секцией, P0/P1/P2 приоритеты
- [02 — Pencil-правки секций «Дистрибьютор» и «Кабельные»](./02-pencil-edits.md) — что было сделано в макете `Mh6hK`

### База правил
- [02 — Design System Rules](./03-design-system-rules.md) — типография, сетка, цвет, spacing, hierarchy, micro-interactions, чек-лист
- [03 — Section Patterns](./04-section-patterns.md) — конкретные рецепты для hero, header, split, product-grid, banner, services, footer, buttons, carousel

### Референсы и теория
- [05 — References Library](./05-references-library.md) — анализ 16+ сайтов (e-commerce / B2B / editorial / architecture / design systems)
- [06 — Articles & Books Notes](./06-articles-and-books.md) — выжимки из Müller-Brockmann, Hurlburt, Rousselle, NN/g, Refactoring UI, Every Layout, Spencer Mortensen, Smashing

---

## Как использовать

### Перед началом работы над секцией
1. Открыть [Section Patterns](./04-section-patterns.md), найти тип секции
2. Скопировать готовый CSS-снаряд, адаптировать под контент
3. Проверить против [Design System Rules](./03-design-system-rules.md) чек-листа в конце

### Перед мерджем
Пройти чек-лист из секции 9 [Design System Rules](./03-design-system-rules.md). Если хоть один пункт не выполнен — не мерджить.

### Когда нужен референс
Открыть [References Library](./05-references-library.md), найти ближайший по типу. Скриншоты (если есть) в папке `/screenshots/`.

### Когда нужно обоснование решения
Открыть [Articles & Books Notes](./06-articles-and-books.md), найти автора → цитату → источник.

---

## Ключевые принципы (TL;DR)

Если не успеваешь читать всё — это **5 главных правил**:

### 1. Один модуль — 24px
Все размеры (padding, gap, height, отступы) **кратны 24** (или 8). Никаких `width: 553px` / `height: 760px`.

### 2. Grid для макро, Flex для микро
Разбивка секций — `display: grid; grid-template-columns: 1fr 1fr`. Внутри — `display: flex` для стека контента.

### 3. Top-aligned, не space-between
Заголовок и body — **группа сверху** (`align-items: start; gap: 24px`). Не разделять на верх+низ.

### 4. Aspect-ratio, не height
Картинки — `aspect-ratio: 1/1` (или 4/5, 16/9). **Не** `height: 530px`.

### 5. 3 цвета, 1 шрифт, 3 веса
- Цвета: text + bg + bg-alt + muted + border (5 токенов, но 3 «семьи»)
- Шрифт: только Inter
- Веса: 400, 500, 600 — других нет

---

## Источники теории

**Книги** (в `D:/Загрузки/pdf/`):
- Müller-Brockmann «Grid Systems in Graphic Design»
- Allen Hurlburt «The Grid» (русский перевод)
- Matthis Rousselle «Le Minimalisme Web» (Livre Blanc)

**Статьи и сайты:**
- [Every Layout](https://every-layout.dev) — Heydon Pickering
- [Refactoring UI](https://refactoringui.com) — Adam Wathan, Steve Schoger
- [Practical Typography](https://practicaltypography.com) — Matthew Butterick
- [NN/g articles](https://www.nngroup.com)
- [Laws of UX](https://lawsofux.com)
- [Brad Frost — Atomic Design](https://atomicdesign.bradfrost.com)

**Референсные сайты** (детальный разбор в [References Library](./05-references-library.md)):
- minimal.gallery (e-commerce tag)
- regrocery.co
- aesop.com
- norse-store.com
- in commonwith.com
- artifacts.is
- topicals.com
- gardinex.com
- linear.app
- vercel.com
- pentagram.com
- quadrantcapital.io

---

## Как добавлять новые знания

1. Нашёл хорошую статью / разобрал сайт → запиши в [Articles & Books](./06-articles-and-books.md) или [References Library](./05-references-library.md)
2. Понял новое правило → добавь в [Design System Rules](./03-design-system-rules.md) с источником
3. Придумал новый паттерн → добавь рецепт в [Section Patterns](./04-section-patterns.md)
4. Сделал аудит — создай новый файл `01-page-audit-YYYY-MM-DD.md`, не перезаписывай старый

---

## Связь с CLAUDE.md

Файл `/CLAUDE.md` в корне проекта — это **краткие правила** (что/где/как).
Эта папка — **подробная теория и референсы** (почему, откуда, как ещё бывает).

Когда правила в CLAUDE.md устаревают или нужно расширить — обновляй сначала здесь, потом синхронизируй основные тезисы в CLAUDE.md.

---

## Migration to Obsidian

Файлы готовы к импорту:
- Чистый Markdown без специфики IDE
- Связи через относительные ссылки `./file.md` — Obsidian распознаёт
- Можно конвертировать в `[[wikilinks]]` через "Convert relative MD links to Obsidian format" в Settings → Files & Links
- Метаданные (frontmatter) можно добавить при импорте — например `---\ntags: [audit, ic-farvater]\ndate: 2026-05-06\n---`
