"use client";

import { Heart } from "lucide-react";

interface FullScreenLoaderProps {
    message?: string;
}

export default function FullScreenLoader({ message = "Loading..." }: FullScreenLoaderProps) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center">
            <div className="text-center w-60 h-36 flex items-center justify-center bg-white rounded-lg">
                <div>
                    <div className="relative">
                        {/* Pulsing heart animation */}
                        <Heart className="w-16 h-16 text-[#0F766E] animate-pulse mx-auto mb/2" />

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-[#0F766E]/20 animate-ping" />
                    </div>

                    {/* Loading message */}
                    <p className="text-gray-500 font-medium">{message}</p>

                    {/* Animated dots */}
                    <div className="flex justify-center gap-1 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8A96A] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                </div>
            </div>
        </div>
    );
}