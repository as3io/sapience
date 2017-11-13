const Router = require('express').Router();
const { noCache } = require('helmet');
const httpError = require('http-errors');
const bodyParser = require('body-parser');
const tenantLoader = require('../middlewares/tenant-loader');
const EventModel = require('../models/event');
const botDetector = require('../services/bot-detector');
const { createAppHeader, castAsBoolean } = require('../utils');

const emptyGif = Buffer.from('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64');

Router.use(noCache());
Router.use(bodyParser.json());
Router.use(tenantLoader());

Router.use((req, res, next) => {
  res.locals.debug = castAsBoolean(req.get(createAppHeader('Debug')));
  next();
});

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

  // Create the event.
  const event = EventModel({ act, ent, usr });

  // Determine if the event was initiated by a bot.
  const bot = botDetector(req.get('User-Agent'));
  if (!bot.detected) {
    // Persist the event.
    // @todo Add a catch here. Should the response only be handled on success?
    event.save(res.locals.db);
  } else {
    // Log the bot activity?
  }

  // Send the response.
  const response = res.locals.debug ? event : { id: event.id };
  res.status(201);
  switch (ext) {
    case 'json':
      res.json(response);
      break;
    case 'gif':
      res.set('Content-Type', 'image/gif');
      res.set(createAppHeader('Event-Data'), JSON.stringify(response));
      res.send(emptyGif);
      break;
    default:
      throw httpError(406, 'Only `json` and `gif` responses are supported.');
  }
  // Handle post-process tasks.
};

Router.route('/:act').post(handleEvent).get(handleEvent);

module.exports = Router;
