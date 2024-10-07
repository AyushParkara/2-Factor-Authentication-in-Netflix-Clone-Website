<?php
// Start session to store user data
session_start();

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

// Create connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check for a database connection error
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form input
    $uname = $_POST['username'];
    $pwd = $_POST['password'];

    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM login WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $uname, $pwd); // bind the username and password

    // Execute the query
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the user exists
    if ($result->num_rows > 0) {
        // User is found, store user information in session
        $_SESSION['username'] = $uname;

        // Redirect to 2FA page
        header("Location: 2fa.html");
        exit();
    } else {
        // Invalid credentials, redirect back to the login form with an error message
        echo "<script>alert('Invalid Username or Password!'); window.location.href='form.htm';</script>";
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
}
?>
