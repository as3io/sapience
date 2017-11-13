const compose = require('@stamp/it');
const { ObjectID } = require('mongodb');
const Entity = require('./entity');
const { createModel, castAsString } = require('../utils');

module.exports = compose({
  /**
   *
   * @param {Object} opts
   * @param {string} opts.act The event action, such as `view` or `click`.
   * @param {Object} opts.ent The entity object.
   * @param {Date} opts.d The event date.
   * @param {Object} opts.usr The event user.
   */
  init({
    act,
    ent,
    d,
    usr,
  }) {
    this.id = new ObjectID();
    this.act = castAsString(act).toLowerCase();
    this.d = d instanceof Date ? d : new Date();
    this.ent = createModel(ent, Entity);
    this.usr = createModel(usr, Entity);
  },
});
