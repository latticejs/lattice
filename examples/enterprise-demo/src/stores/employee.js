import gql from 'graphql-tag';

export const employeesConnection = gql`
  query EmployeesConnection($filterBy: [Filter], $orderBy: [Order], $first: Int = 10, $after: String) {
    employeesConnection(filterBy: $filterBy, orderBy: $orderBy, first: $first, after: $after) {
      totalCount
      edges {
        node {
          id
          name
          email
          area {
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
  mutation createEmployee($id: ID!, $name: String!, $email: String!, $position: String!, $department: String!) {
    createEmployee(id: $id, name: $name, email: $email, position: $position, department: $department) {
      id
      name
      email
      position
      department
    }
  }
`;

export const updateEmployee = gql`
  mutation updateEmployee($id: ID!, $name: String, $email: String, $position: String, $department: String) {
    updateEmployee(id: $id, name: $name, email: $email, position: $position, department: $department) {
      id
      name
      email
      position
      department
    }
  }
`;
