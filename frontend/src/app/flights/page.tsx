"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { format, differenceInSeconds } from 'date-fns';
import Image from 'next/image';
import { fetchWithAuth } from '@/utils/api';
import Navbar from '@/components/Navbar';

interface Flight {
    id: number;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    total_time: string;
    departure_gate: string;
    arrival_gate: string;
    flight_plan: string;
    notes: string;
    photo: string | null;
    aircraft_condition: string;
    registration_number: string;
}

export default function FlightsPage() {
    const { data: session, status } = useSession();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isAddingFlight, setIsAddingFlight] = useState(false);
    const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
    const [formData, setFormData] = useState({
        departure_airport: '',
        arrival_airport: '',
        departure_time: '',
        arrival_time: '',
        departure_gate: '',
        arrival_gate: '',
        flight_plan: '',
        notes: '',
        total_time: '',
        aircraft_condition: 'AIRWORTHY',
        registration_number: '',
    });
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

    const CONDITIONS = [
        { value: 'GROUNDED', label: 'Grounded' },
        { value: 'MAINTENANCE', label: 'Needs Maintenance' },
        { value: 'MINOR_ISSUES', label: 'Minor Issues' },
        { value: 'GOOD', label: 'Good Condition' },
        { value: 'AIRWORTHY', label: 'Airworthy' },
    ];

    useEffect(() => {
        if (!session) return;
        fetchFlights();
    }, [session]);

    const fetchFlights = async () => {
        try {
            const response = await fetchWithAuth("http://127.0.0.1:8000/api/flights/");
            if (response.ok) {
                const data = await response.json();
                setFlights(data);
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
        }
    };

    const handleEdit = (flight: Flight) => {
        setEditingFlight(flight);
        setFormData({
            departure_airport: flight.departure_airport,
            arrival_airport: flight.arrival_airport,
            departure_time: flight.departure_time.slice(0, 16), // Format for datetime-local input
            arrival_time: flight.arrival_time.slice(0, 16),
            departure_gate: flight.departure_gate,
            arrival_gate: flight.arrival_gate,
            flight_plan: flight.flight_plan,
            notes: flight.notes,
            total_time: flight.total_time,
            aircraft_condition: flight.aircraft_condition,
            registration_number: flight.registration_number,
        });
        setIsAddingFlight(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const departureDate = new Date(formData.departure_time);
        const arrivalDate = new Date(formData.arrival_time);
        const totalSeconds = differenceInSeconds(arrivalDate, departureDate);
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const total_time = `PT${hours}H${minutes}M${seconds}S`;

        const formDataObj = new FormData();
        Object.entries({ ...formData, total_time }).forEach(([key, value]) => {
            formDataObj.append(key, value);
        });

        if (selectedPhoto) {
            formDataObj.append('photo', selectedPhoto);
        }

        try {
            const url = editingFlight 
                ? `http://127.0.0.1:8000/api/flights/${editingFlight.id}/`
                : "http://127.0.0.1:8000/api/flights/";

            const response = await fetchWithAuth(url, editingFlight ? 'PUT' : 'POST', formDataObj);

            if (response.ok) {
                setIsAddingFlight(false);
                setEditingFlight(null);
                fetchFlights();
                setFormData({
                    departure_airport: '',
                    arrival_airport: '',
                    departure_time: '',
                    arrival_time: '',
                    departure_gate: '',
                    arrival_gate: '',
                    flight_plan: '',
                    notes: '',
                    total_time: '',
                    aircraft_condition: 'AIRWORTHY',
                    registration_number: '',
                });
                setSelectedPhoto(null);
            }
        } catch (error) {
            console.error('Error submitting flight:', error);
        }
    };

    if (status === "loading") return <p>Loading...</p>;

    if (!session) {
        return (
            <div className="p-8">
                <h2>Access Denied</h2>
                <p>Please sign in to view your logbook.</p>
                <button onClick={() => signIn()} className="mt-4">Sign In</button>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Flight Logbook</h1>
                    <button
                        onClick={() => setIsAddingFlight(true)}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        Add Flight
                    </button>
                </div>

                {isAddingFlight && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-100 rounded-lg p-8 max-w-2xl w-full">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">
                                {editingFlight ? 'Edit Flight' : 'Add New Flight'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Departure Airport</label>
                                        <input
                                            type="text"
                                            value={formData.departure_airport}
                                            onChange={(e) => setFormData({...formData, departure_airport: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Arrival Airport</label>
                                        <input
                                            type="text"
                                            value={formData.arrival_airport}
                                            onChange={(e) => setFormData({...formData, arrival_airport: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Departure Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.departure_time}
                                            onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Arrival Time</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.arrival_time}
                                            onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Departure Gate</label>
                                        <input
                                            type="text"
                                            value={formData.departure_gate}
                                            onChange={(e) => setFormData({...formData, departure_gate: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Arrival Gate</label>
                                        <input
                                            type="text"
                                            value={formData.arrival_gate}
                                            onChange={(e) => setFormData({...formData, arrival_gate: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Registration Number</label>
                                        <input
                                            type="text"
                                            value={formData.registration_number}
                                            onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-900">Aircraft Condition</label>
                                        <select
                                            value={formData.aircraft_condition}
                                            onChange={(e) => setFormData({...formData, aircraft_condition: e.target.value})}
                                            className="w-full p-2 border rounded bg-white text-gray-900"
                                            required
                                        >
                                            {CONDITIONS.map(condition => (
                                                <option key={condition.value} value={condition.value}>
                                                    {condition.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-900">Flight Plan</label>
                                    <textarea
                                        value={formData.flight_plan}
                                        onChange={(e) => setFormData({...formData, flight_plan: e.target.value})}
                                        className="w-full p-2 border rounded bg-white text-gray-900"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-900">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="w-full p-2 border rounded bg-white text-gray-900"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-900">Flight Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
                                        className="w-full p-2 border rounded bg-white text-gray-900"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingFlight(false)}
                                        className="px-4 py-2 text-gray-900 hover:text-black transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                                    >
                                        Save Flight
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-gray-100 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Registration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Condition</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Photo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {flights.map((flight) => (
                                <tr key={flight.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-900">
                                        {flight.departure_airport} → {flight.arrival_airport}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {format(new Date(flight.departure_time), 'MMM d, HH:mm')} →{' '}
                                        {format(new Date(flight.arrival_time), 'MMM d, HH:mm')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {formatDuration(flight.total_time)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {flight.registration_number}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {CONDITIONS.find(c => c.value === flight.aircraft_condition)?.label}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {flight.photo && (
                                            <Image
                                                src={`http://127.0.0.1:8000${flight.photo}`}
                                                alt="Flight photo"
                                                width={50}
                                                height={50}
                                                className="rounded"
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleEdit(flight)}
                                            className="text-black hover:text-gray-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function formatDuration(duration: string) {
    // Parse ISO 8601 duration string
    const matches = duration.match(/PT(\d+)H(\d+)M(\d+)S/);
    if (!matches) return duration;
    
    const [hours, minutes, seconds] = matches;
    const parts = [];
    
    if (parseInt(hours)) parts.push(`${parseInt(hours)}h`);
    if (parseInt(minutes)) parts.push(`${parseInt(minutes)}m`);
    if (parseInt(seconds)) parts.push(`${parseInt(seconds)}s`);
    
    return parts.join(' ');
}
