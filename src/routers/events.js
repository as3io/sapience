const Router = require('express').Router();
const bodyParser = require('body-parser');
const tenantLoader = require('../middlewares/tenant-loader');
const EventModel = require('../models/event');

Router.use(bodyParser.json());
Router.use(tenantLoader());

Router.route('/:action').post((req, res) => {
  const { action } = req.params;
  const { entity, user } = req.body;

  const event = EventModel({ action, entity, user });
  res.json(event);
});

module.exports = Router;
