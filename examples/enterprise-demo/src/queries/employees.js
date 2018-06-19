import gql from 'graphql-tag';

export default gql`
  query AllEmployees($page: Int, $rowsPerPage: Int, $filterBy: String, $orderBy: Order) {
    allEmployees(page: $page, perPage: $rowsPerPage, filter: { q: $filterBy }, order: $orderBy) @client {
      id
      name
      email
      position
      department
    }
    _allEmployeesMeta(filter: { q: $filterBy }) @client {
      count
    }
  }
`;

export const createEmployee = gql`
  mutation createEmployee($id: ID!, $name: String!, $email: String!, $position: String!, $department: String!) {
    createEmployee(id: $id, name: $name, email: $email, position: $position, department: $department) @client {
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
    updateEmployee(id: $id, name: $name, email: $email, position: $position, department: $department) @client {
      id
      name
      email
      position
      department
    }
  }
`;
