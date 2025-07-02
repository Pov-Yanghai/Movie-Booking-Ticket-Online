import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Movies.css'; 
const Movies = ({ selectedDay }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const url = selectedDay
          ? `http://localhost:5000/api/showtimes?day=${selectedDay}`
          : 'http://localhost:5000/api/movies';  
        const res = await axios.get(url);
        setMovies(res.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [selectedDay]);

  if (loading) return <p>Loading movies...</p>;

  return (
    <section id="movies" className="info-section">
      <h2>{selectedDay ? `Movies on ${selectedDay}` : 'All Movies'}</h2>
      <div className="movie-grid">
        {movies.length === 0 ? (
          <p>No movies found{selectedDay ? ` for ${selectedDay}` : ''}</p>
        ) : (
          movies.map(movie => (
            <div key={movie.id} className="movie-item">
              <img src={movie.image} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p className="price">{movie.price}</p>
              <p className="day">{movie.days}</p>
              <p className="promotion">{movie.promotion}</p>
              <a href={`/movies/${movie.id}`} className="btn">View Details</a>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Movies;
