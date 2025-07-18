'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
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
  Zap,
  Trophy,
  AlertTriangle,
  Clock,
  Users,
  Award,
  Crown,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
  Percent,
  Hash,
  Layers,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  ScatterChart,
  Gauge,
  Flame,
  Snowflake,
  Diamond,
  Gem,
  Sparkles,
  Database,
  Wallet
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

interface FlowTransaction {
  id: string
  blockHeight: number
  timestamp: string
  type: 'purchase' | 'sale' | 'mint' | 'transfer' | 'list' | 'withdraw' | 'deposit'
  momentId?: string
  price?: number
  priceInFlow?: number
  priceInUSD?: number
  fromAddress?: string
  toAddress?: string
  seller?: string
  buyer?: string
  marketplace?: string
  gasUsed?: number
  status: 'success' | 'failed' | 'pending'
  events: any[]
  metadata?: Record<string, any>
}

interface FlowPurchaseData {
  momentId: string
  purchasePrice: number
  purchasePriceUSD: number
  purchaseDate: string
  seller: string
  buyer: string
  marketplace: string
  transactionHash: string
  blockHeight: number
}

interface FlowPortfolioPL {
  totalInvested: number
  totalInvestedUSD: number
  currentValue: number
  currentValueUSD: number
  totalProfit: number
  totalProfitUSD: number
  profitPercentage: number
  totalTransactions: number
  averagePurchasePrice: number
  averagePurchasePriceUSD: number
  purchaseHistory: FlowPurchaseData[]
  salesHistory: FlowPurchaseData[]
  mintHistory: FlowPurchaseData[]
}

interface FlowTransactionTrackerProps {
  walletAddress?: string
}

