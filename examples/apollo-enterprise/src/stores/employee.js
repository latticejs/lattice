import gql from 'graphql-tag';

export const getEmployee = gql`
  query GetEmployee($id: ID!) {
    getEmployee(id: $id) {
      id
      name
      email
      jobTitle
      area {
        id
        name
      }
    }
  }
`;

export const employeesConnection = gql`
  query EmployeesConnection($filterBy: [Filter], $orderBy: [Order], $first: Int = 10, $after: String) {
    employeesConnection(filterBy: $filterBy, orderBy: $orderBy, first: $first, after: $after) {
      totalCount
      edges {
        node {
          id
          name
          email
          jobTitle
          area {
            id
            name
          }
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

export const createEmployee = gql`
  mutation createEmployee($name: String!, $email: String!, $jobTitle: String!, $areaId: ID!) {
    createEmployee(name: $name, email: $email, jobTitle: $jobTitle, areaId: $areaId) {
      id
      name
      email
      jobTitle
      area {
        id
        name
      }
    }
  }
`;

export const updateEmployee = gql`
  mutation updateEmployee($id: ID!, $name: String, $email: String, $jobTitle: String, $areaId: ID) {
    updateEmployee(id: $id, name: $name, email: $email, jobTitle: $jobTitle, areaId: $areaId) {
      id
      name
      email
      jobTitle
      area {
        id
        name
      }
    }
  }
`;
