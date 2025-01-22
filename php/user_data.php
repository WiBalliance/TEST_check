<?php
$users = [
    ["id" => "001", "name" => "山田太郎"],
    ["id" => "002", "name" => "佐藤花子"],
    ["id" => "003", "name" => "田中一郎"],
];

foreach ($users as $user) {
    echo "<tr><td>{$user['id']}</td><td>{$user['name']}</td></tr>";
}
?>
