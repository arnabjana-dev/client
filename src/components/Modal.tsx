"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-[95vw]"
};

export default function Modal({ isOpen, onClose, title, children, maxWidth = "xl" }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative ${maxWidthClasses[maxWidth]} w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200`}
            >
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-r from-[#0F766E] via-[#1a8a82] to-[#0F766E] px-6 py-4">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
                    <div className="relative flex justify-between items-center">
                        <h2 className="font-serif text-xl text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}