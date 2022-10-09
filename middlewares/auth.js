const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const { MESSAGES } = require('../utils/constants');
const { JWT_SECRET_DEV } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(MESSAGES.AUTHORIZATION_REQUIRED));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (e) {
    next(new UnauthorizedError(MESSAGES.AUTHORIZATION_REQUIRED));
    return;
  }
  req.user = payload;
  next();
};
