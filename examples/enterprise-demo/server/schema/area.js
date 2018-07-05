exports.typeDef = `
  type Area {
    id: ID!
    name: String!
    dependsOn: [Area]!
  }

  extend type Query {
    getAllAreas: [Area]!
  }
`;

exports.resolvers = {
  Query: {
    getAllAreas: (_, args, { db }) => {
      return db.areas.value();
    }
  },
  Area: {
    dependsOn: (_, args, { db }) => {
      return _.dependsOn.map(id => db.areas.getById(id).value());
    }
  }
};
