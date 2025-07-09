import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js'; 

const Booking = sequelize.define('Booking', {
  userId: { type: DataTypes.INTEGER, allowNull: false }, 
  movieId: { type: DataTypes.INTEGER, allowNull: false },
  showtimeId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: true });

export default Booking;
