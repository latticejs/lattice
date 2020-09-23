var assert = require('assert');
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit();

export default function listExamples(options) {
  assert.equal(typeof options, 'object', 'clap: listExamples expects an object');

  return octokit.repos.getContent({
    owner: options.owner,
    repo: options.repo,
    path: options.path,
    ref: options.ref,
  });
}
