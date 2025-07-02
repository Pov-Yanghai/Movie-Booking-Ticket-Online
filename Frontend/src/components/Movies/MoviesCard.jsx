import React from 'react';
import { Link } from 'react-router-dom';
import './Movies.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-item">
      <Link to={`/movies/${movie.id}`}>
        <img src={movie.image} alt={movie.title} />
        <h3>{movie.title}</h3>
        <p className="price">{movie.price}</p>
        <p className="day">{movie.days}</p>
        <p className="promotion">{movie.promotion}</p>
      </Link>
    </div>
  );
};

export default MovieCard;
