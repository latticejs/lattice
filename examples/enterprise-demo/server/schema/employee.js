const handlerConnection = require('../utils/handler-connection')('employees');

exports.typeDef = `
  type Employee {
    id: ID!
    name: String!
    email: String!
    area: Area!
    jobTitle: String!
  }

  type EmployeeConnection {
    totalCount: Int!
    edges: [EmployeeEdge]!
    pageInfo: PageInfo!
  }

  type EmployeeEdge {
    node: Employee!,
    cursor: String!
  }

  extend type Query {
    employeesConnection(filterBy: [Filter], orderBy: [Order], first: Int, after: String): EmployeeConnection
  }
`;

exports.resolvers = {
  Query: {
    employeesConnection: (...args) => {
      return handlerConnection(...args);
    }
  },
  Employee: {
    area: (_, args, { db }) => {
      return db.areas.getById(_.areaId).value();
    }
  }
};
