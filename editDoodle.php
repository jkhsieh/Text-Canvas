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
    if(!isset($id)) exit("Specify doodle id to edit!");
    
    $db = mysql_connect("localhost", "jkhsieh", "tc_inspir");
    if(!$db) exit(mysql_error());

    $db_ok = mysql_select_db("textcanvas");

    /*
    $statement = "SELECT json FROM doodles where id=".$id;   //case sensitive!
    $result = mysql_query($statement);
    $arr = mysql_fetch_row($result);  //row[]
    $json = html_entity_decode($arr[0]);
    */
?>
<form id="canvasForm" method="post" action="save.php"
    onsubmit="return saveDoodle();">
    <input type="hidden" name="id" value="<?php print($id); ?>">
    <input type="hidden" name="json" id="json" value="">
    <input type="submit" value="save doodle"></input>
</form>

<script type='text/javascript'>
    var doodles = new Array();  //holds histories. no handle on Doodle!
</script>
<?php
    print("<script type='text/javascript'>\n");
    print("    var id = ".$id.";");
    print("</script>");
?>
<script type='text/javascript'>
    $(document).ready(
        function() {
            getDoodle("selectJson.php?id="+id);
        }
    );
    
    /**/
    //modified from example on http://www.captain.at/howto-ajax-process-xml.php

    var http_request = false;

    function getDoodle(url) {   //returns HTML (external source)
        $.ajax({
            url:"selectJson.php?id="+id, success:function(result){
                //get url doodles array, eval, add doodles
                doodles = (eval('(' + result + ')')).doodles;     //eval DANGER!!
                for(i = 0; i<doodles.length; i++){
                    new Doodle(doodles[i].id, doodles[i].history, true);
                }
            }
        });
    }//function getDoodles
    
    function stringifyHistory() {
        var jsonHolder = document.getElementById("json");
	    jsonHolder.value = JSON.stringify(doodles[0].history);    //id not used!!!
    }
    
    function saveDoodle() {
        stringifyHistory();
        return true;
    }
</script>

</body>
</html>
