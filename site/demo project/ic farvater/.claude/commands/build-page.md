# /build-page

Создание или обновление страницы по шаблону IC Фарватер.

## Процесс
1. Сначала макет в Pencil — открыть pencil-new.pen, нарисовать, показать скриншот
2. Дождаться утверждения
3. Перенести в HTML/CSS строго по макету

## Структура страницы (шаблон)
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Название] — IC Фарватер</title>
  <meta name="description" content="[Описание 150-160 символов]">
  <!-- CSS -->
  <link rel="stylesheet" href="../css/reset.css">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/layout.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="../css/pages/[page].css">
</head>
<body>
  <!-- Header (копировать из products.html) -->
  <!-- Main content -->
  <!-- Footer (копировать из products.html) -->
  <!-- Scripts -->
  <script src="../js/main.js"></script>
</body>
</html>
```

## Правила
- Отступы: только токены из variables.css
- Цвета: только CSS-переменные
- Классы: БЭМ
- Изображения: loading="lazy" + alt
- Мобильная версия: обязательно

## Аргумент
`/build-page [название страницы или описание задачи]`
