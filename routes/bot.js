const express = require('express');
const router = express.Router();

const func = require('../app');

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

// Creates the endpoint for our webhook 
router.post('/webhook', (req, res) => {
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(entry => {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            entry.messaging.forEach(messagingEvent => {
                if (messagingEvent.message) {
                    func.receivedMessage(messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
            // let webhook_event = entry.messaging[0];
            // console.log(webhook_event);
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
})

module.exports = router;