import gql from 'graphql-tag';

export const getUi = gql`
  query ui {
    ui @client {
      __typename
      nightMode
    }
  }
`;

export const updateUi = gql`
  mutation updateUi($nightMode: Boolean) {
    updateUi(nightMode: $nightMode) @client
  }
`;

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
