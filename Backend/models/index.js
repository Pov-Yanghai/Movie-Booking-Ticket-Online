import User from './users.model.js';
import Movie from './movies.model.js';
import Showtime from './showtime.model.js';
import Booking from './booking.model.js';
import Seat from './seat.model.js';
import BookedSeat from './bookedseat.model.js';
import Payment from './payment.model.js';
// User → Bookings
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User → BookedSeats
User.hasMany(BookedSeat, { foreignKey: 'userId', as: 'bookedSeats' });
BookedSeat.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// =========================
// Movies
// =========================

// Movie → Bookings
Movie.hasMany(Booking, { foreignKey: 'movieId', as: 'bookings' });
Booking.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

// Movie → Showtimes
Movie.hasMany(Showtime, { foreignKey: 'movieId', as: 'showtimes' });
Showtime.belongsTo(Movie, { foreignKey: 'movieId', as: 'movie' });

// Booking → Seats
Booking.hasMany(Seat, { foreignKey: 'bookingId', as: 'seats' });
Seat.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

// Showtime → BookedSeats
Showtime.hasMany(BookedSeat, { foreignKey: 'showtimeId', as: 'bookedSeats' });
BookedSeat.belongsTo(Showtime, { foreignKey: 'showtimeId', as: 'showtime' });

//Booking -> Payment 
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });


export {
  User,
  Movie,
  Showtime,
  Booking,
  Seat,
  BookedSeat,
  Payment
};
