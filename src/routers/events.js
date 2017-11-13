const Router = require('express').Router();
const bodyParser = require('body-parser');
const tenantLoader = require('../middlewares/tenant-loader');
const EventModel = require('../models/event');

Router.use(bodyParser.json());
Router.use(tenantLoader());

const createEvent = (params, body) => {
  const { act } = params;
  const { ent, usr } = body;
  return EventModel({ act, ent, usr });
};

Router.route('/:act')
  .post((req, res) => {
    res.json(createEvent(req.params, req.body));
  })
  .get((req, res) => {
    res.json(createEvent(req.params, req.query));
  });

module.exports = Router;
