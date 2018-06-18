import gql from 'graphql-tag';

export default gql`
  query AllStats {
    allStats @client {
      label
      unit
      value
    }
  }
`;
