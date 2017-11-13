const Router = require('express').Router();
const { noCache } = require('helmet');
const httpError = require('http-errors');
const bodyParser = require('body-parser');
const tenantLoader = require('../middlewares/tenant-loader');
const EventModel = require('../models/event');

const emptyGif = Buffer.from('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');

Router.use(noCache());
Router.use(bodyParser.json());
Router.use(tenantLoader());

const extractAction = (value) => {
  const parts = value.split('.');
  return { act: parts.shift(), ext: parts.join('.') || 'json' };
};

const handleEvent = (req, res) => {
  // Determine the action and extension.
  const { act, ext } = extractAction(req.params.act);

  // Extract the event payload.
  const payload = req.method === 'GET' ? req.query : req.body;
  const { ent, usr } = payload;

  // Create the event and persist.
  const event = EventModel({ act, ent, usr });
  event.validate();

  switch (ext) {
    case 'json':
      return res.json(event);
    case 'gif':
      res.set('Content-Type', 'image/gif');
      return res.send(emptyGif);
    default:
      throw httpError(406, 'Only `json` and `gif` responses are supported.');
  }
};

Router.route('/:act').post(handleEvent).get(handleEvent);

module.exports = Router;
