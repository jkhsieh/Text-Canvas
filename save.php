<?php
//get json string
foreach($_POST as $key=>$val)
{
    if($key == "json") $json = htmlentities($val);  //need undo on read
    //print $json;
    if($key == "id") $id = $val;
}

$db = mysql_connect("localhost", "jkhsieh", "tc_inspir");
if(!$db) exit(mysql_error());

mysql_select_db("textcanvas");

/*
//$records = 
$row = mysql_fetch_assoc($records);
if ($records) {                      
	$record_id = $row['user_id'];
}

    NEED VALIDIFY!!
*/
if($id == "new")
    $statement = "INSERT INTO doodles(json, modified) VALUES ('".$json."', current_timestamp)";
else
    $statement = "UPDATE doodles SET json = '".$json."', modified = current_timestamp WHERE id = ".$id;
$result = mysql_query($statement);

if($result == true) print "<br>\r<br>\r" . "Canvas doodle saved.";
else print "<br>\r<br>\r" . mysql_error() . $statement;

?>
