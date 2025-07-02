import React, { useState } from 'react';
import './Showtimes.css';

const Showtimes = ({ onDaySelect }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayClick = (day) => {
    setSelectedDay(day);
    onDaySelect(day);
  };

  return (
    <div className="showtimes-container">
      <h2>Select a Day to See Movies</h2>
      <div className="days-list">
        {daysList.map((day) => (
          <button
            key={day}
            className={selectedDay === day ? 'active' : ''}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Showtimes;
