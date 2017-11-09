const MongoDb = require('mongodb');
const Promise = require('bluebird');
const compose = require('stampit');
const p = require('../privates')();

Promise.promisifyAll(MongoDb);

function connect(url, options) {
  return MongoDb.MongoClient.connectAsync(url, options);
}

module.exports = compose({
  init({ url, options }) {
    p(this).instance = undefined;
    p(this).promise = undefined;
    p(this).connected = false;

    this.url = url;
    this.options = options;
  },
  methods: {
    db(name, options) {
      return this.connect().then(db => db.db(name, options));
    },
    coll(dbName, collName, options) {
      return this.db(dbName).then(db => db.collectionAsync(collName, options));
    },
    connect() {
      if (!p(this).connected) {
        if (!p(this).promise) {
          p(this).promise = connect(this.url, this.options).then((db) => {
            p(this).instance = db;
            p(this).connected = true;
            process.stdout.write(`Successful MongoDB connection to '${this.url}'\n`);
            return db;
          });
        }
        return p(this).promise;
      }
      return Promise.resolve(p(this).instance);
    },
  },
});
