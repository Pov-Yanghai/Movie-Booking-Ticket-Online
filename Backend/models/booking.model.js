import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js'; 

const Booking = sequelize.define('Booking', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { timestamps: true });

export default Booking;
