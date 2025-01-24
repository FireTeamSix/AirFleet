"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        // Remove the tokens
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        // Redirect to login page
        router.push('/login');
    };

    return (
        <nav className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/flights" className="text-xl font-bold">
                    AirFleet
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/flights" className="hover:text-gray-300">
                        Flights
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
} 