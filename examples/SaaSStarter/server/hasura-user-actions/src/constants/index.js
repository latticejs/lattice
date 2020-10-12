const HASURA_MUTATIONS = require('./hasura-mutations');
const HASURA_QUERIES = require('./hasura-queries');
const AUTH0_CONFIG = require('./auth0');

const HASURA_HEADERS = {
  'x-hasura-admin-secret': process.env.HASURA_SECRET || 'HASURA_ADMIN_SECRET',
  'Content-Type': 'application/json',
};

const HASURA_URL = process.env.HASURA_URL || 'HASURA_BASE_URL';

const DEFAULT_USER_PASSWORD = 'Cel@1234';

module.exports = {
  HASURA_OPS: {
    ...HASURA_MUTATIONS,
    ...HASURA_QUERIES,
  },
  HASURA_HEADERS,
  HASURA_URL,
  AUTH0: {
    ...AUTH0_CONFIG,
  },
  DEFAULT_USER_PASSWORD,
};
