const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { validSignIn, validSignUp } = require('../middlewares/validators');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/notFound');

router.post('/signup', validSignUp, createUser);
router.post('/signin', validSignIn, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый пользователь не найден'));
});

module.exports = router;
