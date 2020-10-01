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

export const createArea = gql`
  mutation CreateArea($name: String!, $dependsOn: [ID!]) {
    createArea(name: $name, dependsOn: $dependsOn) {
      id
      name
      dependsOn {
        id
        name
      }
    }
  }
`;

export const updateArea = gql`
  mutation UpdateArea($id: ID!, $name: String, $dependsOn: [ID]) {
    updateArea(id: $id, name: $name, dependsOn: $dependsOn) {
      id
      name
      dependsOn {
        id
        name
      }
    }
  }
`;
