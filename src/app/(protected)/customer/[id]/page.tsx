"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Users,
  Home,
  Utensils,
  Cigarette,
  Wine,
  PawPrint,
  Baby,
  Map,
  MessageCircle,
  Send,
  Sparkles,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  Globe,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Protected from "@/components/Protected";
import api from "@/lib/axios";
import Modal from "@/components/Modal";
import FullScreenLoader from "@/components/FullScreenLoader";

// Types
interface CustomerPreferences {
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredReligion: string;
  preferredCaste: string;
  preferredMotherTongue: string;
  preferredEducation: string;
  preferredProfession: string;
  preferredDiet: string;
  preferredFamilyType: string;
  preferredMaritalStatus: string;
  preferredCity: string;
  preferredState: string;
}

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  state: string;
  country: string;
  height: number;
  weight: number;
  education: string;
  profession: string;
  annualIncome: number;
  caste: string;
  subCaste: string;
  gotra: string;
  motherTongue: string;
  languagesKnown: string[];
  siblings: number;
  familyType: string;
  familyValues: string;
  diet: string;
  smoking: string;
  drinking: string;
  pets: boolean;
  religion: string;
  zodiacSign: string;
  manglik: string;
  wantsChildren: boolean;
  hasChildren: boolean;
  numberOfChildren: number;
  maritalStatus: string;
  willingToRelocate: boolean;
  relocationCities: string[];
  bio: string;
  stage: string;
  age: number;
  preferences: CustomerPreferences;
  notes: any[];
  sentMatches: any[];
}

interface Match {
  customerId: string;
  score: number;
  factors: Record<string, { score: number; reason: string }>;
  aiExplanation: {
    matchmaker_note: string;
    key_factors: string[];
    potential_concerns: string[];
  };
}

interface MatchResponse {
  customerId: string;
  matches: Match[];
  total: number;
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Stage colors mapping
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

// Score color helper
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return "bg-emerald-50 border-emerald-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-rose-50 border-rose-200";
};

