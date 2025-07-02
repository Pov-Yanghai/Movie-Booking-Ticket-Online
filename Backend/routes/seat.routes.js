import express from 'express';
import { getSeatsByShowtime, bookSeat } from '../Controllers/seat.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:showtimeId', getSeatsByShowtime);
router.post('/book', authMiddleware, bookSeat);

export default router;