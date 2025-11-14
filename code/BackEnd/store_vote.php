<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include("db_connection.php"); // defines $pdo

$data = json_decode(file_get_contents("php://input"), true);

$constituency = $data['constituency'] ?? '';
$assembly = $data['assembly'] ?? '';
$ward_no = $data['ward_no'] ?? '';
$poll_no = $data['poll_no'] ?? 0;
$gender = $data['gender'] ?? '';
$mob = $data['mob'] ?? '';

if (!$constituency || !$assembly || !$ward_no || !$mob || !$gender) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

try {
    // Start transaction so both queries succeed/fail together
    $pdo->beginTransaction();

    // Get current year (e.g., 2025)
    $currentYear = date('Y');

    // Insert vote into poll table including gender and year
    $sql = "INSERT INTO poll (constituency, assembly, ward_no, poll_no, gender, year) 
            VALUES (:constituency, :assembly, :ward_no, :poll_no, :gender, :year)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':constituency' => $constituency,
        ':assembly' => $assembly,
        ':ward_no' => $ward_no,
        ':poll_no' => $poll_no,
        ':gender' => strtoupper($gender), // store as M/F in uppercase
        ':year' => $currentYear
    ]);

    // Update remarks in voter_database
    $updateSql = "UPDATE voter_database 
                  SET remarks = 1 
                  WHERE mob = :mob";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([':mob' => $mob]);

    // Commit transaction
    $pdo->commit();

    echo json_encode(["success" => true, "message" => "Vote recorded and voter updated"]);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
