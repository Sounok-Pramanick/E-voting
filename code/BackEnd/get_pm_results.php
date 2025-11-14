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
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// Aggregate votes at all levels by year
$sql = "
SELECT 
    year,
    constituency,
    assembly,
    ward_no,
    poll_no,
    COUNT(*) as votes
FROM poll
GROUP BY year, constituency, assembly, ward_no, poll_no
ORDER BY year DESC, constituency, assembly, ward_no, votes DESC
";

$result = $conn->query($sql);

$data = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
?>
