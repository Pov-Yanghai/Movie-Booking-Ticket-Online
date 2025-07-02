import User from './users.model.js';
import Movie from './movies.model.js';
import Showtime from './showtime.model.js';
import Booking from './booking.model.js';
import Seat from './seat.model.js';
import BookedSeat from './bookedseat.model.js'

// Relationships
User.hasMany(Booking);
Booking.belongsTo(User);

Movie.hasMany(Booking);
Booking.belongsTo(Movie);

Movie.hasMany(Showtime);
Showtime.belongsTo(Movie);

Booking.hasMany(Seat);
Seat.belongsTo(Booking);

Showtime.hasMany(BookedSeat);
BookedSeat.belongsTo(Showtime);

User.hasMany(BookedSeat);
BookedSeat.belongsTo(User);

export {
  User,
  Movie,
  Showtime,
  Booking,
  Seat,
  BookedSeat
};
