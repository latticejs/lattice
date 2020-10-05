const merge = require('lodash.merge');

const { typeDef: Input } = require('./input.js');
const { typeDef: Auth, resolvers: authResolvers } = require('./auth.js');
const { typeDef: Employee, resolvers: employeeResolvers } = require('./employee.js');
const { typeDef: Area, resolvers: areaResolvers } = require('./area.js');
const { typeDef: Task, resolvers: taskResolvers } = require('./task.js');
const { typeDef: Stat, resolvers: statResolvers } = require('./stat.js');
const { typeDef: Product, resolvers: productResolvers } = require('./product.js');
const { typeDef: Sale } = require('./sale.js');

// If you had Query fields not associated with a
// specific type you could put them here
const Query = `
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
  typeDefs: [Query, Input, Auth, Employee, Area, Task, Stat, Product, Sale],
  resolvers: merge(
    resolvers,
    authResolvers,
    employeeResolvers,
    areaResolvers,
    taskResolvers,
    statResolvers,
    productResolvers
  ),
};
