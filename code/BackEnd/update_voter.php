<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "1234"; // MySQL password
$dbname = "e_voting";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input."]);
    exit();
}

// Extract and sanitize all fields
$voter_uid             = $conn->real_escape_string($data['voter_uid'] ?? '');
$aadhar_uid            = $conn->real_escape_string($data['aadhar_uid'] ?? '');
$name                  = $conn->real_escape_string($data['name'] ?? '');
$age                   = $conn->real_escape_string($data['age'] ?? '');
$house_no              = $conn->real_escape_string($data['house_no'] ?? '');
$street_name           = $conn->real_escape_string($data['street_name'] ?? '');
$location              = $conn->real_escape_string($data['location'] ?? '');
$pincode               = $conn->real_escape_string($data['pincode'] ?? '');
$remarks               = $conn->real_escape_string($data['remarks'] ?? '');
$state                 = $conn->real_escape_string($data['state'] ?? '');
$city                  = $conn->real_escape_string($data['city'] ?? '');
$mob                   = $conn->real_escape_string($data['mob'] ?? '');
$constituency          = $conn->real_escape_string($data['constituency'] ?? '');
$assembly              = $conn->real_escape_string($data['assembly'] ?? '');
$ward_no               = $conn->real_escape_string($data['ward_no'] ?? '');
$email                 = $conn->real_escape_string($data['email'] ?? '');
$gender                = $conn->real_escape_string($data['gender'] ?? '');
$father_or_husband     = $conn->real_escape_string($data['father_or_husband_name'] ?? '');
$authenticated_initial = $conn->real_escape_string($data['authenticated_initial'] ?? '');

// Special handling for expiry (DATE field)
$expiry = $conn->real_escape_string($data['expiry'] ?? '');
if (empty($expiry)) {
    $expiry = "NULL"; // Save NULL if empty
} else {
    $expiry = "'$expiry'";
}

// Ensure voter_uid is present (primary key)
if (empty($voter_uid)) {
    echo json_encode(["success" => false, "message" => "Voter UID is required for update."]);
    exit();
}

// Build update query
$sql = "UPDATE voter_database SET 
            aadhar_uid='$aadhar_uid',
            name='$name',
            age='$age',
            house_no='$house_no',
            street_name='$street_name',
            location='$location',
            pincode='$pincode',
            remarks='$remarks',
            state='$state',
            city='$city',
            mob='$mob',
            constituency='$constituency',
            assembly='$assembly',
            ward_no='$ward_no',
            email='$email',
            gender='$gender',
            father_or_husband_name='$father_or_husband',
            expiry=$expiry,
            authenticated_initial='$authenticated_initial'
        WHERE voter_uid='$voter_uid'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Voter details updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $conn->error]);
}

$conn->close();
?>
