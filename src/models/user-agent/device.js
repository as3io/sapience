const compose = require('@stamp/it');

module.exports = compose({
  /**
   *
   */
  init({ model, type, vendor }) {
    this.m = model;
    this.t = type;
    this.v = vendor;
  },
});
