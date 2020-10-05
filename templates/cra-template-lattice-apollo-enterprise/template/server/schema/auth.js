const { CustomError } = require('graphql-shield');
const jwt = require('jsonwebtoken');

const createToken = async (user, expiresIn) => {
  const { id, email, role } = user;
  return jwt.sign({ id, email, role }, process.env.SECRET || 'aSecret', { expiresIn });
};

exports.typeDef = `
  type Token {
    token: String!
  }

  type CurrentUser {
    id: ID!
    email: String!
    role: String!
  }

  extend type Query {
    currentUser: CurrentUser
  }

  extend type Mutation {
    signIn(email: String!, password: String!): Token!
  }
`;

exports.resolvers = {
  Query: {
    currentUser: (_, args, { db, currentUser }) => {
      let user = db.users.find({ id: currentUser.id }).value();

      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    },
  },
  Mutation: {
    signIn: async (_, { email, password }, { db }) => {
      let user = db.users.find({ email: email.toLowerCase(), password }).value();

      if (!user) {
        throw new CustomError('userNotFound');
      }

      return { token: createToken(user, '30m') };
    },
  },
};
