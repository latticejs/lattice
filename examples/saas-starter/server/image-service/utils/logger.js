const axios = require('axios');

const log = async (level, message) => {
  if (process.env.LOG_SERVICE) {
    await axios.post(process.env.LOG_SERVICE, {
      service: 'image',
      level,
      message,
    });
  }
};

module.exports = {
  log,
};
