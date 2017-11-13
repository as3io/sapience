const compose = require('@stamp/it');
const httpError = require('http-errors');
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
    this.z = castAsDasherized(z) || undefined;
    this.b = castAsDasherized(b) || undefined;
    this.n = castAsDasherized(n) || undefined;
  },
  methods: {
    /**
     * Converts the namespace to a string.
     * Formatted as zone/base/name. Undefined or empty values are replaced with a `-`.
     * Given `{ n: undefined, b: foo, n: bar }` would return `-/foo/bar`.
     *
     * @return {string}
     */
    toString() {
      return [this.z || '-', this.b || '-', this.n || '-'].join('/');
    },

    /**
     * Validates the namespace.
     * At minimum, a `name` (`n`) must be specified
     *
     * @throws {httpError}
     */
    validate() {
      if (!this.n) throw httpError(422, 'Entity namespaces must contain at least the `name` property.');
    },
  },
  statics: {
    /**
     * Converts a stringified namsespace into an object literal.
     * Given`-/foo/bar` would return `{ n: undefined, b: foo, n: bar }`.
     * All non-string values of `v` will return undefined.
     *
     * @param {string} v The stringified namespace.
     * @returns {(string|undefined)}
     */
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
