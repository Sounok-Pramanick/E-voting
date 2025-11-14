<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "e_voting";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["exists" => false, "error" => "Database connection failed."]));
}

$data = json_decode(file_get_contents('php://input'), true);
$mobile = $data['mob'] ?? "";

if (!$mobile) {
    echo json_encode(["exists" => false, "error" => "Mobile number missing"]);
    exit();
}

$stmt = $conn->prepare("SELECT mob FROM voter_database WHERE mob = ?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["exists" => true]);
} else {
    echo json_encode(["exists" => false]);
}

$stmt->close();
$conn->close();
?>
