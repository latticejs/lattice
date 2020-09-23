const { Octokit } = require("@octokit/rest");
const octokit = new Octokit();

export default function validateExampleName(repoData, example) {
  return new Promise(function (resolve, reject) {
    octokit.repos
      .getContent({
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
