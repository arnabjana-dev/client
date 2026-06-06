import Link from "next/link";
import {
  Heart,
  Sparkles,
  Users,
  Quote,
  ArrowRight,
  MessageCircle
} from "lucide-react";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-white to-[#FAF7F2]">

      {/* Navigation */}
      <nav className="px-8 py-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#0F766E] fill-[#0F766E]/20" />
            <span className="font-serif text-2xl text-gray-800">The Date Crew</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href={'/login'}>
              <button
                className="px-6 py-2 text-[#0F766E] hover:bg-[#0F766E]/5 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Matchmaker Portal</span>
            </div>
            <h1 className="font-serif text-5xl lg:text-6xl text-gray-800 mb-6 leading-tight">
              Bringing Hearts Together,
              <span className="text-[#0F766E]"> One Match at a Time</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Professional matchmaking dashboard for TDC's dedicated matchmakers.
              Review profiles, curate matches, and help clients find their perfect life partner.
            </p>
            <div className="flex gap-4">
              <button
                className="px-8 py-3 bg-[#0F766E] text-white rounded-lg hover:bg-[#1a8a82] transition-all shadow-md flex items-center gap-2">
                <Link href={'/dashboard'}>
                  Access Dashboard
                </Link>
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-[#0F766E] hover:text-[#0F766E] transition-all">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-100">
              <div>
                <p className="text-2xl font-serif text-gray-800">1000+</p>
                <p className="text-sm text-gray-500">Successful Matches</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-gray-800">85%</p>
                <p className="text-sm text-gray-500">Success Rate</p>
              </div>
              <div>
                <p className="text-2xl font-serif text-gray-800">4.9/5</p>
                <p className="text-sm text-gray-500">Client Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E] to-[#1a8a82] rounded-2xl blur-3xl opacity-10"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-serif">MK</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Meera Krishnamurthy</p>
                  <p className="text-xs text-gray-500">Senior Matchmaker · 8 years</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-sm">Active clients</span>
                  </div>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#0F766E]" />
                    <span className="text-sm">Matches sent this week</span>
                  </div>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm">New connections</span>
                  </div>
                  <span className="font-semibold text-emerald-600">3 this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Features */}
      < section className="px-8 py-16 bg-white/50" >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-gray-800 mb-3">Designed for Matchmakers</h2>
            <p className="text-gray-500">Everything you need to create meaningful connections</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#0F766E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-[#0F766E]" />
              </div>
              <h3 className="font-serif text-xl text-gray-800 mb-2">Client Management</h3>
              <p className="text-gray-500 text-sm">View assigned clients, track journey stages, and manage profiles in one place</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#0F766E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-[#0F766E]" />
              </div>
              <h3 className="font-serif text-xl text-gray-800 mb-2">AI-Powered Matches</h3>
              <p className="text-gray-500 text-sm">Get intelligent match recommendations with detailed compatibility insights</p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#0F766E]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-[#0F766E]" />
              </div>
              <h3 className="font-serif text-xl text-gray-800 mb-2">Matchmaker Notes</h3>
              <p className="text-gray-500 text-sm">Record observations, track conversations, and collaborate with the team</p>
            </div>
          </div>
        </div>
      </section >

      {/* Testimonial */}
      < section className="px-8 py-16 max-w-7xl mx-auto" >
        <div className="bg-gradient-to-r from-[#0F766E] to-[#1a8a82] rounded-2xl p-8 md:p-12 text-center">
          <Quote className="w-10 h-10 text-white/30 mx-auto mb-4" />
          <p className="text-white text-xl md:text-2xl font-serif mb-4 max-w-2xl mx-auto">
            "The Date Crew's matchmaker platform has transformed how we create connections.
            The AI insights save hours of manual work."
          </p>
          <p className="text-teal-100 font-medium">Priya Sharma</p>
          <p className="text-teal-200 text-sm">Lead Matchmaker, The Date Crew</p>
        </div>
      </section >

      {/* CTA */}
      < section className="px-8 py-20 max-w-4xl mx-auto text-center" >
        <h2 className="font-serif text-3xl text-gray-800 mb-4">Ready to Create Love Stories?</h2>
        <p className="text-gray-500 mb-8">Join our team of dedicated matchmakers and help clients find their perfect partner</p>
        <Link href={'/dashboard'}>
          <button
            className="px-8 py-3 bg-[#0F766E] text-white rounded-lg hover:bg-[#1a8a82] transition-all shadow-md flex items-center gap-2">
            Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </section >

      {/* Footer */}
      < footer className="px-8 py-12 border-t border-gray-100" >
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#0F766E]" />
            <span className="font-serif text-gray-800">The Date Crew</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 The Date Crew. Professional matchmaking services.
          </p>
        </div>
      </footer >
    </div >
  );
}