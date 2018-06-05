export default {
  defaults: {
    user: {
      __typename: 'user',
      loggedIn: false
    }
  },
  resolvers: {
    Mutation: {
      signIn: (_, { username, pass }, { cache }) => {
        const data = {
          user: {
            __typename: 'user',
            loggedIn: true
          }
        };
        cache.writeData({ data });
        return null;
      },
      signOut: (_, __, { cache }) => {
        const data = {
          user: {
            __typename: 'user',
            loggedIn: false
          }
        };
        cache.writeData({ data });
        return null;
      }
    }
  }
};
