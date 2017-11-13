const noCase = require('no-case');
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
