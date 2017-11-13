const compose = require('@stamp/it');
const httpError = require('http-errors');
const { ObjectID } = require('mongodb');
const Entity = require('./entity');
const { createModel, castAsString, prepareForMongo } = require('../utils');

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
    this.act = castAsString(act).toLowerCase() || undefined;
    this.d = d instanceof Date ? d : new Date();
    this.ent = createModel(ent, Entity);
    this.usr = createModel(usr, Entity);
  },
  methods: {
    /**
     * Saves the event to the database.
     *
     * @param {*} db
     * @returns {Promise}
     */
    save(db) {
      this.validate();
      return db.collection('events').insertOne(this.toDb());
    },

    /**
     * Converts the event to database format.
     *
     * @returns {object}
     */
    toDb() {
      const obj = { ...this, _id: this.id };
      delete obj.id;
      return prepareForMongo(obj);
    },

    /**
     * Validates the event.
     * Requires an identifier (`id`), an action (`act`), a date (`d`) and a valid entity (`ent`).
     * If a user (`usr`) is present, it must also be valid.
     *
     * @throws {httpError}
     */
    validate() {
      if (!this.id) throw httpError(422, 'No id was assigned to the event.');
      if (!this.act) throw httpError(422, 'No event action was provided.');
      if (!(this.d instanceof Date)) throw httpError(422, 'No event date was specified.');
      if (!this.ent) throw httpError(422, 'No event entity was specified.');
      this.ent.validate();
      if (this.usr) this.usr.validate();
    },
  },
});
