<?php

require 'HelpUtil.php';

$mng = GetDb();
$data = json_decode(file_get_contents('php://input'));

$userDb = GetUser($mng, $data->username);
$userData = GetUserData($userDb, $data->password);

$userDb->secureData = $Encryption->encrypt(json_encode($userData), $data->newPassword);

$bulk = new MongoDB\Driver\BulkWrite;
$bulk->update(["_id" => $userDb->_id], $userDb);
$mng->executeBulkWrite("eydsla.user", $bulk);

echo(json_encode(fixToJson($userDb)));
?>
