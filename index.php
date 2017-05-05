<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width">
<link rel="stylesheet" type="text/css" href="css/markdown.css">
<title>MarkDownDiagram</title>
<style>
a {text-decoration: none;font-size:14px;}
a.delete {color:red;}
#fileList td {padding:5px;}
#fileList td a {display:block;}
#fileList tr td:nth-child(1) {width:40em;}
#fileList tr td:nth-child(2) {width:5em;text-align:center;}
#fileList tr td.new {background-color:#fff;}
</style>
<script>
function deleteConfirm() {
	return confirm('It will be deleted. Are you sure?');
}
</script>
</head>
<body>
<h1>Saved diagrams</h1>
<table id="fileList">
<?php

require_once 'lib/lib.php';

DB::init();
$lists = DB::list();

if ($lists) {
	foreach($lists as $list) {
		echo "<tr>\n";
		echo '<td><a href="edit.php?id='.$list['id'].'">'.h($list['name']).'</a></td>';
		echo '<td><a href="delete.php?id='.$list['id'].'" class="delete" onclick="return deleteConfirm();">delete</a></td>'."\n";
		echo "</tr>\n";
	}
}
?><tr>
<td colspan="2" class="new"><a href="edit.php?id=new">Create new diagram</a></td>
</tr>
</table>
</body>
</html>
