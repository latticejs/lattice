var exec = require('execa');

module.exports = async function downloadExample(project, example) {
  // NOTE(dk): we should split these commands (curl, tar) to have better errors.
  var command = `curl --fail --silent --show-error https://codeload.github.com/latticejs/lattice/tar.gz/master | tar -xz -C ${project} --strip=3 lattice-master/examples/${example}`;
  var out = {};
  try {
    out = await exec.shell(command);
  } catch (err) {
    out = err;
  }
  return out;
};
