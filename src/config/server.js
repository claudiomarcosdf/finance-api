const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cors = require('cors');
const queryParser = require('express-query-int');

const server = express();
const PORT = process.env.PORT;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(
  cors({
    origin: process.env.CORS,
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: [
      'Access-Control-Allow-Headers',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);

server.use(queryParser());

server.use(
  '/files',
  express.static(path.resolve(__dirname, '..', '..', 'tmp', 'uploads'))
);

server.listen(PORT, function () {
  console.log(`BACKEND is running on port ${PORT}.`);
});

module.exports = server;
