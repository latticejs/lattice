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
    getEmployee(id: ID!): Employee
    employeesConnection(filterBy: [Filter], orderBy: [Order], first: Int, after: String): EmployeeConnection
  }

  extend type Mutation {
    createEmployee(name: String!, email: String!, jobTitle: String!, areaId: ID!): Employee
    updateEmployee(id: ID!, name: String, email: String, jobTitle: String, areaId: ID): Employee
  }
`;

exports.resolvers = {
  Query: {
    getEmployee: (_, { id }, { db }) => {
      return db.employees.getById(id).value();
    },
    employeesConnection: (...args) => {
      return handlerConnection(...args);
    }
  },
  Mutation: {
    createEmployee: (_, args, { db }) => {
      const data = Object.assign({}, args, { createdAt: Date.now() });
      return db.employees.insert(data).write();
    },
    updateEmployee: (_, args, { db }) => {
      const data = Object.assign({}, args, { createdAt: Date.now() });
      return db.employees.updateById(data.id, data).write();
    }
  },
  Employee: {
    area: (_, args, { db }) => {
      return db.areas.getById(_.areaId).value();
    }
  }
};
