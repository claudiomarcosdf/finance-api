const express = require('express');
const auth = require('./auth');
const CustomerRouter = require('../api/service/customerService');

module.exports = function (server) {
  /* Rotas protegidas por Token JWT */
  const protectedApi = express.Router();
  server.use('/api', protectedApi);
  protectedApi.use(auth);

  //Rota customer
  CustomerRouter.register(protectedApi, '/clientes');

  /* Rotas abertas */
  const openApi = express.Router();
  server.use('/oapi', openApi);

  const AuthService = require('../api/service/authService');
  openApi.post('/login', AuthService.login);
  openApi.post('/signup', AuthService.signup);
  openApi.post('/validateToken', AuthService.validateToken);
};
