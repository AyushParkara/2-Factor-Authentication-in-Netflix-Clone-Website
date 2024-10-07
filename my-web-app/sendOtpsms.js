// sendOtpSms.js

const twilio = require('twilio');
const otpGenerator = require('./otpgen.js');
const otpAuth = require('./otpAuth.js');

// Twilio credentials (hardcoded)
const accountSid = ' '; // Replace with your Twilio Account SID
const authToken = ' ';   // Replace with your Twilio Auth Token
const fromPhoneNumber = '+17082608124'; // Replace with your Twilio phone number

// Secret key for OTP hashing (hardcoded)
const secretKey = 'NyjjmYI9Lkr+9yy4Wj+9F97rVhBlL4YAmJLABCLR4Gw='; // Replace with your custom secret key

// In-memory storage for OTP hash
const otpStorage = {};

// Function to send OTP via SMS using Twilio
async function sendOtpSms(toPhoneNumber) {
    // Generate OTP
    const otp = otpGenerator();
    otpStorage[toPhoneNumber] = otpAuth.generateOTP(secretKey, otp); // Store the hash for the specific phone number

    // Configure Twilio client
    const client = twilio(accountSid, authToken);

    // Send SMS
    try {
        const message = await client.messages.create({
            body: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
            from: fromPhoneNumber,
            to: toPhoneNumber
        });
        console.log('SMS sent: ' + message.sid);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }

    return otpStorage[toPhoneNumber];
}

// Example usage
(async () => {
    const recipientPhoneNumber = '+917405350013'; // Replace with the user's phone number
    const hashedOTP = await sendOtpSms(recipientPhoneNumber);
    console.log('Stored Hashed OTP:', otpStorage[recipientPhoneNumber]);
})();

module.exports = { sendOtpSms, otpStorage };

