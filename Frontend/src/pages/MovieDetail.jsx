import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movies } from '../components/data/movies';
import '../components/Movies/Moviesdetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const movie = movies.find(m => m.id === parseInt(id));
  const navigate = useNavigate();

  if (!movie) {
    return <h2>Movie not found</h2>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-image">
        <img src={movie.image} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p><strong>Price:</strong> {movie.price}</p>
        <p><strong>Days:</strong> {movie.days}</p>
        <p><strong>Promotion:</strong> {movie.promotion}</p>
        <button onClick={() => navigate(`/booking/${movie.id}`, { state: { moviePrice: parseFloat(movie.price.replace('$', '')) } })}>Book Now</button>
      </div>
    </div>
  );
};

export default MovieDetail;
