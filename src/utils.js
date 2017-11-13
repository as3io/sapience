const noCase = require('no-case');

exports.createModel = (v, Factory) => (v && typeof v === 'object' ? Factory(v) : undefined);

exports.castAsString = (v) => {
  if (v === undefined || v === null || Number.isNaN(v)) return undefined;
  const cast = String(v).trim();
  return cast.length ? cast : undefined;
};

exports.castAsDasherized = (v) => {
  const cast = this.castAsString(v);
  const val = cast ? noCase(cast, null, '-') : cast;
  return val || undefined;
};
