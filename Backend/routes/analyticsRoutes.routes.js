import express from 'express';
import {
  getBookingsPerMovie,
  getUserGrowth,
  getRevenueByMovie,
  getTotalUsers,
  getTotalIncome,
  getMessages
} from '../Controllers/analyticsController.js';

const router = express.Router();

// Analytics routes
router.get('/bookings-per-movie', getBookingsPerMovie);
router.get('/user-growth', getUserGrowth);
router.get('/revenue-by-movie', getRevenueByMovie);
router.get('/total-users', getTotalUsers);
router.get('/total-income', getTotalIncome);
router.get('/messages', getMessages);

export default router;