const loadingMatchMessages = [
  "Searching for compatible matches...",
  "Generating AI compatibility insights...",
  "Analyzing preferences and lifestyle...",
  "Curating personalized recommendations...",
  "Finding the perfect connections..."
];

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "notes" | "sent">("profile");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch customer details
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const { data } = await api.get(`/customer/details/${customerId}`)
        setCustomer(data)
      } catch (error) {
        console.error("Error fetching customer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  // Fetch matches with infinite scroll
  const fetchMatches = async (pageNum: number) => {
    if (!hasMore) return;

    setLoadingMatches(true);
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMatchMessages.length);
    }, 2000);
    try {
      const { data } = await api.get(`/customer/match/${customerId}?page=${pageNum}&limit=10`)

      if (pageNum === 1) {
        setMatches(data.matches);
        console.log(data.matches)
      } else {
        setMatches(prev => [...prev, ...data.matches]);
      }

      setHasMore(data.matches.length === 10);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoadingMatches(false);
      clearInterval(interval);
    }
  };

  // Initial matches load
  useEffect(() => {
    if (customerId) {
      fetchMatches(1);
    }
  }, [customerId]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMatches) {
          setPage(prev => prev + 1);
          fetchMatches(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMatches, page]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await fetch(`/api/customers/${customerId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote })
      });
      setNewNote("");
      const response = await fetch(`/api/customers/${customerId}`);
      const data = await response.json();
      setCustomer(data);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleSendMatch = async (matchCustomerId: string) => {
    try {
      // await fetch(`/api/customers/${customerId}/send-match`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ matchCustomerId })
      // });
      alert("Match sent successfully! ✨");
    } catch (error) {
      console.error("Error sending match:", error);
    }
  };

  const handleViewMatchDetails = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  if (!loading && !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <p className="text-gray-600">Customer not found</p>
          <Link href="/dashboard" className="mt-4 inline-block text-[#0F766E] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Protected>
      {loading && <FullScreenLoader />}
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F766E] via-[#1a8a82] to-[#0F766E] text-white">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-teal-50 hover:text-white mb-4 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif text-3xl mb-2">
                  {customer?.firstName} {customer?.lastName}
                </h1>
                <div className="flex items-center gap-4 text-teal-50">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {customer?.age} years
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {customer?.city}, {customer?.state}
                  </span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${stageColors[customer?.stage as keyof typeof stageColors]}`}>
                {stageLabels[customer?.stage as keyof typeof stageLabels]}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tabs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === "profile"
                      ? "text-[#0F766E] border-b-2 border-[#0F766E]"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Profile Overview
                  </button>
                  {/* <button
                    onClick={() => setActiveTab("notes")}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === "notes"
                      ? "text-[#0F766E] border-b-2 border-[#0F766E]"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Matchmaker Notes ({customer?.notes?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("sent")}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === "sent"
                      ? "text-[#0F766E] border-b-2 border-[#0F766E]"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Previously Sent ({customer?.sentMatches?.length || 0})
                  </button> */}
                </div>

                <div className="p-6">
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      {/* About */}
                      {customer?.bio && (
                        <div>
                          <h3 className="font-serif text-lg text-gray-800 mb-2">About</h3>
                          <p className="text-gray-600 leading-relaxed">{customer?.bio}</p>
                        </div>
                      )}

                      {/* Basic Information */}
                      <div>
                        <h3 className="font-serif text-lg text-gray-800 mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Marital Status</p>
                              <p className="text-sm text-gray-700">{customer?.maritalStatus.toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Baby className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Children</p>
                              <p className="text-sm text-gray-700">
                                {customer?.hasChildren ? `${customer?.numberOfChildren} children` : "None"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <GraduationCap className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Education</p>
                              <p className="text-sm text-gray-700">{customer?.education.toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Briefcase className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Profession</p>
                              <p className="text-sm text-gray-700">{customer?.profession.toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <IndianRupee className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Annual Income</p>
                              <p className="text-sm text-gray-700">{formatCurrency(customer?.annualIncome ?? 0)}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Heart className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Religion & Caste</p>
                              <p className="text-sm text-gray-700">{customer?.religion} • {customer?.caste}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lifestyle */}
                      <div>
                        <h3 className="font-serif text-lg text-gray-800 mb-3">Lifestyle</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start gap-2">
                            <Utensils className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Diet</p>
                              <p className="text-sm text-gray-700">{customer?.diet.toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Cigarette className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Smoking</p>
                              <p className="text-sm text-gray-700">{customer?.smoking.toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Wine className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Drinking</p>
                              <p className="text-sm text-gray-700">{customer?.drinking.toLowerCase()}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <PawPrint className="w-4 h-4 text-[#C8A96A] mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500">Pets</p>
                              <p className="text-sm text-gray-700">{customer?.pets ? "Has pets" : "No pets"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preferences */}
                      {customer?.preferences && (
                        <div>
                          <h3 className="font-serif text-lg text-gray-800 mb-3">Partner Preferences</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Age Range</p>
                              <p className="text-sm text-gray-700">{customer?.preferences.preferredAgeMin} - {customer?.preferences.preferredAgeMax} years</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Religion</p>
                              <p className="text-sm text-gray-700">{customer?.preferences.preferredReligion}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Caste</p>
                              <p className="text-sm text-gray-700">{customer?.preferences.preferredCaste}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Marital Status</p>
                              <p className="text-sm text-gray-700">{customer?.preferences.preferredMaritalStatus.toLowerCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Education</p>
                              <p className="text-sm text-gray-700">{customer?.preferences.preferredEducation.toLowerCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Location</p>
                              <p className="text-sm text-gray-700">{customer?.preferences.preferredCity}, {customer?.preferences.preferredState}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === "notes" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Add a note</label>
                        <div className="flex gap-3">
                          <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Write your observations, thoughts, or follow-ups..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] resize-none"
                            rows={3}
                          />
                          <button
                            onClick={handleAddNote}
                            className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#1a8a82] transition-colors h-fit"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {customer?.notes && customer?.notes.length > 0 ? (
                          customer?.notes.map((note: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                              <p className="text-gray-700">{note.content}</p>
                              <p className="text-xs text-gray-400 mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                            <p>No notes yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sent Matches Tab */}
                  {activeTab === "sent" && (
                    <div className="space-y-3">
                      {customer?.sentMatches && customer?.sentMatches.length > 0 ? (
                        customer?.sentMatches.map((match: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div>
                              <p className="font-medium text-gray-800">{match.name}</p>
                              <p className="text-sm text-gray-500">Compatibility: {match.score}%</p>
                            </div>
                            <p className="text-xs text-gray-400">{new Date(match.sentDate).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <Send className="w-8 h-8 mx-auto mb-2" />
                          <p>No matches sent yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Recommended Matches (1 column) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gradient-to-r from-[#0F766E] to-[#1a8a82] rounded-xl p-4 text-white">
                <Sparkles className="w-5 h-5 mb-2" />
                <h3 className="font-serif text-lg">AI-Powered Matches</h3>
                <p className="text-teal-50 text-sm">Based on preferences and compatibility</p>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)]">
                {matches.map((match, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-serif text-lg font-semibold text-gray-800">
                            Match #{idx + 1}
                          </h4>
                          <p className="text-xs text-gray-500">Customer ID: {match.customerId.slice(-8)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreBgColor(match.score)} ${getScoreColor(match.score)}`}>
                          {match.score}%
                        </div>
                      </div>

                      {/* AI Explanation */}
                      <div className="mb-3 p-3 bg-amber-50/30 rounded-lg border border-amber-100">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {match.aiExplanation?.matchmaker_note}
                        </p>
                      </div>

                      {/* Key Factors */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Key Strengths
                        </p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {match.aiExplanation?.key_factors.slice(0, 2).map((factor, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-1">
                              <span className="text-emerald-600">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Potential Concerns */}
                      {match.aiExplanation?.potential_concerns.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            To Consider
                          </p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {match.aiExplanation?.potential_concerns.slice(0, 2).map((concern, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-1">
                                <span className="text-amber-600">•</span>
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleViewMatchDetails(match)}
                          className="flex-1 px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          View Match Details
                        </button>
                        <button
                          onClick={() => handleSendMatch(match.customerId)}
                          className="flex-1 px-3 py-1.5 text-sm bg-[#0F766E] text-white rounded-lg hover:bg-[#1a8a82] transition-colors flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Send Match
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Infinite scroll trigger */}
                <div ref={observerTarget} className="h-4"></div>

                {loadingMatches && (
                  <div className="text-center py-4">
                    <Heart className="w-6 h-6 text-[#0F766E] animate-pulse mx-auto" />
                    <p className="text-gray-400 mt-1"> {loadingMatchMessages[loadingMessageIndex]}</p>
                  </div>
                )}

                {!hasMore && matches.length > 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    ✨ That's all for now
                  </div>
                )}

                {matches.length === 0 && !loadingMatches && (
                  <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No matches found yet</p>
                    <p className="text-xs text-gray-400 mt-1">Check back after updating preferences</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Match Details"
        maxWidth="lg"
      >
        {selectedMatch && (
          <div className="space-y-6">
            {/* Compatibility Score */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl border border-amber-100">
              <div>
                <p className="text-sm text-gray-600">Compatibility Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(selectedMatch?.score)}`}>
                  {selectedMatch?.score}%
                </p>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-2 ${getScoreBgColor(selectedMatch?.score)} ${getScoreColor(selectedMatch?.score)}`}>
                {selectedMatch?.score}
              </div>
            </div>

            {/* Matchmaker Note */}
            <div>
              <h3 className="font-serif text-lg text-gray-800 mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C8A96A]" />
                Matchmaker's Note
              </h3>
              <div className="bg-amber-50/30 p-4 rounded-lg border border-amber-100">
                <p className="text-gray-700 leading-relaxed">
                  {selectedMatch?.aiExplanation?.matchmaker_note}
                </p>
              </div>
            </div>

            {/* Key Factors */}
            <div>
              <h3 className="font-serif text-lg text-gray-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Strengths
              </h3>
              <div className="space-y-2">
                {selectedMatch?.aiExplanation?.key_factors?.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-emerald-50/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{factor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Concerns */}
            {selectedMatch?.aiExplanation?.potential_concerns?.length > 0 && (
              <div>
                <h3 className="font-serif text-lg text-gray-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Considerations
                </h3>
                <div className="space-y-2">
                  {selectedMatch?.aiExplanation?.potential_concerns?.map((concern, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-amber-50/30 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{concern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Factor Breakdown */}
            <div>
              <h3 className="font-serif text-lg text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                Detailed Compatibility
              </h3>
              <div className="space-y-3 pr-2">
                {Object.entries(selectedMatch?.factors).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className={`text-sm font-semibold ${value.score >= 80 ? "text-emerald-600" :
                        value.score >= 50 ? "text-amber-600" : "text-rose-600"
                        }`}>
                        {value.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full ${value.score >= 80 ? "bg-emerald-500" :
                          value.score >= 50 ? "bg-amber-500" : "bg-rose-500"
                          }`}
                        style={{ width: `${value.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{value.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSendMatch(selectedMatch?.customerId);
                  setIsModalOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0F766E] to-[#1a8a82] text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send This Match
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Protected>
  );
}