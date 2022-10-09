const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');
const BadRequestError = require('../errors/badRequest');
const { MESSAGES } = require('../utils/constants');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      owner: req.user._id,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    });
    res.send(movie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError(MESSAGES.INCORRECT_DATA));
      return;
    } next(e);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId)
      .orFail(() => new NotFoundError(MESSAGES.MOVIE_NOT_FOUND));
    if (!movie.owner.equals(req.user._id)) {
      next(new ForbiddenError(MESSAGES.MOVIE_CANNOT_DELETE));
      return;
    }
    const deletedMovie = await movie.remove();
    res.send({ data: deletedMovie, message: MESSAGES.MOVIE_DELETED });
  } catch (e) {
    next(e);
  }
};
