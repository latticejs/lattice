/**
 *  @fileOverview Configures the and exports the certificate used to verify the JWT tokens.
 *
 *  @author       Nowfal Nazar
 *
 *  @requires     NPM:axios
 */

const path = require('path');
const axios = require('axios');
const fs = require('fs');
const logger = require('./logger');

const {
  FILE_ERRORS: { NOT_FOUND },
  CONFIG_ERRORS: {
    AUHT0: { DOMAIN_NOT_DEFINED, DOWNLOAD_ERROR, CERT_NOT_FOUND },
    NOT_CONFIGURED,
  },
  INFO_MESSAGES: {
    AUHT0: { DOWNLOADING_CERT, USING_AUTH0 },
    LOAD_PUB_KEY,
    LOAD_CERT_FROM_PATH,
  },
} = require('./lang');

/**
 * Loads the key from a path specified by the CERT_PATH env variable.
 * @method
 * @returns {String} The key that is used to decode auth-0 tokens
 */
const loadCertFromPath = () => {
  const certExists = fs.existsSync(process.env.CERT_PATH) && fs.lstatSync(process.env.CERT_PATH).isFile();
  if (!certExists) {
    logger.error(NOT_FOUND);
    process.exit(1);
  }
  const data = fs.readFileSync(process.env.CERT_PATH, 'utf-8');
  return data;
};

/**
 * Loads the key from the keys folder specified by the AUTH0_DOMAIN env variable. If the file is not present it will
 * attempt to download the certificate from the domain specified by AUTH0_DOMAIN.
 * @async
 * @method
 * @returns {String} The key that is used to decode auth-0 tokens
 */

const loadAuthZeroFile = async () => {
  if (!process.env.AUTH0_DOMAIN) {
    logger.error(DOMAIN_NOT_DEFINED);
    process.exit(1);
  }
  const certPath = path.join(__dirname, 'keys', `${process.env.AUTH0_DOMAIN}.pem`);
  const certExists = fs.existsSync(certPath) && fs.lstatSync(certPath).isFile();
  if (!certExists) {
    logger.error(CERT_NOT_FOUND);
    try {
      logger.info(DOWNLOADING_CERT);
      const resp = await axios.get(`https://${process.env.AUTH0_DOMAIN}.auth0.com/pem`);
      fs.writeFileSync(path.join(__dirname, 'keys', `${process.env.AUTH0_DOMAIN}.pem`), resp.data);
      return resp.data;
    } catch (error) {
      logger.log(DOWNLOAD_ERROR);
      process.exit(1);
    }
  } else {
    return fs.readFileSync(certPath, 'utf-8');
  }
};

/**
 * Retrieves the key that will be used to validate the tokens. Exports the key based on the env configuration.
 * @async
 * @method
 * @returns {String} The key that is used to decode auth-0 tokens
 * @throws {NotFoundError} When the user is not found.
 */

const loadCert = async () => {
  if (process.env.PUB_KEY) {
    logger.info(LOAD_PUB_KEY);
    return process.env.PUB_KEY;
  }
  if (process.env.CERT_PATH) {
    logger.info(LOAD_CERT_FROM_PATH);
    return loadCertFromPath();
  } else if (process.env.USE_AUTH0) {
    logger.info(USING_AUTH0);
    return loadAuthZeroFile();
  } else {
    logger.error(NOT_CONFIGURED);
    process.exit(1);
  }
};

const cert = loadCert();

module.exports = {
  cert,
};
