// const { hash } = require('node-object-hash')({ alg: 'md5', enc: 'base64', coerce: false });
const compose = require('@stamp/it');
const { Binary } = require('mongodb');
const { DB_PREFIX } = require('../../constants');
const { createModel, hashObject } = require('../../utils');
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
    this.dev = createModel(device, Device); // This should undefine if empty.
    this.id = new Binary(hashObject(this), Binary.SUBTYPE_MD5);
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
    /**
     * Converts the event to database format.
     *
     * @returns {object}
     */
    toDb() {
      const obj = { ...this, _id: this.id };
      delete obj.id;
      return obj;
      // return prepareForMongo(obj);
    },
  },
});
