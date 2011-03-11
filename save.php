<?php
//get json string
foreach($_POST as $key=>$val)
{
    if($key == "jsonTextarea") $json = htmlentities($val);  //need undo on read
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
    $statement = "INSERT INTO doodles(json) VALUES ('".$json."')";
else
    $statement = "UPDATE doodles SET json = '".$json."' WHERE id = ".$id;
$result = mysql_query($statement);

if($result == true) print "<br>\r<br>\r" . "Canvas doodle saved.";
else print "<br>\r<br>\r" . mysql_error() . $statement;

?>
