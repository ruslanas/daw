<?php
$tmp = $_FILES['data']['tmp_name'];

$ext = ($_FILES['data']['type'] === 'audio/mp3') ? '.mp3' : '.wav';

$fname = 'uploads' . DIRECTORY_SEPARATOR . uniqid() . $ext;

$date = date_create();
$date_formatted = date_format($date, 'Y-m-d H:i:s');

if(move_uploaded_file($tmp, $fname)) {
	$message = "File uploaded to " . $fname;
} else {
	$message = "File upload failed";
}

error_log("\n" . $date_formatted . ' ' . $message, 3, 'server.log');
