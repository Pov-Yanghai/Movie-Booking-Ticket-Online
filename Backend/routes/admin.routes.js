import express from 'express';
import authenticate, {isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { createMovie,updateMovie,deleteMovie,getIncomeReport, getRecentBookings } from '../Controllers/admin.controller.js';
import { getShowtimesByMovieId } from '../Controllers/showtimes.controller.js';

import {getAllMessages} from '../Controllers/message.controller.js'; 
const router = express.Router();

router.use(authenticate, isAdmin); // protect all admin routes

router.post('/movies',upload.single('image'),createMovie);  // 
router.put('/movies/:id', updateMovie);   // update movie details
router.delete('/movies/:id', deleteMovie);  // delete movie by id
router.get('/income', getIncomeReport);  // get total income from bookings
router.get('/showtimes/:movieId', getShowtimesByMovieId);  // get showtimes by movie id
router.get('/messages', getAllMessages); // get all messages from users
router.get('/recent-bookings', getRecentBookings);

export default router;