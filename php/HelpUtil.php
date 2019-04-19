<?php
// https://gist.github.com/ve3/0f77228b174cf92a638d81fddb17189d
require 'Encryption.php';

function GetDb(){
    return new MongoDB\Driver\Manager("mongodb://localhost:27017");
}

function GetData($mng, $table, $id) {
    $filter = [ '_id' =>  $id ]; 
    $query = new MongoDB\Driver\Query($filter);  
    $res = $mng->executeQuery("eydsla.".$table, $query); 
    return $res->toArray();  
}

function GetUser($mng, $user) {
    $regex = new MongoDB\BSON\Regex ( '^'.$user.'$','i');
    $filter = [ 'username' =>  $regex ]; 
    $query = new MongoDB\Driver\Query($filter);  
    $res = $mng->executeQuery("eydsla.user", $query); 
    $dbResult = $res->toArray();

    if (sizeof($dbResult) == 0) {
        http_response_code(500);
        exit("No user found");
    }

    if (sizeof($dbResult) > 1) {
        http_response_code(500);
        exit("too many user found");
    }

    return $dbResult[0];  
}

function GetUserData($userDb, $password) {
    $Encryption = new Encryption();
    $dataStr = $Encryption->decrypt($userDb->secureData, $password);
    if (!isset($dataStr) || trim($dataStr) == "") {
            http_response_code(500);
            exit("pass");
    }

    return json_decode($dataStr);
}

function fixToJson($data) {
    foreach ($data as $key => $value) {
            if ($value instanceof MongoDB\BSON\UTCDateTime) {
                    $data->{$key} = $value->toDateTime()->format('Y-m-d\TH:i:s\Z');
            } else {
                    if ($value instanceof MongoDB\BSON\ObjectId) {
                            $data->{$key} = $value->__toString();
                    }
            }
    }
    return $data;
}
?>