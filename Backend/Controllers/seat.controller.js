import Booking from '../models/booking.model.js';
import Seat from '../models/seat.model.js';
import sequelize from '../utils/db.js';

// POST /api/bookings
export const createBooking = async (req, res) => {
  const { userId, movieId, showtimeId, name, phone, selectedSeats, moviePrice } = req.body;

  if (!userId || !movieId || !showtimeId || !name || !phone || !selectedSeats?.length) {
    return res.status(400).json({ message: 'Missing required booking data' });
  }

  // Calculate total price
  const totalPrice = moviePrice * selectedSeats.length;

  // Use transaction for safety (all or nothing)
  const t = await sequelize.transaction();

  try {
    // 1. Create booking record
    const booking = await Booking.create({
      userId,
      movieId,
      name,
      phone,
      total_price: totalPrice
    }, { transaction: t });

    // 2. Create seat records linked to booking
    const seatRecords = selectedSeats.map(seatNumber => ({
      bookingId: booking.id,
      seat_number: seatNumber
    }));

    await Seat.bulkCreate(seatRecords, { transaction: t });

    // Commit transaction
    await t.commit();

    return res.status(201).json({
      message: 'Booking successful',
      bookingId: booking.id,
      bookedSeats: selectedSeats
    });

  } catch (error) {
    await t.rollback();
    console.error('Booking creation error:', error);
    return res.status(500).json({ message: 'Failed to create booking' });
  }
};
