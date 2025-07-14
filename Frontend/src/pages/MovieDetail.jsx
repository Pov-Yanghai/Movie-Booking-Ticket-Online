import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/Movies/Moviesdetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShowtime, setSelectedShowtime] = useState("");

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      try {
        const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(movieRes.data);

        const showtimeRes = await axios.get(`http://localhost:5000/api/showtimes/${id}`);
        setShowtimes(showtimeRes.data);
      } catch (error) {
        console.error("Failed to fetch movie or showtimes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieAndShowtimes();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!movie) return <h2>Movie not found</h2>;

  const handleBookNow = () => {
    if (!selectedShowtime) {
      alert("Please select a showtime");
      return;
    }

    const selected = showtimes.find(s => s.id === parseInt(selectedShowtime));

    navigate("/booking-seat", {
      state: {
        movieId: movie.id,
        moviePrice: parseFloat(movie.price.replace("$", "")),
        showtimeId: selected.id,
        screen: selected.screen,
        time: selected.time,
        day: selected.day,
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
        <p><strong>Price:</strong> {movie.price}</p>
        <p><strong>Days:</strong> {movie.days}</p>
        <p><strong>Promotion:</strong> {movie.promotion}</p>

        <label>Select Showtime (Day / Time / Screen):</label>
        <select
          value={selectedShowtime}
          onChange={(e) => setSelectedShowtime(e.target.value)}
        >
          <option value="">Select</option>
          {showtimes.map(showtime => (
            <option key={showtime.id} value={showtime.id}>
              {showtime.day} - {showtime.time} ({showtime.screen})
            </option>
          ))}
        </select>

        <button onClick={handleBookNow}>Book Now</button>
      </div>
    </div>
  );
};

export default MovieDetail;
