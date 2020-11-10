const express = require('express');
const CustomerRouter = require('../api/service/customerService');

module.exports = function (server) {
  const api = express.Router();
  server.use('/api', api);

  //Rota customer
  CustomerRouter.register(api, '/customers');
};
