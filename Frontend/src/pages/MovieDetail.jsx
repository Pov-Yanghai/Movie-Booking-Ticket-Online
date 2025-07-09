import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { movies } from "../components/data/movies";
import "../components/Movies/Moviesdetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState("");

  if (!movie) return <h2>Movie not found</h2>;

  const handleBookNow = () => {
    if (!selectedShowtime) {
      alert("Please select a showtime");
      return;
    }

    navigate("/booking-seat", {
      state: {
      movieId: movie.id,
      moviePrice: parseFloat(movie.price.replace("$", "")),
      showtimeId: parseInt(selectedShowtime),
      },
    });
  };

  return (
    <div className="movie-detail">
      <div className="movie-image">
        <img src={movie.image} alt={movie.title} />
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p>
          <strong>Price:</strong> {movie.price}
        </p>
        <p>
          <strong>Days:</strong> {movie.days}
        </p>
        <p>
          <strong>Promotion:</strong> {movie.promotion}
        </p>

        <label>Select Showtime:</label>
        <select
          value={selectedShowtime}
          onChange={(e) => setSelectedShowtime(e.target.value)}
        >
          <option value="">Select Time</option>
          <option value="1">10:00 AM</option>
          <option value="2">1:30 PM</option>
          <option value="3">6:45 PM</option>
        </select>

        <button onClick={handleBookNow}>Book Now</button>
      </div>
    </div>
  );
};

export default MovieDetail;
