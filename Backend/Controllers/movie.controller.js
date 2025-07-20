import Movie from '../models/movies.model.js';
import Showtime from '../models/showtime.model.js';  // import your Showtime model
import {Op} from 'sequelize';
// Get all movies, optionally filter by day query param
export const getAllMovies = async (req, res) => {
  try {
    const { day } = req.query;

    const includeShowtimes = {
      model: Showtime,
      as: 'showtimes',   // this is the alias from association
    };

    if (day) {
      includeShowtimes.where = { day };  // filter showtimes by day
      includeShowtimes.required = true; // only movies with matching showtimes
    }

    const movies = await Movie.findAll({
      include: [includeShowtimes],
    });

    res.json(movies);
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create movie and related showtimes from days string
export const createMovie = async (req, res) => {
  try {
    const { title, description, price, image, days, promotion } = req.body;

    // Create the movie first
    const newMovie = await Movie.create({ title, description, price, image, days, promotion });

    // Parse days string, e.g. "Monday, Wednesday, Friday"
    const dayList = days.split(',').map(d => d.trim());

    // Create showtimes with default time or from req.body if you want
    const showtimeData = dayList.map(day => ({
      movieId: newMovie.id,
      day,
      time: "18:00",  // default time, change if you have time input
    }));

    // Bulk create showtimes
    await Showtime.bulkCreate(showtimeData);

    // Respond with the new movie (optionally you can include showtimes)
    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Create movie error:', error);
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

// Search Movie apply in Booking Section 
export const searchMovies = async (req, res) => {
  const { q } = req.query;
  try {
    const movies = await Movie.findAll({
      where: {
        title: {
          [Op.like]: `%${q}%`  // <-- use Op.like for MySQL
        }
      }
    });

    if (!movies.length) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};