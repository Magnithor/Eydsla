<?php
// https://gist.github.com/ve3/0f77228b174cf92a638d81fddb17189d

require 'HelpUtil.php';


//header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
$mng = GetDb();
$data = json_decode(file_get_contents('php://input'));

echo(json_encode(fixToJson(GetUser($mng, $data->username))));

?>
