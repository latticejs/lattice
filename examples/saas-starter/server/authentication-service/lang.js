const FILE_ERRORS = {
  NOT_FOUND: 'File does not exist or it is not a file.',
};

const CONFIG_ERRORS = {
  AUHT0: {
    DOMAIN_NOT_DEFINED: 'Auth0 Domain must be defined.',
    CERT_NOT_FOUND: 'Certificate not found.',
    DOWNLOAD_ERROR: 'Unable to download certificate.',
  },
  NOT_CONFIGURED: 'No method to load keys have been configured.',
};

const INFO_MESSAGES = {
  AUHT0: {
    DOWNLOADING_CERT: 'Downloading certificate from auth0 domain.',
    USING_AUTH0: 'Using auth-0 cert.',
  },
  LOAD_PUB_KEY: 'Loading key from env.',
  LOAD_CERT_FROM_PATH: 'Loading cert file from path.',
};

module.exports = {
  FILE_ERRORS,
  CONFIG_ERRORS,
  INFO_MESSAGES,
};
