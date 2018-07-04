const merge = require('lodash.merge');

const { typeDef: Auth, resolvers: authResolvers } = require('./auth.js');
const { typeDef: Employee, resolvers: employeeResolvers } = require('./employee.js');

// const {
// typeDef: User,
// resolvers: userResolvers
// } = require('./user.js')

// If you had Query fields not associated with a
// specific type you could put them here
const Query = `
  input Filter {
    field: String!
    value: String!
  }

  input Order {
    field: String!
    direction: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const resolvers = {};

module.exports = {
  typeDefs: [Query, Auth, Employee],
  resolvers: merge(resolvers, authResolvers, employeeResolvers)
};
