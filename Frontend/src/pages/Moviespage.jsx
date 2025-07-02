import React, { useState } from 'react';
import Showtimes from '../components/Showtimes/Showtimes';
import Movies from '../components/Movies/Movies';

function Moviespage() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div>
      <Showtimes onDaySelect={setSelectedDay} />
      <Movies selectedDay={selectedDay} />
    </div>
  );
}

export default Moviespage;
