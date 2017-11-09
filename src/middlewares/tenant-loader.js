const httpError = require('http-errors');
const tenantStore = require('../services/tenant');
const { CLIENT_PARAM_NAME } = require('../constants');

module.exports = () => (req, res, next) => {
  const publicKey = req.query[CLIENT_PARAM_NAME.toLowerCase()] || req.get(CLIENT_PARAM_NAME);
  if (publicKey) {
    tenantStore.load(publicKey).then(({ tenant, db }) => {
      if (!tenant || !db) throw httpError(400, 'The provided client key is invalid.');
      res.locals.tenant = tenant;
      res.locals.db = db;
      next();
    }).catch(next);
  } else {
    next(httpError(400, 'No client key was included with the request.'));
  }
};
