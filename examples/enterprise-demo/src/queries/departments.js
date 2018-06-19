import gql from 'graphql-tag';

export default gql`
  query AllDepartments {
    allDepartments @client {
      label
      value
    }
  }
`;
