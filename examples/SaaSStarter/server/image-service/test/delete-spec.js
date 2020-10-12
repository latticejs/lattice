const chai = require('chai');
const chaiHttp = require('chai-http');
const nock = require('nock');

const app = require('../index');

const AWS_BASE_URL = `https://${process.env.S3_BUCKET}.${process.env.S3_ENDPOINT}`;
const { RESPONSE_MESSAGES } = require('../lang');

const {
  TOKEN: { INVALID_TOKEN, VALID_TOKEN },
  END_POINTS,
} = require('./constants');

const TEST_MESSAGES = require('./helpers/messages/tests');

let requester;
chai.should();

chai.use(chaiHttp);

describe(TEST_MESSAGES.DELETES.MEDIA_MANAGER.DESCRIPTION, () => {
  before(async () => {
    requester = await chai.request(app).keepOpen();
  });

  after(async () => {
    await requester.close();
  });

  it(TEST_MESSAGES.GENERAL.AUTH_SERVICE_UNREACHABLE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: INVALID_TOKEN.split(' ')[1],
      })
      .reply(404);
    requester
      .delete(END_POINTS.MEDIA_MANAGER.DELETE('some-random-id'))
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(502);
        res.body.message.should.equal(RESPONSE_MESSAGES.UNREACHABLE_AUTH_SERVICE);
        done();
      });
  });

  it(TEST_MESSAGES.GENERAL.NO_TOKEN, (done) => {
    requester.delete(END_POINTS.MEDIA_MANAGER.DELETE('some-ranom-id')).end((err, res) => {
      res.should.have.status(401);
      res.body.message.should.equal(RESPONSE_MESSAGES.NO_AUTH_TOKEN);
      done();
    });
  });

  it(TEST_MESSAGES.GENERAL.NO_TOKEN, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: INVALID_TOKEN.split(' ')[1],
      })
      .reply(401);

    requester
      .delete(END_POINTS.MEDIA_MANAGER.DELETE('some-random-id'))
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.message.should.equal(RESPONSE_MESSAGES.INVALID_AUTH_TOKEN);
        done();
      });
  });

  it(TEST_MESSAGES.DELETES.MEDIA_MANAGER.NON_EXISTENT_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).intercept('/non-existent-file-id', 'HEAD').reply(404);

    requester
      .delete(END_POINTS.MEDIA_MANAGER.DELETE('non-existent-file-id'))
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.equal(RESPONSE_MESSAGES.FILE_NOT_FOUND);
        done();
      });
  });

  it(TEST_MESSAGES.DELETES.MEDIA_MANAGER.SUCCESSFUL_DELETE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).intercept('/valid-file', 'HEAD').reply(200);

    nock(AWS_BASE_URL).delete('/valid-file').reply(200);

    requester
      .delete(END_POINTS.MEDIA_MANAGER.DELETE('valid-file'))
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal(RESPONSE_MESSAGES.FILE_DELETED);
        res.body.media.should.equal('valid-file');
        done();
      });
  });

  it(TEST_MESSAGES.DELETES.MEDIA_MANAGER.GRACEFUL_EXIT, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).intercept('/valid-file', 'HEAD').reply(200);

    nock(AWS_BASE_URL).delete('/valid-file').reply(500);

    requester
      .delete(END_POINTS.MEDIA_MANAGER.DELETE('valid-file'))
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.message.should.equal(RESPONSE_MESSAGES.SERVER_ERROR);
        done();
      });
  });
});

describe(TEST_MESSAGES.DELETES.PROFILE_PICTURE.DESCRIPTION, () => {
  before(async () => {
    requester = await chai.request(app).keepOpen();
  });

  after(async () => {
    await requester.close();
  });

  it(TEST_MESSAGES.GENERAL.AUTH_SERVICE_UNREACHABLE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: INVALID_TOKEN.split(' ')[1],
      })
      .reply(404);
    requester
      .delete(END_POINTS.PROFILE_PICTURE.DELETE('random-id'))
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(502);
        res.body.message.should.equal(RESPONSE_MESSAGES.UNREACHABLE_AUTH_SERVICE);
        done();
      });
  });

  it(TEST_MESSAGES.GENERAL.NO_TOKEN, (done) => {
    requester.delete(END_POINTS.PROFILE_PICTURE.DELETE('random-id')).end((err, res) => {
      res.should.have.status(401);
      res.body.message.should.equal(RESPONSE_MESSAGES.NO_AUTH_TOKEN);
      done();
    });
  });

  it(TEST_MESSAGES.GENERAL.INVALID_TOKEN, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: INVALID_TOKEN.split(' ')[1],
      })
      .reply(401);

    requester
      .delete(END_POINTS.PROFILE_PICTURE.DELETE('random-id'))
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.message.should.equal(RESPONSE_MESSAGES.INVALID_AUTH_TOKEN);
        done();
      });
  });

  it(TEST_MESSAGES.DELETES.PROFILE_PICTURE.NON_EXISTENT_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).intercept('/non-existent-file-id', 'HEAD').reply(404);

    requester
      .delete(END_POINTS.PROFILE_PICTURE.DELETE('non-existent-file-id'))
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.equal(RESPONSE_MESSAGES.FILE_NOT_FOUND);
        done();
      });
  });

  it(TEST_MESSAGES.DELETES.PROFILE_PICTURE.SUCCESSFUL_DELETE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).intercept('/profile-pictures/valid-file', 'HEAD').reply(200);

    nock(AWS_BASE_URL).delete('/profile-pictures/valid-file').reply(200);

    requester
      .delete(END_POINTS.PROFILE_PICTURE.DELETE('valid-file'))
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.equal(RESPONSE_MESSAGES.FILE_DELETED);
        res.body.media.should.equal('valid-file');
        done();
      });
  });

  it(TEST_MESSAGES.DELETES.PROFILE_PICTURE.GRACEFUL_EXIT, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).intercept('/profile-pictures/valid-file', 'HEAD').reply(200);

    nock(AWS_BASE_URL).delete('/profile-pictures/valid-file').reply(500);

    requester
      .delete(END_POINTS.PROFILE_PICTURE.DELETE('valid-file'))
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.message.should.equal(RESPONSE_MESSAGES.SERVER_ERROR);
        done();
      });
  });
});
