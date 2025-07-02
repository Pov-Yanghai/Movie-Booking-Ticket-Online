import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  days: { type: DataTypes.STRING },
  promotion: { type: DataTypes.TEXT }
});

export default Movie;
