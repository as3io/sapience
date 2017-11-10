const Router = require('express').Router();
const bodyParser = require('body-parser');
const tenantLoader = require('../middlewares/tenant-loader');
const EventModel = require('../models/event');

Router.use(bodyParser.json());
Router.use(tenantLoader());

Router.route('/:act').post((req, res) => {
  const { act } = req.params;
  const { ent, usr } = req.body;

  const event = EventModel({ act, ent, usr });
  res.json(event);
});

module.exports = Router;
