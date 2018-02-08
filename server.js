const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const morgan = require('morgan');

const { PORT, DATABASE_URL } = require('./config');

const express = require('express');
const app = express();

const usersRouter = require('./router.js')
app.use(morgan('combined'));
app.use('/users', usersRouter);
app.use(express.static('public'));

// --------------- RUN/CLOSE SERVER  -----------------
let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', () => {
          mongoose.disconnect();
          reject(err);
        });
      return false;
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close((err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
