# 🎬 Movie Booking System (Backend)
## 📄 Project Description
This is a Movie Booking Backend API built with Node.js, Express.js, Sequelize, and MySQL.
It supports:
-User Authentication (JWT)
-Admin Management for Movies, Showtimes, Bookings
-Statistics (Income, Bookings per Movie)
-Customer Messages
-QR Code Payment (Static Image)
## 📂 Project Structure

Backend/
│
├── Controllers/           # Handle business logic
│   ├── admin.controller.js
│   ├── analytics.controller.js
│   ├── auth.controller.js
│   ├── booking.controller.js
│   ├── bookedseats.controller.js
│   ├── message.controller.js
│   ├── movie.controller.js
│   ├── payment.controller.js
│   ├── stat.controller.js
│   ├── showtimes.controller.js
│
├── Middleware/            # Auth, Logger, File Upload
│   ├── auth.middleware.js
│   ├── logger.middleware.js
│   ├── upload.middleware.js
│
├── Models/                # Sequelize Models (Tables)
│   ├── bookedseat.model.js
│   ├── booking.model.js
│   ├── message.model.js
│   ├── movie.model.js
│   ├── payment.model.js
│   ├── showtime.model.js
│   ├── stat.model.js
│   ├── user.model.js
│
├── Public/                # For static files (QR Payment Image)
│
├── Routes/                # API Routes (connect to controllers)
│   ├── admin.routes.js
│   ├── analytics.routes.js
│   ├── auth.routes.js
│   ├── booking.routes.js
│   ├── bookedseats.routes.js
│   ├── message.routes.js
│   ├── movie.routes.js
│   ├── stat.routes.js
│   ├── showtimes.routes.js
│
├── Seeders/               # Data Seeder for Initial Data
│   ├── BookedSeatSeeder.js
│   ├── BookingSeeder.js
│   ├── MessageSeeder.js
│   ├── MovieSeeder.js
│   ├── PaymentSeeder.js
│   ├── ShowtimeSeeder.js
│   ├── StatSeeder.js
│   ├── UserSeeder.js
│
├── uploads_images/        # Uploaded movie images
│
├── .env                   # Environment variables (DB, Port, etc)
├── package.json            # Node.js dependencies
├── server.js               # Main entry point

### 🔧 How to Setup
- Clone the repository:
   ```bash
   git clone https://github.com/Pov-Yanghai/Movie-Booking-Ticket-Online.git

### 1️⃣ Install Required Libraries
- npm install express
- npm install sequelize mysql2
- npm install jsonwebtoken
- npm install multer
- npm install bcryptjs
- npm install cors
- npm install dotenv
- npm install morgan


### 2️⃣ Install for Development (Optional)
- npm install --save-dev nodemon

## 🚀 How to Run
- npm run dev 

## Usage 
### Admin Features
- Create / Edit / Delete Movies
- Manage Showtimes & Seats
- View Analytics Dashboard
- Read Messages from Users
### User Features
- Register / Login (JWT)
- Browse Movies, Showtimes
- Book Seats with Real-Time Status
- See Booking Confirmation & QR Payment


## Contact
 Development Team
📧 Team7@company.com
📞 +855 96 7817889

## Cinema Partnerships
📧 CADT@moviebook.kh
📞 +855 87 888 045


