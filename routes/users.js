const router = require('express').Router();
const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');
const {
  validUpdateUser,
} = require('../middlewares/validators');

router.get('/me', getUserInfo);
router.patch('/me', validUpdateUser, updateUser);

module.exports = router;
