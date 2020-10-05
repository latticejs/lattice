import gql from 'graphql-tag';

export const getTopProductsSale = gql`
  query GetTopProductsSale($limit: Int) {
    getTopProductsSale(limit: $limit) {
      product {
        name
        price
      }
      total
    }
  }
`;
