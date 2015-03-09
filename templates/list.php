<?php
/**
 * Return JSON encoded array of uploaded MP3 files
 * @author Ruslanas Balciunas <ruslanas.com@gmail.com>
 */

$list = scandir('./uploads', SCANDIR_SORT_DESCENDING);

$mp3 = array_filter($list, function($val) {
	if(preg_match('/\.mp3$/', $val)) {
		return true;
	} else {
		return false;
	}
});

$out = [];

foreach($mp3 as $k => $v) {
	$out[] = 'uploads/'.$v;
}

echo json_encode($out);
