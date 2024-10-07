const crypto = require('crypto');

// Function to generate OTP hash
function generateOTP(secretKey, otp) {
    const hash = crypto.createHmac('sha256', secretKey)
        .update(otp)
        .digest('hex'); // Ensure 'hex' is used consistently
    console.log(`Generated OTP Hash: ${hash}`);
    return hash;
}

// Function to validate OTP
function validateOTP(inputOTP, storedHash, secretKey) {
    const inputHash = generateOTP(secretKey, inputOTP);
    console.log(`Input OTP: ${inputOTP}`);
    console.log(`Input Hash: ${inputHash}`);
    console.log(`Stored Hash: ${storedHash}`);
    return inputHash === storedHash;
}

module.exports = {
    generateOTP,
    validateOTP
};
