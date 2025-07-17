'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] text-white relative overflow-x-hidden">
      {/* Subtle basketball court pattern background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{background: 'url("/court-pattern.svg") repeat', opacity: 0.08}} />
      {/* Header */}
      <header className="relative z-10 bg-black/70 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            {/* Logo: basketball + chart */}
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2">
              <span className="text-2xl">🏀</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">TS Tracker Pro</h1>
          </div>
          <button
            className="bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-6 py-2 rounded-full font-semibold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB927]"
            onClick={() => router.push('/login')}
          >
            Connect Your Collection
          </button>
        </div>
      </header>
      {/* Tagline & Disclaimer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex flex-col sm:flex-row sm:justify-between items-center text-xs text-gray-400">
        <span className="font-semibold">Unofficial portfolio analytics for NBA Top Shot collectors</span>
        <span className="mt-2 sm:mt-0">Not affiliated with NBA Top Shot or Dapper Labs</span>
      </div>
      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-white">
          Advanced Portfolio Analytics for <span className="text-[#FDB927]">NBA Top Shot</span> Collectors
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Track your collection, analyze trends, and unlock deep insights with the most trusted analytics platform for NBA Top Shot.
        </p>
        <button
          className="bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-10 py-4 rounded-full font-bold text-xl shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB927] mb-8"
          onClick={() => router.push('/login')}
        >
          Connect Your Collection
        </button>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
            <span className="text-3xl mb-3">📈</span>
            <h3 className="text-lg font-bold text-white mb-2">Track Performance</h3>
            <p className="text-gray-300">Monitor your portfolio value, moment prices, and sales history in real time.</p>
          </div>
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
            <span className="text-3xl mb-3">📊</span>
            <h3 className="text-lg font-bold text-white mb-2">Analyze Trends</h3>
            <p className="text-gray-300">Visualize market trends, player performance, and collection growth with pro charts.</p>
          </div>
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-md flex flex-col items-center">
            <span className="text-3xl mb-3">💎</span>
            <h3 className="text-lg font-bold text-white mb-2">Portfolio Insights</h3>
            <p className="text-gray-300">Get advanced stats, rarity breakdowns, and actionable insights for your collection.</p>
          </div>
        </div>
        {/* Testimonials */}
        <div className="mt-16 w-full max-w-3xl mx-auto">
          <h4 className="text-xl font-bold text-white mb-6">What Collectors Are Saying</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#181A1B]/80 rounded-lg p-5 border border-[#333] shadow flex flex-col">
              <span className="text-lg text-[#FDB927] font-bold mb-2">“TS Tracker Pro is my go-to for tracking my Top Shot investments.”</span>
              <span className="text-gray-300 mt-2">— @hoopfanatic</span>
            </div>
            <div className="bg-[#181A1B]/80 rounded-lg p-5 border border-[#333] shadow flex flex-col">
              <span className="text-lg text-[#FDB927] font-bold mb-2">“The analytics and charts are next-level. I feel like a pro trader.”</span>
              <span className="text-gray-300 mt-2">— @momentmaven</span>
            </div>
            <div className="bg-[#181A1B]/80 rounded-lg p-5 border border-[#333] shadow flex flex-col">
              <span className="text-lg text-[#FDB927] font-bold mb-2">“Finally, a dashboard that makes sense for serious collectors.”</span>
              <span className="text-gray-300 mt-2">— @courtvision</span>
            </div>
            <div className="bg-[#181A1B]/80 rounded-lg p-5 border border-[#333] shadow flex flex-col">
              <span className="text-lg text-[#FDB927] font-bold mb-2">“I trust TS Tracker Pro to keep my collection stats on point.”</span>
              <span className="text-gray-300 mt-2">— @legendaryhoops</span>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;900&display=swap');
        html { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
    </div>
  )
}