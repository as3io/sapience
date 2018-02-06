const compose = require('@stamp/it');
const { isNil } = require('lodash/lang');

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
