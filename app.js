const apiai = require('apiai');
const express = require('express');
const bodyParser = require("body-parser");
const uuid = require("uuid");
const axios = require('axios');

//.ENV setup
require('dotenv').config();

// Server setup
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is starting at", port));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// Process application/json
app.use(bodyParser.json());

// Route setup
const router = require('./routes/bot');
app.use('/', router);
