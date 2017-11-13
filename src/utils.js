const noCase = require('no-case');

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
 * Empty values will be returned as undefined.
 *
 * @param {string} v
 * @returns {(string|undefined)}
 */
exports.castAsString = (v) => {
  if (v === undefined || v === null || Number.isNaN(v)) return undefined;
  const cast = String(v).trim();
  return cast.length ? cast : undefined;
};

/**
 * Casts a value as a dasherized string.
 * Empty values will be returned as undefined.
 *
 * @param {string} v
 * @returns {(string|undefined)}
 */
exports.castAsDasherized = (v) => {
  const cast = this.castAsString(v);
  const val = cast ? noCase(cast, null, '-') : cast;
  return val || undefined;
};
