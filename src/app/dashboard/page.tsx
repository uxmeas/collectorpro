'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Target, 
  Activity,
  Eye,
  Star,
  Filter,
  Download,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Zap
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Premium Performance Metrics Hook (Koyfin-inspired)
const usePortfolioMetrics = (walletAddress: string) => {
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    totalProfit: 0,
    roi: 0,
    topPerformer: null,
    recentActivity: [],
    loading: true
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/flow/comprehensive-portfolio?address=${walletAddress}`)
        const data = await response.json()
        
        if (data.success) {
          setMetrics({
            totalValue: data.totalValue || 0,
            totalProfit: data.totalProfit || 0,
            roi: data.roi || 0,
            topPerformer: data.topPerformer || null,
            recentActivity: data.recentActivity || [],
            loading: false
          })
        }
      } catch (error) {
        console.error('Error fetching metrics:', error)
        setMetrics(prev => ({ ...prev, loading: false }))
      }
    }

    if (walletAddress) {
      fetchMetrics()
    }
  }, [walletAddress])

  return metrics
}

// Sample data for premium visualizations (TradingView-inspired)
const portfolioChartData = [
  { date: 'Jan', value: 45000, volume: 12 },
  { date: 'Feb', value: 52000, volume: 19 },
  { date: 'Mar', value: 48000, volume: 15 },
  { date: 'Apr', value: 61000, volume: 24 },
  { date: 'May', value: 58000, volume: 21 },
  { date: 'Jun', value: 67000, volume: 31 },
  { date: 'Jul', value: 72000, volume: 28 }
]

const performanceData = [
  { name: 'LeBron James', value: 35, color: '#10B981' },
  { name: 'Stephen Curry', value: 25, color: '#3B82F6' },
  { name: 'Kevin Durant', value: 20, color: '#8B5CF6' },
  { name: 'Giannis', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 5, color: '#6B7280' }
]

// Webull-style Data Table Component
const MomentTable = ({ moments }: { moments: any[] }) => (
  <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800/50">
            <th className="text-left py-4 px-6 font-medium text-gray-300">Asset</th>
            <th className="text-right py-4 px-4 font-medium text-gray-300">Current Price</th>
            <th className="text-right py-4 px-4 font-medium text-gray-300">24h Change</th>
            <th className="text-right py-4 px-4 font-medium text-gray-300">P&L</th>
            <th className="text-right py-4 px-4 font-medium text-gray-300">ROI</th>
            <th className="text-right py-4 px-4 font-medium text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {moments.map((moment, index) => (
            <tr key={index} className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors group">
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{moment.player}</div>
                    <div className="text-sm text-gray-400">#{moment.serialNumber || `${index + 1000}`}</div>
                  </div>
                </div>
              </td>
              <td className="text-right py-4 px-4 font-medium text-white">
                ${moment.currentPrice?.toLocaleString() || '---'}
              </td>
              <td className="text-right py-4 px-4">
                <span className={`flex items-center justify-end space-x-1 ${
                  Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {Math.random() > 0.5 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{((Math.random() - 0.5) * 20).toFixed(2)}%</span>
                </span>
              </td>
              <td className="text-right py-4 px-4">
                <span className={`font-medium ${
                  (moment.profit || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ${Math.abs(moment.profit || 0).toLocaleString()}
                </span>
              </td>
              <td className="text-right py-4 px-4">
                <span className={`font-medium ${
                  (moment.roi || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {((moment.roi || 0) * 100).toFixed(2)}%
                </span>
              </td>
              <td className="text-right py-4 px-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

function PremiumDashboardContent() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet') || 'demo-wallet'
  const { totalValue, totalProfit, roi, loading } = usePortfolioMetrics(walletAddress)
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D')
  const [moments, setMoments] = useState<any[]>([])

  // Sample moments data (would come from API)
  const sampleMoments = [
    { player: 'LeBron James', currentPrice: 1250, profit: 250, roi: 0.25, serialNumber: '1234' },
    { player: 'Stephen Curry', currentPrice: 890, profit: -45, roi: -0.048, serialNumber: '5678' },
    { player: 'Kevin Durant', currentPrice: 1580, profit: 480, roi: 0.44, serialNumber: '9012' },
    { player: 'Giannis Antetokounmpo', currentPrice: 2100, profit: 850, roi: 0.68, serialNumber: '3456' },
    { player: 'Luka Dončić', currentPrice: 1750, profit: 320, roi: 0.22, serialNumber: '7890' }
  ]

  useEffect(() => {
    setMoments(sampleMoments)
  }, [])

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          <p className="text-white font-medium">
            Value: {formatValue(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Premium Header - Koyfin Style */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold tracking-tight">CollectorPRO</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-blue-400 font-medium">Dashboard</Link>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">Research</Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search moments..."
                  className="bg-gray-900/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all w-64"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Premium KPI Cards - Koyfin Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '---' : formatValue(totalValue)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-300">Portfolio Value</p>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">+2.4% today</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {loading ? '---' : formatValue(Math.abs(totalProfit))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-300">Total P&L</p>
              <div className="flex items-center space-x-2">
                <ArrowUpRight className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">{((roi || 0) * 100).toFixed(2)}% ROI</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {moments.length}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-300">Total Moments</p>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-400">5 series</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                A+
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-300">Portfolio Score</p>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400">Top 15%</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* TradingView-Style Chart */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Portfolio Performance</h3>
                <p className="text-sm text-gray-400">Track your collection's value over time</p>
              </div>
              <div className="flex items-center space-x-2">
                {['1D', '7D', '1M', '3M', '1Y', 'ALL'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTimeframe === timeframe
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioChartData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatValue(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#colorGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Performance Breakdown */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Top Performers</h3>
            
            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Allocation']}
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {performanceData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Webull-Style Data Table */}
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Your Collection</h3>
              <p className="text-sm text-gray-400">Detailed view of all your NBA Top Shot moments</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          <MomentTable moments={moments} />
        </Card>
      </div>
    </div>
  )
}

export default function PremiumDashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PremiumDashboardContent />
    </Suspense>
  )
} 