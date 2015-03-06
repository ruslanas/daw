<?php
$tmp = $_FILES['data']['tmp_name'];

$fname = 'uploads' . DIRECTORY_SEPARATOR . uniqid() . '.wav';

$date = date_create();
$date_formatted = date_format($date, 'Y-m-d H:i:s');

if(move_uploaded_file($tmp, $fname)) {
	$message = "File uploaded to " . $fname;
} else {
	$message = "File upload failed";
}

error_log("\n" . $date_formatted . ' ' . $message, 3, 'server.log');
