<!DOCTYPE html>
<html>
<head>
<title>HTML5 Create HTML5 Canvas JavaScript Drawing App Example</title>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js"></script>
<!--[if IE]><script type="text/javascript" src="excanvas.js"></script><![endif]-->
<script type="text/javascript" src="oo-canvas.js"></script>
</head>

<body>

<!-- canvas tags to be created in div -->
<div id="canvasDiv"></div>

<?php
    foreach($_REQUEST as $key => $value){
        if($key == 'id') $id = $value;
    }
    print "id = ".$id;
    if(!isset($id)) exit("Specify doodle id or 'new'!");
    
    $db = mysql_connect("localhost", "jkhsieh", "tc_inspir");
    if(!$db) exit(mysql_error());

    $db_ok = mysql_select_db("textcanvas");

    $statement = "SELECT json FROM doodles where id=".$id;   //case sensitive!

    $result = mysql_query($statement);
    $arr = mysql_fetch_row($result);  //row[]
    $json = html_entity_decode($arr[0]);
?>
<form id="canvasForm" method="post" action="save.php">
    <input type="hidden" name="id" value="<?php print($id); ?>">
    <!-- stringify => textarea => eval. save. -->
	<input id="stringifyBtn" type="button" value="stringify =>" onclick="doodle.stringifyHistory();"></input>
	<textarea id="jsonTextarea" name="jsonTextarea" cols="80" rows="10"><?php print($json); ?></textarea>
	<input id="evalBtn" type="button" value="=> eval" onclick="doodle.evalHistoryJson();"></input>
	<br>
	<input type="submit" value="save"></input>
</form>

<?php    
    print("<script type='text/javascript'>\n");
    print("    var doodle;\n");
    print("    $(document).ready(\n");
    print("    function() {\n");
    print("        doodle = new Doodle('canvas".$id."', eval('(' +'".$json."'+ ')'));\n");
    print("    });\n");
    print("</script>");
?>

</body>
</html>
