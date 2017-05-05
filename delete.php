<?php
require_once 'lib/lib.php';

DB::init();

$id = null;
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
	$id = (int)$_GET['id'];
	DB::delete($id);
}

header('Location: ./');
exit;

