const ping = require('./ping');
const events = require('./events');

module.exports = (app) => {
  app.use('/ping', ping);
  app.use('/events', events);
};
