import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';
import Booking from './booking.model.js';

const Payment = sequelize.define('Payment', {
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qrCodeUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Payment;
