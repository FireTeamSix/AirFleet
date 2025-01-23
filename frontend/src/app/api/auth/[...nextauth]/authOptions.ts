import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (credentials?.username === "pilot" && credentials?.password === "airfleet123") {
                    return { id: "123", name: "Pilot", email: "pilot@airfleet.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
};
