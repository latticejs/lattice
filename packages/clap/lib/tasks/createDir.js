var assert = require('assert');
var exec = require('execa');

module.exports = function createDir(projectName) {
  assert.ok(projectName);
  assert.strictEqual(typeof projectName, 'string');
  var command = `mkdir -p ${projectName}`;
  return exec.shell(command);
};
