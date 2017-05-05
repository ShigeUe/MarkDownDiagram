<?php
header('Content-type: application/json; charset=UTF-8');
require_once 'lib/lib.php';

DB::init();

if ($_POST) {
	$id = null;
	if (isset($_POST['id']) && is_numeric($_POST['id'])) {
		$id = (int)$_POST['id'];
	}
	$name = @$_POST['name'];
	$text = @$_POST['data'];

	DB::save($id, $name, $text);
	echo json_encode(['result'=>true]);
}
else {
	echo json_encode(['result'=>false]);
}

