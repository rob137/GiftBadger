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

function runServer(port = PORT) {
	server = app.listen(port, () => {
		console.log(`Your app is listening on ${port}`);
	});	
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				return reject(err);
			}
			resolve();
		})
	});
}

if (require.main === module) {
	runServer();
}

module.exports = { app, runServer, closeServer };