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

export const getAllDatagrids = gql`
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
        try {
          const previous = cache.readQuery({ query: getAllDatagrids });
          const datagrid = previous.datagrids.find(datagrid => datagrid.id === id);

          if (datagrid) {
            return datagrid;
          }
        } catch (err) {
          console.log(err.message);
        }

        return {
          __typename: 'Datagrid',
          id,
          variables: null,
          scrollTop: null
        };
      }
    },
    Mutation: {
      updateUi: (_, { nightMode }, { cache }) => {
        try {
          const data = {
            ui: {
              __typename: 'ui',
              nightMode
            }
          };
          cache.writeData({ data });
        } catch (err) {
          console.log(err.message);
        }
        return null;
      },
      updateDatagrid: (_, { id, variables, scrollTop }, { cache }) => {
        try {
          const query = getAllDatagrids;
          const previous = cache.readQuery({ query });
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
          cache.writeQuery({ query, data });

          return datagrid;
        } catch (err) {
          console.log(err.message);
        }

        return null;
      }
    }
  }
};
