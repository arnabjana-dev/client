"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProtectedProps = {
    authProtected?: boolean
    children: React.ReactNode;
};

export default function Protected({ authProtected = true, children }: ProtectedProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (authProtected && !token) {
            router.replace("/login");
            return;
        }
        if (!authProtected && token) {
            router.replace("/dashboard");
            return;
        }

        setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] flex items-center justify-center">
                <div className="text-center">
                    <Heart className="w-12 h-12 text-[#0F766E] animate-pulse mx-auto mb-4" />
                    <p className="text-gray-500">Loading (Protected)...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}