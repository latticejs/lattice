// \\ CLAP test suite \\
// manual mock first
jest.mock('../lib/tasks', () => ({
  createDir: jest.fn(() => Promise.resolve({ code: 1 })),
  download: jest.fn(() => Promise.resolve({ code: 0 })),
  install: jest.fn(() => Promise.resolve({ code: 0 }))
}));

var lib = require('../lib');
var DEFAULT_EXAMPLE = require('../cli').DEFAULT_EXAMPLE;
var DEFAULT_PROJECT = 'demo';

// Describe: API
describe('clap', () => {
  test('call clap with a projectName should return exit(0)', async () => {
    /* WIP - test kind of work but they leave "open handles" so jest doesnt exit properly
    expect.assertions(1);
    var exitSpy = jest.spyOn(process, 'exit').mockImplementation(jest.fn());

    await lib.clap(DEFAULT_EXAMPLE, DEFAULT_PROJECT);
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    */
  });
});
