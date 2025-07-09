import BookedSeat from '../models/bookedseat.model.js';

export const getBookedSeats = async (req, res) => {
  const { showtimeId } = req.params;

  try {
    const bookedSeats = await BookedSeat.findAll({
      where: { showtimeId },
      attributes: ['seat_number']
    });

    const seatNumbers = bookedSeats.map(seat => seat.seat_number);
    return res.json({ bookedSeats: seatNumbers });
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
