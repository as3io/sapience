const Router = require('express').Router();
const { noCache } = require('helmet');
const httpError = require('http-errors');
const bodyParser = require('body-parser');
const UAParser = require('ua-parser-js');
const tenantLoader = require('../middlewares/tenant-loader');
const EventModel = require('../models/event');
const UserAgent = require('../models/user-agent');
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

/**
 * @todo Implement this.
 * @param {Error} error
 */
const logError = error => error;

const extractAction = (value) => {
  const parts = value.split('.');
  return { act: parts.shift(), ext: parts.join('.').toLowerCase() || 'json' };
};

const handleEvent = (req, res) => {
  // Determine the action and extension.
  const { act, ext } = extractAction(req.params.act);

  // Extract the event payload.
  const payload = req.method === 'GET' ? req.query : req.body;
  const { ent, usr } = payload;

  // Handle user agent.
  const userAgent = req.get('User-Agent');
  const agent = UserAgent(UAParser(userAgent));

  // Create the event.
  const event = EventModel({
    act,
    ent,
    usr,
    ua: agent.getId(),
  });

  // Determine if a bot.
  const bot = botDetector(userAgent);
  if (!bot.detected) {
    // Persist the event.
    // @todo Add a catch here. Should there always be a successful response?
    agent.save().catch(logError);
    event.save(res.locals.db).catch(logError);
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
