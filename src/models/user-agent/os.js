const compose = require('@stamp/it');
const Nameable = require('./nameable');
const Versionable = require('./versionable');

module.exports = compose(Nameable, Versionable);
