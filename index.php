<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim();

$app->config([
	'templates.path' => 'templates'
]);

$app->get('/', function() use ($app) {
	$app->render('home.php');
});

$app->get('/api/list', function() use ($app) {
	$app->render('list.php');
});

$app->post('/api/upload', function() use ($app) {
	echo 'I am a stub!';
});

$app->run();