import ui from './ui';
import user from './user';

// Mock data
import { stats, sales } from '../mock-data';

const combineResolvers = resolvers => {
  return resolvers
    .reduce((prev, curr) => {
      const currResolvers = curr.resolvers && curr.resolvers.Mutation
    
      return {
        defaults: {
          ...prev.defaults,
          ...curr.defaults
        },
        resolvers: {
          Mutation: {
            ...prev.resolvers.Mutation,
            ...currResolvers
          }
        }
      }
    },
    {
      defaults: {},
      resolvers: {
        Mutation: {}
      }
    });
}

export default combineResolvers([
  ui,
  user,
  { 
    defaults: { 
      allStats: stats, 
      allSales: sales 
    }
  }
]);
