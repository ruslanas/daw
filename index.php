<?php

require 'vendor/autoload.php';

function getDb() {
    $user = 'root';
    $password = '';
    $conn = new PDO("mysql:host=localhost;dbname=daw", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
}

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

$app->get('/api/drumkits/:id', function($id) {
    $data = [
        'waves/snd-10.wav',
        'waves/snd-11.wav',
        'waves/snd-12.wav',
        'waves/snd-13.wav',
        'waves/snd-14.wav',
        'waves/snd-15.wav',
        'waves/snd-16.wav',
        'waves/snd-17.wav',
        'waves/snd-18.wav',
        'waves/snd-19.wav',
        'waves/snd-20.wav',
    ];
    // $data = [
    //     'waves/kick-1.wav',
    //     'waves/small-tom-1.wav',
    //     'waves/snare-1.wav',
    //     'waves/16-crash-1.wav',
    //     'waves/20-ride-9.wav',
    //     'waves/hi-closed-1.wav',
    //     'waves/kick-9.wav',
    //     'waves/kick2.wav',
    //     'waves/weird.wav',
    //     'waves/pluck.wav'
    // ];
    echo json_encode($data);
});

$app->get('/api/songs', function() use ($app) {
    $db = getDb();
    $stmt = $db->prepare("SELECT * FROM songs");
    $stmt->execute();
    $songs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($songs);
});

$app->post('/api/songs', 'addSong');

$app->get('/api/patterns/:id', function($id) {
    try {
        $db = getDb();
        $stmt = $db->prepare("SELECT * FROM patterns WHERE id = :id");
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $data = $stmt->fetch();
        echo $data["pattern"];
    } catch (PDOException $e) {
        $app->response->setStatus(404);
        echo json_encode(["error" => $e->getMessage()]);
    }
});

$app->post('/api/patterns', function() use ($app) {
    $req = $app->request();
    try {
        $db = getDb();
        $stmt = $db->prepare("INSERT INTO patterns (pattern) VALUES (:pattern)");
        $pattern = json_encode($req->post('pattern'));
        $stmt->bindParam("pattern", $pattern);
        $stmt->execute();
        $db = null;
    } catch(PDOException $e) {
        $res = $app->response()->setStatus(404);
        echo json_encode(["error" => $e->getMessage()]);
    }
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

    $fname = uniqid() . $ext;
    $path =  'uploads' . DIRECTORY_SEPARATOR .$fname;

    $date = date_create();
    $date_formatted = date_format($date, 'Y-m-d H:i:s');

    if(move_uploaded_file($tmp, $path)) {
        $message = "File uploaded to " . $fname;

        try {
            $db = getDb();
            $stmt = $db->prepare("INSERT INTO songs (title, email, file) VALUES(:title, :email, :file)");
            $stmt->bindParam("title", $_POST['name']);
            $stmt->bindParam("email", $_POST['email']);
            $url = "uploads/" . $fname;
            $stmt->bindParam("file", $url);
            $stmt->execute();
        } catch(PDOException $e) {
            die($e->getMessage());
        }

    } else {
        $message = "File upload failed";
        die(':( Something went wrong. Go back ant try again.');
    }

    error_log("\n" . $date_formatted . ' '
        . $message . "\n" . print_r($_POST, true), 3, '../daw.log');
}
