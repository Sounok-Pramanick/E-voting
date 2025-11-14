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
$dbname = "e_voting"; // correct DB name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$sql = "SELECT voter_uid, aadhar_uid, name, dob, house_no, street_name, location, 
        pincode, remarks, state, city, mob, constituency, assembly, ward_no, 
        email, gender, father_or_husband_name, expire 
        FROM voter_database_temp";

$result = $conn->query($sql);

$voters = [];
if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $voters[] = $row;
    }
}

echo json_encode($voters);

$conn->close();
?>
