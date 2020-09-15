var octokit = require('@octokit/rest');

module.exports = function validateExampleName(repoData, example) {
  return new Promise(function (resolve, reject) {
    octokit.repos
      .getContents({
        owner: repoData.owner,
        repo: repoData.repo,
        path: `${repoData.path}/${example}/package.json`,
        ref: repoData.ref,
      })
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
};
