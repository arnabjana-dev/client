"use client";

import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/auth/login", { email, password })
            router.push("/dashboard");
            localStorage.setItem("token", data?.token);
        } catch (error: any) {
            alert(`${error?.message}`)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#0F766E] to-[#1a8a82] rounded-2xl mb-4 shadow-lg">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-serif text-3xl text-gray-800 mb-2">
                        The Date Crew
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Matchmaker Portal · Where love stories begin
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 text-[#C8A96A] text-sm mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Welcome back</span>
                        </div>
                        <h2 className="font-serif text-2xl text-gray-800">
                            Matchmaker Login
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Continue your journey of bringing hearts together
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
                                placeholder="meera@thedatecrew.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#0F766E] to-[#1a8a82] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                        >
                            Login to Dashboard
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            Secure portal for TDC matchmakers only
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Every login helps write a new love story ✨
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}