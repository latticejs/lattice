const { ApolloServer, gql } = require('apollo-server');
const search = require('libnpmsearch');

const dummyPkg = {
  name: 'App',
  dependencies: JSON.stringify({ react: '16.0.0', 'react-dom': '1.0.0' })
};

const typeDefs = gql`
  type Dependency {
    name: String
    version: String
    description: String
    homepage: String
  }

  type Pkg {
    name: String!
    dependencies: String
  }

  type Query {
    pkg: Pkg
    dependency(name: String!): [Dependency]
  }
  type Mutation {
    updatePkg(name: String!, dependencies: String!): Pkg
  }
`;

const resolvers = {
  Query: {
    dependency: async (root, { name }, context, info) => {
      return search(name, { limit: 5 });
    },
    pkg: async (root, args, context, info) => {
      return dummyPkg;
    }
  },
  Mutation: {
    updatePkg: (root, { name, dependencies }) => {
      dummyPkg.name = name;
      dummyPkg.dependencies = dependencies;
      return dummyPkg;
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
