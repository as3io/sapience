const Router = require('express').Router();
const bodyParser = require('body-parser');

Router.use(bodyParser.json());

module.exports = Router;
