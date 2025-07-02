import Booking from '../models/booking.model.js';
import Movie from '../models/movies.model.js';
import Showtime from '../models/showtime.model.js';
import Seat from '../models/seat.model.js';

export const createBooking = async (req, res) => {
  try {
    const { showtimeId, seatIds, totalPrice } = req.body;

    if (!showtimeId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({ message: 'Showtime and seat(s) are required' });
    }

    const userId = req.user.id;

    // Create booking with user, showtime and total price
    const booking = await Booking.create({ userId, showtimeId, total_price: totalPrice });

    // Update seat statuses and assign them to this booking
    await Promise.all(seatIds.map(async (seatId) => {
      await Seat.update(
        {
          isBooked: true,
          bookingId: booking.id
        },
        {
          where: {
            id: seatId,
            showtimeId
          }
        }
      );
    }));

    res.status(201).json({ message: 'Booking created successfully', bookingId: booking.id });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Showtime,
          include: [Movie]
        },
        {
          model: Seat
        }
      ]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
