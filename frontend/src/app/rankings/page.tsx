"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface Ranking {
    username: string;
    total_flights?: number;
    total_time?: string;
    total_distance?: number;
}

interface RankingsData {
    flights: Ranking[];
    time: Ranking[];
    distance: Ranking[];
}

export default function RankingsPage() {
    const [rankings, setRankings] = useState<RankingsData | null>(null);
    const [activeTab, setActiveTab] = useState<'flights' | 'time' | 'distance'>('flights');

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/rankings/');
                if (!response.ok) throw new Error('Failed to fetch rankings');
                const data = await response.json();
                setRankings(data);
            } catch (error) {
                console.error('Error fetching rankings:', error);
            }
        };

        fetchRankings();
    }, []);

    const renderRankings = () => {
        if (!rankings) return <div>Loading...</div>;

        const data = rankings[activeTab];
        
        return (
            <div className="space-y-4">
                {data.map((rank, index) => (
                    <div 
                        key={rank.username} 
                        className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                            <span className="text-xl">{rank.username}</span>
                        </div>
                        <span className="text-xl">
                            {activeTab === 'flights' && rank.total_flights}
                            {activeTab === 'time' && rank.total_time}
                            {activeTab === 'distance' && `${rank.total_distance} nm`}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Pilot Rankings</h1>
                
                <div className="flex space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('flights')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'flights' 
                                ? 'bg-blue-600' 
                                : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        Total Flights
                    </button>
                    <button
                        onClick={() => setActiveTab('time')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'time' 
                                ? 'bg-blue-600' 
                                : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        Flight Time
                    </button>
                    <button
                        onClick={() => setActiveTab('distance')}
                        className={`px-4 py-2 rounded ${
                            activeTab === 'distance' 
                                ? 'bg-blue-600' 
                                : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        Distance Flown
                    </button>
                </div>

                {renderRankings()}
            </div>
        </div>
    );
} 