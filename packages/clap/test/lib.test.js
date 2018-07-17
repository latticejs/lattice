// \\ CLAP test suite \\
// manual mock first
jest.mock('../lib/tasks', () => ({
  createDir: jest.fn(() => Promise.resolve({ code: 0 })),
  download: jest.fn(() => Promise.resolve({ code: 0 })),
  install: jest.fn(() => Promise.resolve({ code: 0 }))
}));

var process = require('process');
var lib = require('../lib');
var DEFAULT_EXAMPLE = require('../cli').DEFAULT_EXAMPLE;
var DEFAULT_PROJECT = 'demo';

// Describe: API
describe('clap', () => {
  test('call clap with a projectName should return exit(0)', async done => {
    /* WIP - test kind of work but they leave "open handles" so jest doesnt exit properly */
    jest.spyOn(console, 'log').mockImplementation(() => {}); // silent output
    jest.spyOn(process, 'exit').mockImplementation(code => {
      if (code === 0) return 'ok';
      if (code === 1) throw new Error('process.exit() was called.');
    });

    // useful for testing the bad scenario
    // await expect(lib.clap(DEFAULT_EXAMPLE, DEFAULT_PROJECT)).rejects.toThrow('process.exit() was called.');
    await expect(lib.clap(DEFAULT_EXAMPLE, DEFAULT_PROJECT)).resolves.not.toThrow();
    done();
  });
});
