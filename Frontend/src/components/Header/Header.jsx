import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import LogoProfile from './LogoProfile';
import axios from 'axios';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu 
  const [searchTerm, setSearchTerm] = useState(''); // state for search  bar text input 
  const [searchResults, setSearchResults] = useState([]); // state for store search results from API 

// AUto fetch movies when typing(debounce)
  useEffect(() => {
    // Async function to fetch movies from backend API with searchTerm as query
    const fetchMovies = async () => {
      if (searchTerm.trim() === '') {
        // if search box is empty, clear results
        setSearchResults([]);
    
        return;
      }
      // call backend API to search movies
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/search?q=${searchTerm}`);
        setSearchResults(res.data); // save result in state
      } catch (err) {
        console.error(err);
      }
    };
    // Debounce: wait 300ms= 0.3S after user stops typing before api called
    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 300); // debounce for smooth typing
 // Clean up the timeout if user types again quickly
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  // Manually fetch when clicking "Search" button
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
    {/* If results exist, show dropdown below input */}
    {searchResults.length > 0 && (
      <div className="search-dropdown">
        {searchResults.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="search-dropdown-item"
            onClick={() => setSearchTerm('')}  // Cealr input after click 
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
