<?php

require 'vendor/autoload.php';

$app = new \Slim\Slim([
    'debug' => true
    ]);

$app->hook('slim.before', function() use ($app) {

    // abracadabra
    $baseUrl = 'http://'.$_SERVER['SERVER_NAME']
        .'/'.substr(str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', realpath(__DIR__)), 1);

    $app->view()->appendData([
        'baseUrl' => $baseUrl
    ]);
});

$app->config([
	'templates.path' => 'templates'
]);

$app->get('/', function() use ($app) {
	$app->render('home.php');
});

$app->get('/api/songs', function() use ($app) {
	$app->render('list.php');
});

$app->post('/api/songs', 'addSong');

$app->get('/api/pattern/:id', function($id) {
    echo file_get_contents('pattern.json');
});

$app->post('/api/pattern', function() use ($app) {
    $req = $app->request();
    file_put_contents('pattern.json', json_encode($req->post('pattern')));
    echo json_encode($req->post());
});

$app->run();

function addSong() {
    $tmp = $_FILES['data']['tmp_name'];

    switch($_FILES['data']['type']) {
        case 'audio/mp3':
            $ext = '.mp3';
            break;
        case 'audio/wav':
            $ext = '.wav';
            break;
        default:
            // ignore silently
            return;
    }

    $fname = 'uploads' . DIRECTORY_SEPARATOR . uniqid() . $ext;

    $date = date_create();
    $date_formatted = date_format($date, 'Y-m-d H:i:s');

    if(move_uploaded_file($tmp, $fname)) {
        $message = "File uploaded to " . $fname;
    } else {
        $message = "File upload failed";
        die(':( Something went wrong. Go back ant try again.');
    }

    error_log("\n" . $date_formatted . ' '
        . $message . "\n" . print_r($_POST, true), 3, '../daw.log');
}
