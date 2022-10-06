const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError('Пользователь не найден.'));
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные при запросе пользователя.'));
      return;
    }
    next(e);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    ); if (!user) {
      next(new NotFoundError(`Пользователь по указанному - ${req.user._id}не найден.`));
      return;
    }
    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      return;
    }
    next(e);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashedPassword,
    });
    res.send(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные.'));
      return;
    }
    if (e.name === 'MongoError' || e.code === 11000) {
      next(new ConflictError('Указанный email уже занят'));
      return;
    }
    next(e);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      next(new NotFoundError('Пользователь не найден.'));
      return;
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.send({ token });
  } catch (e) {
    next(e);
  }
};
