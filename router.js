const express = require('express');
const usersRouter = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { UserData } = require('./models');

// -------------------- GET ----------------------
usersRouter.get('/', (req, res) => {
  console.log('GET request received');
  UserData
    .find()
    .then((userData) => {
      res.json({
        userData: userData.map(user => user.serialize()),
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

usersRouter.get('/:email', (req, res) => {
  console.log('GET request received.');
  UserData
    .findOne({ email: req.params.email })
    .then((user) => { res.json(user.serialize()); })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error ' });
    });
});


// --------------------- POST ----------------------
usersRouter.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['firstName', 'email'];
  requiredFields.forEach((requiredField) => {
    if (!(requiredField in req.body)) {
      const message = `missing ${requiredField} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
    return false;
  });
  UserData
    .create({
      firstName: req.body.firstName,
      email: req.body.email,
    })
    .then(console.log('Creating a new user profile...'))
    .then(user => res.status(201).json(user.serialize()))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error ' });
    });
});


// --------------------- PUT -----------------------
usersRouter.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match',
    });
  }

  const updated = {};
  const updateableFields = ['budget', 'giftLists'];
  updateableFields.forEach((field) => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  UserData
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then((updatedUser) => {
      console.log(updatedUser);
      res.json(updatedUser.serialize()).status(200).end();
    })
    .catch(() => {
      res.status(500).json({ message: 'Something went wrong' });
    });
});

// -------------------- DELETE ---------------------
usersRouter.delete('/:id', (req, res) => {
  UserData
    .findByIdAndRemove(req.params.id)
    .then(console.log('Deleting a user profile'))
    .then(() => res.status(204).end())
    .catch(() => res.status(500).json({ message: 'Intenal server error ' }));
});


module.exports = usersRouter;
