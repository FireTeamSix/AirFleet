"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { addFlight } from '@/utils/api';

export default function AddFlight() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        departure_time: '',
        arrival_time: '',
        departure_airport: '',
        arrival_airport: '',
        registration_number: '',
        aircraft_condition: 'AIRWORTHY',
        distance: 0,
        photo: null as File | null,
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                photo: e.target.files![0]
            }));
        }
    };

    const calculateTotalTime = () => {
        if (formData.departure_time && formData.arrival_time) {
            const departure = new Date(formData.departure_time);
            const arrival = new Date(formData.arrival_time);
            const diffInSeconds = (arrival.getTime() - departure.getTime()) / 1000;
            const hours = Math.floor(diffInSeconds / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);
            const seconds = Math.floor(diffInSeconds % 60);
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return '0:00:00';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const totalTime = calculateTotalTime();
            const flightData = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null) {
                    if (key === 'photo' && value instanceof File) {
                        flightData.append(key, value);
                    } else if (typeof value === 'number') {
                        flightData.append(key, value.toString());
                    } else if (typeof value === 'string') {
                        flightData.append(key, value);
                    }
                }
            });
            
            flightData.append('total_time', totalTime);

            await addFlight(flightData);
            router.push('/flights');
            router.refresh();
        } catch (error) {
            setError('Failed to add flight. Please try again.');
            console.error('Error adding flight:', error);
            if (error instanceof Error && error.message.includes('401')) {
                router.push('/login');
            }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Add New Flight</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Departure Time
                            </label>
                            <input
                                type="datetime-local"
                                name="departure_time"
                                value={formData.departure_time}
                                onChange={handleChange}
                                required
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Arrival Time
                            </label>
                            <input
                                type="datetime-local"
                                name="arrival_time"
                                value={formData.arrival_time}
                                onChange={handleChange}
                                required
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Departure Airport
                            </label>
                            <input
                                type="text"
                                name="departure_airport"
                                value={formData.departure_airport}
                                onChange={handleChange}
                                required
                                minLength={3}
                                maxLength={4}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Arrival Airport
                            </label>
                            <input
                                type="text"
                                name="arrival_airport"
                                value={formData.arrival_airport}
                                onChange={handleChange}
                                required
                                minLength={3}
                                maxLength={4}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Distance (nm)
                            </label>
                            <input
                                type="number"
                                name="distance"
                                value={formData.distance}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                name="registration_number"
                                value={formData.registration_number}
                                onChange={handleChange}
                                required
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Aircraft Condition
                            </label>
                            <select
                                name="aircraft_condition"
                                value={formData.aircraft_condition}
                                onChange={handleChange}
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            >
                                <option value="AIRWORTHY">Airworthy</option>
                                <option value="GOOD">Good Condition</option>
                                <option value="MINOR_ISSUES">Minor Issues</option>
                                <option value="MAINTENANCE">Needs Maintenance</option>
                                <option value="GROUNDED">Grounded</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Photo
                            </label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="w-full p-2 rounded bg-gray-800 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add Flight
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}