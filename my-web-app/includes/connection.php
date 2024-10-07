<?php
$servername = "localhost";
$username = "root"; // Default XAMPP MySQL username
$password = ""; // Default is empty for root in XAMPP
$dbname = "project"; // Name of your database

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
