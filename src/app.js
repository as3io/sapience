const express = require('express');
const helmet = require('helmet');
const loadRouters = require('./routers');
const errorHandlers = require('./error-handlers');

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
