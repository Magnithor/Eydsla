<?php

require 'HelpUtil.php';

$mng = GetDb();
$data = json_decode(file_get_contents('php://input'));

HasUser($mng, $data->newUsername);

$userDb = GetUser($mng, $data->username);
$userData = GetUserData($userDb, $data->password);


$userDb = new stdClass();
$userDb->username = $data->newUsername;
$userDb->needToBeSync = false;
$userDb->lastUpdate = new MongoDB\BSON\UTCDateTime(time() * 1000);


$Encryption = new Encryption();
$userDb->secureData = $Encryption->encrypt(json_encode($data->data), $data->newPassword);

$bulk = new MongoDB\Driver\BulkWrite;
$bulk->insert($userDb);
$mng->executeBulkWrite("eydsla.user", $bulk);

$userDb = GetUser($mng, $data->newUsername);


echo(json_encode(fixToJson($userDb)));
?>