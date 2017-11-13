const compose = require('@stamp/it');
const { DB_PREFIX } = require('../constants');
const mongodb = require('../mongodb');

const factory = compose({
  methods: {
    async findByKey(publicKey) {
      const coll = await mongodb.get('default').coll(DB_PREFIX, 'clients');
      return coll.findOneAsync({ publicKey });
    },
    async load(publicKey) {
      const tenant = await this.findByKey(publicKey);
      const db = (tenant) ? await mongodb.get('default').db(`${DB_PREFIX}-${tenant.namespace}`) : null;
      return { tenant, db };
    },
  },
});

module.exports = factory();