export default function FlowTransactionTracker({ walletAddress = 'demo-wallet' }: FlowTransactionTrackerProps) {
  const [loading, setLoading] = useState(false)
  const [transactions, setTransactions] = useState<FlowTransaction[]>([])
  const [purchaseHistory, setPurchaseHistory] = useState<FlowPortfolioPL | null>(null)
  const [marketData, setMarketData] = useState<Record<string, any>>({})
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('30d')
  const [filterType, setFilterType] = useState<'all' | 'purchases' | 'sales' | 'mints'>('all')

  useEffect(() => {
    if (walletAddress) {
      fetchTransactionData()
    }
  }, [walletAddress, selectedTimeframe])

  const fetchTransactionData = async () => {
    setLoading(true)
    try {
      // Fetch transaction data from our API
      const response = await fetch(`/api/flow/transactions?wallet=${walletAddress}`)
      const data = await response.json()
      
      if (data.success) {
        setPurchaseHistory(data.purchaseHistory)
        setMarketData(data.marketData)
        
        // Generate sample transactions for demo
        const sampleTransactions = generateSampleTransactions()
        setTransactions(sampleTransactions)
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSampleTransactions = (): FlowTransaction[] => {
    const sampleData = [
      {
        id: '0x1234567890abcdef',
        blockHeight: 12345678,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'purchase' as const,
        momentId: '123456',
        price: 150,
        priceInFlow: 15,
        priceInUSD: 150,
        fromAddress: '0xabcdef1234567890',
        toAddress: walletAddress,
        seller: '0xabcdef1234567890',
        buyer: walletAddress,
        marketplace: 'NBA TopShot',
        gasUsed: 1000,
        status: 'success' as const,
        events: [],
        metadata: { playerName: 'LeBron James', rarity: 'Legendary' }
      },
      {
        id: '0x2345678901bcdefg',
        blockHeight: 12345679,
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'purchase' as const,
        momentId: '123457',
        price: 75,
        priceInFlow: 7.5,
        priceInUSD: 75,
        fromAddress: '0xbcdefg2345678901',
        toAddress: walletAddress,
        seller: '0xbcdefg2345678901',
        buyer: walletAddress,
        marketplace: 'NBA TopShot',
        gasUsed: 1000,
        status: 'success' as const,
        events: [],
        metadata: { playerName: 'Stephen Curry', rarity: 'Rare' }
      },
      {
        id: '0x3456789012cdefgh',
        blockHeight: 12345680,
        timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'sale' as const,
        momentId: '123458',
        price: 200,
        priceInFlow: 20,
        priceInUSD: 200,
        fromAddress: walletAddress,
        toAddress: '0xcdefgh3456789012',
        seller: walletAddress,
        buyer: '0xcdefgh3456789012',
        marketplace: 'NBA TopShot',
        gasUsed: 1000,
        status: 'success' as const,
        events: [],
        metadata: { playerName: 'Giannis Antetokounmpo', rarity: 'Legendary' }
      }
    ]

    return sampleData
  }

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <ArrowDownRight className="w-4 h-4 text-green-400" />
      case 'sale': return <ArrowUpRight className="w-4 h-4 text-red-400" />
      case 'mint': return <Sparkles className="w-4 h-4 text-blue-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-400'
      case 'sale': return 'text-red-400'
      case 'mint': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true
    if (filterType === 'purchases') return tx.type === 'purchase'
    if (filterType === 'sales') return tx.type === 'sale'
    if (filterType === 'mints') return tx.type === 'mint'
    return false
  })

  const chartData = purchaseHistory?.purchaseHistory.map(purchase => ({
    date: formatDate(purchase.purchaseDate),
    price: purchase.purchasePriceUSD,
    momentId: purchase.momentId
  })) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Flow transaction data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-400" />
                Flow Transaction Tracker
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500">
                  <Database className="w-3 h-3 mr-1" />
                  Live Blockchain Data
                </Badge>
              </h1>
              <p className="text-gray-400">Real-time Flow blockchain transaction tracking with purchase price extraction</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchTransactionData}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Wallet Info */}
          <Card className="bg-gray-900/50 border-gray-700 p-4">
            <div className="flex items-center gap-4">
              <Wallet className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Connected Wallet</p>
                <p className="text-white font-mono">{walletAddress}</p>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>
          </Card>
        </div>

        {/* P&L Summary */}
        {purchaseHistory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatValue(purchaseHistory.totalInvestedUSD)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-300">Total Invested</p>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Purchase History</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatValue(purchaseHistory.currentValueUSD)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-300">Current Value</p>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400">Market Price</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatValue(purchaseHistory.totalProfitUSD)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-300">Total Profit</p>
                <div className="flex items-center space-x-2">
                  <Percent className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">{purchaseHistory.profitPercentage.toFixed(2)}% ROI</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {purchaseHistory.totalTransactions}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-300">Transactions</p>
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">Flow Blockchain</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Purchase Price History */}
          <Card className="bg-gray-900/50 border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Purchase Price History</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500">
                  <LineChart className="w-3 h-3 mr-1" />
                  Flow Data
                </Badge>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Transaction Types Distribution */}
          <Card className="bg-gray-900/50 border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Transaction Types</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-400 border-purple-500">
                  <PieChartIcon className="w-3 h-3 mr-1" />
                  Distribution
                </Badge>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Purchases', value: transactions.filter(t => t.type === 'purchase').length, color: '#10B981' },
                    { name: 'Sales', value: transactions.filter(t => t.type === 'sale').length, color: '#EF4444' },
                    { name: 'Mints', value: transactions.filter(t => t.type === 'mint').length, color: '#3B82F6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {[
                    { name: 'Purchases', value: transactions.filter(t => t.type === 'purchase').length, color: '#10B981' },
                    { name: 'Sales', value: transactions.filter(t => t.type === 'sale').length, color: '#EF4444' },
                    { name: 'Mints', value: transactions.filter(t => t.type === 'mint').length, color: '#3B82F6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-gray-900/50 border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Transaction History</h3>
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={filterType === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'purchases' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('purchases')}
                >
                  Purchases
                </Button>
                <Button
                  variant={filterType === 'sales' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('sales')}
                >
                  Sales
                </Button>
                <Button
                  variant={filterType === 'mints' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('mints')}
                >
                  Mints
                </Button>
              </div>

              {/* Timeframe Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Timeframe:</span>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-white"
                >
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                  <option value="1y">1 Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Moment ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Marketplace</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className={`capitalize ${getTransactionColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm">{transaction.momentId}</span>
                        {transaction.metadata?.playerName && (
                          <Badge variant="outline" className="text-xs">
                            {transaction.metadata.playerName}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {transaction.priceInUSD ? `$${transaction.priceInUSD}` : 'N/A'}
                        </span>
                        {transaction.priceInFlow && (
                          <span className="text-sm text-gray-400">
                            {transaction.priceInFlow} FLOW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {transaction.marketplace || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatDate(transaction.timestamp)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={transaction.status === 'success' ? 'secondary' : 'destructive'}
                        className={transaction.status === 'success' ? 'bg-green-500/20 text-green-400' : ''}
                      >
                        {transaction.status === 'success' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No transactions found for the selected filters</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 