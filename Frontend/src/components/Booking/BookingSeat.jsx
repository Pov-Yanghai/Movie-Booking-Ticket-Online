import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./BookingSeat.css";

const BookingSeat = () => {
  const location = useLocation();
  const { id } = useParams();
  const moviePrice = location.state?.moviePrice || 10;
  const showtimeId = id || location.state?.showtimeId;
  const movieId = location.state?.movieId;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [qrCode, setQrCode] = useState(null);

  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = Array.from({ length: 8 }, (_, i) => i + 1);
  // QR Modal Component
  function QRModal({ qrCodeUrl, onClose }) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 8,
            textAlign: "center",
            maxWidth: 320,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <h3>Scan QR Code to Pay</h3>
          <img
            src={qrCodeUrl}
            alt="Payment QR Code"
            style={{ width: "100%", height: "auto" }}
          />
          <button
            onClick={onClose}
            style={{
              marginTop: 15,
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: 4,
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  // Fetch booked seats from backend
  useEffect(() => {
    if (!movieId || !showtimeId) {
      alert("Missing movie or showtime info. Please return and try again.");
      return;
    }

    const fetchBookedSeats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/booked/${showtimeId}`
        );
        setBookedSeats(res.data.bookedSeats);
      } catch (error) {
        console.error("Failed to fetch booked seats:", error);
      }
    };

    fetchBookedSeats();
  }, [showtimeId, movieId]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const alreadyBooked = selectedSeats.filter((seat) =>
      bookedSeats.includes(seat)
    );
    if (alreadyBooked.length > 0) {
      alert(
        `These seats are already booked: ${alreadyBooked.join(
          ", "
        )}. Please select other seats.`
      );
      // Optionally, remove these seats from selectedSeats
      setSelectedSeats((prev) =>
        prev.filter((seat) => !alreadyBooked.includes(seat))
      );
      return; // stop booking request
    }

    try {
      const bookingData = {
        name: userInfo.name,
        phone: userInfo.phone,
        selectedSeats,
        movieId: location.state?.movieId,
        moviePrice,
        showtimeId,
      };
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking successful!");
      setBookedSeats([...bookedSeats, ...selectedSeats]);
      setSelectedSeats([]);
      setUserInfo({ name: "", phone: "" });

      setQrCode(res.data.qrCode);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to book seats");
    }
  };

  const totalPrice = selectedSeats.length * moviePrice;

  return (
    <div className="booking-container">
      <div className="screen">Choose Your Seat</div>

      <table
        className="seat-table"
        style={{ borderCollapse: "collapse", margin: "auto" }}
      >
        <thead>
          <tr>
            <th></th>
            {cols.map((col) => (
              <th
                key={col}
                style={{ padding: "6px", border: "1px solid #ccc" }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td
                style={{
                  padding: "6px",
                  fontWeight: "bold",
                  border: "1px solid #ccc",
                  textAlign: "center",
                }}
              >
                {row}
              </td>
              {cols.map((col) => {
                const seatId = `${row}${col}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                  <td
                    key={seatId}
                    style={{ padding: "4px", border: "1px solid #ccc" }}
                  >
                    <button
                      onClick={() => handleSeatClick(seatId)}
                      disabled={isBooked}
                      
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        cursor: isBooked ? "not-allowed" : "pointer",
                        backgroundColor: isBooked
                          ? "#d9534f" // red for booked
                          : isSelected
                          ? "#5cb85c" // green for selected
                          : "#0275d8", // blue for available
                        color: "white",
                        border: "none",
                        fontWeight: "bold",
                      }}
                      title={isBooked ? "Already Booked" : "Available"}
                    >
                      {seatId}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="booking-summary">
        <h3>Selected Seats: {selectedSeats.join(", ") || "None"}</h3>
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={userInfo.phone}
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
            required
          />
          <button type="submit" className="confirm-button">
            Confirm Booking
          </button>
        </form>
      </div>
      {qrCode && <QRModal qrCodeUrl={qrCode} onClose={() => setQrCode(null)} />}
    </div>
  );
};

export default BookingSeat;
