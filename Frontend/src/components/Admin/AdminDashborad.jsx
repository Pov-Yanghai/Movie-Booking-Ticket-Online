import React, { useEffect, useState } from "react";
import axios from "axios";
// admin dashboard component 
const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);   // store movie data 
  const [income, setIncome] = useState(0); // store total income from bookings 
  const [loading, setLoading] = useState(true); // loading state for laoding screen
  const [error, setError] = useState("");  // store error message for laoding screen 
  const [selectedDay, setSelectedDay] = useState(""); // store selected day for filtering movies
  const [activeTab, setActiveTab] = useState("movies");  // which tab is active movies tab for form tab for admin dashborad 
  const [showtimes, setShowtimes] = useState([{ day: "", time: "", screen: "" }]);  // store showtimes data (day, time, screen) it is array 
// handle change in showtimes fields (day, time, screen)
  const handleShowtimeChange = (index, field, value) => {
    const updated = [...showtimes];
    updated[index][field] = value;
    setShowtimes(updated);
  };
// filter movies based on selected day
  const filteredMovies = selectedDay
    ? movies.filter((movie) =>
        movie.days
          .split(",")
          .map((d) => d.trim().toLowerCase())
          .includes(selectedDay.toLowerCase())
      )
    : movies;
  // form state to store movie details for adding or updating movie
  const [form, setForm] = useState({
    id: null,
    title: "",
    price: "",
    image: null,
    days: "",
    promotion: "",
  });
// store the slelected movie id for showtimes
  const [selectedMovieId, setSelectedMovieId] = useState(null);
// this for when page loads, fetch movies and income data 
  useEffect(() => {
    fetchData();
  }, []);

