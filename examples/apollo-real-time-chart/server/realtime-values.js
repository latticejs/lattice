const os = require('os');
const si = require('systeminformation');

let cpuHistory = [];
let memoryHistory = [];
let disksHistory = [];

exports.disksUsageUpdated = (cb) =>
  setInterval(async () => {
    const disksIO = await si.disksIO();

    const data = {
      timestamp: Date.now(),
      reads: disksIO.rIO_sec,
      writes: disksIO.wIO_sec,
    };

    if (disksHistory.length > 20) {
      disksHistory.shift();
    }

    disksHistory.push(data);

    cb({
      history: disksHistory,
      latest: data,
    });
  }, 1000);

exports.cpuUsageUpdated = (cb) =>
  setInterval(async () => {
    const usage = await si.currentLoad();

    const data = {
      timestamp: Date.now(),
      totalUsage: usage.currentload,
      cpusUsage: usage.cpus.map((cpu) => cpu.load),
    };

    if (cpuHistory.length > 20) {
      cpuHistory.shift();
    }

    cpuHistory.push(data);

    cb({
      history: cpuHistory,
      latest: data,
    });
  }, 2000);

exports.memoryUsageUpdated = (cb) =>
  setInterval(async () => {
    const freemem = os.freemem();
    const totalmem = os.totalmem();
    const usage = totalmem - freemem;
    const data = {
      timestamp: Date.now(),
      usage,
      free: freemem,
      total: totalmem,
    };

    if (memoryHistory.length > 20) {
      memoryHistory.shift();
    }

    memoryHistory.push(data);

    cb({
      history: memoryHistory,
      latest: data,
    });
  }, 2000);

exports.psUsageUpdated = (cb) =>
  setInterval(async () => {
    const ps = await si.processes();

    cb(
      ps.list
        .sort((a, b) => {
          if (a.pcpu > b.pcpu) return -1;
          if (a.pcpu < b.pcpu) return 1;
          if (a.pmem > b.pmem) return -1;
          if (a.pmem < b.pmem) return 1;
          return 0;
        })
        .map((p) => ({
          pid: p.pid,
          name: p.name,
          cpu: p.pcpu,
          memory: p.pmem,
        }))
    );
  }, 2000);
