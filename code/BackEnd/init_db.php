<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database credentials
$host = "localhost";
$user = "root";        // change if needed
$pass = "1234";        // your MySQL password
$dbname = "e_voting";

// Response array
$response = [
    "success" => false,
    "message" => ""
];

// Connect to MySQL server
$conn = new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    $response['message'] = "Connection failed: " . $conn->connect_error;
    echo json_encode($response);
    exit;
}

// Create database if it doesn’t exist
if (!$conn->query("CREATE DATABASE IF NOT EXISTS $dbname")) {
    $response['message'] = "Error creating database: " . $conn->error;
    echo json_encode($response);
    exit;
}

$conn->select_db($dbname);

// Helper function to create table
function create_table($conn, $sql, $table_name) {
    if (!$conn->query($sql)) {
        return "Error creating $table_name: " . $conn->error;
    }
    return null; // success
}

// Table definitions
$tables = [
    "voter_database" => "
        CREATE TABLE IF NOT EXISTS voter_database (
            voter_uid VARCHAR(20) NOT NULL,
            aadhar_uid CHAR(12) NOT NULL,
            name VARCHAR(40) NOT NULL,
            age INT(11) DEFAULT NULL,
            house_no VARCHAR(30) DEFAULT NULL,
            street_name VARCHAR(40) NOT NULL,
            location VARCHAR(20) NOT NULL,
            pincode INT(11) NOT NULL,
            remarks VARCHAR(20) DEFAULT NULL,
            state VARCHAR(20) NOT NULL,
            city VARCHAR(20) NOT NULL,
            mob CHAR(10) NOT NULL,
            constituency INT(11) NOT NULL,
            assembly INT(11) NOT NULL,
            ward_no INT(11) NOT NULL,
            email VARCHAR(50) DEFAULT NULL,
            gender CHAR(1) NOT NULL,
            father_or_husband_name CHAR(40) NOT NULL,
            expiry DATE DEFAULT NULL,
            authenticated_initial VARCHAR(4) NOT NULL,
            PRIMARY KEY (voter_uid, aadhar_uid, mob)
        )
    ",
    "voter_database_temp" => "
        CREATE TABLE IF NOT EXISTS voter_database_temp (
            voter_uid VARCHAR(20) NOT NULL,
            aadhar_uid CHAR(12) NOT NULL,
            name VARCHAR(40) NOT NULL,
            dob DATE NOT NULL,
            house_no VARCHAR(10) NOT NULL,
            street_name VARCHAR(40) NOT NULL,
            location VARCHAR(20) NOT NULL,
            pincode INT(11) NOT NULL,
            remarks VARCHAR(20) DEFAULT NULL,
            state VARCHAR(20) NOT NULL,
            city VARCHAR(20) NOT NULL,
            mob CHAR(10) NOT NULL,
            constituency INT(11) NOT NULL,
            assembly INT(11) NOT NULL,
            ward_no INT(11) NOT NULL,
            email VARCHAR(50) DEFAULT NULL,
            gender CHAR(1) NOT NULL,
            father_or_husband_name CHAR(40) NOT NULL,
            expire DATE DEFAULT NULL,
            PRIMARY KEY (voter_uid, aadhar_uid, mob)
        )
    ",
    "candidate_database" => "
        CREATE TABLE IF NOT EXISTS candidate_database (
            voter_uid VARCHAR(30) NOT NULL,
            aadhar_uid CHAR(12) NOT NULL,
            name VARCHAR(40) NOT NULL,
            age INT(11) NOT NULL,
            house_no VARCHAR(10) NOT NULL,
            street_name VARCHAR(40) NOT NULL,
            location VARCHAR(20) NOT NULL,
            pincode INT(11) NOT NULL,
            remarks VARCHAR(20) DEFAULT NULL,
            state VARCHAR(20) NOT NULL,
            city VARCHAR(20) NOT NULL,
            mob CHAR(10) NOT NULL,
            constituency INT(11) NOT NULL,
            assembly INT(11) NOT NULL,
            ward_no INT(11) NOT NULL,
            email VARCHAR(50) DEFAULT NULL,
            gender CHAR(1) NOT NULL,
            father_or_husband_name CHAR(40) NOT NULL,
            expire DATE DEFAULT NULL,
            authenticated_initial VARCHAR(4) NOT NULL,
            election YEAR(4) NOT NULL,
            election_cons INT(11) NOT NULL,
            election_assembly INT(11) NOT NULL,
            election_ward INT(11) NOT NULL,
            party_name VARCHAR(30) NOT NULL,
            party_shortform VARCHAR(10) NOT NULL,
            logo VARCHAR(50) NOT NULL,
            PRIMARY KEY (voter_uid, aadhar_uid, mob)
        )
    ",
    "poll" => "
        CREATE TABLE IF NOT EXISTS poll (
            constituency INT(11) NOT NULL,
            assembly INT(11) NOT NULL,
            ward_no INT(11) NOT NULL,
            poll_no INT(11) DEFAULT 0,
            gender CHAR(1) NOT NULL
        )
    "
];

// Loop through tables
$errors = [];
foreach ($tables as $name => $sql) {
    $err = create_table($conn, $sql, $name);
    if ($err) $errors[] = $err;
}

if (count($errors) > 0) {
    $response['success'] = false;
    $response['message'] = implode(" | ", $errors);
} else {
    $response['success'] = true;
    $response['message'] = "Database and tables verified/created successfully.";
}

echo json_encode($response);
$conn->close();
