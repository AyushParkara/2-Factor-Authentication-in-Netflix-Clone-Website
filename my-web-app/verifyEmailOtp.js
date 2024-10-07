const express = require('express');
const bodyParser = require('body-parser');
const otpAuth = require('./otpAuth.js');
const { sendOtpEmail, otpStorage } = require('./sendOtpEmail.js'); // Import OTP storage
const cors = require('cors'); // Import CORS

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Secret key for OTP hashing (should be the same as used during OTP generation)
const secretKey = 'NyjjmYI9Lkr+9yy4Wj+9F97rVhBlL4YAmJLABCLR4Gw='; // Replace with your custom secret key

// Route to handle OTP request for email
app.post('/request-email-otp', async (req, res) => {
    console.log('Received OTP request');
    const email = req.body.email; // Retrieve email from request body

    try {
        const hashedOTP = await sendOtpEmail(email);
        console.log('OTP sent successfully');
        console.log('Stored Hashed OTP for email:', email, otpStorage[email]); // Check OTP storage
        res.send('OTP has been sent to your email.');
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).send('Failed to send OTP.');
    }
});

// Route to handle OTP verification for email
app.post('/verify-email-otp', (req, res) => {
    const { email, inputOTP } = req.body;

    // Retrieve the stored hash for the email
    const storedHash = otpStorage[email];
    console.log('Email for verification:', email);
    console.log('Stored Hash for verification:', storedHash);

    if (storedHash && otpAuth.validateOTP(inputOTP, storedHash, secretKey)) {
        res.send('Email OTP is valid! Authentication successful.');
    } else {
        res.send('Invalid OTP. Please try again.');
    }
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001 for email OTP requests');
});

