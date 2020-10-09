const path = require('path');

const TOKEN = {
  INVALID_TOKEN: 'Bearer !nv@l!dT0k3n',
  VALID_TOKEN: 'Beaerer v@l!dT0k3n',
};

const END_POINTS = {
  AUTH: {
    VALIDATE_TOKEN: '/token/validate',
  },
  MEDIA_MANAGER: {
    UPLOAD: '/storage/upload',
    DELETE: (id) => `/storage/upload/${id}`,
  },
  PROFILE_PICTURE: {
    UPLOAD: '/storage/upload/profile-picture',
    DELETE: (id) => `/storage/upload/profile-picture/${id}`,
  },
};

const IMAGES = {
  VALID_IMAGE: path.join(__dirname, 'helpers/files/test_image.jpg'),
};

module.exports = {
  TOKEN,
  IMAGES,
  END_POINTS,
};
