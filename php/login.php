<?php
session_start();

// 本番環境ではセキュリティ強化のためパスワードをハッシュ化してください。
$correctPassword = "12345"; // 仮パスワード

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $password = $_POST["password"];
    if ($password === $correctPassword) {
        $_SESSION["loggedin"] = true;
        header("Location: ../page/protected.html");
        exit();
    } else {
        echo "パスワードが間違っています。<a href='../page/login.html'>戻る</a>";
    }
}
?>
