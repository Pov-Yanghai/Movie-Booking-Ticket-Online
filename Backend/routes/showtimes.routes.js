import express from 'express';
import { getMoviesByDay, getAllShowtimes, getShowtimesByMovieId} from '../Controllers/showtimes.controller.js';

const router = express.Router();

// Route to get movies by day with their showtimes
router.get('/showtimes', getMoviesByDay);

//  to get all showtimes with movies 
router.get('/all-showtimes', getAllShowtimes);
router.get('/:movieId',getShowtimesByMovieId);
export default router;
