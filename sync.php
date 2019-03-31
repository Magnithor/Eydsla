<?php
    // http://zetcode.com/db/mongodbphp/
    header('Access-Control-Allow-Origin: *');
    $mng = new MongoDB\Driver\Manager("mongodb://localhost:27017");
    $data = json_decode(file_get_contents('php://input'));

    $result = new stdClass();

    $time = new MongoDB\BSON\UTCDateTime(time()*1000);
    //str_replace("+00:00", ".000Z", date('c', time()));


    function GetData($mng, $table, $id) {
        $filter = [ '_id' =>  $id ]; 
        $query = new MongoDB\Driver\Query($filter);  
        $res = $mng->executeQuery("eydsla.".$table, $query); 
        return $res->toArray();  
    }

    function GetAllDataExist($mng, $table, $ids, $maxDate) {
        // echo (new MongoDB\BSON\UTCDateTime(strtotime($maxDate)));
        
        if (isset($maxDate)) {
            $filter = [ '$and' => array( [ '_id' => [ '$nin'  => $ids ]]
            , 
            ['lastUpdate'=>['$gt'=> new MongoDB\BSON\UTCDateTime(strtotime($maxDate)*1000)]] 
         )]; 
        ;
        } else {
            $filter = [ '$and' => array( [ '_id' => [ '$nin'  => $ids ]] )]; 
        }

        //print_r($filter);

        $query = new MongoDB\Driver\Query($filter);  
        $res = $mng->executeQuery("eydsla.".$table, $query); 
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

    $result->travels = sync($mng, "travel", $data->travels, $time);
    $result->buyItems = sync($mng, "buyItem", $data->buyItems, $time);
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