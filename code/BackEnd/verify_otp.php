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
$otp = $data['otp'] ?? '';
$mobile = $data['mobile'] ?? '';

if (!isset($_SESSION['otp'], $_SESSION['otp_mobile'], $_SESSION['otp_expiry'])) {
    echo json_encode(["success" => false, "message" => "OTP not generated"]);
    exit;
}

if ($_SESSION['otp_mobile'] !== $mobile) {
    echo json_encode(["success" => false, "message" => "Mobile number mismatch"]);
    exit;
}

if (time() > $_SESSION['otp_expiry']) {
    echo json_encode(["success" => false, "message" => "OTP expired"]);
    exit;
}

if ($_SESSION['otp'] !== $otp) {
    echo json_encode(["success" => false, "message" => "Invalid OTP"]);
    exit;
}

unset($_SESSION['otp']);
unset($_SESSION['otp_mobile']);
unset($_SESSION['otp_expiry']);

echo json_encode(["success" => true, "message" => "OTP verified"]);
?>
