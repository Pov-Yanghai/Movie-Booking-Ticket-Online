import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const Showtime = sequelize.define('Showtime', {
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  screen: {
    type: DataTypes.STRING,
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'movies',   
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
});

export default Showtime;
