import Movie from '../models/movies.model.js';
import Showtime from '../models/showtime.model.js';
import sequelize from '../utils/db.js'; // Required for raw SQL functions

// Get movies that have showtimes on a specific day
export const getMoviesByDay = async (req, res) => {
  try {
    const { day } = req.query;

    if (!day) {
      return res.status(400).json({ message: 'Day query parameter is required' });
    }

    const movies = await Movie.findAll({
      include: [{
        model: Showtime,
        as: 'showtimes',
        where: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('Showtimes.day')),
          day.toLowerCase()
        ),
        attributes: ['day', 'time', 'screen']
      }],
      distinct: true
    });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies by day:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all showtimes with their associated movies
export const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.findAll({
      include: [Movie]
    });

    res.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
