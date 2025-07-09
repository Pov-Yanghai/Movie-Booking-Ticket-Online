import Booking from '../models/booking.model.js';

const bookings = [
  { userId: 1, movieId: 1, showtimeId: 1, name: 'John Doe', phone: '012345678', total_price: 20.0 },
  { userId: 2, movieId: 2, showtimeId: 2, name: 'Jane Smith', phone: '098765432', total_price: 15.0 }
];


export const seedBookings = async () => {
  for (const booking of bookings) {
    const exists = await Booking.findOne({ where: { name: booking.name, phone: booking.phone } });
    if (!exists) {
      await Booking.create(booking);
      console.log(`✅ Booking added for: ${booking.name}`);
    } else {
      console.log(`⚠️ Booking already exists for: ${booking.name}`);
    }
  }
};
seedBookings();
