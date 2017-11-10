const compose = require('@stamp/it');
const { castAsDasherized } = require('../utils');

module.exports = compose({
  /**
   *
   * @param {Object} opts
   * @param {string} opts.z The namespace zone (tenant/org name).
   * @param {string} opts.b The namespace base (grouping name).
   * @param {string} opts.n The namespace name (model name).
   */
  init({ z, b, n }) {
    this.z = castAsDasherized(z);
    this.b = castAsDasherized(b);
    this.n = castAsDasherized(n);
  },
});
