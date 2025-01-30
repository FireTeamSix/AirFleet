"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { getFlights } from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Flight {
    id: number;
    departure_time: string;
    arrival_time: string;
    total_time: string;
    departure_airport: string;
    arrival_airport: string;
    registration_number: string;
    aircraft_condition: string;
    distance: number;
    photo?: string;
}

export default function FlightsPage() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const data = await getFlights();
                setFlights(data);
            } catch (error) {
                console.error('Error fetching flights:', error);
                // Redirect to login if unauthorized
                if (error instanceof Error && error.message.includes('401')) {
                    router.push('/login');
                }
            }
        };

        fetchFlights();
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Flights</h1>
                    <Link 
                        href="/flights/add" 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Flight
                    </Link>
                </div>

                <div className="space-y-4">
                    {flights.map((flight) => (
                        <div key={flight.id} className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {flight.departure_airport} → {flight.arrival_airport}
                                    </h3>
                                    <p className="text-gray-400">
                                        {new Date(flight.departure_time).toLocaleString()}
                                    </p>
                                    <p className="text-gray-400">
                                        Flight Time: {flight.total_time}
                                    </p>
                                    <p className="text-gray-400">
                                        Distance: {flight.distance} nm
                                    </p>
                                    <p className="text-gray-400">
                                        Aircraft: {flight.registration_number}
                                    </p>
                                    <p className="text-gray-400">
                                        Condition: {flight.aircraft_condition}
                                    </p>
                                </div>
                                {flight.photo && (
                                    <Image 
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${flight.photo}`}
                                        alt="Flight photo" 
                                        width={128}
                                        height={128}
                                        className="object-cover rounded"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
