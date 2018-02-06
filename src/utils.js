const noCase = require('no-case');
const crypto = require('crypto');
const _ = require('lodash/lang');
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

exports.hashObject = (obj, { algo = 'md5', digest = 'hex' } = {}) => {
  const { stringify, parse } = JSON;
  const sort = o => Object.keys(o).sort().reduce((n, k) => {
    const v = o[k] && typeof o[k] === 'object' ? sort(o[k]) : o[k];
    return { ...n, [k]: v };
  }, {});
  const str = stringify(sort(parse(stringify(obj))));
  return crypto.createHash(algo).update(str).digest();
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
  .filter(key => !_.isNil(obj[key]) && !_.isNaN(obj[key]))
  .reduce((prep, key) => {
    const v = canPrepare(obj[key]) ? this.prepareForMongo(obj[key]) : obj[key];
    return typeof v === 'object' && _.isEmpty(v) ? prep : { ...prep, [key]: v };
  }, {});

