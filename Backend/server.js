import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import sequelize from './utils/db.js'; 
import './models/index.js'; 

// Routes and middleware
import authRoutes from './routes/auth.routes.js';
import authMiddleware from './middleware/auth.middleware.js';
import logger from './middleware/logger.middleware.js';
import movieRoutes from './routes/movies.routes.js';
import showtimeRoutes from './routes/showtimes.routes.js';
import bookingRoutes from './routes/booking.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/public', express.static('public'));
// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// Static files
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.resolve('public/images')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);

// Protected route example
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You accessed a protected route!' });
});

//Sequelize: Sync DB and start server
sequelize.sync({ alter: true }) // Change to { force: true } only during development reset
  .then(() => {
    console.log('Database connected & synced');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
