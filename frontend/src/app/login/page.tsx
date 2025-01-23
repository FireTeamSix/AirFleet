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
        <main className="flex min-h-screen items-center justify-center bg-black text-white">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 bg-gray-900 p-6 rounded shadow-md"
            >
                <h1 className="text-2xl font-bold">Login</h1>
                {error && <p className="text-red-400">{error}</p>}

                <label htmlFor="username">Username</label>
                <input
                    className="p-2 text-black"
                    type="text"
                    name="username"
                    id="username"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    className="p-2 text-black"
                    type="password"
                    name="password"
                    id="password"
                    required
                />

                <button
                    type="submit"
                    className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
                >
                    Sign In
                </button>
            </form>
        </main>
    );
}
