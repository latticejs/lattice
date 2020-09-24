import assert from 'assert';
import makeDir from 'make-dir';

export default function createDir(projectName) {
  assert.ok(projectName);
  assert.strictEqual(typeof projectName, 'string', 'clap: createDir expects a string');
  return new Promise(function (resolve, reject) {
    makeDir(projectName)
      .then(function () {
        resolve({ code: 0 });
      })
      .catch(function (err) {
        reject({
          code: 1,
          stderr: err,
        });
      });
  });
}
