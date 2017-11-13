const compose = require('@stamp/it');
const { castAsDasherized } = require('../utils');

const { assign } = Object;

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
  methods: {
    toString() {
      return [this.z || '-', this.b || '-', this.n || '-'].join('/');
    },
  },
  statics: {
    fromString(v) {
      const map = { 0: 'z', 1: 'b', 2: 'n' };
      if (typeof v === 'string') {
        return v.split('/').reduce((obj, val, idx) => {
          const key = map[idx];
          if (key) assign(obj, { [key]: val });
          return obj;
        }, {});
      }
      return undefined;
    },
  },
});
