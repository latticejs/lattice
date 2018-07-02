import gql from 'graphql-tag';

export const currentUser = gql`
  query CurrentUser {
    currentUser {
      id
      email
    }
  }
`;
