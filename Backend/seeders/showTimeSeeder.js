import Showtime from '../models/showtime.model.js';

const showtimes = [
  { day: 'Monday', time: '18:00:00', screen: 'Screen 1' },
  { day: 'Wednesday', time: '20:00:00', screen: 'Screen 2' }
];

export const seedShowtimes = async () => {
  for (const showtime of showtimes) {
    const exists = await Showtime.findOne({ where: { day: showtime.day, time: showtime.time } });
    if (!exists) {
      await Showtime.create(showtime);
      console.log(`✅ Showtime added: ${showtime.day} ${showtime.time}`);
    } else {
      console.log(`⚠️ Showtime exists: ${showtime.day} ${showtime.time}`);
    }
  }
};
