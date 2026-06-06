"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Heart, ChevronRight, User, MapPin, Briefcase, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Protected from "@/components/Protected";
import api from "@/lib/axios";
import FullScreenLoader from "@/components/FullScreenLoader";

const stageColors = {
    PROFILE_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
    SEARCHING: "bg-sky-50 text-sky-700 border-sky-200",
    MATCHES_SENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ACTIVE_DISCUSSION: "bg-purple-50 text-purple-700 border-purple-200",
    MATCHED: "bg-rose-50 text-rose-700 border-rose-200",
    PAUSED: "bg-gray-50 text-gray-600 border-gray-200",
    CLOSED: "bg-stone-50 text-stone-600 border-stone-200"
};

const stageLabels = {
    PROFILE_REVIEW: "Profile Review",
    SEARCHING: "Searching",
    MATCHES_SENT: "Matches Sent",
    ACTIVE_DISCUSSION: "Active Discussion",
    MATCHED: "Matched ✨",
    PAUSED: "Paused",
    CLOSED: "Journey Complete"
};


export default function Dashboard() {
    const [loading, setLoading] = useState('')
    const [customers, setCustomers] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStage, setSelectedStage] = useState("ALL");

    const fetchCustomers = async () => {
        try {
            setLoading('Gathering your clients')
            const { data } = await api.get("/customer/all")
            setCustomers(data?.data)
            console.log(data?.data)
        } catch (error: any) {
            alert(`${error?.message}`)
        } finally {
            setLoading('')
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = `${customer.firstName} ${customer.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStage = selectedStage === "ALL" || customer.stage === selectedStage;
        return matchesSearch && matchesStage;
    });

    const stats = {
        total: customers.length,
        profileReview: customers.filter(c => c.stage === "PROFILE_REVIEW").length,
        searching: customers.filter(c => c.stage === "SEARCHING").length,
        matchesSent: customers.filter(c => c.stage === "MATCHES_SENT").length,
        activeDiscussion: customers.filter(c => c.stage === "ACTIVE_DISCUSSION").length,
        matched: customers.filter(c => c.stage === "MATCHED").length
    };

    return (
        <Protected>
            {!!loading && <FullScreenLoader message={loading} />}
            <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2]">
                {/* Header with warm gradient */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[#0F766E] via-[#1a8a82] to-[#0F766E]">
                    <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
                    <div className="relative px-8 py-8">
                        <div className="max-w-7xl mx-auto">
                            {/* Welcome Section */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h1 className="text-3xl font-serif text-white mb-2">
                                        Welcome back!
                                    </h1>
                                    <p className="text-teal-50 text-sm">
                                        You're making a difference in {stats.total} love journeys today
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* <div className="text-right">
                                        <p className="text-teal-50 text-xs">Matchmaker</p>
                                        <p className="text-white font-medium text-sm">Meera Krishnamurthy</p>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-serif">MK</span>
                                    </div> */}
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <p className="text-teal-50 text-xs mb-1">Profile Review</p>
                                    <p className="text-white text-2xl font-serif">{stats.profileReview}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <p className="text-teal-50 text-xs mb-1">Searching</p>
                                    <p className="text-white text-2xl font-serif">{stats.searching}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <p className="text-teal-50 text-xs mb-1">Matches Sent</p>
                                    <p className="text-white text-2xl font-serif">{stats.matchesSent}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <p className="text-teal-50 text-xs mb-1">Active Discussion</p>
                                    <p className="text-white text-2xl font-serif">{stats.activeDiscussion}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <p className="text-teal-50 text-xs mb-1">Matched</p>
                                    <p className="text-white text-2xl font-serif">{stats.matched}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["ALL", "PROFILE_REVIEW", "SEARCHING", "MATCHES_SENT", "ACTIVE_DISCUSSION", "MATCHED", "PAUSED", "CLOSED"].map((stage) => (
                                    <button
                                        key={stage}
                                        onClick={() => setSelectedStage(stage)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedStage === stage
                                            ? "bg-[#0F766E] text-white shadow-md"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {stage === "ALL" ? "All Clients" : stageLabels[stage as keyof typeof stageLabels]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCustomers.map((customer) => (
                            <Link href={`/customer/${customer.id}`} key={customer.id}>
                                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#C8A96A]/30 cursor-pointer">
                                    {/* Card Header with gradient accent */}
                                    <div className="relative h-28 bg-gradient-to-r from-[#0F766E] to-[#1a8a82] overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
                                        <div className="absolute -bottom-6 left-6">
                                            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                                <span className="text-white font-serif text-xl font-semibold">
                                                    {customer.firstName[0]}{customer.lastName[0]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 pt-8">
                                        {/* Name and Stage */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-serif text-xl font-semibold text-gray-800 group-hover:text-[#0F766E] transition-colors">
                                                    {customer.firstName} {customer.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">{customer.age} years</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${stageColors[customer.stage as keyof typeof stageColors]}`}>
                                                {stageLabels[customer.stage as keyof typeof stageLabels]}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                                                <span>{customer.city}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Briefcase className="w-3.5 h-3.5 text-[#C8A96A]" />
                                                <span>{customer.profession.charAt(0) + customer.profession.slice(1).toLowerCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Heart className="w-3.5 h-3.5 text-[#C8A96A]" />
                                                <span>Looking for meaningful connection</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                            <div className="flex items-center gap-1 text-xs text-[#0F766E]">
                                                <Sparkles className="w-3 h-3" />
                                                <span>Ready for matchmaking</span>
                                            </div>
                                            <button className="text-[#0F766E] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                                                View Profile
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="font-serif text-xl text-gray-600 mb-2">No clients found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </Protected>
    );
}