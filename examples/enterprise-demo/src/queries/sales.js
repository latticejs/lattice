import gql from 'graphql-tag';

export default gql`
  query AllSales {
    allSales @client {
      name
      value
    }
  }
`;
