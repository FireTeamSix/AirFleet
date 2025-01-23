"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;


        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid username or password");
        } else {
            router.push("/flights");
        }
    }

    return (
        <main className="relative min-h-screen flex flex-col px-4 bg-black">
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("home_bg.jpg")',
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
                    <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                    {error && <p className="text-red-400">{error}</p>}

                    <label htmlFor="username" className="text-gray-200">Username</label>
                    <input
                        className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                        type="text"
                        name="username"
                        id="username"
                        required
                    />

                    <label htmlFor="password" className="text-gray-200">Password</label>
                    <input
                        className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                        type="password"
                        name="password"
                        id="password"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-white text-black py-3 px-4 rounded-md font-medium
                                 hover:bg-gray-100 transition-colors mt-4"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}
