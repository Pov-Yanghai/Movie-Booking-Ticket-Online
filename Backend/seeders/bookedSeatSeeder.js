import BookedSeat from '../models/bookedseat.model.js';
import Showtime from '../models/showtime.model.js';

export const seedBookedSeats = async () => {
  const showtime = await Showtime.findOne({ where: { day: 'Monday' } });

  if (!showtime) {
    console.log('Showtime not found for Monday');
    return;
  }

  const seatNumbers = ['A1', 'A2', 'A3']; // 

  for (const seat_number of seatNumbers) {
    const exists = await BookedSeat.findOne({
      where: { seat_number, showtimeId: showtime.id }
    });

    if (!exists) {
      await BookedSeat.create({
        seat_number,
        booking_time: new Date(),
        showtimeId: showtime.id
      });
      console.log(`✅ Booked seat ${seat_number} for Monday showtime`);
    } else {
      console.log(`⚠️ Booked seat ${seat_number} for Monday already exists`);
    }
  }
};

// Call it here if running directly
seedBookedSeats();
