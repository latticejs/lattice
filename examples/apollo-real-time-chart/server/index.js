const { GraphQLServer, PubSub } = require('graphql-yoga');
const cors = require('cors');
const si = require('systeminformation');

const { cpuUsageUpdated, memoryUsageUpdated, psUsageUpdated, disksUsageUpdated } = require('./realtime-values');

const typeDefs = `
  type PlatformInfo {
    osName: String!
    osDistro: String!
    cpuManufacturer: String!
    cpuBrand: String!
    cpuSpeed: String!
    cpuCores: Int!
  }

  type CPUStat {
    timestamp: Float!
    totalUsage: Float!
    cpusUsage: [Float!]!
  }

  type CPUHistory {
    history: [CPUStat]!
    latest: CPUStat!
  }

  type MemoryStat {
    timestamp: Float!
    usage: Float!
    free: Float!
    total: Float!
  }

  type MemoryHistory {
    history: [MemoryStat]!
    latest: MemoryStat!
  }

  type DisksHistory {
    history: [DisksStat]!
    latest: DisksStat!
  }

  type Process {
    pid: Int!
    name: String!
    cpu: Float!
    memory: Float!
  }

  type DisksStat {
    timestamp: Float!
    reads: Float!
    writes: Float!
  }

  type Query {
    getPlatformInfo: PlatformInfo!
  }

  type Subscription {
    cpuUpdated: CPUHistory!
    memoryUpdated: MemoryHistory!
    psUpdated: [Process]!
    disksUpdated: DisksHistory!
  }
`;

const CPU_UPDATED = 'CPU_UPDATED';
const MEMORY_UPDATED = 'MEMORY_UPDATED';
const PS_UPDATED = 'PS_UPDATED';
const DISKS_UPDATED = 'DISKS_UPDATED';

const resolvers = {
  Query: {
    getPlatformInfo: async () => {
      const osInfo = await si.osInfo();
      const cpuInfo = await si.cpu();

      return {
        osName: osInfo.platform,
        osDistro: osInfo.distro,
        cpuManufacturer: cpuInfo.manufacturer,
        cpuBrand: cpuInfo.brand,
        cpuSpeed: cpuInfo.speed,
        cpuCores: cpuInfo.cores
      };
    }
  },
  Subscription: {
    cpuUpdated: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(CPU_UPDATED)
    },
    memoryUpdated: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(MEMORY_UPDATED)
    },
    psUpdated: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(PS_UPDATED)
    },
    disksUpdated: {
      subscribe: (_, args, { pubsub }) => pubsub.asyncIterator(DISKS_UPDATED)
    }
  }
};

const opts = {
  port: process.env.NODE_PORT || 3001
};

(async () => {
  const pubsub = new PubSub();

  cpuUsageUpdated(data => {
    pubsub.publish(CPU_UPDATED, { cpuUpdated: data });
  });

  memoryUsageUpdated(data => {
    pubsub.publish(MEMORY_UPDATED, { memoryUpdated: data });
  });

  psUsageUpdated(list => {
    pubsub.publish(PS_UPDATED, {
      psUpdated: list.slice(0, 10).map(p => ({
        pid: p.pid,
        name: p.name,
        cpu: p.cpu,
        memory: p.memory
      }))
    });
  });

  disksUsageUpdated(data => {
    pubsub.publish(DISKS_UPDATED, { disksUpdated: data });
  });

  // context
  const context = ({ request }) => ({
    pubsub
  });

  // server
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context
  });

  server.express.use(cors());

  server.start(opts, () => console.log(`Server is running on http://localhost:${opts.port}`));
})();
