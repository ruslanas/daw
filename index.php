<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim();

$app->get('list', function() {
	echo "Hi there!";
});

$app->run();