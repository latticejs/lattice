var assert = require('assert');
var exec = require('execa');

module.exports = function installDeps(projectPath) {
  assert.ok(projectPath);
  assert.strictEqual(typeof projectPath, 'string');
  var command = 'npm install';
  process.chdir(projectPath);
  return exec.shell(command);
};
