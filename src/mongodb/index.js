const client = require('./client');

const clients = {};

module.exports = {
  use(name, { url, options, connect }) {
    if (!name) {
      throw new Error('The client name must be specified!');
    }
    if (clients[name]) {
      throw new Error(`Client ${name} already exists!`);
    }
    clients[name] = client({ url, options });
    if (connect) {
      clients[name].connect();
    }
    return this;
  },
  get(name) {
    if (!clients[name]) {
      throw new Error(`Client ${name} does not exist!`);
    }
    return clients[name];
  },
};
