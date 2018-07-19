exports.typeDef = `
  type Stat {
    label: String!
    unit: String!
    value: Float!
  }

  extend type Query {
    getAllStats: [Stat]!
  }
`;

exports.resolvers = {
  Query: {
    getAllStats: (_, args, { db }) => {
      const { employees, tasks, areas } = db;

      return [
        {
          label: 'Employees',
          unit: 'Total Employees',
          value: employees.value().length
        },
        {
          label: 'Areas',
          unit: 'Total Areas',
          value: areas.value().length
        },
        {
          label: 'Tasks',
          unit: 'Completed Tasks',
          value: tasks.filter(task => task.completedAt !== null).value().length
        },
        {
          label: 'Tasks',
          unit: 'Uncompleted Tasks',
          value: tasks.filter(task => task.completedAt === null).value().length
        }
      ];
    }
  }
};
