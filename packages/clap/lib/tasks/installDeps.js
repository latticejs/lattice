var assert = require('assert');
var exec = require('execa');

export default function installDeps(projectPath) {
  assert.ok(projectPath);
  assert.strictEqual(typeof projectPath, 'string', 'clap: installDeps expects a string');
  var command = 'npm install';
  process.chdir(projectPath);
  return exec.shell(command);
};
