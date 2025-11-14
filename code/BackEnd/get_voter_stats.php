<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "1234";
$db = "e_voting";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

// ---------- Voter Base Data ----------
$voterQuery = "
    SELECT 
        constituency,
        assembly,
        ward_no,
        COUNT(voter_uid) AS total_voters,
        SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS male_voters,
        SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_voters
    FROM voter_database
    GROUP BY constituency, assembly, ward_no
";

$voterResult = $conn->query($voterQuery);
$voterBase = [];

if ($voterResult && $voterResult->num_rows > 0) {
    while ($row = $voterResult->fetch_assoc()) {
        $key = $row['constituency'].'_'.$row['assembly'].'_'.$row['ward_no'];
        $voterBase[$key] = $row;
    }
}

// ---------- Poll Data by Year ----------
$pollQuery = "
    SELECT 
        year,
        constituency,
        assembly,
        ward_no,
        COUNT(*) AS polled_vote,
        SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS male_polled,
        SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_polled,
        SUM(CASE WHEN poll_no = 9 THEN 1 ELSE 0 END) AS nota
    FROM poll
    GROUP BY year, constituency, assembly, ward_no
";

$pollResult = $conn->query($pollQuery);
$data = [];

if ($pollResult && $pollResult->num_rows > 0) {
    while ($row = $pollResult->fetch_assoc()) {
        $key = $row['constituency'].'_'.$row['assembly'].'_'.$row['ward_no'];
        $voter = $voterBase[$key] ?? [
            'total_voters' => 0,
            'male_voters' => 0,
            'female_voters' => 0
        ];

        $percent = $voter['total_voters'] > 0
            ? round(($row['polled_vote'] / $voter['total_voters']) * 100, 2)
            : 0;

        $data[] = array_merge($row, $voter, ['percent_vote' => $percent]);
    }
}

echo json_encode($data);
$conn->close();
?>
