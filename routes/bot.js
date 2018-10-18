const express = require('express');
const router = express.Router();

require('dotenv').config();

router.get('/', (req, res) => {
    res.send("Hello world, I am a chat bot");
});

// Adds support for GET requests to our webhook
router.get('/webhook', (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
  
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
            // Responds with the challenge token from the request
            console.log('WEBHOOK VERIFIED');
            res.status(200).send(challenge);
        } else {

            // Responds with '403 Forbidden' if verify tokens do not match
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);      
        }
    }
});

module.exports = router;