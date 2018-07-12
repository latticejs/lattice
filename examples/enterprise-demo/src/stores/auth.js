import gql from 'graphql-tag';

export const signIn = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;

export const currentUser = gql`
  query CurrentUser {
    currentUser {
      id
      email
      role
    }
  }
`;
