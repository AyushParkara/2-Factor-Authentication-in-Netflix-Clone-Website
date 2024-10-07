const express = require('express');
const bodyParser = require('body-parser');
const otpAuth = require('./otpAuth.js');
const { sendOtpSms, otpStorage } = require('./sendOtpsms.js');
const cors = require('cors'); // Import CORS

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const secretKey = 'NyjjmYI9Lkr+9yy4Wj+9F97rVhBlL4YAmJLABCLR4Gw=';

// Route to handle OTP request for SMS
app.post('/request-sms-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).send('Phone number is missing.');
    }

    try {
        const hashedOTP = await sendOtpSms(phoneNumber);
        res.send('OTP sent successfully.');
    } catch (error) {
        console.error('Error in /request-sms-otp:', error);
        res.status(500).send('Error sending OTP.');
    }
});

// Route to handle OTP verification for SMS
app.post('/verify-sms-otp', (req, res) => {
    const { otp, phoneNumber } = req.body;

    if (!otp || !phoneNumber) {
        return res.status(400).send('OTP or phone number is missing.');
    }

    const storedHash = otpStorage[phoneNumber];
    console.log('Phone Number:', phoneNumber);
    console.log('Stored Hash:', storedHash);

    if (storedHash && otpAuth.validateOTP(otp, storedHash, secretKey)) {
        res.send('SMS OTP is valid! Authentication successful.');
    } else {
        res.send('Invalid OTP. Please try again.');
    }
});

app.listen(3002, () => {
    console.log('Server is running on port 3002 for SMS OTP verification');
});

