<?php
// Include the database connection file
$servername = "localhost";
$username = "root"; // Default XAMPP MySQL username
$password = ""; // Default is empty for root in XAMPP
$dbname = "project"; // Replace with your database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to generate codes using Node.js
function generateCodes() {
    $output = [];
    $return_var = 0;

    // Adjust the path to your Node.js and seccode.js files accordingly
    exec("node C:\\xampp\\htdocs\\my-web-app\\seccode.js 2>&1", $output, $return_var); // Capture standard error

    if ($return_var !== 0) {
        echo "Command output: " . implode("\n", $output);
        throw new Exception("Error generating codes");
    }

    return json_decode(implode("", $output), true);
}

// Function to store codes in the database for the given username
function storeCodesInDB($conn, $username) {
    $codes = generateCodes(); // Generate codes using the JS file

    foreach ($codes as $code) {
        $sql = "INSERT INTO security_codes (username, code) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("ss", $username, $code);
            $stmt->execute();
            $stmt->close();
        } else {
            echo "Error inserting security code: " . $conn->error;
        }
    }
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and sanitize form data
    $fullname = htmlspecialchars($_POST['fullname']);
    $username = htmlspecialchars($_POST['username']);
    $email = htmlspecialchars($_POST['email']);
    $pnumber = htmlspecialchars($_POST['pnumber']);
    $password = htmlspecialchars($_POST['password']);
    $conpassword = htmlspecialchars($_POST['conpassword']);

    // Validate phone number (must be 10 digits)
    if (!preg_match('/^\d{10}$/', $pnumber)) {
        echo "<script>
                alert('Please enter a valid 10-digit phone number.');
                window.location.href = 'regi.html';
              </script>";
        exit();
    }

    // Validate if password and confirm password are the same
    if ($password != $conpassword) {
        echo "<script>
                alert('Passwords do not match!');
                window.location.href = 'regi.html';
              </script>";
        exit();
    }

    // Hash the password before storing it in the database
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare the SQL query to insert data into the login table
    $sql = "INSERT INTO login (fullname, username, email, pnumber, password)
            VALUES (?, ?, ?, ?, ?)";

    if ($stmt = $conn->prepare($sql)) { 
        // Bind the parameters
        $stmt->bind_param("sssis", $fullname, $username, $email, $pnumber, $hashed_password);

        // Execute the query
        if ($stmt->execute()) {
            // If user is successfully registered, generate and store security codes
            storeCodesInDB($conn, $username);
            
            // Redirect to site.html upon successful registration
            header("Location: site.html");
            exit();
        } else {
            echo "Error: " . $stmt->error;
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "Error preparing statement: " . $conn->error;
    }
}

// Close the connection
$conn->close();
?>