import sequelize from '../utils/db.js';
import { seedMovies } from './movieSeeder.js';
import { seedUsers } from './userSeeder.js';
import { seedShowtimes } from './showTimeSeeder.js';
import { seedSeats } from './seatSeeder.js';
import { seedBookings } from './bookingSeeder.js';
import { seedBookedSeats } from './bookedSeatSeeder.js';
import { seedMessages } from './messageSeeder.js';

const runAll = async () => {
  try {
    await sequelize.sync(); // do not force drop
    await seedMovies();
    await seedUsers();
    await seedShowtimes();
    await seedSeats();
    await seedBookings();
    await seedBookedSeats();
    await seedMessages();
    console.log('✅ All seeders completed');
  } catch (err) {
    console.error('❌ Seeder failed:', err);
  } finally {
    await sequelize.close();
  }
};

runAll();
