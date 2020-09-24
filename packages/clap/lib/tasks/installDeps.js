import assert from 'assert';
import exec from 'execa';

export default function installDeps(projectPath) {
  assert.ok(projectPath);
  assert.strictEqual(typeof projectPath, 'string', 'clap: installDeps expects a string');
  var command = 'npm install';
  process.chdir(projectPath);
  return exec.shell(command);
}
