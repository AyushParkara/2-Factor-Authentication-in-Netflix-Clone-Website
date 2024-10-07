<?php
// Start session (optional, if you want to use session management)
session_start();

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form input
    $uname = $_POST['username'];
    $pwd = $_POST['password'];
    $confirmPwd = $_POST['confirmPassword'];

    // Check if passwords match
    if ($pwd !== $confirmPwd) {
        // If passwords don't match, redirect back to the form with an error message
        echo "<script>alert('Passwords do not match!'); window.location.href='frgpwd.html';</script>";
        exit();
    }

    // Use password hashing for better security (optional)
    // $hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);

    // Update the password in the login table for the given username
    $stmt = $conn->prepare("UPDATE login SET password = ? WHERE username = ?");
    $stmt->bind_param("ss", $pwd, $uname); // bind password and username

    // Execute the query and check if the update was successful
    if ($stmt->execute()) {
        // If successful, redirect to a success page (or site.html)
        echo "<script>alert('Password successfully updated!'); window.location.href='site.html';</script>";
    } else {
        // If failed, show an error message
        echo "<script>alert('Error updating password.'); window.location.href='frgpwd.html';</script>";
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
}
?>
