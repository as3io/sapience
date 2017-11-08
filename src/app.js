const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

// Global middlewares.
app.use(helmet());
app.use(bodyParser.json());

// Basic ping/pong endpoint (health check).
app.get('/ping', (req, res) => {
  res.json({ pong: true });
});

// Run the app
const port = process.env.PORT || 8101;
app.listen(port);
process.stdout.write(`Sapience server listening on port ${port}\n`);
