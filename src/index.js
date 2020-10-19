require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });
const router = require('./routes');

const app = express();
app.use(cors());
app.use(compression());
app.use(expressLogger);

app.use('/api/v1', router);

app.use('*', (req, res) => res.status(404).send('Not found'));

app.listen(process.env.PORT, () => {
  logger.info(`Server started on port ${process.env.PORT}`);
});

module.exports = {
  logger,
};
