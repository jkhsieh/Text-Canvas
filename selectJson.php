{   "doodles": [    //doodle objects: {id: json/history}

<?php /** REST. returns json string, representing up to $num doodles. */

foreach($_REQUEST as $key=>$value)  //GET -or- POST (?)
{
    if($key == "num") $num = $_REQUEST["num"];
    if($key == "id") $id = $_REQUEST["id"];
}
if(!isset($num)) $num = 5;
$i = 0;


$db = mysql_connect("localhost", "jkhsieh", "tc_inspir");
if(!$db) exit(mysql_error());

$db_ok = mysql_select_db("textcanvas");

$statement = "SELECT * FROM doodles";   //case sensitive!
if(isset($id)) $statement = $statement." WHERE id=".$id;

$records = mysql_query($statement);
//$n = mysql_num_rows($records);
//print("//".$n." records");


$doodle = false;
while($i < $num && $doodle = mysql_fetch_row($records)) {

    //{id: history},    //VALIDIFY??
    print("{'id': ");
    print($doodle[0]);
    print(", 'history': ");
    print(html_entity_decode($doodle[1]));
    print("},\n");
    
    $i++;

}//while rows

//close connection?
?>

] }   //end doodle objects
