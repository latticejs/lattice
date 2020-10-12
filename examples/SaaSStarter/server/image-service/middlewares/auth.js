const axios = require('axios');
const { RESPONSE_MESSAGES } = require('../lang');
/**
 * @description Used to validate the JWT tokens by calling the auth service API's
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const validateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: RESPONSE_MESSAGES.NO_AUTH_TOKEN });
  }
  try {
    await axios.get(`${process.env.AUTH_SERVICE}/token/validate?token=${token.split(' ')[1]}`);
    next();
  } catch (error) {
    if (error.isAxiosError && error.response && error.response.status === 401) {
      return res.status(401).json({ message: RESPONSE_MESSAGES.INVALID_AUTH_TOKEN });
    }
    res.status(502).json({ message: RESPONSE_MESSAGES.UNREACHABLE_AUTH_SERVICE });
    next(error);
  }
};

module.exports = {
  validateToken,
};
