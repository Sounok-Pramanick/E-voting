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

$data = json_decode(file_get_contents("php://input"), true);
$mobile = $data["mobile"] ?? null;

// Validate mobile
if (!$mobile || !preg_match('/^\d{10}$/', $mobile)) {
    echo json_encode(["allowed" => false, "message" => "Invalid mobile number"]);
    exit;
}

$pythonPath = "C:\\Python314\\python.exe";
$scriptPath = "C:\\Web_App Development\\XAMPP\\htdocs\\evoting\\check_whatsapp_join.py";

$command = "\"$pythonPath\" \"$scriptPath\" $mobile 2>&1";
$output = shell_exec($command);

error_log("Python Raw Output: " . $output);

// Default response
$response = ["allowed" => false];

if ($output !== null) {
    // Check if Python returned the word FOUND anywhere
    if (strpos($output, "FOUND") !== false) {
        $response["allowed"] = true;
        $response["message"] = "WhatsApp verification successful";
    } elseif (strpos($output, "NOT_FOUND") !== false) {
        $response["message"] = "Join message not detected yet";
    } elseif (strpos($output, "ERROR") !== false) {
        $response["message"] = "Python execution error";
    } else {
        $response["message"] = "Unexpected response from Python";
    }
} else {
    $response["message"] = "No output from Python script";
}

echo json_encode($response);
exit;
?>
