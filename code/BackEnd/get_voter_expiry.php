<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "1234";
$dbname = "e_voting";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed."]));
}

$data = json_decode(file_get_contents("php://input"), true);

$voter_uid = $conn->real_escape_string($data['voter_uid'] ?? '');
$aadhar_uid = $conn->real_escape_string($data['aadhar_uid'] ?? '');
$mob = $conn->real_escape_string($data['mob'] ?? '');

$sql = "";
if (!empty($voter_uid)) {
    $sql = "SELECT * FROM voter_database WHERE voter_uid='$voter_uid' LIMIT 1";
} elseif (!empty($aadhar_uid)) {
    $sql = "SELECT * FROM voter_database WHERE aadhar_uid='$aadhar_uid' LIMIT 1";
} elseif (!empty($mob)) {
    $sql = "SELECT * FROM voter_database WHERE mob='$mob' LIMIT 1";
}

if ($sql != "") {
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(["success" => true, "voter" => $row]);
    } else {
        echo json_encode(["success" => false, "message" => "No record found."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No input provided."]);
}

$conn->close();
?>
