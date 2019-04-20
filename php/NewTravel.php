<?php
// https://gist.github.com/ve3/0f77228b174cf92a638d81fddb17189d
require 'Encryption.php';
require 'HelpUtil.php';
$Encryption = new Encryption();
header('Access-Control-Allow-Origin: *');
$mng = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$data = json_decode(file_get_contents('php://input'));


$result = new stdClass();
$userDb = GetUser($mng, $data->username);
$userData = GetUserData($userDb, $data->password);

$travelKey =  bin2hex(openssl_random_pseudo_bytes(4)); //8keys
$userData->travels->{$data->travel->_id} = array('key' =>$travelKey);
$userDb->secureData = $Encryption->encrypt(json_encode($userData), $data->password);

$travelSecure = clone $data->travel;
unset($travelSecure->_id);
unset($travelSecure->needToBeSync);
unset($travelSecure->lastUpdate);

$travelDb = new stdClass();
$travelDb->_id = (new MongoDB\BSON\ObjectId($data->travel->_id));      
$travelDb->needToBeSync = false;
$travelDb->lastUpdate = new MongoDB\BSON\UTCDateTime(time() * 1000);
$travelDb->secureData = $Encryption->encrypt(json_encode($travelSecure), $travelKey); 

$mng->in

$result = array(
        'travel' => fixToJson($travelDb),
        'user' => fixToJson($userDb),
);

echo(json_encode($result));
?>