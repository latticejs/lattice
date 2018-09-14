const { ApolloServer, gql } = require('apollo-server');
const search = require('libnpmsearch');

const dummyDependencies = [
  {
    name: 'dep1',
    version: '1.0.0',
    description: 'sample dep 1',
    homepage: 'www.example.com'
  },
  {
    name: 'dep2',
    version: '1.0.1',
    description: 'sample dep 2',
    homepage: 'www.example.com'
  }
];

const dummyPkg = {
  name: 'React',
  dependencies: dummyDependencies
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
    dependencies: [Dependency]
  }

  type Query {
    pkg: Pkg
    dependency(name: String!): [Dependency]
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
