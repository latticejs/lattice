const UPLOADS = {
  MEDIA_MANAGER: {
    DESCRIPTION: 'Media manager image upload.',
    NO_FILE: 'Should fail when no image is provided.',
    INVALID_FILE: 'Should fail when invalid file is provided.',
    INVALID_KEY: 'Should fail when file is provided with invalid key.',
    VALID_FILE: 'Should succeed when valid file is provided.',
    MULTIPLE_VALID_FILES: 'Should succeed when multiple valid files are provided.',
    FILE_LIMIT_EXCEEDED: 'Should fail when more than 5 files are uploaded.',
  },

  PROFILE_PICTURE: {
    DESCRIPTION: 'Profile picture image upload.',
    NO_FILE: 'Should fail when no profile picture is provided.',
    INVALID_FILE: 'Should fail when invalid file is provided.',
    INVALID_KEY: 'Should fail when file is provided with invalid key.',
    VALID_FILE: 'Should succeed when valid file is provided.',
    FILE_LIMIT_EXCEEDED: 'Should fail when more than 1 file is uploaded.',
  },
};

const DELETES = {
  MEDIA_MANAGER: {
    DESCRIPTION: 'Media manager delete images.',
    NON_EXISTENT_FILE: 'Should fail when id for non existent file is provided.',
    SUCCESSFUL_DELETE: 'Should pass when id for valid file is provided.',
    GRACEFUL_EXIT: 'Should fail gracefully when file cannot be deleted.',
  },
  PROFILE_PICTURE: {
    DESCRIPTION: 'Profile picture image delete.',
    NON_EXISTENT_FILE: 'Should fail when id for non existent file is provided.',
    SUCCESSFUL_DELETE: 'Should pass when id for valid file is provided.',
    GRACEFUL_EXIT: 'Should fail gracefully when file cannot be deleted.',
  },
};

const GENERAL = {
  AUTH_SERVICE_UNREACHABLE: 'Should fail when authentication serivce is unreachable.',
  NO_TOKEN: 'Should fail when no token is supplied.',
  INVALID_TOKEN: 'Should fail when an invalid token is supplied.',
};

module.exports = {
  UPLOADS,
  DELETES,
  GENERAL,
};
