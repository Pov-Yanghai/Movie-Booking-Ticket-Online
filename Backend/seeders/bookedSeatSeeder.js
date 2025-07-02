import BookedSeat from '../models/bookedseat.model.js';
import Showtime from '../models/showtime.model.js';

export const seedBookedSeats = async () => {
  const showtime = await Showtime.findOne({ where: { day: 'Monday' } });
  if (!showtime) {
    console.log('❌ Showtime not found for Monday');
    return;
  }

  const seat_number = 'A1';
  const exists = await BookedSeat.findOne({ where: { seat_number, showtimeId: showtime.id } });
  if (!exists) {
    await BookedSeat.create({
      seat_number,
      booking_time: new Date(),
      showtimeId: showtime.id
    });
    console.log(`✅ Booked seat A1 for Monday showtime`);
  } else {
    console.log(`⚠️ Booked seat A1 for Monday already exists`);
  }
};
