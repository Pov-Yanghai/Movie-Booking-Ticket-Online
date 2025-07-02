import React, { useState, useEffect } from 'react';
import './Banner.css';

const bannerImages = [
  { src: '/images/banner1.jpeg', caption: 'Our promotion' },
  { src: '/images/banner2.jpeg', caption: 'Our promotion' },
  { src: '/images/banner4.jpeg', caption: 'Our promotion' },
  { src: '/images/banner5.jpeg', caption: 'Our promotion' },
  
  
];

const Banner = () => {
  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Effect to change the image every 5 seconds
  useEffect(() => {
    // Set an interval to change the image index
    const interval = setInterval(() => { 
      setCurrentImageIndex(prev => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // Function to handle the previous button click
  const handlePrev = () => {
    setCurrentImageIndex(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % bannerImages.length);
  };

  return (
    <div className="banner">
      <img src={bannerImages[currentImageIndex].src} alt="Banner" />
      <div className="caption">{bannerImages[currentImageIndex].caption}</div>
      <div className="controls">
        <button className="prev" onClick={handlePrev}>&#10094;</button>
        <button className="next" onClick={handleNext}>&#10095;</button>
      </div>
      <div className="dots">
        {bannerImages.map((_, index) => (
          <button 
            key={index}
            className={index === currentImageIndex ? 'active' : ''} // Active class for current image
            onClick={() => setCurrentImageIndex(index)} // Set current image index on dot click
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;