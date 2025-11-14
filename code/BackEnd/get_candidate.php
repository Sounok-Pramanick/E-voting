<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$mysqli = new mysqli("localhost", "root", "1234", "e_voting");

if ($mysqli->connect_errno) {
    echo json_encode([
        "exists" => false,
        "error" => "DB connection failed"
    ]);
    exit();
}

$mobile = $_GET['mobile'] ?? '';

if (!$mobile) {
    echo json_encode([
        "exists" => false,
        "error" => "Mobile required"
    ]);
    exit();
}

$stmt = $mysqli->prepare("SELECT * FROM candidate_database WHERE mob=?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "exists" => true,
        "candidate" => $row
    ]);
} else {
    echo json_encode(["exists" => false]);
}

$stmt->close();
$mysqli->close();
?>
