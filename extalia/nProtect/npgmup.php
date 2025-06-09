<?php

require_once "FastXor.php";

// Load DB credentials from environment
$dbHost = getenv("DB_HOST");
$dbUser = getenv("DB_USER");
$dbPass = getenv("DB_PASS");
$dbName = getenv("DB_NAME");

// Time and IP info
$dateToday = date("m.d.y");
$timeNow = date("H:i:s");
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN';

// Parse user & mode from query string
parse_str($_SERVER['QUERY_STRING'], $params);
$userEncoded = $params['user'] ?? null;
$isClient = isset($params['isClient']); // use ?isClient=1 to trigger

if (!$userEncoded) {
  exit("Missing user");
}

// Decode and convert encoding
// $user = base64_decode($userEncoded);
$user = iconv('UTF-8', 'CP1251//IGNORE', $userEncoded);

// Connect to DB
$conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);
if (!$conn) {
  logToFile("Database connection failed for $clientIp");
  exit("DB error");
}
mysqli_set_charset($conn, 'cp1251');

// Fetch key from DB securely
$stmt = $conn->prepare("SELECT id, ip, `key` FROM `nProtect` WHERE id = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
  echo "Bed Key ";
  logToFile("$dateToday $timeNow: $user ($clientIp) - Key not found");
  exit;
}

// Check for locked key
$key = $row['key'];
$dbIp = $row['ip'];

if ($key === '-') {
  logToFile("$dateToday $timeNow: Access to locked key $user from " . ($isClient ? 'client' : 'server') . " $clientIp", true);
  echo " ";
  exit;
}

// Server mode
if (!$isClient) {
  if ($dbIp !== '*' && $clientIp !== $dbIp) {
    echo " Error";
  } else {
    echo "Key=$key ";
    logToFile("$dateToday $timeNow $user ($clientIp) - Server key retrieved");
    exit;
  }
}

// Client mode
echo "z";
$body = "$key\n" . md5_file('sps/gGuard.des') . "\n";

// Generate random header
$pos = 2;
echo chr(ord('A') + $pos);
$keyChar = chr(65); // A
for ($i = 1; $i < $pos; $i++)
  echo chr(rand(65, 90));
echo $keyChar;
for ($i = $pos; $i < 10; $i++)
  echo chr(rand(65, 90));

// Encrypt and output data
$cipher = new FastXor($keyChar);
$pLines = file('nwindow.txt');
foreach ($pLines as $val) {
  $body .= $val . "\n";
}
echo $cipher->encrypt($body);
logToFile("$dateToday $timeNow $user ($clientIp) - Client key retrieved ");
echo " ";
exit;

// --- Logging function ---
function logToFile(string $message, bool $overwrite = false): void
{
  $logFile = "/tmp/sps.log"; // use /tmp or ensure write permissions
  $flags = $overwrite ? "w+" : "a+";
  if ($fh = @fopen($logFile, $flags)) {
    fwrite($fh, $message . "\n");
    fclose($fh);
  }
}
