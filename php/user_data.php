<?php
// 仮のデータ（本番環境ではデータベースを使用）
$users = [
    ["id" => "001", "name" => "山田太郎"],
    ["id" => "002", "name" => "佐藤花子"],
    ["id" => "003", "name" => "田中一郎"],
    ["id" => "004", "name" => "鈴木二郎"],
];

foreach ($users as $user) {
    echo "<tr>";
    echo "<td>" . htmlspecialchars($user["id"]) . "</td>";
    echo "<td>" . htmlspecialchars($user["name"]) . "</td>";
    echo "</tr>";
}
?>
