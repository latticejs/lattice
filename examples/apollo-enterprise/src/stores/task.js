import gql from 'graphql-tag';

export const tasksConnection = gql`
  query TasksConnection($filterBy: [Filter], $orderBy: [Order], $first: Int = 10, $after: String) {
    tasksConnection(filterBy: $filterBy, orderBy: $orderBy, first: $first, after: $after) {
      totalCount
      edges {
        node {
          title
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
