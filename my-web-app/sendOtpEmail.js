const { google } = require('googleapis');
const otpgen = require('./otpgen.js');
const otpAuth = require('./otpAuth.js');

// Set up OAuth2 client
const CLIENT_ID = '.apps.googleusercontent.com'; // Replace with your Client ID
const CLIENT_SECRET = ' '; // Replace with your Client Secret
const REDIRECT_URI = 'http://localhost:3010/oauth2callback'; // Replace with your Redirect URI
const REFRESH_TOKEN = ''; // Replace with your Refresh Token

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// In-memory storage for OTP hash and email
const otpStorage = {};

// Secret key for OTP hashing
const secretKey = 'NyjjmYI9Lkr+9yy4Wj+9F97rVhBlL4YAmJLABCLR4Gw='; // Replace with your custom secret key

// Function to send OTP via email using Google API
async function sendOtpEmail(recipientEmail) {
    // Generate OTP
    const otp = otpgen();
    const hashedOTP = otpAuth.generateOTP(secretKey, otp); // Use secretKey here

    // Store the email and hashed OTP
    otpStorage[recipientEmail] = hashedOTP;

    try {
        // Set up Gmail API client
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        // Email content
        const mailOptions = {
            from: 'ayushkali97@outlook.com', // Your Gmail address
            to: recipientEmail, // Use the dynamic recipientEmail
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
        };

        // Send email
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: Buffer.from(`From: ${mailOptions.from}\nTo: ${mailOptions.to}\nSubject: ${mailOptions.subject}\n\n${mailOptions.text}`)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, ''), // Remove padding
            },
        });
        
        console.log('Email sent: ', res.data);
    } catch (error) {
        console.error('Error sending email:', error);
    }

    return hashedOTP;
}

// Export the function and OTP storage
module.exports = { sendOtpEmail, otpStorage };

