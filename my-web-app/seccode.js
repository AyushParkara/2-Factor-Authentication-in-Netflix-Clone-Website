const generateCodes = (numCodes) => {
    const codes = [];
    
    for (let i = 0; i < numCodes; i++) {
        const code = generateRandomCode(8).toUpperCase();
        codes.push(code);
    }
    
    return codes;
};

// Function to generate a random alphanumeric code of specified length
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

// If this script is run directly, generate 5 codes and log them
if (require.main === module) {
    const codes = generateCodes(5);
    console.log(JSON.stringify(codes));  // Output the codes as JSON
}

// Export the function for use in other files
module.exports = { generateCodes };