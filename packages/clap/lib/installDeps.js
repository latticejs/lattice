var exec = require('execa');

module.exports = function installDeps(projectPath) {
  var command = 'npm install';
  process.chdir(projectPath);
  return exec.shell(command);
};
