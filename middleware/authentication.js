const jwt = require('jsonwebtoken');
const UnauthenticatedError = require('../errors/unauthenticated');
const User = require('../models/userModel');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findById(payload.userId).select('-password');

    const { userId, username } = payload;
    req.user = { userId, username };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access is route');
  }
};

module.exports = auth;
