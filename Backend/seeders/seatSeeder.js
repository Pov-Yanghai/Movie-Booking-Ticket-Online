import Seat from '../models/seat.model.js';

const seats = [
  { seat_number: 'A1' },
  { seat_number: 'A2' },
  { seat_number: 'B1' },
  { seat_number: 'B2' }
];

export const seedSeats = async () => {
  for (const seat of seats) {
    const exists = await Seat.findOne({ where: { seat_number: seat.seat_number } });
    if (!exists) {
      await Seat.create(seat);
      console.log(`✅ Seat added: ${seat.seat_number}`);
    } else {
      console.log(`⚠️ Seat already exists: ${seat.seat_number}`);
    }
  }
};
