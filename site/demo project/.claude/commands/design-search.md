# Поиск по базе дизайн-решений (UI/UX Pro Max)

Используй базу данных UI/UX Pro Max для поиска стилей, цветов, шрифтов и UX-паттернов.

## Как использовать:

Запусти поиск через Node.js:
```bash
node .claude/skills/ui-ux-pro-max/scripts/search.mjs "<запрос>" --domain <домен> [-n <кол-во>]
```

## Домены:
- `product` — рекомендации по типу продукта (SaaS, e-commerce, B2B)
- `style` — стили UI (минимализм, glassmorphism, brutalism) + CSS-подсказки
- `typography` — пары шрифтов с Google Fonts импортами
- `color` — цветовые палитры по типу продукта
- `landing` — структура лендингов и CTA-стратегии
- `chart` — типы графиков и библиотеки
- `ux` — лучшие практики и анти-паттерны

## Примеры:
```bash
node .claude/skills/ui-ux-pro-max/scripts/search.mjs "electronics corporate" --domain product -n 5
node .claude/skills/ui-ux-pro-max/scripts/search.mjs "blue professional" --domain color -n 5
node .claude/skills/ui-ux-pro-max/scripts/search.mjs "minimalist clean" --domain style -n 3
node .claude/skills/ui-ux-pro-max/scripts/search.mjs "sans-serif technical" --domain typography -n 5
```

## Аргумент:
Передай запрос и домен, например: `/design-search blue corporate color`
