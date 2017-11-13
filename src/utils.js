const noCase = require('no-case');
const { ObjectID } = require('mongodb');
const { APP_NAME } = require('./constants');

/**
 * Creates a namespaced header value for this application.
 *
 * @param {string} header The name of the header.
 * @return {string} The namespaced header value.
 */
exports.createAppHeader = header => `X-${APP_NAME}-${header}`;

/**
 * Casts a model object from the provided object and factory.
 * Non-object values will be return as undefined.
 *
 * @param {object} v The object-literal value.
 * @param {Factory} Factory The model factory.
 * @returns {(Object|undefined)}
 */
exports.createModel = (v, Factory) => (v && typeof v === 'object' ? Factory(v) : undefined);

/**
 * Casts a value as a string.
 *
 * @param {*} v
 * @returns {string}
 */
exports.castAsString = (v) => {
  if (v === undefined || v === null || Number.isNaN(v)) return '';
  return String(v).trim();
};

/**
 * Casts a value as a dasherized string.
 *
 * @param {*} v
 * @returns {string}
 */
exports.castAsDasherized = (v) => {
  const cast = this.castAsString(v);
  return cast.length ? noCase(cast, null, '-') : cast;
};

/**
 * Casts a value as a boolean.
 *
 * @param {*} v
 * @returns {boolean}
 */
exports.castAsBoolean = (v) => {
  if (v === '0' || v === 'false') return false;
  return Boolean(v);
};

const canPrepare = v => typeof v === 'object' && !(v instanceof Date) && !(v instanceof ObjectID);
/**
 * Removes `null` and `undefined` values from an object.
 * For use when inserting documents into MongoDB.
 * Will leave Mongo objects as is.
 *
 * @param {object} obj
 * @returns {object}
 */
exports.prepareForMongo = obj => Object
  .keys(obj)
  .filter(key => obj[key] !== null && obj[key] !== undefined)
  .reduce((prep, key) => (canPrepare(obj[key])
    ? { ...prep, [key]: this.prepareForMongo(obj[key]) }
    : { ...prep, [key]: obj[key] }), {});
