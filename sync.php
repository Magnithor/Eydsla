<?php
    require 'HelpUtil.php';
    // http://zetcode.com/db/mongodbphp/
    $mng = GetDb();
    $data = json_decode(file_get_contents('php://input'));

    $userDb = GetUser($mng, $data->username);
    $userData = GetUserData($userDb, $data->password);

    $result = new stdClass();

    $time = new MongoDB\BSON\UTCDateTime(time()*1000);
    //str_replace("+00:00", ".000Z", date('c', time()));


    function GetData($mng, $table, $id) {
        $filter = [ '_id' =>  $id ]; 
        $query = new MongoDB\Driver\Query($filter);  
        $res = $mng->executeQuery("eydsla.".$table, $query); 
        return $res->toArray();  
    }

    function GetAllDataExist($mng, $table, $ids, $maxDate, $extrafilter) {
        // echo (new MongoDB\BSON\UTCDateTime(strtotime($maxDate)));
        
        $and = array([ '_id' => [ '$nin'  => $ids ]]);
        if (isset($extrafilter)) {
            array_push($and, $extrafilter);
        }

        if (isset($maxDate)) {
            array_push($and,
                ['lastUpdate' => ['$gt' => new MongoDB\BSON\UTCDateTime(strtotime($maxDate)*1000)]]
            );
         )]; 
        }

        $filter = [ '$and' => $and ];
        //print_r($filter);

        $query = new MongoDB\Driver\Query($filter);  
        $res = $mng->executeQuery("eydsla.".$table, $query); 
        return $res->toArray();  
    }

    function sync($mng, $table, $data, $time) {
        $result = array();
        $ids = array();
        if (count($data->hasChanged) > 0) {
            $bulk = new MongoDB\Driver\BulkWrite;
            for ($i=0; $i < count($data->hasChanged); $i++) {
                $item = $data->hasChanged[$i];            
                $res = GetData($mng, $table, $item->_id);
                $item->lastUpdate = $time;
                $item->needToBeSync = false;
                if (count($res) == 0) {
                    $bulk->insert($item);
                } else {
                    $bulk->update(["_id" => $item->_id], $item);
                }

                array_push($result, fixToJson($item));
                array_push($ids, $item->_id);
            }

            $mng->executeBulkWrite("eydsla.".$table, $bulk);
        }
    
        $list = GetAllDataExist($mng, $table, $ids, $data->newestSyncData);
        for($i=0;$i < count($list); $i++) {
            array_push($result, fixToJson($list[$i]));
        }

        return $result;
    }

    $result->travels = sync($mng, "travel", $data->travels, $time, ["_id" => ["in" => array_keys($userData->travels)]]);
    $result->buyItems = sync($mng, "buyItem", $data->buyItems, $time, ["travelId" => [ "in" => array_keys($userData->travels)]]);
    $result->users = sync($mng, "user", $data->users, $time);

    echo(json_encode($result));

    // print_r($data->travel->hasChanged[0]->id);
    /*
    try {
    $data = json_decode(file_get_contents("php://input"));
    echo( $data);
    }
    catch (Exception ex) {
        echo ex;
    }*/
?>