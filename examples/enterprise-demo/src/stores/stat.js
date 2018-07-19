import gql from 'graphql-tag';

export const getAllStats = gql`
  query GetAllStats {
    getAllStats {
      label
      unit
      value
    }
  }
`;
