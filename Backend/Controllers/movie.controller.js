import Movie from '../models/movies.model.js';

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Create movie 
export const createMovie = async (req, res) => {
  try {
    const { title, description, price, image, days, promotion } = req.body;
    const newMovie = await Movie.create({ title, description, price, image, days, promotion });
    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Create movie error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
