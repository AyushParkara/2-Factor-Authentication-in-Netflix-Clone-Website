// verifyOtp.js

const express = require('express');
const bodyParser = require('body-parser');
const otpAuth = require('./otpAuth.js');
const { otpStorage: emailOtpStorage } = require('./sendOtpEmail.js'); // Import the shared OTP storage for email
const { otpStorage: smsOtpStorage } = require('./sendOtpsms.js'); // Import the shared OTP storage for SMS

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Secret key for OTP hashing (should be the same as used during OTP generation)
const secretKey = 'NyjjmYI9Lkr+9yy4Wj+9F97rVhBlL4YAmJLABCLR4Gw='; // Replace with your custom secret key

// Route to handle OTP verification
app.post('/verify-otp', (req, res) => {
    const inputOTP = req.body.otp;
    const contact = req.body.contact; // Assume the user provides their email or phone number

    // Determine if the contact is an email or phone number and retrieve the stored hash
    const storedHash = contact.includes('@') ? emailOtpStorage[contact] : smsOtpStorage[contact];

    // Debugging: Print the stored hash
    console.log('Stored Hash:', storedHash);

    if (storedHash && otpAuth.validateOTP(inputOTP, storedHash, secretKey)) {
        res.send('OTP is valid! Authentication successful.');
    } else {
        res.send('Invalid OTP. Please try again.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

