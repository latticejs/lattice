import gql from 'graphql-tag';

export const getAllAreas = gql`
  query GetAllAreas {
    getAllAreas {
      id
      name
      dependsOn {
        id
        name
      }
    }
  }
`;
