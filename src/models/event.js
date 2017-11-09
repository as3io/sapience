const compose = require('stampit');

module.exports = compose({
  init({ action }) {
    this.action = action;
  },
});
