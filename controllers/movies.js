const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');
const BadRequestError = require('../errors/badRequest');

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
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    } next(e);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId)
      .orFail(() => new NotFoundError('Нет фильма по указанному id'));
    if (!movie.owner.equals(req.user._id)) {
      next(new ForbiddenError('Нельзя удалить фильм'));
      return;
    }
    const deletedMovie = await movie.remove();
    res.send({ data: deletedMovie, message: 'Фильм удален' });
  } catch (e) {
    next(e);
  }
};
