import { Booking, BookedSeat, Seat, Payment } from "../models/index.js";
import { Op } from 'sequelize';

export const createBooking = async (req, res) => {
  try {
    const { name, phone, selectedSeats, movieId, moviePrice, showtimeId } =
      req.body;
    const userId = req.user.id;

    if (!selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const existing = await BookedSeat.findAll({
      where: {
        showtimeId,
        seat_number: { [Op.in]: selectedSeats },
      },
    });

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked",
        seats: existing.map((seat) => seat.seat_number),
      });
    }

    const total_price = selectedSeats.length * moviePrice;
    const booking = await Booking.create({
      userId,
      movieId,
      showtimeId,
      name,
      phone,
      total_price,
    });

    await Promise.all(
      selectedSeats.map((seat) =>
        Seat.create({ seat_number: seat, bookingId: booking.id })
      )
    );

    await Promise.all(
      selectedSeats.map((seat) =>
        BookedSeat.create({ seat_number: seat, showtimeId, userId })
      )
    );

    // Generate QR Code before sending response
    const staticQrImageUrl =
      "http://localhost:5000/public/QR_Code_For_Payment.jpg";

    // Save payment info
    await Payment.create({
      bookingId: booking.id,
      method: "qr",
      qrCodeUrl: staticQrImageUrl,
      status: "pending",
    });

    // Return booking success + QR image URL
    res.status(201).json({
      message: "Booking successful",
      bookingId: booking.id,
      qrCode: staticQrImageUrl,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res
      .status(500)
      .json({ message: "Failed to book seats", error: err.message });
  }
};