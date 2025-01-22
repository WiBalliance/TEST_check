<?php
session_start();

$correctPassword = "12345"; // 本番環境ではハッシュ化したパスワードを使用

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $password = $_POST["password"];
    if ($password === $correctPassword) {
        $_SESSION["loggedin"] = true;
        header("Location: ../page/protected.html");
    } else {
        echo "パスワードが間違っています。<a href='../page/login.html'>戻る</a>";
    }
}
?>
