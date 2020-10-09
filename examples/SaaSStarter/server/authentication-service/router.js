const cert = require('./config').cert;
const jwt = require('jsonwebtoken');

const router = require('express').Router();

router.get('/validate', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'No token found' });
  let validToken;
  try {
    validToken = jwt.verify(token, await cert);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
  if (validToken) return res.status(200).json({ decoded: validToken });
});

module.exports = router;
