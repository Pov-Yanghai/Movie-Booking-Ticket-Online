// src/components/Header/LogoProfile.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './LogoProfile.css';  

const LogoProfile = () => {
  const isAuthenticated = false; 
  const navigate = useNavigate();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="logo-profile" onClick={handleClick}>
      <FontAwesomeIcon icon={faUser} className="logo-profile-img" />
    </div>
  );
};

export default LogoProfile;
