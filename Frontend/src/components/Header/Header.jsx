import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LogoProfile from './LogoProfile';
import axios from 'axios';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/search?q=${searchTerm}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 300); // debounce for smooth typing

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  const fetchMoviesNow = () => {
    fetchMovies();
  }
  

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
  <div className="search-input-wrapper">
    <input
      type="text"
      placeholder="Search movies..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {searchResults.length > 0 && (
      <div className="search-dropdown">
        {searchResults.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="search-dropdown-item"
            onClick={() => setSearchTerm('')}
          >
            {movie.title}
          </Link>
        ))}
      </div>
    )}
  </div>
  <button onClick={fetchMoviesNow}>Search</button>
</div>

      <LogoProfile />
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
     
        

       
      </div>
    </header>
  );
}

export default Header;
