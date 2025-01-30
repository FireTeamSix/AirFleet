"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed: Server Error');
            }

            // Store tokens
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed: This Username or Email is already in use');
        }
    };

    return (
        <main className="relative min-h-screen flex flex-col px-4 bg-black">
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/home_bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 bg-black/80 p-8 rounded-lg shadow-xl backdrop-blur-sm w-full max-w-md"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Register</h1>
                    {error && <p className="text-red-400">{error}</p>}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password2" className="block text-sm font-medium text-gray-200">Confirm Password</label>
                        <input
                            type="password"
                            id="password2"
                            value={formData.password2}
                            onChange={(e) => setFormData({...formData, password2: e.target.value})}
                            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        Register
                    </button>

                    <p className="text-center text-gray-300">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}