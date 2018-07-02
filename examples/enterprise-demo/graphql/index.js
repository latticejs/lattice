const express = require('express');
const jsonGraphqlExpress = require('@geut/json-graphql-server');
const bodyParser = require('body-parser');
const gql = require('graphql-tag');
const { passwords, db } = require('./db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const secret = 'aSecret';

const app = express();

app.use(cors());

app.use(bodyParser.json());

const createToken = async (user, expiresIn) => {
  const { id, email } = user;
  return await jwt.sign({ id, email }, secret, { expiresIn });
};

const validateAuth = async (req, res, next) => {
  const token = req.headers['x-token'];

  const query = req.query.query || req.body.query;

  let resource;
  if (query) {
    const g = gql(query);
    resource = g.definitions[0].selectionSet.selections[0].name.value;
  }

  if (resource && ['signIn', 'logout', '__schema'].includes(resource)) {
    next();
    return;
  }

  if (token) {
    try {
      const credentials = await jwt.verify(token, secret);
      req.credentials = credentials;
    } catch (e) {
      const error = 'Your session expired. Sign in again.';
      res.status(401).json({ error });
      return;
    }
  }

  next();
};

const Query = `
  type Token {
    token: String!
  }

  extend type Mutation {
    signIn(email: String!, password: String!): Token!
  }

  extend type Query {
    currentUser: User
  }
`;

const resolvers = {
  Mutation: {
    signIn(obj, { email, password }) {
      let user = passwords.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password.toString() === password
      );

      if (!user) {
        throw new Error('No user found with this login credentials.');
      }

      user = db.users.find(u => u.email === user.email);

      return { token: createToken(user, '30m') };
    }
  },
  Query: {
    currentUser(obj, params, { credentials }) {
      if (!credentials) {
        return null;
      }

      return db.users.find(u => u.id === credentials.id);
    }
  }
};

app.use('/graphql', validateAuth, jsonGraphqlExpress({ data: db, typeDefs: Query, resolvers }));

app.listen(process.env.NODE_PORT || 3001);
