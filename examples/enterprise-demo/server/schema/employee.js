const { CustomError } = require('graphql-shield');

exports.typeDef = `
  type Employee {
    id: String!
    name: String!
    email: String!
    area: Area!
    jobTitle: String!
  }

  extend type Query {
    employeesConnection(filterBy: [Filter], orderBy: [Order], first: Int, after: String): EmployeeConnection
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

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }

  type Area {
    name: String!
  }
`;

exports.resolvers = {
  Query: {
    employeesConnection: (_, { filterBy, orderBy, first = 10, after }, { db }) => {
      let cursorDate;
      if (after) {
        cursorDate = parseInt(Buffer.from(after, 'base64').toString('ascii'), 10);
      } else {
        cursorDate = db.employees.first().value().createdAt;
      }

      const newIndex = db.employees.findIndex({ createdAt: cursorDate }).value();
      const startIndex = after ? newIndex + 1 : newIndex;
      const endIndex = startIndex + first;

      const edges = db.employees
        .slice(startIndex, endIndex)
        .value()
        .map(employee => ({
          node: employee,
          cursor: Buffer.from(employee.createdAt.toString()).toString('base64')
        }));

      const endCursor = Buffer.from(
        db.employees
          .last()
          .value()
          .createdAt.toString()
      ).toString('base64');

      const hasNextPage = !!edges.find(edge => edge.cursor === endCursor);

      return {
        totalCount: db.employees.value().length,
        edges,
        pageInfo: {
          endCursor,
          hasNextPage
        }
      };
    }
  },
  Employee: {
    area: (_, args, { db }) => {
      return db.areas.getById(_.areaId).value();
    }
  }
};
