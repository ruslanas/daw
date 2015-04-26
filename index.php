<?php

require 'vendor/autoload.php';

require 'config.php';

function getDb() {
    $conn = new PDO("mysql:host=".Config::$dbhost.";dbname=".Config::$dbname, Config::$user, Config::$password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
}

$app = new \Slim\Slim([
    'debug' => Config::$debug
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

$app->get('/composer', function() use ($app) {
    $app->render('composer.php');
});

// experimental
$app->get('/api/scores/:id', function($id) {
    $score = file_get_contents("xml/March_of_the_Wooden_Soldiers.xml");
    echo $score;
});

$app->get('/api/drumkits/:id', function($id) {
    $db = getDb();
    $stmt = $db->prepare("SELECT * FROM waves WHERE kit_id = :id");
    $stmt->bindParam("id", $id);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
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
$app->get('/api/pattern/random/:length', function($len) {
    try {
        $db = getDb();

        $query = "SELECT * FROM patterns"
            ." WHERE length = :length ORDER BY RAND() LIMIT 1";

        $stmt = $db->prepare($query);
        $stmt->bindParam(":length", $len);
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

        $query = "INSERT INTO patterns (pattern, `range`, length)"
                ." VALUES (:pattern, :range, :length)";

        $stmt = $db->prepare($query);
        $pattern = json_encode($req->post('pattern'));
        $stmt->bindParam("pattern", $pattern);
        $stmt->bindParam("range", $req->post('range'));
        $stmt->bindParam("length", $req->post('length'));

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
