<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // ← THIS IS CRUCIAL

$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "e_voting";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

$data = json_decode(file_get_contents('php://input'), true);
$mobile = $data['mobile'] ?? null;

if (!$mobile) {
    echo json_encode(["success" => false, "message" => "Mobile number required"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM voter_database WHERE mob = ?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $voter = $result->fetch_assoc();
    echo json_encode(["success" => true, "voter" => $voter]);
} else {
    echo json_encode(["success" => false, "message" => "Voter not found"]);
}

$stmt->close();
$conn->close();
?>