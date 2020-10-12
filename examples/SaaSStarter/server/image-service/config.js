const S3_CONFIG = {
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || '<S3_ACCESS_KEY>',
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || '<S3_ACCESS_KEY_SECRET>',
  S3_ENDPOINT: process.env.S3_ENDPOINT || '<S3_ENDPOINT>',
  S3_BUCKET: process.env.S3_BUCKET || '<S3_BUCKET>',
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

module.exports = {
  S3_CONFIG,
  ALLOWED_IMAGE_TYPES,
};