// fetch movies and income data from backend
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const [moviesRes, incomeRes] = await Promise.all([
        axios.get("http://localhost:5000/api/movies"),
        axios.get("http://localhost:5000/api/admin/income", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMovies(moviesRes.data);
      setIncome(incomeRes.data.totalIncome || 0);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("You must be an admin to view this page.");
    } finally {
      setLoading(false);
    }
  };
// fetch showtimes for a specific movie by its ID 
  const fetchShowtimes = async (movieId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/showtimes/${movieId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowtimes(res.data);
      setSelectedMovieId(movieId);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
      setShowtimes([]);
    }
  };
// delete movie by id of movie
  const deleteMovie = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/admin/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) => prev.filter((m) => m.id !== id));
      alert("Movie deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete movie");
    }
  };
  // update form state when the user types in form fields or selects a file 
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
// submit form to create or update movie
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      if (form.image) {
        formData.append("image", form.image);
      }
      formData.append("days", form.days);
      formData.append("promotion", form.promotion);
      formData.append("showtimes", JSON.stringify(showtimes));

      if (form.id) {
        await axios.put(
          `http://localhost:5000/api/admin/movies/${form.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Movie updated successfully");
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/admin/movies",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setMovies((prev) => [...prev, res.data]);
        alert("Movie created successfully");
      }
// Reset form after submit success 
      setForm({ id: null, title: "", price: "", image: null, days: "", promotion: "" });
      setShowtimes([{ day: "", time: "", screen: "" }]);
      fetchData();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit movie");
    }
  };

  // Populate form when editing a movie 
  const handleEditClick = (movie) => {
    setForm({
      id: movie.id,
      title: movie.title,
      price: movie.price.toString(),
      image: null,
      days: movie.days || "",
      promotion: movie.promotion || "",
    });
    setActiveTab("form");
  };
// reset form to a  blank state 
  const resetForm = () => {
    setForm({ id: null, title: "", price: "", image: null, days: "", promotion: "" });
    setShowtimes([{ day: "", time: "", screen: "" }]);
  };
 
  if (loading) return <p className="loading-screen">Loading admin dashboard...</p>; // show loadinf screen when laoding 
  if (error) return <p className="error-message">{error}</p>; // error message 
// UI for dash borad for css can not separate beacuse there are issue with that 
  return (

    <div className="admin-dashboard">
      {/* Header with income display */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Cinema Admin Dashboard</h1>
          <div className="income-card">
            <h2>Total Income</h2>
            <div className="income-amount">${income.toFixed(2)}</div>
            <div className="income-source">From all bookings</div>
          </div>
        </div>
      </div>
      {/* Tabs: Manage movies or Add/Edit Form */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === "movies" ? "active" : ""}`}
          onClick={() => setActiveTab("movies")}
        >
          Manage Movies
        </button>
        <button 
          className={`tab-button ${activeTab === "form" ? "active" : ""}`}
          onClick={() => setActiveTab("form")}
        >
          {form.id ? "Update Movie" : "Add Movie"}
        </button>
      </div>

      <div className="dashboard-content">

        {/* ----- Movie Management  ----- */}
        {activeTab === "movies" && (
          <div className="movies-section">
            <div className="section-header">
              <h2>Movie Management</h2>
               {/* Filter movies by playing day */}
              <div className="filter-controls">
                <label htmlFor="dayFilter">Filter by Day:</label>
                <select
                  id="dayFilter"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  <option value="">All Days</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
                <button 
                  className="add-movie-btn"
                  onClick={() => {
                    resetForm();
                    setActiveTab("form");
                  }}
                >
                  ➕ Add New Movie
                </button>
              </div>
            </div>

            {/* Show when no movies exist */}
            {filteredMovies.length === 0 ? (
              <div className="no-movies">
                <p>No movies found.</p>
                <button 
                  className="add-movie-btn"
                  onClick={() => {
                    resetForm();
                    setActiveTab("form");
                  }}
                >
                  ➕ Add Your First Movie
                </button>
              </div>
            ) : (
              <div className="movie-grid">
                {filteredMovies.map((m) => (
                  <div key={m.id} className="movie-card">
                    {m.image && (
                      <div className="movie-image">
                        <img
                          src={`http://localhost:5000/uploads/${m.image}`}
                          alt={m.title}
                        />
                      </div>
                    )}

                    {/* Movie Info */}
                    <div className="movie-details">
                      <h3>{m.title}</h3>
                      <div className="movie-info">
                        <div className="info-item">
                          <span>Price:</span> ${Number(m.price).toFixed(2)}
                        </div>
                        <div className="info-item">
                          <span>Days:</span> {m.days}
                        </div>
                        {m.promotion && (
                          <div className="promotion-badge">
                            Promotion: {m.promotion}
                          </div>
                        )}
                      </div>
                    </div>


                      {/* Action Buttons */}
                    <div className="movie-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(m)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteMovie(m.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="showtime-btn"
                        onClick={() => fetchShowtimes(m.id)}
                      >
                        Showtimes
                      </button>
                    </div>

                     {/* Showtimes Section */}
                    
                    {selectedMovieId === m.id && (
                      <div className="showtime-section">
                        <h4>🎟️ Showtimes</h4>
                        {showtimes.length === 0 ? (
                          <p>No showtimes available</p>
                        ) : (
                          <ul>
                            {showtimes.map((s) => (
                              <li key={s.id}>
                                <span className="showtime-day">{s.day}</span>
                                <span className="showtime-time">{s.time}</span>
                                <span className="showtime-screen">{s.screen}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <button 
                          className="close-showtimes"
                          onClick={() => setSelectedMovieId(null)}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* ----- Add / Edit Movie Form ----- */}
        {activeTab === "form" && (
          <div className="form-section">
            <h2>{form.id ? "Update Movie" : "Add New Movie"}</h2>
            <form onSubmit={handleFormSubmit} className="movie-form">
                {/* Movie title and price */}
              <div className="form-row">
                <div className="form-group">
                  <label>Movie Title</label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Enter movie title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ticket Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    step="1"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              {/* Days and Promotion */}
              <div className="form-row">
                <div className="form-group">
                  <label>Playing Days (comma separated)</label>
                  <input
                    name="days"
                    type="text"
                    placeholder="Playing: Monday, Wednesday, Friday"
                    value={form.days}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Promotion (optional)</label>
                  <input
                    name="promotion"
                    type="text"
                    placeholder="e.g., 2-for-1 Tuesdays"
                    value={form.promotion}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Image file upload */}
              <div className="form-group">
                <label>Movie Poster</label>
                <div className="file-upload">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFormChange}
                  />
                  <span className="file-info">
                    {form.image ? form.image.name : "Select an image file"}
                  </span>
                </div>
              </div>
              {/* Showtimes form */}
              <div className="showtimes-section">
                <h3>Showtimes</h3>
                {showtimes.map((s, i) => (
                  <div key={i} className="showtime-row">
                    <div className="form-group">
                      <label>Day</label>
                      <input
                        type="text"
                        placeholder="e.g., Monday"
                        value={s.day}
                        onChange={(e) => handleShowtimeChange(i, "day", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={s.time}
                        onChange={(e) => handleShowtimeChange(i, "time", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Screen</label>
                      <input
                        type="text"
                        placeholder="e.g., Screen 1"
                        value={s.screen}
                        onChange={(e) => handleShowtimeChange(i, "screen", e.target.value)}
                        required
                      />
                    </div>
                   {/* Remove showtime button (only show for 2nd+ rows) */}
                    {i > 0 && (
                      <button
                        type="button"
                        className="remove-showtime"
                        onClick={() => {
                          const updated = [...showtimes];
                          updated.splice(i, 1);
                          setShowtimes(updated);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  className="add-showtime"
                  onClick={() =>
                    setShowtimes([...showtimes, { day: "", time: "", screen: "" }])
                  }
                >
                  ➕ Add Showtime
                </button>
              </div>
              
               {/* Form action buttons */}
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {form.id ? "Update Movie" : "Create Movie"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    resetForm();
                    setActiveTab("movies");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

       {/* style  for admin dash board*/}
      <style jsx>{`
        .admin-dashboard {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          min-height: 100vh;
          padding: 20px;
          color: #333;
          margin-top: 100px;
        }
        
        .loading-screen {
          text-align: center;
          font-size: 1.5rem;
          margin-top: 2rem;
          color: #4a5568;
        }
        
        .error-message {
          text-align: center;
          font-size: 1.2rem;
          color: #e53e3e;
          background: #fff5f5;
          padding: 1.5rem;
          border-radius: 8px;
          max-width: 800px;
          margin: 2rem auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .dashboard-header {
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          color: white;
          border-radius: 12px;
          padding: 25px 30px;
          margin-bottom: 25px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .header-content h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .income-source {
          font-size: 0.85rem;
          color: #cbd5e0;
          margin-top: 5px;
        }
        .income-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 15px 25px;
          text-align: center;
          backdrop-filter: blur(5px);
          min-width: 200px;
        }
        
        .income-card h2 {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 500;
          color: #cbd5e0;
        }
        
        .income-amount {
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }
        
        .dashboard-tabs {
          display: flex;
          margin-bottom: 25px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .tab-button {
          background: none;
          border: none;
          padding: 12px 24px;
          font-size: 1.1rem;
          cursor: pointer;
          color: #718096;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tab-button.active {
          color: #3182ce;
          font-weight: 600;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: #3182ce;
          border-radius: 3px 3px 0 0;
        }
        
        .dashboard-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .section-header {
          padding: 20px 25px;
          border-bottom: 1px solid #edf2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .section-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #2d3748;
        }
        
        .filter-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .filter-controls label {
          font-weight: 500;
          color: #4a5568;
        }
        
        .filter-controls select {
          padding: 8px 15px;
          border-radius: 6px;
          border: 1px solid #cbd5e0;
          background: white;
          font-size: 1rem;
        }
        
        .add-movie-btn {
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: background 0.2s;
        }
        
        .add-movie-btn:hover {
          background: #2b6cb0;
        }
        
        .no-movies {
          text-align: center;
          padding: 40px 20px;
          color: #718096;
        }
        
        .no-movies p {
          font-size: 1.2rem;
          margin-bottom: 20px;
        }
        
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(300px, 1fr));
          gap: 25px;
          padding: 25px;
        }
        
        .movie-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #e2e8f0;
        }
        
        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .movie-image {
          height: 180px;
          overflow: hidden;
        }
        
        .movie-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .movie-card:hover .movie-image img {
          transform: scale(1.05);
        }
        
        .movie-details {
          padding: 20px;
        }
        
        .movie-details h3 {
          margin: 0 0 15px 0;
          font-size: 1.3rem;
          color: #2d3748;
        }
        
        .movie-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }
        
        .info-item span {
          font-weight: 500;
          color: #4a5568;
        }
        
        .promotion-badge {
          background: #ebf8ff;
          color: #3182ce;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-top: 10px;
          display: inline-block;
        }
        
        .movie-actions {
          display: flex;
          padding: 0 20px 20px;
          gap: 10px;
        }
        
        .edit-btn, .delete-btn, .showtime-btn {
          flex: 1;
          padding: 8px 0;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .edit-btn {
          background: #3182ce;
          color: white;
        }
        
        .edit-btn:hover {
          background: #2b6cb0;
        }
        
        .delete-btn {
          background: #e53e3e;
          color: white;
        }
        
        .delete-btn:hover {
          background: #c53030;
        }
        
        .showtime-btn {
          background: #38a169;
          color: white;
        }
        
        .showtime-btn:hover {
          background: #2f855a;
        }
        
        .showtime-section {
          padding: 20px;
          background: #f7fafc;
          border-top: 1px solid #e2e8f0;
        }
        
        .showtime-section h4 {
          margin: 0 0 15px 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          color: #2d3748;
        }
        
        .showtime-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .showtime-section li {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #cbd5e0;
        }
        
        .showtime-day, .showtime-time, .showtime-screen {
          font-weight: 500;
        }
        
        .showtime-day {
          color: #3182ce;
        }
        
        .showtime-time {
          color: #38a169;
        }
        
        .showtime-screen {
          color: #dd6b20;
        }
        
        .close-showtimes {
          margin-top: 15px;
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .close-showtimes:hover {
          color: #3182ce;
        }
        
        .form-section {
          padding: 30px;
        }
        
        .form-section h2 {
          margin: 0 0 25px 0;
          font-size: 1.8rem;
          color: #2d3748;
        }
        
        .movie-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-weight: 500;
          color: #4a5568;
        }
        
        .form-group input {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          font-size: 1rem;
          transition: border 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
        }
        
        .file-upload {
          position: relative;
        }
        
        .file-upload input {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        
        .file-info {
          display: block;
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          background: #f7fafc;
          font-size: 1rem;
          color: #718096;
        }
        
        .showtimes-section {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 25px;
        }
        
        .showtimes-section h3 {
          margin: 0 0 20px 0;
          font-size: 1.3rem;
          color: #2d3748;
        }
        
        .showtime-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 15px;
          align-items: end;
          margin-bottom: 15px;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .showtime-row {
            grid-template-columns: 1fr 1fr auto;
          }
          
          .showtime-row .form-group:last-child {
            grid-column: span 2;
          }
        }
        
        .remove-showtime {
          position: absolute;
          right: -25px;
          bottom: 12px;
          background: none;
          border: none;
          color: #e53e3e;
          font-size: 1.5rem;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .add-showtime {
          background: #edf2f7;
          border: none;
          border-radius: 6px;
          padding: 10px 15px;
          font-weight: 500;
          color: #4a5568;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }
        
        .add-showtime:hover {
          background: #e2e8f0;
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 15px;
        }
        
        .submit-btn {
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .submit-btn:hover {
          background: #2b6cb0;
        }
        
        .cancel-btn {
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          border-radius: 6px;
          padding: 12px 25px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .cancel-btn:hover {
          background: #cbd5e0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;