'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NBATopShotMoment, PortfolioAnalytics } from '../../lib/nba-topshot-types'

export default function ComprehensiveDashboard() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState('')
  const [portfolio, setPortfolio] = useState<PortfolioAnalytics | null>(null)
  const [moments, setMoments] = useState<NBATopShotMoment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  // Check for wallet address in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const walletFromUrl = urlParams.get('wallet')
    if (walletFromUrl) {
      setWalletAddress(walletFromUrl)
      connectWalletWithAddress(walletFromUrl)
    }
  }, [])

  const connectWalletWithAddress = async (address: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/flow/comprehensive-portfolio?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (data.success) {
        setPortfolio(data.data.portfolio)
        setMoments(data.data.moments)
      } else {
        setError(data.error || 'Failed to fetch comprehensive portfolio data')
      }
    } catch (err) {
      setError('Failed to connect to wallet')
      console.error('Comprehensive portfolio fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid Flow wallet address')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/flow/comprehensive-portfolio?address=${encodeURIComponent(walletAddress)}`)
      const data = await response.json()

      if (data.success) {
        setPortfolio(data.data.portfolio)
        setMoments(data.data.moments)
      } else {
        setError(data.error || 'Failed to fetch comprehensive portfolio data')
      }
    } catch (err) {
      setError('Failed to connect to wallet')
      console.error('Comprehensive portfolio fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toUpperCase()) {
      case 'COMMON': return 'text-gray-400'
      case 'RARE': return 'text-blue-400'
      case 'LEGENDARY': return 'text-purple-400'
      case 'ULTIMATE': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-400'
    if (risk < 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (!portfolio) {
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
              Professional <span className="text-[#FDB927]">Portfolio Analytics</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
              Get comprehensive NBA Top Shot analytics with real-time data, risk analysis, and professional insights.
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
                  placeholder="0x1234567890abcdef"
                  className="w-full px-6 py-4 bg-[#181A1B] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent text-lg font-mono"
                />
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
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-8 py-4 rounded-xl font-bold text-xl shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB927] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="inline-block h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                    Analyzing Portfolio...
                  </div>
                ) : (
                  'Get Professional Analytics'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
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
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm font-mono">{walletAddress}</span>
            <button
              onClick={() => {
                setPortfolio(null)
                setMoments([])
                setWalletAddress('')
              }}
              className="bg-[#23272A] hover:bg-[#2C2F33] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Portfolio Value</h3>
            <p className="text-3xl font-bold text-white">{formatCurrency(portfolio.overview.totalValue)}</p>
            <p className={`text-sm mt-2 ${getTrendColor(portfolio.performance.allTimeChange)}`}>
              {formatPercentage(portfolio.performance.allTimeChange)} all time
            </p>
          </div>
          
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Profit/Loss</h3>
            <p className={`text-3xl font-bold ${getTrendColor(portfolio.overview.totalProfit)}`}>
              {formatCurrency(portfolio.overview.totalProfit)}
            </p>
            <p className={`text-sm mt-2 ${getTrendColor(portfolio.overview.profitPercentage)}`}>
              {formatPercentage(portfolio.overview.profitPercentage)} ROI
            </p>
          </div>
          
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Moments</h3>
            <p className="text-3xl font-bold text-white">{portfolio.overview.totalMoments}</p>
            <p className="text-gray-400 text-sm mt-2">in collection</p>
          </div>
          
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">24h Change</h3>
            <p className={`text-3xl font-bold ${getTrendColor(portfolio.performance.dailyChange)}`}>
              {formatPercentage(portfolio.performance.dailyChange)}
            </p>
            <p className="text-gray-400 text-sm mt-2">from yesterday</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#23272A]/80 rounded-xl p-2 border border-[#333] shadow-lg mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'breakdown', label: 'Breakdown', icon: '📈' },
              { id: 'holdings', label: 'Holdings', icon: '💎' },
              { id: 'risk', label: 'Risk Analysis', icon: '⚠️' },
              { id: 'market', label: 'Market Insights', icon: '📈' },
              { id: 'performance', label: 'Performance', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#C8102E] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-[#2C2F33]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Change</span>
                    <span className={getTrendColor(portfolio.performance.dailyChange)}>
                      {formatPercentage(portfolio.performance.dailyChange)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Weekly Change</span>
                    <span className={getTrendColor(portfolio.performance.weeklyChange)}>
                      {formatPercentage(portfolio.performance.weeklyChange)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Change</span>
                    <span className={getTrendColor(portfolio.performance.monthlyChange)}>
                      {formatPercentage(portfolio.performance.monthlyChange)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">All Time Change</span>
                    <span className={getTrendColor(portfolio.performance.allTimeChange)}>
                      {formatPercentage(portfolio.performance.allTimeChange)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Portfolio Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average ROI</span>
                    <span className={getTrendColor(portfolio.overview.averageROI)}>
                      {formatPercentage(portfolio.overview.averageROI)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Weighted Avg ROI</span>
                    <span className={getTrendColor(portfolio.overview.weightedAverageROI)}>
                      {formatPercentage(portfolio.overview.weightedAverageROI)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Acquisition Cost</span>
                    <span className="text-white">{formatCurrency(portfolio.overview.totalAcquisitionCost)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Last Updated</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(portfolio.overview.lastUpdated).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Holdings Preview */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Top Holdings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.topHoldings.slice(0, 6).map((holding) => (
                  <div key={holding.id} className="bg-[#181A1B] rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#C8102E] to-[#1D428A] rounded-lg flex items-center justify-center">
                        <span className="text-sm">🏀</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{holding.playerName}</p>
                        <p className="text-gray-400 text-xs">{holding.teamName}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Value</span>
                        <span className="text-white font-semibold">{formatCurrency(holding.currentValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROI</span>
                        <span className={getTrendColor(holding.profitPercentage ?? 0)}>
                          {formatPercentage(holding.profitPercentage ?? 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Rarity</span>
                        <span className={getRarityColor(holding.rarity)}>{holding.rarity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'breakdown' && (
          <div className="space-y-8">
            {/* Rarity Breakdown */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Portfolio by Rarity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(portfolio.breakdown.byRarity).map(([rarity, data]) => (
                  <div key={rarity} className="bg-[#181A1B] rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${getRarityColor(rarity).replace('text-', 'bg-')}`}></div>
                      <span className="text-white font-semibold">{rarity}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Count</span>
                        <span className="text-white">{data.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Value</span>
                        <span className="text-white">{formatCurrency(data.value)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">% of Portfolio</span>
                        <span className="text-white">{data.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROI</span>
                        <span className={getTrendColor(data.profitPercentage)}>
                          {formatPercentage(data.profitPercentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Breakdown */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Portfolio by Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(portfolio.breakdown.byTeam)
                  .sort(([,a], [,b]) => b.value - a.value)
                  .slice(0, 9)
                  .map(([team, data]) => (
                  <div key={team} className="bg-[#181A1B] rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">{team}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Count</span>
                        <span className="text-white">{data.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Value</span>
                        <span className="text-white">{formatCurrency(data.value)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">% of Portfolio</span>
                        <span className="text-white">{data.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ROI</span>
                        <span className={getTrendColor(data.profitPercentage)}>
                          {formatPercentage(data.profitPercentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'holdings' && (
          <div className="space-y-8">
            {/* All Holdings Table */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">All Holdings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#333]">
                      <th className="text-left py-3 px-4 text-gray-300">Player</th>
                      <th className="text-left py-3 px-4 text-gray-300">Team</th>
                      <th className="text-left py-3 px-4 text-gray-300">Rarity</th>
                      <th className="text-left py-3 px-4 text-gray-300">Serial</th>
                      <th className="text-right py-3 px-4 text-gray-300">Current Value</th>
                      <th className="text-right py-3 px-4 text-gray-300">Acquisition</th>
                      <th className="text-right py-3 px-4 text-gray-300">Profit/Loss</th>
                      <th className="text-right py-3 px-4 text-gray-300">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moments.map((moment) => (
                      <tr key={moment.id} className="border-b border-[#333]/50 hover:bg-[#181A1B]/50">
                        <td className="py-3 px-4 text-white font-medium">{moment.playerName}</td>
                        <td className="py-3 px-4 text-gray-300">{moment.teamName}</td>
                        <td className="py-3 px-4">
                          <span className={getRarityColor(moment.rarity)}>{moment.rarity}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">#{moment.serialNumber}</td>
                        <td className="py-3 px-4 text-right text-white font-semibold">
                          {formatCurrency(moment.currentValue)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          {moment.acquisitionPrice ? formatCurrency(moment.acquisitionPrice) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={getTrendColor(moment.profit ?? 0)}>
                            {formatCurrency(moment.profit ?? 0)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={getTrendColor(moment.profitPercentage ?? 0)}>
                            {formatPercentage(moment.profitPercentage ?? 0)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-8">
            {/* Risk Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Risk Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Concentration Risk</span>
                    <span className={getRiskColor(portfolio.riskAnalysis.concentrationRisk)}>
                      {portfolio.riskAnalysis.concentrationRisk.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Volatility Risk</span>
                    <span className={getRiskColor(portfolio.riskAnalysis.volatilityRisk)}>
                      {portfolio.riskAnalysis.volatilityRisk.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Liquidity Risk</span>
                    <span className={getRiskColor(portfolio.riskAnalysis.liquidityRisk)}>
                      {portfolio.riskAnalysis.liquidityRisk.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Market Risk</span>
                    <span className={getRiskColor(portfolio.riskAnalysis.marketRisk)}>
                      {portfolio.riskAnalysis.marketRisk.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Portfolio Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Diversification Score</span>
                    <span className={getRiskColor(100 - portfolio.riskAnalysis.diversificationScore)}>
                      {portfolio.riskAnalysis.diversificationScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Risk-Adjusted Return</span>
                    <span className={getTrendColor(portfolio.riskAnalysis.riskAdjustedReturn)}>
                      {formatPercentage(portfolio.riskAnalysis.riskAdjustedReturn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-8">
            {/* Market Insights */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Market Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#181A1B] rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Market Trend</h4>
                  <p className={`text-2xl font-bold ${portfolio.marketInsights.marketTrend === 'bullish' ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolio.marketInsights.marketTrend.toUpperCase()}
                  </p>
                </div>
                <div className="bg-[#181A1B] rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">24h Volume</h4>
                  <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.marketInsights.volume24h)}</p>
                </div>
                <div className="bg-[#181A1B] rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Average Price</h4>
                  <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.marketInsights.averagePrice)}</p>
                </div>
                <div className="bg-[#181A1B] rounded-lg p-4">
                  <h4 className="text-gray-400 text-sm mb-2">Active Listings</h4>
                  <p className="text-2xl font-bold text-white">{portfolio.marketInsights.activeListings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Trending Players */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Trending Players</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.marketInsights.trendingPlayers.map((player) => (
                  <div key={player.playerId} className="bg-[#181A1B] rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">{player.playerName}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">24h Volume</span>
                        <span className="text-white">{formatCurrency(player.volume24h)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Volume Change</span>
                        <span className={getTrendColor(player.volumeChange24h)}>
                          {formatPercentage(player.volumeChange24h)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Avg Price</span>
                        <span className="text-white">{formatCurrency(player.averagePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Price Change</span>
                        <span className={getTrendColor(player.priceChange24h)}>
                          {formatPercentage(player.priceChange24h)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Trend</span>
                        <span className={player.trend === 'up' ? 'text-green-400' : player.trend === 'down' ? 'text-red-400' : 'text-gray-400'}>
                          {player.trend.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Timeline */}
            <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Performance Timeline</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#181A1B] rounded-lg p-4">
                    <h4 className="text-gray-400 text-sm mb-2">Daily</h4>
                    <p className={`text-2xl font-bold ${getTrendColor(portfolio.performance.dailyChange)}`}>
                      {formatPercentage(portfolio.performance.dailyChange)}
                    </p>
                    <p className="text-gray-400 text-sm">{formatCurrency(portfolio.performance.dailyChange)}</p>
                  </div>
                  <div className="bg-[#181A1B] rounded-lg p-4">
                    <h4 className="text-gray-400 text-sm mb-2">Weekly</h4>
                    <p className={`text-2xl font-bold ${getTrendColor(portfolio.performance.weeklyChange)}`}>
                      {formatPercentage(portfolio.performance.weeklyChange)}
                    </p>
                    <p className="text-gray-400 text-sm">{formatCurrency(portfolio.performance.weeklyChange)}</p>
                  </div>
                  <div className="bg-[#181A1B] rounded-lg p-4">
                    <h4 className="text-gray-400 text-sm mb-2">Monthly</h4>
                    <p className={`text-2xl font-bold ${getTrendColor(portfolio.performance.monthlyChange)}`}>
                      {formatPercentage(portfolio.performance.monthlyChange)}
                    </p>
                    <p className="text-gray-400 text-sm">{formatCurrency(portfolio.performance.monthlyChange)}</p>
                  </div>
                  <div className="bg-[#181A1B] rounded-lg p-4">
                    <h4 className="text-gray-400 text-sm mb-2">All Time</h4>
                    <p className={`text-2xl font-bold ${getTrendColor(portfolio.performance.allTimeChange)}`}>
                      {formatPercentage(portfolio.performance.allTimeChange)}
                    </p>
                    <p className="text-gray-400 text-sm">{formatCurrency(portfolio.performance.allTimeChange)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 