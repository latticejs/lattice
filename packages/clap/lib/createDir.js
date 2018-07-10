var exec = require('execa');

module.exports = function createDir(projectName) {
  var command = `mkdir -p ${projectName}`;
  return exec.shell(command);
};
