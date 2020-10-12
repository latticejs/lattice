require('dotenv').config();
const express = require('express');
const Sentry = require('@sentry/node');
const router = require('./router');

if (process.env.SENTRY_DSN) {
  console.log('SENTRY_DSN found. Initializing SENTRY...');
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(Sentry.Handlers.requestHandler());

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.use('/token', router);

app.use(Sentry.Handlers.errorHandler());

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Service initialized on ${port}`));
