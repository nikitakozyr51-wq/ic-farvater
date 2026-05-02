<?php
/**
 * IC Farvater — обработчик формы контактов
 * Разместить на Beget в папке /scripts/send.php
 *
 * Настройка:
 *   1. Замени TO_EMAIL на свой адрес
 *   2. Убедись что домен ic-farvater.ru прописан в ALLOWED_ORIGIN
 *   3. Загрузи файл на хостинг
 */

define('TO_EMAIL',       'info@ic-farvater.ru');
define('FROM_EMAIL',     'noreply@ic-farvater.ru');
define('ALLOWED_ORIGIN', 'https://ic-farvater.ru');

header('Content-Type: application/json; charset=utf-8');

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ALLOWED_ORIGIN) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Сбор данных
$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$phone   = trim($_POST['phone']   ?? '');
$message = trim($_POST['message'] ?? '');
$consent = $_POST['consent']      ?? '';

// Валидация
if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Заполните все обязательные поля']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Некорректный адрес электронной почты']);
    exit;
}
if (!$consent) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Необходимо согласие на обработку данных']);
    exit;
}

// Санитизация
$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone,   ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Текст письма
$subject = 'Новая заявка с сайта IC Farvater';
$body    = implode("\n", [
    "Новая заявка с сайта ic-farvater.ru",
    str_repeat('-', 40),
    "Имя:      $name",
    "Email:    $email",
    "Телефон:  " . ($phone ?: 'не указан'),
    "",
    "Сообщение:",
    $message,
    "",
    str_repeat('-', 40),
    "Дата: " . date('d.m.Y H:i') . " (МСК)",
]);

$headers = implode("\r\n", [
    "From: IC Farvater <" . FROM_EMAIL . ">",
    "Reply-To: $email",
    "Content-Type: text/plain; charset=UTF-8",
    "X-Mailer: PHP/" . phpversion(),
]);

$sent = mail(
    TO_EMAIL,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    $headers
);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ошибка отправки. Напишите нам напрямую: ' . TO_EMAIL]);
}
