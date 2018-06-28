import gql from 'graphql-tag';

export const allEmployees = gql`
  query AllEmployees($page: Int, $rowsPerPage: Int, $filterBy: String, $sortField: String, $sortOrder: String) {
    allEmployees(
      page: $page
      perPage: $rowsPerPage
      filter: { q: $filterBy }
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      id
      name
      email
      position
      department
    }
    _allEmployeesMeta(filter: { q: $filterBy }) {
      count
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
