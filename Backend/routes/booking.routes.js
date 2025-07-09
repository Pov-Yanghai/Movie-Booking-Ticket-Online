import express from 'express';
import { createBooking} from '../Controllers/booking.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createBooking);


export default router;