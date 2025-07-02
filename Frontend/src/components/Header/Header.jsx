import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LogoProfile from './LogoProfile';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="logo">MOVIEBOOK</div>


      {/* Navigation */}
      <nav>
        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Search Bar and Profile Wrapper */}
      <div className="header-right">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search movies..." />
          <button>Search</button>
           {/* Profile */}
            {/* Mobile Menu Toggle */}
         
      </div>
      <LogoProfile />
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
     
        

       
      </div>
    </header>
  );
}

export default Header;
