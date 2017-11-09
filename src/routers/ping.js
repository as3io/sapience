const Router = require('express').Router();

Router.route('/').get((req, res) => {
  res.json({ pong: true });
});

module.exports = Router;
