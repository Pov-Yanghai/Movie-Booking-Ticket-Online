--- users table   Stores user account details.
Create database BackendProject;
USE BackendProject;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255), -- store uploaded profile image filename
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- movies table  Stores movies shown in the app
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255), -- movie poster image URL or filename
  price DECIMAL(10, 2) NOT NULL,
  days VARCHAR(100),  -- e.g., "Mon, Tue, Wed"
  promotion TEXT
);

-- bookings table  Stores each user's booking session.
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  movie_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- seats table   Tracks individual seat bookings for each session.
CREATE TABLE seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL, -- e.g., 'A1', 'B5'
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);


-- booked_seats Table  
CREATE TABLE booked_seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  showtime_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  booking_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(id),
  UNIQUE (showtime_id, seat_number)
);

-- Message table from contact form 
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- showing time 
CREATE TABLE showtimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  day DATE NOT NULL,
  time TIME NOT NULL,
  screen VARCHAR(50), -- optional: for multi-screen cinemas
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  UNIQUE (movie_id, day, time) -- prevent duplicate entries
);
