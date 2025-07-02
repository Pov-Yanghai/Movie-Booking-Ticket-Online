import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js'; 

const Message = sequelize.define('Message', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: true });

export default Message;
