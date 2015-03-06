<?php
$tmp = $_FILES['data']['tmp_name'];

if(move_uploaded_file($tmp, 'uploads/8bit.wav')) {
	error_log('File uploaded', 3, 'server.log');
} else {
	error_log('Upload failed', 3, 'server.log');
}