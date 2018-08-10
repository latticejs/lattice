import gql from 'graphql-tag';

export const getPlatformInfo = gql`
  query GetPlatformInfo {
    getPlatformInfo {
      osName
      osDistro
      cpuManufacturer
      cpuBrand
      cpuSpeed
      cpuCores
    }
  }
`;

export const cpuUpdated = gql`
  subscription {
    cpuUpdated {
      history {
        timestamp
        cpusUsage
        totalUsage
      }
      latest {
        totalUsage
        cpusUsage
      }
    }
  }
`;

export const memoryUpdated = gql`
  subscription {
    memoryUpdated {
      latest {
        usage
        free
        total
      }
    }
  }
`;

export const psUpdated = gql`
  subscription {
    psUpdated {
      pid
      name
      cpu
      memory
    }
  }
`;
