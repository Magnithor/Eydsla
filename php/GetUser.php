<?php
// https://gist.github.com/ve3/0f77228b174cf92a638d81fddb17189d
require 'Encryption.php';
$Encryption = new Encryption();
header('Access-Control-Allow-Origin: *');
$mng = new MongoDB\Driver\Manager("mongodb://localhost:27017");
$data = json_decode(file_get_contents('php://input'));

function GetUser($mng, $user) {
        $regex = new MongoDB\BSON\Regex ( '^'.$user.'$','i');
        $filter = [ 'username' =>  $regex ]; 
        $query = new MongoDB\Driver\Query($filter);  
        $res = $mng->executeQuery("eydsla.user", $query); 
        return $res->toArray();  
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

$dbResult = GetUser($mng, $data->username);

if (sizeof($dbResult) == 0) {
        http_response_code(500);
        exit("No user found");
}

if (sizeof($dbResult) > 1) {
        http_response_code(500);
        exit("too many user found");
}


$userDb = fixToJson($dbResult[0]);

echo(json_encode($userDb));
?>
