const httpError = require('http-errors');
const { APP_PARAM_NAME } = require('../constants');

module.exports = () => (req, res, next) => {
  const appId = req.query[APP_PARAM_NAME.toLowerCase()] || req.get(APP_PARAM_NAME);
  if (appId) {
    // @todo Query for the proper tenant.
    res.locals.tenant = {
      id: appId,
      name: 'Test Tenant',
    };
  } else {
    next(httpError(400, 'No application ID was included with the request.'));
  }
};
