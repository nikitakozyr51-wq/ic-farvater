# /check-style

Проверка соответствия дизайн-системе IC Фарватер и референсам.

## Что проверять

### Цвета
- [ ] Фон: только #FFFFFF или #F5F5F5
- [ ] Текст: только #000000 / var(--color-text)
- [ ] Акцент: только #0033FF / var(--color-accent)
- [ ] Нет произвольных цветов вне переменных

### Типографика
- [ ] Шрифт: только Inter
- [ ] H1: 72px, weight 500, letter-spacing -2.9px, UPPERCASE
- [ ] H2: 40px, weight 500, letter-spacing -1.6px, UPPERCASE
- [ ] H3: 24px, weight 500, letter-spacing -0.5px, UPPERCASE
- [ ] UI-текст каталога: 11px, weight 700, letter-spacing 0.6px, UPPERCASE
- [ ] НЕТ weight 700 у заголовков
- [ ] НЕТ произвольных размеров (18px, 28px, 36px)

### Отступы (8px grid)
- [ ] Только токены: 4, 8, 12, 16, 24, 32, 48, 64, 80, 120px
- [ ] Container padding: 120px (desktop)
- [ ] Header height: 64px
- [ ] Нет произвольных значений (15px, 25px, 50px, 100px)

### Компоненты
- [ ] Кнопки: background var(--color-accent), hover #0026CC
- [ ] Hover на nav-ссылках: color var(--color-accent), opacity 1
- [ ] Активный фильтр: color var(--color-accent)

## Действие
Прочитай HTML/CSS файлы страниц и найди нарушения. Выдай список с указанием файла и строки.
