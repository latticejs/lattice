// This is the order of the test case file execution.
// Execution is based on describe and it will avoid parallel execution.
const nock = require('nock');

before(async () => {
  nock(process.env.LOG_SERVICE).persist().post('/').reply(200);
});
require('./upload-spec');
require('./delete-spec');
