import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Seat = sequelize.define('Seat', {
  seat_number: { type: DataTypes.STRING, allowNull: false }
});

export default Seat;
