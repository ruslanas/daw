<?php
$tmp = $_FILES['data']['tmp_name'];

$fname = 'uploads' . DIRECTORY_SEPARATOR . uniqid() . '.wav';

$date = date_create();
$date_formated = date_format('Y-m-d H:i:s');
if(move_uploaded_file($tmp, $fname)) {
	"File uploaded to " . $fname;
} else {
	"File upload failed";
}

error_log("\n" . $data_formated . ' ' . $message, 3, 'server.log');
