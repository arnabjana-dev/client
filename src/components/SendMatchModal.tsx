"use client";

import { useState } from "react";
import { Heart, Send, X, Mail, Sparkles, CheckCircle } from "lucide-react";

interface SendMatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    matchData: {
        customerId: string;
        score: number;
        aiExplanation: {
            matchmaker_note: string;
            key_factors: string[];
        };
    };
    customerName: string;
}

export default function SendMatchModal({
    isOpen,
    onClose,
    onConfirm,
    matchData,
    customerName
}: SendMatchModalProps) {
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSend = async () => {
        setIsSending(true);
        await onConfirm();
        setIsSending(false);
        onClose();
    };

    // Generate email preview
    const emailSubject = `✨ A Thoughtfully Curated Match for You from The Date Crew`;
    const emailBody = `
Dear ${customerName},

Our matchmaking team has found someone we believe could be a wonderful match for you.

✨ Match Highlights:
• Compatibility Score: ${matchData.score}%
• ${matchData.aiExplanation.key_factors[0] || "Strong alignment in key areas"}
• ${matchData.aiExplanation.key_factors[1] || "Shared values and lifestyle preferences"}

Matchmaker's Note:
${matchData.aiExplanation.matchmaker_note}

We recommend reviewing this profile and letting us know your thoughts. Every connection begins with an open heart.

With warmth,
The Date Crew Matchmaking Team

---
This is a confidential match recommendation from The Date Crew.
  `;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#0F766E] via-[#1a8a82] to-[#0F766E] px-6 py-4">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
                    <div className="relative flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Send className="w-5 h-5 text-white" />
                            <h2 className="font-serif text-xl text-white">Send Match Recommendation</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                    {/* Match Summary Card */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl border border-amber-100">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-serif text-lg text-gray-800">Match Summary</h3>
                            <div className="px-3 py-1 bg-white rounded-full text-sm font-bold text-[#0F766E] border border-[#0F766E]/20">
                                {matchData.score}% Compatible
                            </div>
                        </div>

                        {/* Key Factors */}
                        <div className="space-y-2">
                            {matchData.aiExplanation.key_factors.slice(0, 3).map((factor, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{factor}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Matchmaker Note */}
                    <div className="mb-6">
                        <h3 className="font-serif text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                            Matchmaker's Assessment
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {matchData.aiExplanation.matchmaker_note}
                            </p>
                        </div>
                    </div>

                    {/* Email Preview */}
                    <div className="mb-6">
                        <h3 className="font-serif text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#C8A96A]" />
                            Email Preview
                        </h3>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                                <p className="text-xs text-gray-600 font-mono">Subject: {emailSubject}</p>
                            </div>
                            <div className="p-4 text-sm text-gray-600 whitespace-pre-wrap font-mono text-xs max-h-64 overflow-y-auto">
                                {emailBody}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0F766E] to-[#1a8a82] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSending ? (
                            <>
                                <Heart className="w-4 h-4 animate-pulse" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Match Recommendation
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}