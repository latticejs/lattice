var assert = require('assert');
var octokit = require('@octokit/rest');

module.exports = function listExamples(options) {
  assert.equal(typeof options, 'object', 'clap: listExamples expects an object');

  return octokit.repos.getContents({
    owner: options.owner,
    repo: options.repo,
    path: options.path,
    ref: options.ref,
  });
};
