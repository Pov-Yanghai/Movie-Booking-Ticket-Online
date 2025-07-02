import express from 'express';
import { createBooking, getUserBookings } from '../Controllers/booking.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);

export default router;