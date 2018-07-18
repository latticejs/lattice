exports.typeDef = `
  type Area {
    id: ID!
    name: String!
    dependsOn: [Area]!
  }

  extend type Query {
    getAllAreas: [Area]!
  }

  extend type Mutation {
    createArea(name: String!, dependsOn: [ID]): Area
    updateArea(id: ID!, name: String!, dependsOn: [ID]): Area
  }
`;

exports.resolvers = {
  Query: {
    getAllAreas: (_, args, { db }) => {
      return db.areas.value();
    }
  },
  Mutation: {
    createArea: (_, args, { db }) => {
      return db.areas.insert(args).write();
    },
    updateArea: (_, args, { db }) => {
      return db.areas.updateById(args.id, args).write();
    }
  },
  Area: {
    dependsOn: (_, args, { db }) => {
      return _.dependsOn.map(id => db.areas.getById(id).value());
    }
  }
};
