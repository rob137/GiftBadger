const express = require('express');
const app = express();
app.use(express.static('public'));
exports.PORT = process.env.PORT || 8080;