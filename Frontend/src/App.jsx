import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, matchPath } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Loginpage from './pages/Loginpage';
import Moviespage from './pages/Moviespage';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Contactpage from './pages/Contactpage';
import Signuppage from './pages/Signuppage'; 
import Profilepage from './pages/Profilepage';
import BookingSeat from './components/Booking/BookingSeat';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup'];
  const isBookingRoute = matchPath('/booking/:id', location.pathname);

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Moviespage />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/booking/:id" element={<BookingSeat />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contactpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/profile" element={<Profilepage />} />
        </Routes>
      </main>
      {!hideFooterRoutes.includes(location.pathname) && !isBookingRoute && <Footer />}
    </div>
  );

}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
