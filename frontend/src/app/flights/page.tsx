"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

interface Flight {
    id: number;
    departure: string;
    arrival: string;
    duration: string;
}

export default function FlightsPage() {
    const { data: session, status } = useSession();

    const [flights, setFlights] = useState<Flight[]>([]);

    useEffect(() => {
        if (!session) return; // If not logged in, skip fetching
        fetch("http://localhost:8000/api/flights/")
            .then((res) => res.json())
            .then((data) => setFlights(data));
    }, [session]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (!session) {
        return (
            <div style={{ padding: "2rem" }}>
                <h2>Access Denied</h2>
                <p>You must be signed in to view this page.</p>
                <button onClick={() => signIn()} style={{ marginTop: "1rem" }}>
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem" }}>
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
