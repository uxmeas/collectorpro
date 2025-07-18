'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConnectWallet() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const connectWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid Flow wallet address')
      return
    }

    // Validate Flow address format
    const flowAddressRegex = /^0x[a-fA-F0-9]{16}$/
    if (!flowAddressRegex.test(walletAddress.trim())) {
      setError('Please enter a valid Flow wallet address (0x followed by 16 characters)')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Redirect to dashboard with wallet address
      router.push(`/dashboard?wallet=${encodeURIComponent(walletAddress.trim())}`)
    } catch (err) {
      setError('Failed to connect wallet')
      console.error('Wallet connection error:', err)
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      connectWallet()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] text-white">
      {/* Header */}
      <header className="bg-black/70 backdrop-blur-md border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2">
              <span className="text-2xl">🏀</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">TS Tracker Pro</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-[#23272A] hover:bg-[#2C2F33] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Home
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-white">
            Connect Your <span className="text-[#FDB927]">Flow Wallet</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
            Enter your Flow wallet address to view your NBA Top Shot portfolio analytics, track performance, and get real-time insights.
          </p>
        </div>

        <div className="bg-[#23272A]/80 rounded-2xl p-8 border border-[#333] shadow-2xl max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Flow Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="0x1234567890abcdef"
                className="w-full px-6 py-4 bg-[#181A1B] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent text-lg font-mono"
              />
              <p className="text-gray-400 text-sm mt-2">
                Your wallet address should start with "0x" followed by 16 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <button
              onClick={connectWallet}
              disabled={loading || !walletAddress.trim()}
              className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-8 py-4 rounded-xl font-bold text-xl shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB927] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="inline-block h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                  Connecting...
                </div>
              ) : (
                'Connect Portfolio'
              )}
            </button>
          </div>

          {/* Features */}
          <div className="mt-12 pt-8 border-t border-[#333]">
            <h3 className="text-lg font-bold text-white mb-6">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#C8102E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C8102E] text-lg">📊</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Portfolio Analytics</h4>
                  <p className="text-gray-400 text-sm">Real-time value tracking and performance metrics</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#C8102E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C8102E] text-lg">📈</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Performance Tracking</h4>
                  <p className="text-gray-400 text-sm">Daily, weekly, and monthly ROI analysis</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#C8102E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C8102E] text-lg">🏆</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Rarity Breakdown</h4>
                  <p className="text-gray-400 text-sm">Detailed analysis by rarity, team, and player</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#C8102E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C8102E] text-lg">💎</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Top Holdings</h4>
                  <p className="text-gray-400 text-sm">Your most valuable moments and best performers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-[#181A1B] rounded-xl border border-[#333]">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-sm">🔒</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Secure & Private</h4>
                <p className="text-gray-400 text-sm">
                  We only read your public Flow wallet data. No private keys or credentials required. 
                  Your data is never stored or shared.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Wallet Addresses */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
          <p className="text-gray-400 mb-4">
            You can find your Flow wallet address in your Dapper wallet or Flow wallet app.
          </p>
          <div className="bg-[#23272A]/50 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-gray-300 text-sm mb-2">Example Flow address format:</p>
            <p className="text-[#FDB927] font-mono text-sm">0x1234567890abcdef</p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        html { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
    </div>
  )
} 