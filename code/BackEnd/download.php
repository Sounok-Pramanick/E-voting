<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$servername = "localhost";
$username = "root";
$password = "1234";
$dbname = "e_voting";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Map poll_no to party names
$partyOptions = [
    0 => "No Party Selected",
    1 => "All India Trinamool Congress",
    2 => "Bharatiya Janata Party",
    3 => "Indian National Congress",
    4 => "Communist Party of India",
    5 => "Bahujan Samaj Party",
    9 => "NOTA"
];

if ($action == "getConstituencies") {
    $sql = "SELECT DISTINCT constituency FROM voter_database ORDER BY constituency";
    $result = $conn->query($sql);
    $constituencies = [];
    while ($row = $result->fetch_assoc()) {
        $constituencies[] = $row;
    }
    echo json_encode($constituencies);
}

elseif ($action == "getAssemblies") {
    $constituency = intval($_GET['constituency']);
    $sql = "SELECT DISTINCT assembly FROM voter_database WHERE constituency=$constituency ORDER BY assembly";
    $result = $conn->query($sql);
    $assemblies = [];
    while ($row = $result->fetch_assoc()) {
        $assemblies[] = $row;
    }
    echo json_encode($assemblies);
}

elseif ($action == "download") {
    $constituency = intval($_GET['constituency']);
    $assembly = intval($_GET['assembly']);

    $filename = "election_data_{$constituency}_{$assembly}.csv";
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="'.$filename.'"');

    $output = fopen('php://output', 'w');

    // CSV header
    $header = [
        'constituency', 'assembly', 'ward_no'
    ];
    foreach ($partyOptions as $partyName) {
        $header[] = $partyName;
    }
    $header = array_merge($header, [
        'total_votes', 'margin', 'winner',
        'total_voter', 'male_voter', 'female_voter',
        'polled_vote', 'male_polled', 'female_polled', '%_of_vote'
    ]);
    fputcsv($output, $header);

    // Fetch all wards
    $wards_sql = "SELECT DISTINCT ward_no FROM voter_database WHERE constituency=$constituency AND assembly=$assembly ORDER BY ward_no";
    $wards_result = $conn->query($wards_sql);

    while ($ward_row = $wards_result->fetch_assoc()) {
        $ward_no = $ward_row['ward_no'];

        // Total voters
        $voters_sql = "SELECT COUNT(*) as total_voter,
                              SUM(gender='M') as male_voter,
                              SUM(gender='F') as female_voter
                       FROM voter_database
                       WHERE constituency=$constituency AND assembly=$assembly AND ward_no=$ward_no";
        $voters_res = $conn->query($voters_sql)->fetch_assoc();

        // Poll data
        $votes_sql = "SELECT poll_no, gender, COUNT(*) as votes
                      FROM poll
                      WHERE constituency=$constituency AND assembly=$assembly AND ward_no=$ward_no
                      GROUP BY poll_no, gender";
        $votes_result = $conn->query($votes_sql);

        // Initialize party votes
        $votes_by_party = [];
        foreach ($partyOptions as $id => $name) {
            $votes_by_party[$name] = 0;
        }

        $polled_vote = 0;
        $male_polled = 0;
        $female_polled = 0;

        while ($vote = $votes_result->fetch_assoc()) {
            $party = $partyOptions[$vote['poll_no']] ?? 'Unknown';
            $votes_by_party[$party] += $vote['votes'];

            $polled_vote += $vote['votes'];
            if ($vote['gender'] == 'M') $male_polled += $vote['votes'];
            if ($vote['gender'] == 'F') $female_polled += $vote['votes'];
        }

        // Determine winner and margin
        $winner = '';
        $margin = 0;
        arsort($votes_by_party);
        $party_names_sorted = array_keys($votes_by_party);
        if (!empty($party_names_sorted)) {
            $winner = $party_names_sorted[0];
            $margin = count($party_names_sorted) > 1 ? $votes_by_party[$party_names_sorted[0]] - $votes_by_party[$party_names_sorted[1]] : $votes_by_party[$party_names_sorted[0]];
        }

        // % of vote
        $percent_vote = $voters_res['total_voter'] ? round(($polled_vote / $voters_res['total_voter']) * 100, 2) : 0;

        // Prepare CSV row
        $row = [
            $constituency,
            $assembly,
            $ward_no
        ];
        foreach ($partyOptions as $id => $name) {
            $row[] = $votes_by_party[$name];
        }
        $row = array_merge($row, [
            $polled_vote, // total_votes
            $margin,
            $winner,
            $voters_res['total_voter'],
            $voters_res['male_voter'],
            $voters_res['female_voter'],
            $polled_vote,
            $male_polled,
            $female_polled,
            $percent_vote
        ]);

        fputcsv($output, $row);
    }

    fclose($output);
}

$conn->close();
?>
