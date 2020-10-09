const chai = require('chai');
const chaiHttp = require('chai-http');
const { readFileSync } = require('fs');
const nock = require('nock');

const AWS_BASE_URL = `https://${process.env.S3_BUCKET}.${process.env.S3_ENDPOINT}`;
const app = require('../index');
const { RESPONSE_MESSAGES } = require('../lang');
const {
  IMAGES: { VALID_IMAGE },
  TOKEN: { INVALID_TOKEN, VALID_TOKEN },
  END_POINTS,
} = require('./constants');

const TEST_MESSAGES = require('./helpers/messages/tests');

let requester;
const should = chai.should();

chai.use(chaiHttp);

describe(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.DESCRIPTION, () => {
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
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(502);
        res.body.message.should.equal(RESPONSE_MESSAGES.UNREACHABLE_AUTH_SERVICE);
        done();
      });
  });

  it(TEST_MESSAGES.GENERAL.NO_TOKEN, (done) => {
    requester.post(END_POINTS.MEDIA_MANAGER.UPLOAD).end((err, res) => {
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
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.message.should.equal(RESPONSE_MESSAGES.INVALID_AUTH_TOKEN);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.NO_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    requester
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal(RESPONSE_MESSAGES.NO_VALID_IMAGE);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.INVALID_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    requester
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'timeline.txt')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal(RESPONSE_MESSAGES.NO_VALID_IMAGE);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.INVALID_KEY, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    nock(AWS_BASE_URL).put(/.*/).reply(200);
    requester
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('invalidKey', readFileSync(VALID_IMAGE), 'image.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(400);
        res.body.message.should.be.equal(RESPONSE_MESSAGES.UNEXPECTED_FIELD);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.VALID_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    nock(AWS_BASE_URL).put(/.*/).reply(200);
    requester
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'image.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.an('array').of.length(1);
        res.body.forEach((e) => e.should.have.property('url'));
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.MULTIPLE_VALID_FILES, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);

    nock(AWS_BASE_URL).persist().put(/.*/).reply(200);
    requester
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'image1.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image2.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image3.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image4.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image5.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.an('array').of.length(5);
        res.body.forEach((e) => e.should.have.property('url'));
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.MEDIA_MANAGER.FILE_LIMIT_EXCEEDED, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    nock(AWS_BASE_URL).persist().put(/.*/).reply(200);
    nock(AWS_BASE_URL).persist().delete(/.*/).reply(200);
    requester
      .post(END_POINTS.MEDIA_MANAGER.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'image1.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image2.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image3.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image4.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image5.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image6.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(400);
        res.body.message.should.equal(RESPONSE_MESSAGES.UNEXPECTED_FIELD);
        done();
      });
  });
});

describe(TEST_MESSAGES.UPLOADS.PROFILE_PICTURE.DESCRIPTION, () => {
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
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(502);
        res.body.message.should.equal(RESPONSE_MESSAGES.UNREACHABLE_AUTH_SERVICE);
        done();
      });
  });

  it(TEST_MESSAGES.GENERAL.NO_TOKEN, (done) => {
    requester.post(END_POINTS.PROFILE_PICTURE.UPLOAD).end((err, res) => {
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
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', INVALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.message.should.equal(RESPONSE_MESSAGES.INVALID_AUTH_TOKEN);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.PROFILE_PICTURE.NO_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    requester
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal(RESPONSE_MESSAGES.NO_VALID_IMAGE);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.PROFILE_PICTURE.INVALID_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    requester
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'profile.txt')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.message.should.equal(RESPONSE_MESSAGES.NO_VALID_IMAGE);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.PROFILE_PICTURE.INVALID_KEY, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    nock(AWS_BASE_URL).put(/.*/).reply(200);
    requester
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('invalidKey', readFileSync(VALID_IMAGE), 'image.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(400);
        res.body.message.should.be.equal(RESPONSE_MESSAGES.UNEXPECTED_FIELD);
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.PROFILE_PICTURE.VALID_FILE, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    nock(AWS_BASE_URL).put(/.*/).reply(200);
    requester
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'image.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('url');
        res.body.should.have.property('name');
        done();
      });
  });

  it(TEST_MESSAGES.UPLOADS.PROFILE_PICTURE.FILE_LIMIT_EXCEEDED, (done) => {
    nock(process.env.AUTH_SERVICE)
      .get(END_POINTS.AUTH.VALIDATE_TOKEN)
      .query({
        token: VALID_TOKEN.split(' ')[1],
      })
      .reply(200);
    nock(AWS_BASE_URL).persist().put(/.*/).reply(200);
    requester
      .post(END_POINTS.PROFILE_PICTURE.UPLOAD)
      .set('Authorization', VALID_TOKEN)
      .attach('image', readFileSync(VALID_IMAGE), 'image1.png')
      .attach('image', readFileSync(VALID_IMAGE), 'image2.png')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(400);
        res.body.message.should.be.equal(RESPONSE_MESSAGES.UNEXPECTED_FIELD);
        done();
      });
  });
});
