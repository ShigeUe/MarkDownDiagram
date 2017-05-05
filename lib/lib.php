<?php
ini_set('display_errors', true);
ini_set('error_reporting', E_ALL);

require_once 'idiorm.php';

class DB
{
	public static function init() {
		ORM::configure('sqlite:'.__DIR__.'/storage.db');
		ORM::configure('error_mode', PDO::ERRMODE_EXCEPTION);
		ORM::configure('logging', true);
	}

	public static function list() {
		return ORM::for_table('files')
			->find_many();
	}

	public static function get($id) {
		return ORM::for_table('files')
			->where('id', $id)
			->find_one();
	}

	public static function save($id, $name, $text) {
		$data = [
			'name' => $name,
			'data' => $text,
			'modified' => date('Y-m-d H:i:s')
		];

		$file = null;
		if ($id) {
			$file = self::get($id);
			if ($file) {
				$data['id'] = $file['id'];
			}
		}
		if (!$file) {
			$file = ORM::for_table('files')->create();
			$data['created'] = $data['modified'];
		}
		$file->set($data);
		$file->save();
	}

	public static function delete($id) {
		$file = self::get($id);
		if ($file) {
			$file->delete();
		}
	}
}

function h($text) {
	return htmlspecialchars($text, ENT_QUOTES);
}
