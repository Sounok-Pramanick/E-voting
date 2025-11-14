<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$data = json_decode(file_get_contents("php://input"), true);

$mysqli = new mysqli("localhost", "root", "1234", "e_voting");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit();
}

// copy all voter fields
$voter_uid = $data['voter_uid'] ?? '';
$aadhar_uid = $data['aadhar_uid'] ?? '';
$name = $data['name'] ?? '';
$age = $data['age'] ?? null;
$house_no = $data['house_no'] ?? '';
$street_name = $data['street_name'] ?? '';
$location = $data['location'] ?? '';
$pincode = $data['pincode'] ?? null;
$remarks = $data['remarks'] ?? '';  
$state = $data['state'] ?? '';
$city = $data['city'] ?? '';
$constituency = $data['constituency'] ?? null;
$assembly = $data['assembly'] ?? null;
$ward_no = $data['ward_no'] ?? null;
$email = $data['email'] ?? '';   
$mob = $data['mob'] ?? '';
$gender = $data['gender'] ?? '';
$father_or_husband_name = $data['father_or_husband_name'] ?? '';
$expire = $data['expire'] ?? null;
$authenticated_initial = $data['authenticated_initial'] ?? 'TD';

// candidate-specific fields
$election = $data['election'] ?? null;
$election_cons = $data['election_cons'] ?? null;
$election_assembly = $data['election_assembly'] ?? null;
$election_ward = $data['election_ward'] ?? null;

// new fields
$party_name = $data['party_name'] ?? '';
$party_shortform = $data['party_shortform'] ?? '';
$logo = $data['logo'] ?? ''; // just filename

// check if already exists
$check = $mysqli->prepare("SELECT voter_uid FROM candidate_database WHERE voter_uid = ? OR aadhar_uid = ?");
$check->bind_param("ss", $voter_uid, $aadhar_uid);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Already registered as candidate"]);
    $check->close();
    $mysqli->close();
    exit();
}
$check->close();

// ✅ Insert with new columns
$stmt = $mysqli->prepare("INSERT INTO candidate_database 
(voter_uid, aadhar_uid, name, age, house_no, street_name, location, pincode, remarks, state, city, constituency, assembly, ward_no, email, mob, gender, father_or_husband_name, expire, authenticated_initial, election, election_cons, election_assembly, election_ward, party_name, party_shortform, logo)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

$stmt->bind_param(
    "sssisssisssiiissssssiiissss",
    $voter_uid,
    $aadhar_uid,
    $name,
    $age,
    $house_no,
    $street_name,
    $location,
    $pincode,
    $remarks,
    $state,
    $city,
    $constituency,
    $assembly,
    $ward_no,
    $email,
    $mob,
    $gender,
    $father_or_husband_name,
    $expire,
    $authenticated_initial,
    $election,
    $election_cons,
    $election_assembly,
    $election_ward,
    $party_name,
    $party_shortform,
    $logo
);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$mysqli->close();
?>
