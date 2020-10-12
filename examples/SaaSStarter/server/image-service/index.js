const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });
const Sentry = require('@sentry/node');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const storageRouter = require('./storage');
const { log } = require('./utils/logger');
const { RESPONSE_MESSAGES } = require('./lang');

const app = express();

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
  app.use(Sentry.Handlers.requestHandler());
}

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(
  morgan('combined', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);
app.disable('x-powered-by');

app.use('/storage', storageRouter);
app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, next) => {
  log('error', err.message);
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message: RESPONSE_MESSAGES.UNEXPECTED_FIELD,
    });
  }
  return res.status(500).json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') app.listen(port, () => log('info', `App initialized on ${port}`));
module.exports = app;
