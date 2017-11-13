const compose = require('@stamp/it');
const httpError = require('http-errors');
const Namespace = require('./namespace');
const { createModel, castAsString } = require('../utils');

module.exports = compose({
  /**
   *
   * @param {Object} opts
   * @param {string} opts.id The entity identifier. Will be stringified and trimmed.
   * @param {Object} opts.ns The entity namespace.
   */
  init({ id, ns }) {
    this.id = castAsString(id);
    const namespace = typeof ns === 'string' ? Namespace.fromString(ns) : ns;
    this.ns = createModel(namespace, Namespace);
  },
  methods: {
    validate() {
      if (!this.id) throw httpError(422, 'No entity identifier was found.');
      if (!this.ns) throw httpError(422, 'No entity namespace was found.');
      this.ns.validate();
    },
  },
});
