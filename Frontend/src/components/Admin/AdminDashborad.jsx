import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PhoneIcon,EnvelopeIcon,ChatBubbleLeftIcon,FilmIcon,PlusCircleIcon,HomeIcon,CurrencyDollarIcon,XMarkIcon,DeviceTabletIcon,ChartBarIcon,UserIcon,TicketIcon,StarIcon,} from "@heroicons/react/24/outline";
import {
  BarChart,Bar, LineChart,Line,PieChart,Pie,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer,Cell,} from "recharts";

const COLORS = [
  "#3182CE",
  "#38A169",
  "#DD6B20",
  "#805AD5",
  "#D53F8C",
  "#319795",
  "#D69E2E",
  "#4C51BF",
];

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [income, setIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showtimes, setShowtimes] = useState([
    { day: "", time: "", screen: "" },
  ]);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessageLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);

  const handleShowtimeChange = (index, field, value) => {
    const updated = [...showtimes];
    updated[index][field] = value;
    setShowtimes(updated);
  };

  const filteredMovies = selectedDay
    ? movies.filter((movie) =>
        movie.days
          .split(",")
          .map((d) => d.trim().toLowerCase())
          .includes(selectedDay.toLowerCase())
      )
    : movies;

  const [form, setForm] = useState({
    id: null,
    title: "",
    price: "",
    image: null,
    days: "",
    promotion: "",
  });

  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const [
          moviesRes,
          incomeRes,
          usersRes,
          messagesRes,
          analyticsRes,
          bookingsRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/movies"),
          axios.get("http://localhost:5000/api/admin/income", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/analytics/total-users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/analytics/messages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/analytics/bookings-per-movie", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/recent-bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMovies(moviesRes.data);
        setIncome(incomeRes.data.totalIncome || 0);
        setTotalUsers(usersRes.data.totalUsers || 0);
        setMessages(messagesRes.data);
        setRecentBookings(bookingsRes.data);

        // Process analytics data
        const bookingsData = analyticsRes.data.map((item) => ({
          title: item.title,
          bookings: item.bookings,
        }));

        setAnalyticsData({
          bookingsPerMovie: bookingsData,
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("You must be an admin to view this page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const fetchMessages = async () => {
    setMessageLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get("http://localhost:5000/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to fetch messages.");
    } finally {
      setMessageLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "messages") {
      fetchMessages();
    }
  }, [activeTab]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

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

      setForm({
        id: null,
        title: "",
        price: "",
        image: null,
        days: "",
        promotion: "",
      });
      setShowtimes([{ day: "", time: "", screen: "" }]);
      setActiveTab("movies");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit movie");
    }
  };

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

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      price: "",
      image: null,
      days: "",
      promotion: "",
    });
    setShowtimes([{ day: "", time: "", screen: "" }]);
  };

  if (loading)
    return <div className="loading-screen">Loading admin dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-dashboard">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <UserIcon className="h-8 w-8" />
            <h2>Cinema Admin</h2>
          </div>
          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="sidebar-menu">
          <button
            className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="menu-content">
              <HomeIcon className="menu-icon" />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            className={`menu-item ${activeTab === "movies" ? "active" : ""}`}
            onClick={() => setActiveTab("movies")}
          >
            <div className="menu-content">
              <FilmIcon className="menu-icon" />
              <span>Manage Movies</span>
            </div>
          </button>

          <button
            className={`menu-item ${activeTab === "form" ? "active" : ""}`}
            onClick={() => {
              resetForm();
              setActiveTab("form");
            }}
          >
            <div className="menu-content">
              <PlusCircleIcon className="menu-icon" />
              <span>Add Movie</span>
            </div>
          </button>

          <button
            className={`menu-item ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            <div className="menu-content">
              <ChatBubbleLeftIcon className="menu-icon" />
              <span>Messages</span>
            </div>
          </button>

          <button
            className={`menu-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <div className="menu-content">
              <ChartBarIcon className="menu-icon" />
              <span>Analytics</span>
            </div>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="contact-info">
            <div className="contact-item">
              <PhoneIcon className="contact-icon" />
              <span>096 781 7889</span>
            </div>
            <div className="contact-item">
              <EnvelopeIcon className="contact-icon" />
              <span>info@moviebook.com.kh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="dashboard-tab">
            <div className="dashboard-header">
              <h1>Admin Dashboard</h1>
              <p>Overview of cinema operations and statistics</p>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FilmIcon className="h-8 w-8" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{movies.length}</div>
                  <div className="stat-label">Total Movies</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <CurrencyDollarIcon className="h-8 w-8" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">${income.toFixed(2)}</div>
                  <div className="stat-label">Total Income</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <UserIcon className="h-8 w-8" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{totalUsers}</div>
                  <div className="stat-label">Active Users</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <ChatBubbleLeftIcon className="h-8 w-8" />
                </div>
                <div className="stat-info">
                  <div className="stat-value">{messages.length}</div>
                  <div className="stat-label">Messages</div>
                </div>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-card">
                <h3>Bookings per Movie</h3>
                <div className="chart-container">
                  {analyticsData?.bookingsPerMovie ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={analyticsData.bookingsPerMovie}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="title"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="bookings"
                          name="Bookings"
                          fill="#3182CE"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-loading">Loading booking data...</div>
                  )}
                </div>
              </div>

              <div className="chart-card">
                <h3>Recent Bookings</h3>
                <div className="recent-bookings">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-icon">
                        <TicketIcon className="h-5 w-5" />
                      </div>
                      <div className="booking-details">
                        <div className="booking-title">
                          {booking.movieTitle}
                        </div>
                        <div className="booking-meta">
                          <span>{booking.userName}</span>
                          <span>${booking.total_price}</span>
                          <span>
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Movies</h2>
              <div className="activity-list">
                {movies.slice(0, 5).map((movie) => (
                  <div key={movie.id} className="activity-item">
                    <div className="activity-icon">
                      <FilmIcon className="h-5 w-5" />
                    </div>
                    <div className="activity-text">
                      <strong>{movie.title}</strong>
                      <div className="activity-meta">
                        <span>${Number(movie.price).toFixed(2)}</span>
                        <span>{movie.days}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="analytics-tab">
            <div className="analytics-header">
              <h1>Cinema Analytics Dashboard</h1>
              <p>Visual insights into movie performance and user engagement</p>
            </div>

            <div className="analytics-summary">
              <div className="summary-card">
                <div className="summary-icon">
                  <TicketIcon className="h-6 w-6" />
                </div>
                <h4>Total Bookings</h4>
                <div className="summary-value">
                  {analyticsData?.bookingsPerMovie
                    .reduce((sum, movie) => sum + movie.bookings, 0)
                    .toLocaleString()}
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <h4>Total Revenue</h4>
                <div className="summary-value">${income.toLocaleString()}</div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">
                  <UserIcon className="h-6 w-6" />
                </div>
                <h4>Current Users</h4>
                <div className="summary-value">
                  {totalUsers.toLocaleString()}
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon">
                  <FilmIcon className="h-6 w-6" />
                </div>
                <h4>Total Movies</h4>
                <div className="summary-value">{movies.length}</div>
              </div>
            </div>

            <div className="chart-grid">
              {/* Bookings per Movie */}
              <div className="chart-card">
                <h3>Bookings per Movie</h3>
                <div className="chart-container">
                  {analyticsData?.bookingsPerMovie ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={analyticsData.bookingsPerMovie}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="title"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="bookings"
                          name="Bookings"
                          fill="#3182CE"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-loading">Loading booking data...</div>
                  )}
                </div>
              </div>

              {/* Revenue Distribution */}
              <div className="chart-card">
                <h3>Revenue Distribution</h3>
                <div className="chart-container">
                  {analyticsData?.bookingsPerMovie ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={analyticsData.bookingsPerMovie}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="bookings"
                          nameKey="title"
                          label={({ percent, index }) =>
                            `${analyticsData.bookingsPerMovie[index].title}: ${(
                              percent * 100
                            ).toFixed(0)}%`
                          }
                        >
                          {analyticsData.bookingsPerMovie.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-loading">Loading revenue data...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Movies Management Tab */}
        {activeTab === "movies" && (
          <div className="movies-section">
            <div className="section-header">
              <h2>Movie Management</h2>
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
                                <span className="showtime-screen">
                                  {s.screen}
                                </span>
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

        {/* Add/Edit Movie Form Tab */}
        {activeTab === "form" && (
          <div className="form-section">
            <h2>{form.id ? "Update Movie" : "Add New Movie"}</h2>
            <form onSubmit={handleFormSubmit} className="movie-form">
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

              <div className="form-row">
                <div className="form-group">
                  <label>Playing Days (comma separated)</label>
                  <input
                    name="days"
                    type="text"
                    placeholder="Monday, Wednesday, Friday"
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
                        onChange={(e) =>
                          handleShowtimeChange(i, "day", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={s.time}
                        onChange={(e) =>
                          handleShowtimeChange(i, "time", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Screen</label>
                      <input
                        type="text"
                        placeholder="e.g., Screen 1"
                        value={s.screen}
                        onChange={(e) =>
                          handleShowtimeChange(i, "screen", e.target.value)
                        }
                        required
                      />
                    </div>

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
                    setShowtimes([
                      ...showtimes,
                      { day: "", time: "", screen: "" },
                    ])
                  }
                >
                  ➕ Add Showtime
                </button>
              </div>

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

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="messages-section">
            <div className="section-header">
              <h2>Customer Messages</h2>
              <div className="contact-info-header">
                <div className="contact-method">
                  <PhoneIcon className="icon" />
                  <span>096 781 7889</span>
                </div>
                <div className="contact-method">
                  <EnvelopeIcon className="icon" />
                  <span>info@moviebook.com.kh</span>
                </div>
              </div>
            </div>

            {messagesLoading ? (
              <p>Loading messages...</p>
            ) : messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages found.</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((message) => (
                  <div key={message.id} className="message-card">
                    <div className="message-header">
                      <div className="sender-info">
                        <h3>{message.name}</h3>
                        <div className="sender-email">{message.email}</div>
                      </div>
                      <div className="message-date">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="message-content">{message.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          color: #333;
          margin-top: 70px;
          position: relative;
        }

        .mobile-menu-btn {
          position: fixed;
          top: 80px;
          left: 20px;
          z-index: 100;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: none;
        }

        .sidebar {
          width: 250px;
          background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          color: white;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          z-index: 10;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
          height: calc(100vh - 70px);
          position: fixed;
          top: 85px;
          left: 0;
          overflow-y: auto;
        }

        .sidebar-header {
          padding: 25px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-sidebar {
          background: none;
          border: none;
          color: #cbd5e0;
          cursor: pointer;
          display: none;
        }

        .sidebar-menu {
          padding: 25px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0 20px;
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          color: #cbd5e0;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 4px solid transparent;
          height: 55px;
        }

        .menu-content {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .menu-item.active {
          background: rgba(49, 130, 206, 0.2);
          color: white;
          border-left: 4px solid #3182ce;
        }

        .menu-icon {
          width: 22px;
          height: 22px;
          margin-right: 15px;
          transition: all 0.2s;
        }

        .menu-item.active .menu-icon {
          color: #63b3ed;
        }

        .menu-item span {
          font-size: 1.05rem;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 25px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
          color: #cbd5e0;
        }

        .contact-icon {
          width: 18px;
          height: 18px;
          margin-right: 12px;
          color: #a0aec0;
        }

        .main-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
        }

        .dashboard-tab {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .dashboard-header {
          padding: 15px 0;
        }

        .dashboard-header h1 {
          margin: 0 0 10px 0;
          font-size: 2.2rem;
          color: #2d3748;
          font-weight: 700;
        }

        .dashboard-header p {
          margin: 0;
          color: #718096;
          font-size: 1.1rem;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(280px, 1fr));
          gap: 25px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          background: #ebf8ff;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 20px;
        }

        .stat-icon svg {
          color: #3182ce;
        }

        .stat-value {
          font-size: 1.9rem;
          font-weight: 700;
          color: #2d3748;
        }

        .stat-label {
          font-size: 1.05rem;
          color: #718096;
        }

        .dashboard-charts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
         
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          height: 500px;
         
          display: flex;
          flex-direction: column;
        }

        .chart-card h3 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .chart-container {
          flex: 1;
          min-height: 500px;
          
        }

        .chart-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #718096;
          font-size: 1.1rem;
        }

        .recent-bookings {
          display: flex;
          flex-direction: column;
          gap: 15px;
          height: 100%;
        }

        .booking-item {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .booking-icon {
          width: 36px;
          height: 36px;
          background: #ebf8ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .booking-icon svg {
          color: #3182ce;
          width: 18px;
          height: 18px;
        }

        .booking-details {
          flex: 1;
        }

        .booking-title {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .booking-meta {
          display: flex;
          gap: 15px;
          font-size: 0.9rem;
          color: #718096;
        }

        .recent-activity {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .recent-activity h2 {
          margin: 0 0 25px 0;
          font-size: 1.6rem;
          color: #2d3748;
          font-weight: 600;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #edf2f7;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          background: #f7fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 18px;
          flex-shrink: 0;
          border: 1px solid #e2e8f0;
        }

        .activity-icon svg {
          width: 18px;
          height: 18px;
          color: #3182ce;
        }

        .activity-text {
          flex: 1;
        }

        .activity-meta {
          display: flex;
          gap: 20px;
          margin-top: 8px;
          font-size: 0.95rem;
          color: #718096;
        }

        .loading-screen,
        .error-message {
          text-align: center;
          padding: 40px 20px;
          font-size: 1.2rem;
          color: #4a5568;
        }

        .error-message {
          color: #e53e3e;
          background: #fff5f5;
        }

        /* Movies Section Styles */
        .movies-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .section-header {
          padding: 22px 28px;
          border-bottom: 1px solid #edf2f7;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.6rem;
          color: #2d3748;
          font-weight: 600;
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .filter-controls label {
          font-weight: 500;
          color: #4a5568;
          font-size: 1.05rem;
        }

        .filter-controls select {
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          background: white;
          font-size: 1.05rem;
          min-width: 160px;
        }

        .add-movie-btn {
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          font-size: 1.05rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
          font-weight: 500;
        }

        .add-movie-btn:hover {
          background: #2b6cb0;
        }

        .no-movies {
          text-align: center;
          padding: 50px 20px;
          color: #718096;
        }

        .no-movies p {
          font-size: 1.2rem;
          margin-bottom: 25px;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(320px, 1fr));
          gap: 28px;
          padding: 28px;
        }
        .movie-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .movie-image {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 250px;
          height: 390px;
          margin-bottom: 20px;
        }

        .movie-image img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
          border-radius: 10px;
          transition: transform 0.5s ease;
        }

        .movie-card:hover .movie-image img {
          transform: scale(1.05);
        }

        .movie-details {
          text-align: center;
          width: 100%;
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
          font-size: 1rem;
          width: 100%;
          text-align: center;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }

        .promotion-badge {
          background: #ebf8ff;
          color: #3182ce;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          margin: 12px auto 0;
          display: inline-block;
        }

        .movie-actions {
          display: flex;
          width: 100%;
          padding-top: 15px;
          gap: 10px;
          justify-content: center;
        }

        .edit-btn,
        .delete-btn,
        .showtime-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
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
          gap: 10px;
          font-size: 1.1rem;
          color: #2d3748;
        }

        .showtime-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px;
        }

        .showtime-section li {
          padding: 10px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
        }

        .showtime-day {
          color: #3182ce;
          font-weight: 500;
        }

        .showtime-time {
          color: #38a169;
          font-weight: 500;
        }

        .showtime-screen {
          color: #dd6b20;
          font-weight: 500;
        }

        .close-showtimes {
          margin-top: 15px;
          background: red;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          padding: 10px;
          border-radius: 10px;
        }

        .close-showtimes:hover {
          color: #3182ce;
        }


        /* Form Section Styles */
        .form-section {
          background: white;
          border-radius: 12px;
          padding: 35px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .form-section h2 {
          margin: 0 0 30px 0;
          font-size: 1.9rem;
          color: #2d3748;
          font-weight: 600;
        }

        .movie-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group label {
          font-weight: 500;
          color: #4a5568;
          font-size: 1.1rem;
        }

        .form-group input {
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          font-size: 1.05rem;
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
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid #cbd5e0;
          background: #f7fafc;
          font-size: 1.05rem;
          color: #718096;
        }

        .showtimes-section {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 28px;
        }

        .showtimes-section h3 {
          margin: 0 0 22px 0;
          font-size: 1.35rem;
          color: #2d3748;
        }

        .showtime-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 18px;
          align-items: end;
          margin-bottom: 18px;
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
          right: -30px;
          bottom: 14px;
          background: none;
          border: none;
          color: #e53e3e;
          font-size: 1.6rem;
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
          border-radius: 8px;
          padding: 12px 18px;
          font-weight: 500;
          color: #4a5568;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s;
          font-size: 1.05rem;
        }

        .add-showtime:hover {
          background: #e2e8f0;
        }

        .form-actions {
          display: flex;
          gap: 18px;
          margin-top: 20px;
        }

        .submit-btn {
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 30px;
          font-size: 1.1rem;
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
          border-radius: 8px;
          padding: 14px 30px;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cancel-btn:hover {
          background: #cbd5e0;
        }

        /* Messages Section */
        .messages-section {
          background: white;
          border-radius: 12px;
          padding: 28px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .contact-info-header {
          display: flex;
          gap: 25px;
          align-items: center;
          flex-wrap: wrap;
        }

        .contact-method {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #edf2f7;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 500;
        }

        .contact-method .icon {
          width: 18px;
          height: 18px;
        }

        .messages-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(250px, 1fr));
          gap: 18px;
          margin-top: 25px;
        }

        .message-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          padding: 22px;
          border: 1px solid #e2e8f0;
          transition: transform 0.2s ease;
        }

        .message-card:hover {
          transform: translateY(-3px);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #edf2f7;
        }

        .sender-info h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #2d3748;
        }

        .sender-email {
          color: #718096;
          font-size: 0.95rem;
          margin-top: 5px;
        }

        .message-date {
          color: #718096;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .message-content {
          line-height: 1.7;
          color: #4a5568;
          font-size: 1.05rem;
        }

        .no-messages {
          text-align: center;
          padding: 45px 20px;
          color: #718096;
          font-size: 1.15rem;
        }

        /* Analytics Tab Styles */
        .analytics-tab {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .analytics-header {
          padding: 15px 0;
        }

        .analytics-header h1 {
          margin: 0 0 10px 0;
          font-size: 2.2rem;
          color: #2d3748;
          font-weight: 700;
        }

        .analytics-header p {
          margin: 0;
          color: #718096;
          font-size: 1.1rem;
        }

        .analytics-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .summary-icon {
          width: 50px;
          height: 50px;
          background: #ebf8ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .summary-icon svg {
          color: #3182ce;
          width: 24px;
          height: 24px;
        }

        .summary-card h4 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
          color: #718096;
          font-weight: 500;
        }

        .summary-value {
          font-size: 2.2rem;
          font-weight: 700;
          color: #3182ce;
        }

        .chart-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(500px, 1fr));
          gap: 25px;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .sidebar {
            width: 240px;
          }

          .main-content {
            margin-left: 240px;
          }

          .dashboard-charts,
          .chart-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 220px;
          }

          .main-content {
            margin-left: 220px;
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
          }

          .sidebar {
            position: fixed;
            top: 70px;
            left: 0;
            height: calc(100vh - 70px);
            transform: translateX(-100%);
            z-index: 100;
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .close-sidebar {
            display: block;
          }

          .main-content {
            margin-left: 0;
            padding: 20px;
          }

          .dashboard-stats,
          .analytics-summary {
            grid-template-columns: 1fr 1fr;
          }

          .movie-grid {
            grid-template-columns: 1fr;
            padding: 20px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .filter-controls {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .form-row {
            gap: 20px;
          }

          .form-section {
            padding: 25px;
          }

          .chart-card {
            height: 500px;
            min-height: 500px;
          }
        }

        @media (max-width: 480px) {
          .dashboard-stats,
          .analytics-summary {
            grid-template-columns: 1fr;
          }

          .summary-value {
            font-size: 1.8rem;
          }

          .movie-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
