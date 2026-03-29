# /check-code

Проверка качества HTML/CSS/JS кода.

## HTML
- [ ] Валидная семантика: header, main, section, article, footer
- [ ] Один h1 на странице
- [ ] alt у всех img
- [ ] label у всех input
- [ ] Нет inline-стилей (style="...")
- [ ] Нет deprecated атрибутов

## CSS
- [ ] Используются CSS-переменные, нет хардкода цветов и размеров
- [ ] БЭМ-нейминг классов (block__element--modifier)
- [ ] Нет !important (кроме вынужденных случаев)
- [ ] Media queries есть на всех компонентах
- [ ] Нет дублирующихся правил

## JavaScript
- [ ] Нет console.log в продакшн коде
- [ ] Обработка ошибок (try/catch или проверки на null)
- [ ] addEventListener с removeEventListener где нужно
- [ ] Нет глобальных переменных (всё в IIFE или модулях)
- [ ] DOMContentLoaded перед работой с DOM

## Действие
Прочитай все файлы проекта, найди нарушения, выдай список с файлом и строкой.
