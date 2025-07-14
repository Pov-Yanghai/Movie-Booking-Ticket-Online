// controllers/admin.controller.js
import Movie from "../models/movies.model.js";
import Showtime from "../models/showtime.model.js";
import Booking from "../models/booking.model.js";
export const createMovie = async (req, res) => {
  try {
    const { title, price, days, promotion } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null;
    const showtimes = JSON.parse(req.body.showtimes || "[]");

    // 1. Create movie
    const movie = await Movie.create({ title, price, image, days, promotion });

    // 2. Insert showtimes
    if (showtimes.length > 0) {
      await Promise.all(
        showtimes.map((st) =>
          Showtime.create({
            movieId: movie.id,
            day: st.day,
            time: st.time,
            screen: st.screen,
          })
        )
      );
    }

    res.status(201).json(movie);
  } catch (error) {
    console.error("Failed to create movie:", error);
    res.status(500).json({ message: "Failed to create movie" });
  }
};
// update movie details
export const updateMovie = async (req, res) => {
  try {
    await Movie.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Movie updated" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};
// delete movie by id
export const deleteMovie = async (req, res) => {
  try {
    await Movie.destroy({ where: { id: req.params.id } });
    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
// will sum total income from booking 
export const getIncomeReport = async (req, res) => {
  try {
    const totalIncome = await Booking.sum('total_price');
    res.json({ totalIncome: totalIncome || 0 });
  } catch (error) {
    console.error('Error calculating total income:', error);
    res.status(500).json({ message: 'Failed to calculate total income' });
  }
};

// Get all movies with their showtimes
export const getShowtimesByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const showtimes = await Showtime.findAll({ where: { movieId } });
    res.json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    res.status(500).json({ message: "Failed to fetch showtimes" });
  }
};

