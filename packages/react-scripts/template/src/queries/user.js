import gql from 'graphql-tag'

export default gql`
  query user {
    user @client {
      __typename
      loggedIn
    }
  }
`
export const signIn = gql`
  mutation signIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) @client
  }
`

export const signOut = gql`
  mutation signOut {
    signOut @client
  }
`
