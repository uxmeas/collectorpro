'use client'

import { useState, useEffect, useMemo } from 'react'
import { flowTopShotService, FlowCollectionData, FlowMarketData, FlowTransactionData } from '@/lib/flow-topshot-service'
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  collections: FlowCollectionData[]
  marketData: FlowMarketData
  transactions: FlowTransactionData[]
  priceHistory: Array<{ date: string; price: number; volume: number }>
  topPerformers: Array<{ name: string; change: number; volume: number }>
  rarityDistribution: Array<{ name: string; value: number; color: string }>
}

export default function AnalyticsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all-flow')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('24h')

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedPlatform, timeframe])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Load all data in parallel for better performance
      const [collections, marketData, transactions] = await Promise.all([
        flowTopShotService.getCombinedFlowData(),
        flowTopShotService.getFlowMarketAnalytics('combined'),
        flowTopShotService.getLiveTransactions('combined', 100)
      ])

      // Generate additional analytics data
      const priceHistory = generatePriceHistory()
      const topPerformers = collections
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 10)
        .map(c => ({
          name: c.name,
          change: c.change24h,
          volume: c.volume24h
        }))

      const rarityDistribution = [
        { name: 'Common', value: 60, color: '#8b5cf6' },
        { name: 'Rare', value: 25, color: '#3b82f6' },
        { name: 'Legendary', value: 12, color: '#f59e0b' },
        { name: 'Ultimate', value: 3, color: '#ef4444' }
      ]

      setAnalyticsData({
        collections,
        marketData,
        transactions,
        priceHistory,
        topPerformers,
        rarityDistribution
      })
    } catch (error) {
      console.error('❌ Error loading analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePriceHistory = () => {
    const data = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      data.push({
        date: date.toLocaleDateString(),
        price: Math.random() * 50 + 20,
        volume: Math.random() * 1000000 + 500000
      })
    }
    return data
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume.toFixed(0)}`
  }

  const formatChange = (change: number) => {
    const formatted = change.toFixed(1)
    return change >= 0 ? `+${formatted}%` : `${formatted}%`
  }

  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading NBA Top Shot Analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">NBA Top Shot Analytics</h1>
              <p className="text-gray-400">Professional Flow blockchain analytics and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg"
              >
                <option value="1h">1 Hour</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
              <Button onClick={loadAnalyticsData} className="bg-blue-600 hover:bg-blue-700">
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Platform Selector */}
          <div className="flex space-x-2">
            {[
              { id: 'all-flow', name: 'All Top Shot', desc: 'NBA + WNBA' },
              { id: 'nba-topshot', name: 'NBA Top Shot', desc: 'Men\'s Basketball' },
              { id: 'wnba', name: 'WNBA', desc: 'Women\'s Basketball' }
            ].map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedPlatform === platform.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-sm font-medium">{platform.name}</div>
                <div className="text-xs opacity-75">{platform.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Volume</p>
                <p className="text-2xl font-bold text-white">{formatVolume(analyticsData.marketData.totalVolume)}</p>
                <p className={`text-sm ${analyticsData.marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatChange(analyticsData.marketData.change24h)} vs yesterday
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-xl">📊</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Floor Price</p>
                <p className="text-2xl font-bold text-white">{formatPrice(analyticsData.marketData.floorPrice)}</p>
                <p className="text-sm text-green-400">+2.3% vs yesterday</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 text-xl">💰</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Traders</p>
                <p className="text-2xl font-bold text-white">{analyticsData.marketData.activeTraders.toLocaleString()}</p>
                <p className="text-sm text-green-400">+5.2% vs yesterday</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 text-xl">👥</span>
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-white">{analyticsData.marketData.totalSales.toLocaleString()}</p>
                <p className="text-sm text-green-400">+8.1% vs yesterday</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-orange-400 text-xl">🏀</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price History Chart */}
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price History (30 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    fill="url(#priceGradient)" 
                  />
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Volume Chart */}
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Trading Volume (30 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="volume" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Analytics Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performers */}
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performers (24h)</h3>
            <div className="space-y-3">
              {analyticsData.topPerformers.slice(0, 8).map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{performer.name}</p>
                      <p className="text-gray-400 text-sm">{formatVolume(performer.volume)} volume</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${performer.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatChange(performer.change)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Rarity Distribution */}
          <Card className="bg-[#1a1a1a] border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rarity Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.rarityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {analyticsData.rarityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {analyticsData.rarityDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-300 text-sm">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <span className="px-2 py-1 text-xs font-medium text-green-400 border border-green-500/30 rounded-md">
              Live Feed
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium py-3">Player</th>
                  <th className="text-left text-gray-400 font-medium py-3">Play</th>
                  <th className="text-left text-gray-400 font-medium py-3">Type</th>
                  <th className="text-left text-gray-400 font-medium py-3">Price</th>
                  <th className="text-left text-gray-400 font-medium py-3">Rarity</th>
                  <th className="text-left text-gray-400 font-medium py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.transactions.slice(0, 10).map((tx, index) => (
                  <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3">
                      <div className="font-medium text-white">{tx.playerName}</div>
                    </td>
                    <td className="py-3 text-gray-300">{tx.playDescription}</td>
                    <td className="py-3">
                                           <span 
                       className={`px-2 py-1 text-xs font-medium border rounded-md ${
                         tx.type === 'sale' ? 'text-green-400 border-green-500/30' :
                         tx.type === 'mint' ? 'text-blue-400 border-blue-500/30' :
                         'text-orange-400 border-orange-500/30'
                       }`}
                     >
                       {tx.type.toUpperCase()}
                     </span>
                    </td>
                    <td className="py-3 text-white font-medium">{formatPrice(tx.price)}</td>
                    <td className="py-3">
                                           <span 
                       className={`px-2 py-1 text-xs font-medium border rounded-md ${
                         tx.rarity === 'Ultimate' ? 'text-red-400 border-red-500/30' :
                         tx.rarity === 'Legendary' ? 'text-yellow-400 border-yellow-500/30' :
                         tx.rarity === 'Rare' ? 'text-blue-400 border-blue-500/30' :
                         'text-gray-400 border-gray-500/30'
                       }`}
                     >
                       {tx.rarity}
                     </span>
                    </td>
                    <td className="py-3 text-gray-400 text-sm">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Unlock Premium NBA Top Shot Analytics</h3>
          <p className="text-gray-300 mb-6">Get advanced insights, portfolio tracking, and real-time alerts</p>
          <div className="flex items-center justify-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Start 7-Day Free Trial
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 