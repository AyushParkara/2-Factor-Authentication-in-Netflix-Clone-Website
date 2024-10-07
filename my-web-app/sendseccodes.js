const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const seccode = require('./seccode'); // Ensure this is the correct path to your seccode file
const cors = require('cors');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up OAuth2 client
const CLIENT_ID = '.apps.googleusercontent.com'; // Replace with your Client ID
const CLIENT_SECRET = ''; // Replace with your Client Secret
const REDIRECT_URI = 'http://localhost:3010/oauth2callback'; // Replace with your Redirect URI
const REFRESH_TOKEN = ''; // Replace with your Refresh Token

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to send security codes via email using Google API
async function sendSecurityCodes(recipientEmail) {
    const codes = seccode.generateCodes(5);

    try {
        // Get the access token
        const accessToken = await oAuth2Client.getAccessToken();
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        // Set up Gmail API client
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        // Email content
        const mailOptions = {
            from: 'ayushkali97@outlook.com', // Your Gmail address or Outlook email
            to: recipientEmail,
            subject: 'Your Security Codes',
            text: `Your security codes are:\n\n${codes.join('\n')}\n\nThese codes are valid for one-time use.`
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
}

// Route to handle registration form submission
app.post('/send-codes', async (req, res) => {
    const { email } = req.body; // Get the email from the form submission

    if (!email) {
        return res.status(400).send('Email is required');
    }

    await sendSecurityCodes(email);
    res.send('Security codes sent to your email!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

