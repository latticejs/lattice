import gql from 'graphql-tag';

import { employees } from '../mock-data';

const filterBy = (filter) => e => {
  return (!filter || !filter.q || 
    e.name.indexOf(filter.q) !== -1 ||
    e.email.indexOf(filter.q) !== -1
  )
}

export default {
  resolvers: {
    Query: {
      allEmployees: (_, { page, perPage, filter }, { cache } ) => {
        const from = page * perPage;
        const to = from + perPage
        const allEmployees = employees
          .filter(filterBy(filter))
          .slice(from, to)
        
        return allEmployees;

      },
      _allEmployeesMeta: (_, { filter }, { cache }) => ({
        __typename: '_allEmployeesMeta',
         count: employees
          .filter(filterBy(filter)).length
        })
    },
    Mutation: {
      createEmployee: (_, { id, name, email, position, department },  { cache }) => {
        const previous = cache.readQuery({
          query: gql`
            query getAllEmployees {
              allEmployees @client {
                id
                name
                email
                position
                department
              }
            }
          `
        });

        const newEmployee = {
          id,
          name,
          email,
          position,
          department,
          __typename: 'Employees'
        }

        cache.writeData({
          data: {
            allEmployees: previous.allEmployees.concat([newEmployee])
          }
        });

        return newEmployee;
        
      },
      updateEmployee: (_, { id, name, email, position, department },  { cache }) => {
        const data = { id, name, email, position, department, __typename: 'Employees' };
        cache.writeData({ id: `Employees:${id}`, data });
        return null;        
      }
      
    }
  }
}
