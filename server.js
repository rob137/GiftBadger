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

app.get('/users/:username', (req, res) => {
	console.log('GET request received.');
	UserData
		.findOne({"username": req.params.username})
		.then(user => {console.log(user);res.json(user.serialize())})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: 'Internal server error '})
		});
});





// --------------------- POST ----------------------
app.post('/users', (req, res) => {
	const requiredFields = ['username', 'firstName', 'email'];
	for (let num in requiredFields) {
		const field = requiredFields[num];
		if(!(field in req.body)) {
			const message = `missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	UserData
		.create({
			username: req.body.username,
			firstName: req.body.firstName,
			email: req.body.email
		})
		.then(console.log('Creating a new user profile...'))
		.then(user => res.status(201).json(user.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({ message: 'Internal server error '});
		})
})




// --------------------- PUT -----------------------
app.put('/users/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id values must match'
		});
	}

	const updated = {};
	const updateableFields = ['budget', 'giftLists'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	})

	UserData
		.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
		.then(updatedUser => {
			console.log(updatedUser);
			res.json(updatedUser.serialize()).status(204).end()
		})
		.catch(err => res.status(500).json({ message: 'Something went wrong' }))
})





// -------------------- DELETE ---------------------
app.delete('/users/:id', (req, res) => {
	UserData
		.findByIdAndRemove(req.params.id)
		.then(console.log('Deleting a user profile'))
		.then(user => res.status(204).end())
		.catch(err => res.status(500).json({ message: 'Intenal server error '}));
})





// --------------- RUN/CLOSE SERVER  -----------------

let server;

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