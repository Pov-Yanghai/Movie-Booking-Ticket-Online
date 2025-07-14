import express from 'express';
import { getBookedSeats } from '../Controllers/bookedSeats.controller.js';

const router = express.Router();

router.get('/booked/:showtimeId', getBookedSeats);

export default router;
