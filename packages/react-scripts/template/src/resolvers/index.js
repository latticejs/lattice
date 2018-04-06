import ui from './ui';
import user from './user';
import employees from './employees';

// Mock data
import { stats, sales, departments } from '../mock-data';

const combineResolvers = resolvers => {
  return resolvers
    .reduce((prev, curr) => {
      const mutation = curr.resolvers && curr.resolvers.Mutation
      const query = curr.resolvers && curr.resolvers.Query
    
      return {
        defaults: {
          ...prev.defaults,
          ...curr.defaults
        },
        resolvers: {
          Query: {
            ...prev.resolvers.Query,
            ...query
          },
          Mutation: {
            ...prev.resolvers.Mutation,
            ...mutation
          }
          
        }
      }
    },
    {
      defaults: {},
      resolvers: {
        Query: {},
        Mutation: {}
      }
    });
}

export default combineResolvers([
  ui,
  user,
  employees,
  { 
    defaults: {
      allStats: stats,
      allSales: sales,
      allDepartments: departments
    }
  }
]);
