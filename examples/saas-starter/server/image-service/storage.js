const router = require('express').Router();
const uuidv4 = require('uuid').v4;
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const VALIDATE_TOKEN = require('./middlewares/auth').validateToken;
const { RESPONSE_MESSAGES } = require('./lang');
const {
  S3_CONFIG: { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT },
  ALLOWED_IMAGE_TYPES,
} = require('./config');

const s3 = new AWS.S3({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  endpoint: S3_ENDPOINT,
});

const uploadImage = multer({
  fileFilter: (req, file, cb) => {
    // TODO detect the file type based on the content.
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.validationError = { message: 'Only images are supported' };
      cb(null, false);
    }
  },
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {
        originalname: file.originalname,
      });
    },
    contentType: (req, file, cb) => cb(null, file.mimetype),
    key: (req, file, cb) => {
      const uuid = uuidv4();
      cb(null, uuid);
    },
  }),
});

const uploadProfilePicture = multer({
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      req.validationError = { message: 'Only images are supported' };
      cb(null, false);
    }
  },
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {
        originalname: file.originalname,
      });
    },
    contentType: (req, file, cb) => cb(null, file.mimetype),
    key: (req, file, cb) => {
      const uuid = `profile-pictures/${uuidv4()}`;
      cb(null, uuid);
    },
  }),
});

router.post('/upload', VALIDATE_TOKEN, uploadImage.fields([{ name: 'image', maxCount: 5 }]), (req, res) => {
  if (!req.files || !req.files.image || !req.files.image.length) {
    return res.status(400).json({
      message: RESPONSE_MESSAGES.NO_VALID_IMAGE,
    });
  }
  return res.status(200).json(
    req.files.image.map((file) => ({
      url: file.location,
      name: file.originalname,
    }))
  );
});

/**
 * API to delete a file from s3 storage using the file name key.
 * Uses the headObject function to retrieve the file metadata.
 * It throws and responds with an error if the file does not exist.
 * @param {String} file
 */

router.delete('/upload/:file', VALIDATE_TOKEN, async (req, res) => {
  const { file } = req.params;
  const params = {
    Bucket: S3_BUCKET,
    Key: file,
  };
  try {
    // Check if the file exists in the bucket at the root path before proceeding to delete it.
    await s3.headObject(params).promise();
  } catch (objNotExistsErr) {
    return res.status(404).json({ message: RESPONSE_MESSAGES.FILE_NOT_FOUND });
  }
  try {
    await s3.deleteObject(params).promise();
    return res.status(200).json({ message: RESPONSE_MESSAGES.FILE_DELETED, media: file });
  } catch (error) {
    return res.status(500).json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
  }
});
/**
 * @description API to upload profile pictures to a folder in the same S3 bucket.
 * @param {File} image The profile picture to be uploaded.
 * @method POST
 */
router.post('/upload/profile-picture', VALIDATE_TOKEN, uploadProfilePicture.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: RESPONSE_MESSAGES.NO_VALID_IMAGE });
  }
  return res.status(200).json({
    url: req.file.location,
    name: req.file.originalname,
  });
});

/**
 * API to delete a profile-picture from s3 storage using the file name key.
 * Uses the headObject function to retrieve the file metadata.
 * It throws and responds with an error if the file does not exist.
 * @param {String} file
 */

router.delete('/upload/profile-picture/:file', VALIDATE_TOKEN, async (req, res) => {
  const { file } = req.params;
  const params = {
    Bucket: S3_BUCKET,
    Key: `profile-pictures/${file}`,
  };
  try {
    // Check if the file exists in the bucket at the
    // profile-pictures path before proceeding to delete it.
    await s3.headObject(params).promise();
  } catch (objNotExistsErr) {
    return res.status(404).json({ message: RESPONSE_MESSAGES.FILE_NOT_FOUND });
  }
  try {
    await s3.deleteObject(params).promise();
    return res.status(200).json({ message: RESPONSE_MESSAGES.FILE_DELETED, media: file });
  } catch (error) {
    return res.status(500).json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
  }
});

module.exports = router;
