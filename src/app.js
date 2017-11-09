const express = require('express');
const helmet = require('helmet');
const loadRouters = require('./routers');
const errorHandlers = require('./error-handlers');
const mongodb = require('./mongodb');
const pkg = require('../package.json');

// Connect to database.
mongodb.use('default', { url: 'mongodb://localhost:27017/sapience', options: { w: 0, j: false, appname: pkg.name }, connect: true });

const app = express();

// Global middlewares.
app.use(helmet());

// Load routers.
loadRouters(app);
errorHandlers(app);

// Run the app
const port = process.env.PORT || 8101;
app.listen(port);
process.stdout.write(`Sapience server listening on port ${port}\n`);
