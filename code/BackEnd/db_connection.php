<?php
$host = "localhost";      // Database server (XAMPP = localhost)
$user = "root";           // Default MySQL user in XAMPP
$pass = "1234";               // Default MySQL password (blank in XAMPP)
$dbname = "e_voting";     // Your database name

try {
    // Create PDO connection
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);

    // Throw exception on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}
?>
