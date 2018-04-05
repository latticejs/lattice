import gql from 'graphql-tag'

export default gql`
  query ui {
    ui @client {
      __typename
      nightMode
    }
  }
`
export const updateNightMode = gql`
  mutation updateUi($nightMode: Boolean) {
    updateUi(nightMode: $nightMode) @client
  }
`