import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Hero.css";
import { movies } from "../data/movies.js"

const Hero = ({
  title = "Book Your Movie Tickets Now",
  description = "Find your favorite movies and book tickets for the latest releases in cinemas near you.",
  buttonText = "Book Now",
  buttonLink = "/booking",
  onButtonClick,
  backgroundImage,
  subtitle,
  rating,
  enableAnimations = true,
  animationType = "fade",
  animationDelay = 0.5,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter movies based on search input
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const heroStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  const animationClass = enableAnimations ? `animate-${animationType}` : "";
  const delayStyle = enableAnimations ? { animationDelay: `${animationDelay}s` } : {};

  return (
    <section id="home" className="hero" style={heroStyle}>
      <div className="hero-content">
        {rating && (
          <div className="rating-badge">⭐ {parseFloat(rating).toFixed(1)}/10</div>
        )}

        <h1 className={`title ${animationClass}`} style={delayStyle}>{title}</h1>

        {subtitle && (
          <h2 className={`subtitle ${animationClass}`} style={delayStyle}>{subtitle}</h2>
        )}

        <p className={`description ${animationClass}`} style={delayStyle}>{description}</p>

        <div className={`cta-container ${animationClass}`} style={delayStyle}>
          <Link to={buttonLink} className="cta-button" onClick={onButtonClick} role="button" aria-label="Book tickets">
            {buttonText}
          </Link>
        </div>

        {/* Search Box */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            aria-label="Movie search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/>
            </svg>
          </button>
        </div>

        {/* Display Filtered Movies */}
        <div className="search-results">
          {searchTerm && (
            filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <img src={movie.image} alt={movie.title} className="movie-image" />
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-price">{movie.price}</p>
                  <p className="movie-days">{movie.days}</p>
                  <p className="movie-promotion">{movie.promotion}</p>
                </div>
              ))
            ) : (
              <p className="no-results">No movies found</p>
            )
          )}
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  onButtonClick: PropTypes.func,
  backgroundImage: PropTypes.string,
  subtitle: PropTypes.string,
  rating: PropTypes.number,
  enableAnimations: PropTypes.bool,
  animationType: PropTypes.oneOf(["fade", "slide", "zoom"]),
  animationDelay: PropTypes.number,
};

export default Hero;
