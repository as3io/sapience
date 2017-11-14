const { hash } = require('node-object-hash')({ alg: 'md5', enc: 'base64' });
const compose = require('@stamp/it');
const base64url = require('base64url');
const { DB_PREFIX } = require('../../constants');
const { createModel, prepareForMongo } = require('../../utils');
const Browser = require('./browser');
const Device = require('./device');
const Engine = require('./engine');
const mongodb = require('../../mongodb');
const OS = require('./os');

module.exports = compose({
  /**
   *
   */
  init({
    browser,
    engine,
    os,
    device,
  }) {
    this.br = createModel(browser, Browser);
    this.eng = createModel(engine, Engine);
    this.os = createModel(os, OS);
    this.dev = createModel(device, Device);
  },
  methods: {
    /**
     *
     */
    async save() {
      const coll = await mongodb.get('default').coll(DB_PREFIX, 'user-agents');
      const doc = this.toDb();
      return coll.updateOneAsync({ _id: doc._id }, { $setOnInsert: doc }, { upsert: true });
    },
    getId() {
      const prepped = prepareForMongo({ ...this });
      return base64url.fromBase64(hash(prepped));
    },
    /**
     * Converts the user agent to database format.
     *
     * @returns {object}
     */
    toDb() {
      const prepped = prepareForMongo({ ...this });
      const id = base64url.fromBase64(hash(prepped));
      return { ...prepped, _id: id };
    },
  },
});
