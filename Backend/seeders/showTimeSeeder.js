import sequelize from '../utils/db.js';
import Showtime from '../models/showtime.model.js';

export async function seedShowtimes() {
  try {
    await sequelize.sync({ force: false }); // this will not create table when we change something in tables if we want change use True
    const showtimesData = [
      { movieId: 1, day: 'Monday', time: '10:00:00', screen: 'Screen 1' },
      { movieId: 1, day: 'Wednesday', time: '14:00:00', screen: 'Screen 1' },
      { movieId: 1, day: 'Friday', time: '18:00:00', screen: 'Screen 2' },

      { movieId: 2, day: 'Tuesday', time: '11:00:00', screen: 'Screen 3' },
      { movieId: 2, day: 'Thursday', time: '15:00:00', screen: 'Screen 3' },
      { movieId: 2, day: 'Saturday', time: '19:00:00', screen: 'Screen 3' },

      { movieId: 3, day: 'Wednesday', time: '12:00:00', screen: 'Screen 4' },
      { movieId: 3, day: 'Friday', time: '16:00:00', screen: 'Screen 4' },
      { movieId: 3, day: 'Sunday', time: '20:00:00', screen: 'Screen 4' },

      { movieId: 4, day: 'Monday', time: '10:30:00', screen: 'Screen 1' },
      { movieId: 4, day: 'Thursday', time: '14:30:00', screen: 'Screen 2' },
      { movieId: 4, day: 'Saturday', time: '18:30:00', screen: 'Screen 2' },

      { movieId: 5, day: 'Monday', time: '11:00:00', screen: 'Screen 1' },
      { movieId: 5, day: 'Thursday', time: '15:00:00', screen: 'Screen 1' },
      { movieId: 5, day: 'Saturday', time: '19:00:00', screen: 'Screen 1' },

      { movieId: 6, day: 'Tuesday', time: '10:00:00', screen: 'Screen 3' },
      { movieId: 6, day: 'Thursday', time: '14:00:00', screen: 'Screen 3' },
      { movieId: 6, day: 'Saturday', time: '18:00:00', screen: 'Screen 3' },

      { movieId: 7, day: 'Tuesday', time: '10:30:00', screen: 'Screen 3' },
      { movieId: 7, day: 'Thursday', time: '14:30:00', screen: 'Screen 3' },
      { movieId: 7, day: 'Saturday', time: '18:30:00', screen: 'Screen 3' },

      { movieId: 8, day: 'Tuesday', time: '11:00:00', screen: 'Screen 3' },
      { movieId: 8, day: 'Thursday', time: '15:00:00', screen: 'Screen 3' },
      { movieId: 8, day: 'Saturday', time: '19:00:00', screen: 'Screen 3' },

      { movieId: 9, day: 'Tuesday', time: '12:00:00', screen: 'Screen 4' },
      { movieId: 9, day: 'Thursday', time: '16:00:00', screen: 'Screen 4' },
      { movieId: 9, day: 'Saturday', time: '20:00:00', screen: 'Screen 4' },

      { movieId: 10, day: 'Tuesday', time: '10:00:00', screen: 'Screen 2' },
      { movieId: 10, day: 'Thursday', time: '14:00:00', screen: 'Screen 2' },
      { movieId: 10, day: 'Saturday', time: '18:00:00', screen: 'Screen 2' },

      { movieId: 11, day: 'Thursday', time: '10:00:00', screen: 'Screen 1' },
      { movieId: 11, day: 'Saturday', time: '14:00:00', screen: 'Screen 1' },
      { movieId: 11, day: 'Sunday', time: '18:00:00', screen: 'Screen 1' },

      { movieId: 12, day: 'Thursday', time: '11:00:00', screen: 'Screen 1' },
      { movieId: 12, day: 'Saturday', time: '15:00:00', screen: 'Screen 1' },
      { movieId: 12, day: 'Sunday', time: '19:00:00', screen: 'Screen 1' },

      { movieId: 13, day: 'Monday', time: '10:00:00', screen: 'Screen 4' },
      { movieId: 13, day: 'Tuesday', time: '14:00:00', screen: 'Screen 4' },
      { movieId: 13, day: 'Wednesday', time: '18:00:00', screen: 'Screen 4' },
      { movieId: 13, day: 'Thursday', time: '12:00:00', screen: 'Screen 4' },
      { movieId: 13, day: 'Friday', time: '16:00:00', screen: 'Screen 4' },

      { movieId: 14, day: 'Saturday', time: '10:00:00', screen: 'Screen 2' },
      { movieId: 14, day: 'Sunday', time: '14:00:00', screen: 'Screen 2' },

      { movieId: 15, day: 'Tuesday', time: '10:00:00', screen: 'Screen 3' },
      { movieId: 15, day: 'Thursday', time: '14:00:00', screen: 'Screen 3' },
      { movieId: 15, day: 'Saturday', time: '18:00:00', screen: 'Screen 3' },
    ];

    for (const showtime of showtimesData) {
      await Showtime.create(showtime);
    }

    console.log('Showtimes seeded successfully!');
  } catch (error) {
    console.error('Error seeding showtimes:', error);
  } finally {
    await sequelize.close();
  }
}
seedShowtimes(); 


