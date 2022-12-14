const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/badRequest');
const { MESSAGES } = require('../utils/constants');

const url = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new BadRequestError(MESSAGES.URL_INCORRECT);
  }
  return value;
};

const validSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const validSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const validUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

const validCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(url),
    trailerLink: Joi.string().custom(url),
    thumbnail: Joi.string().custom(url),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validSignIn,
  validSignUp,
  validUpdateUser,
  validCreateMovie,
  validDeleteMovie,
};
