import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';
import Movie from './movies.model.js';

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
  }
});


export default Showtime;
