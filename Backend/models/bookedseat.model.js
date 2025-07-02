import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const BookedSeat = sequelize.define('BookedSeat', {
  seat_number: { type: DataTypes.STRING, allowNull: false },
  booking_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  indexes: [
    { unique: true, fields: ['showtimeId', 'seat_number'] }
  ]
});

export default BookedSeat;
