import { Movie, Booking, Showtime, User, Message } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../utils/db.js';
// Get bookings per movie
export const getBookingsPerMovie = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      attributes: [
        'movieId',
        [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'bookings'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
      ],
      group: ['movieId', 'movie.id'],
      include: [{
        model: Movie,
        as: 'movie',
        attributes: ['title']
      }],
      raw: true,
      nest: true
    });

    const result = bookings.map(item => ({
      title: item.movie.title,
      bookings: item.bookings,
      revenue: parseFloat(item.revenue) || 0
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching bookings per movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user growth over time
export const getUserGrowth = async (req, res) => {
  try {
    // Get user signups per month
    const userGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'users']
      ],
      group: ['month'],
      order: [['month', 'ASC']],
      raw: true
    });

    res.json(userGrowth);
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get revenue by movie
export const getRevenueByMovie = async (req, res) => {
  try {
    const revenue = await Booking.findAll({
      attributes: [
        'movieId',
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
      ],
      group: ['movieId'],
      include: [{
        model: Movie,
        as: 'movie',
        attributes: ['title']
      }],
      raw: true
    });

    const result = revenue.map(item => ({
      title: item['Movie.title'],
      revenue: parseFloat(item.revenue) || 0
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching revenue by movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get total users count
export const getTotalUsers = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ totalUsers: count });
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get total income
export const getTotalIncome = async (req, res) => {
  try {
    const result = await Booking.sum('total_price');
    res.json({ totalIncome: result || 0 });
  } catch (error) {
    console.error('Error fetching total income:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
};

