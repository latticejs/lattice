const merge = require('lodash.merge');

const { typeDef: Auth, resolvers: authResolvers } = require('./auth.js');
const { typeDef: Employee, resolvers: employeeResolvers } = require('./employee.js');
const { typeDef: Area, resolvers: areaResolvers } = require('./area.js');
const { typeDef: Task, resolvers: taskResolvers } = require('./task.js');

// const {
// typeDef: User,
// resolvers: userResolvers
// } = require('./user.js')

// If you had Query fields not associated with a
// specific type you could put them here
const Query = `
  enum Operator {
    EQUAL
    LIKE
    NOT_EQUAL
    NOT_LIKE
  }

  input Filter {
    field: String!
    value: String
    operator: Operator
  }

  input Order {
    field: String!
    direction: String!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
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
  typeDefs: [Query, Auth, Employee, Area, Task],
  resolvers: merge(resolvers, authResolvers, employeeResolvers, areaResolvers, taskResolvers)
};
