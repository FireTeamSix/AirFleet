"use client";

import { useEffect, useState } from 'react';

interface Flight {
  id: number;
  departure: string;
  arrival: string;
  duration: string;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/flights/')
      .then((res) => res.json())
      .then((data) => setFlights(data));
  }, []);

  return (
    <div>
      <h1>Flights</h1>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            {flight.departure} -&gt; {flight.arrival} ({flight.duration})
          </li>
        ))}
      </ul>
    </div>
  );
}
