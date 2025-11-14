<?php
session_start();
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$mobile = $data['mobile'] ?? null;

if (!$mobile || !preg_match('/^\d{10}$/', $mobile)) {
    echo json_encode(["success" => false, "message" => "Invalid Mobile Number"]);
    exit;
}

// ✅ Step 1: Connect to MySQL
$mysqli = new mysqli("localhost", "root", "1234", "e_voting");
if ($mysqli->connect_errno) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// ✅ Step 2: Verify mobile exists in voter_database
$stmt = $mysqli->prepare("SELECT * FROM voter_database WHERE mob = ?");
$stmt->bind_param("s", $mobile);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Mobile number not registered"]);
    exit;
}

// ✅ Step 3: Generate OTP
$otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
$_SESSION['otp'] = $otp;
$_SESSION['otp_mobile'] = $mobile;
$_SESSION['otp_expiry'] = time() + 300; // 5 mins validity

// ✅ Step 4: Execute Python script to send WhatsApp OTP
$pythonPath = "C:\\Python314\\python.exe";
$scriptPath = "C:\\Web_App Development\\XAMPP\\htdocs\\evoting\\send_whatsapp_otp.py";
$command = "\"$pythonPath\" \"$scriptPath\" $mobile $otp 2>&1";

$output = shell_exec($command);
error_log("Python Output: " . $output);

if (strpos($output, 'success') !== false) {
    echo json_encode(["success" => true, "message" => "OTP sent"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to send OTP", "python_log" => $output]);
}
?>
