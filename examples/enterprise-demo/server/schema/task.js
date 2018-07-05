const handlerConnection = require('../utils/handler-connection')('tasks');

exports.typeDef = `
  type Task {
    id: ID!
    title: String!,
    description: String!,
    employees: [Employee]!,
    createdAt: Int!,
    completedAt: Int
  }

  type TaskConnection {
    totalCount: Int!
    edges: [TaskEdge]!
    pageInfo: PageInfo!
  }

  type TaskEdge {
    node: Task!,
    cursor: String!
  }

  extend type Query {
    tasksConnection(filterBy: [Filter], orderBy: [Order], first: Int, after: String): TaskConnection
  }
`;

exports.resolvers = {
  Query: {
    tasksConnection: (...args) => {
      return handlerConnection(...args);
    }
  },
  Task: {
    employees: (_, args, { db }) => {
      return _.employees.map(id => db.employees.getById(id).value());
    }
  }
};
