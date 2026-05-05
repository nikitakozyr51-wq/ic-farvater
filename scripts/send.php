<?php
/**
 * IC Farvater — обработчик формы контактов
 * Разместить на Beget в папке /scripts/send.php
 */

define('TO_EMAIL',       'info@ic-farvater.ru');
define('FROM_EMAIL',     'noreply@ic-farvater.ru');
define('ALLOWED_ORIGIN', 'https://ic-farvater.ru');
define('FILE_MAX_COUNT',  5);
define('FILE_MAX_TOTAL',  10 * 1024 * 1024);

$ALLOWED_EXT = ['pdf','doc','docx','xls','xlsx','csv','txt','png','jpg','jpeg','zip','rar','7z'];

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

// Защита от CSRF: пропускаем только запросы со своего домена
$referer   = $_SERVER['HTTP_REFERER'] ?? '';
$okOrigin  = ($origin === ALLOWED_ORIGIN);
$okReferer = (strpos($referer, ALLOWED_ORIGIN . '/') === 0);
if (!$okOrigin && !$okReferer) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden']);
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

// Сбор и валидация вложений
$attachments = [];
if (!empty($_FILES['attachments']) && is_array($_FILES['attachments']['name'])) {
    $files = $_FILES['attachments'];
    $count = count($files['name']);

    // Отсеиваем "пустые" слоты (когда форма отправлена без файлов)
    $real = [];
    for ($i = 0; $i < $count; $i++) {
        if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
        $real[] = $i;
    }

    if (count($real) > FILE_MAX_COUNT) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Максимум ' . FILE_MAX_COUNT . ' файлов']);
        exit;
    }

    $totalSize = 0;
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : false;

    foreach ($real as $i) {
        if ($files['error'][$i] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Ошибка загрузки файла: ' . $files['name'][$i]]);
            if ($finfo) finfo_close($finfo);
            exit;
        }
        $tmp  = $files['tmp_name'][$i];
        $name_f = $files['name'][$i];
        if (!is_uploaded_file($tmp)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Некорректный файл']);
            if ($finfo) finfo_close($finfo);
            exit;
        }

        $ext = strtolower(pathinfo($name_f, PATHINFO_EXTENSION));
        if (!in_array($ext, $ALLOWED_EXT, true)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => "Тип «.$ext» не поддерживается"]);
            if ($finfo) finfo_close($finfo);
            exit;
        }

        $totalSize += $files['size'][$i];
        if ($totalSize > FILE_MAX_TOTAL) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Превышен общий размер 10 MB']);
            if ($finfo) finfo_close($finfo);
            exit;
        }

        $mime = $finfo ? finfo_file($finfo, $tmp) : 'application/octet-stream';

        $attachments[] = [
            'name' => $name_f,
            'mime' => $mime ?: 'application/octet-stream',
            'data' => file_get_contents($tmp),
        ];
    }

    if ($finfo) finfo_close($finfo);
}

// Санитизация
$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$email_s = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone,   ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Текст письма
$attachLine = $attachments
    ? 'Вложений:  ' . count($attachments)
    : 'Вложений:  нет';

$subject = 'Новая заявка с сайта IC Farvater';
$body    = implode("\n", [
    "Новая заявка с сайта ic-farvater.ru",
    str_repeat('-', 40),
    "Имя:      $name",
    "Email:    $email_s",
    "Телефон:  " . ($phone ?: 'не указан'),
    $attachLine,
    "",
    "Сообщение:",
    $message,
    "",
    str_repeat('-', 40),
    "Дата: " . date('d.m.Y H:i') . " (МСК)",
]);

$subjectEnc = '=?UTF-8?B?' . base64_encode($subject) . '?=';

if (empty($attachments)) {
    // Простое plain-text письмо
    $headers = implode("\r\n", [
        "From: IC Farvater <" . FROM_EMAIL . ">",
        "Reply-To: $email",
        "Content-Type: text/plain; charset=UTF-8",
        "MIME-Version: 1.0",
        "X-Mailer: PHP/" . phpversion(),
    ]);
    $sent = mail(TO_EMAIL, $subjectEnc, $body, $headers);
} else {
    // MIME multipart с вложениями
    $boundary = '=_b_' . md5(uniqid('', true));
    $eol = "\r\n";

    $headers = implode($eol, [
        "From: IC Farvater <" . FROM_EMAIL . ">",
        "Reply-To: $email",
        "MIME-Version: 1.0",
        "Content-Type: multipart/mixed; boundary=\"$boundary\"",
        "X-Mailer: PHP/" . phpversion(),
    ]);

    $msg  = "--$boundary$eol";
    $msg .= "Content-Type: text/plain; charset=UTF-8$eol";
    $msg .= "Content-Transfer-Encoding: 8bit$eol$eol";
    $msg .= $body . $eol;

    foreach ($attachments as $att) {
        $fnameEnc = '=?UTF-8?B?' . base64_encode($att['name']) . '?=';
        $msg .= "--$boundary$eol";
        $msg .= "Content-Type: " . $att['mime'] . "; name=\"$fnameEnc\"$eol";
        $msg .= "Content-Disposition: attachment; filename=\"$fnameEnc\"$eol";
        $msg .= "Content-Transfer-Encoding: base64$eol$eol";
        $msg .= chunk_split(base64_encode($att['data'])) . $eol;
    }

    $msg .= "--$boundary--$eol";

    $sent = mail(TO_EMAIL, $subjectEnc, $msg, $headers);
}

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Ошибка отправки. Напишите нам напрямую: ' . TO_EMAIL]);
}
