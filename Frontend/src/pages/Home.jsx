import React, { useState } from 'react';
import Banner from '../components/Banner/Banner';
import Showtimes from '../components/Showtimes/Showtimes';
import Movies from '../components/Movies/Movies';

function Home() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div>
      <Banner />
      <Showtimes onDaySelect={setSelectedDay} />
      <Movies selectedDay={selectedDay} />
    </div>
  );
}

export default Home;
