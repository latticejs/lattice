var assert = require('assert');
var got = require('got');
var tar = require('tar');

var BASE_URL = 'https://codeload.github.com/latticejs/lattice/tar.gz/';

function sanitizeBranchName(name) {
  return name.replace(/\//, '-').toLowerCase();
}

export default async function downloadExample(project, example, branch) {
  assert.ok(project);
  assert.ok(example);
  assert.strictEqual(typeof project, 'string', 'clap: project should be a string');
  assert.strictEqual(typeof example, 'string', 'clap: example should be a string');
  // NOTE(dk): we should split these commands (curl, tar) to have better errors.

  if (!branch) {
    branch = 'master';
  }

  return new Promise(function (resolve, reject) {
    got
      .stream(`${BASE_URL}${branch}`)
      .on('error', function (err) {
        reject({
          code: 1,
          stderr: err,
        });
      })
      .pipe(
        tar.extract(
          {
            // Extract to the project name
            cwd: project,
            // Strip the first 3 dirs
            strip: 3,
          },
          [`lattice-${sanitizeBranchName(branch)}/examples/${example}`]
        )
      )
      .on('error', function (err) {
        reject({
          code: 1,
          stderr: err,
        });
      })
      .on('end', function () {
        resolve({ code: 0 });
      });
  });
};
