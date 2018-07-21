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

export const GetAllDatagrids = gql`
  query GetAllDatagrids {
    datagrids @client {
      id
      variables
      scrollTop
    }
  }
`;

export const getDatagrid = gql`
  query GetDatagrid($id: ID!) {
    getDatagrid(id: $id) @client {
      id
      variables
      scrollTop
    }
  }
`;

export const updateDatagrid = gql`
  mutation UpdateDatagrid($id: ID!, $variables: Variables!, $scrollTop: Int!) {
    updateDatagrid(id: $id, variables: $variables, scrollTop: $scrollTop) @client
  }
`;

export default {
  defaults: {
    ui: {
      __typename: 'ui',
      nightMode: false
    },
    datagrids: []
  },
  resolvers: {
    Query: {
      getDatagrid: (_, { id }, { cache }) => {
        const previous = cache.readQuery({ query: GetAllDatagrids });
        const datagrid = previous.datagrids.find(datagrid => datagrid.id === id);

        if (datagrid) {
          return datagrid;
        }

        return null;
      }
    },
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
      },
      updateDatagrid: (_, { id, variables, scrollTop }, { cache }) => {
        const previous = cache.readQuery({ query: GetAllDatagrids });
        const datagrid = previous.datagrids.find(datagrid => datagrid.id === id) || {
          id,
          __typename: 'Datagrid'
        };

        datagrid.variables = variables;
        datagrid.scrollTop = scrollTop;

        const datagrids = previous.datagrids.filter(datagrid => datagrid.id !== id);
        const data = {
          datagrids: datagrids.concat([datagrid])
        };
        cache.writeQuery({ query: GetAllDatagrids, data });

        return datagrid;
      }
    }
  }
};
