'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { PORT, DATABASE_URL } = require('./config');

// For later:
// const { Recipient } = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let server;
let port = PORT;
server = app.listen(port, () => {
	console.log(`Your app is listening on ${port}`);
});