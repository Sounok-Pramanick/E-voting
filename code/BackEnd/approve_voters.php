<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
include "db_connection.php"; // shared connection

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["voter_ids"]) || !is_array($data["voter_ids"])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$voter_ids = $data["voter_ids"];
$placeholders = implode(",", array_fill(0, count($voter_ids), "?"));

try {
    $pdo->beginTransaction();

    // Fetch selected voters from temp table (expire column exists here)
    $stmt = $pdo->prepare("SELECT * FROM voter_database_temp WHERE voter_uid IN ($placeholders)");
    $stmt->execute($voter_ids);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$rows) {
        echo json_encode(["success" => false, "message" => "No records found"]);
        exit;
    }

    // Insert into voter_database (expiry column expected here)
    $insert = $pdo->prepare("
        INSERT INTO voter_database (
            voter_uid, aadhar_uid, name, age, house_no, street_name, location, 
            pincode, remarks, state, city, mob, constituency, assembly, ward_no, 
            email, gender, father_or_husband_name, expiry, authenticated_initial
        ) VALUES (
            :voter_uid, :aadhar_uid, :name, :age, :house_no, :street_name, :location, 
            :pincode, :remarks, :state, :city, :mob, :constituency, :assembly, :ward_no, 
            :email, :gender, :father_or_husband_name, :expiry, 'TD'
        )
    ");

    foreach ($rows as $row) {
        // Calculate age from DOB
        $age = null;
        if (!empty($row['dob'])) {
            $dob = new DateTime($row['dob']);
            $today = new DateTime();
            $age = $today->diff($dob)->y;
        }

        // ✅ Map expire (temp) → expiry (final)
        $expiry = isset($row['expire']) ? $row['expire'] : null;

        $insert->execute([
            ':voter_uid' => $row['voter_uid'],
            ':aadhar_uid' => $row['aadhar_uid'],
            ':name' => $row['name'],
            ':age' => $age,
            ':house_no' => $row['house_no'],
            ':street_name' => $row['street_name'],
            ':location' => $row['location'],
            ':pincode' => $row['pincode'],
            ':remarks' => $row['remarks'],
            ':state' => $row['state'],
            ':city' => $row['city'],
            ':mob' => $row['mob'],
            ':constituency' => $row['constituency'],
            ':assembly' => $row['assembly'],
            ':ward_no' => $row['ward_no'],
            ':email' => $row['email'],
            ':gender' => $row['gender'],
            ':father_or_husband_name' => $row['father_or_husband_name'],
            ':expiry' => $expiry
        ]);
    }

    // Delete from temp table
    $delete = $pdo->prepare("DELETE FROM voter_database_temp WHERE voter_uid IN ($placeholders)");
    $delete->execute($voter_ids);

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Selected voters approved and moved successfully!"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
