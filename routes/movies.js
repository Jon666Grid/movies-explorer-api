const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validCreateMovie,
  validDeleteMovie,
} = require('../middlewares/validators');

router.get('/', getMovies);
router.post('/', validCreateMovie, createMovie);
router.delete('/:movieId', validDeleteMovie, deleteMovie);

module.exports = router;
