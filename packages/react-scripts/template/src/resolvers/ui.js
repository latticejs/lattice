export default {
  defaults: {
    ui: {
      __typename: 'ui',
      nightMode: false
    }
  },
  resolvers: {
    Mutation: {
      updateUi: (_, { nightMode }, { cache }) => {
        const data = {
          ui: {
            __typename: 'ui',
            nightMode
          }
        };
        cache.writeData({ data });
        return null;
      }
    }
  }
};
