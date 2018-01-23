'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const { UserData } = require('./models');

const app = express();
app.use(bodyParser.json());

app.use(express.static('public'));

let server;

// -------------------- GET ----------------------
app.get('/users', (req, res) => {
	console.log('GET request received');
	UserData
		.find()
		.then(userData => {
			res.json({
				userData: userData.map( 
					(user) => user.serialize())
			})
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error'});
		});
});

app.get('/users/:id', (req, res) => {
	console.log('GET request received.');
	UserData
		.findById(req.params.id)
		.then(user => res.json(user.serialize()))
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Internal server error '})
		});
});

// --------------------- POST ----------------------
// --------------------- PUT -----------------------
// -------------------- DELETE ---------------------

// --------------- RUN/CLOSE SERVER  -----------------

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
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
	runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };