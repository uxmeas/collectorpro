'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/design-system/atoms/Text'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Icon } from '@/components/design-system/atoms/Icon'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface Offer {
  id: string
  assetId: string
  assetName: string
  assetImage: string
  platform: 'topshot' | 'allday' | 'panini'
  offerAmount: number
  currentValue: number
  percentageChange: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
  timestamp: Date
  expiresAt: Date
  buyerAddress?: string
  sellerAddress?: string
  offerTrend: 'increasing' | 'decreasing' | 'stable'
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
}

interface MarketPulseProps {
  offers: Offer[]
}

const MarketPulse: React.FC<MarketPulseProps> = ({ offers }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d')
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'topshot' | 'allday' | 'panini'>('all')

  // Mock data for charts - in real app, this would be calculated from offers data
  const offerTrendData = [
    { date: 'Mon', offers: 12, avgAmount: 850, acceptanceRate: 65 },
    { date: 'Tue', offers: 18, avgAmount: 920, acceptanceRate: 72 },
    { date: 'Wed', offers: 15, avgAmount: 780, acceptanceRate: 58 },
    { date: 'Thu', offers: 22, avgAmount: 1100, acceptanceRate: 81 },
    { date: 'Fri', offers: 19, avgAmount: 950, acceptanceRate: 69 },
    { date: 'Sat', offers: 14, avgAmount: 820, acceptanceRate: 64 },
    { date: 'Sun', offers: 16, avgAmount: 890, acceptanceRate: 71 }
  ]

  const platformData = [
    { name: 'TopShot', value: 45, color: '#3B82F6' },
    { name: 'AllDay', value: 32, color: '#10B981' },
    { name: 'Panini', value: 23, color: '#F59E0B' }
  ]

  const sentimentData = [
    { name: 'Bullish', value: 58, color: '#10B981' },
    { name: 'Neutral', value: 27, color: '#6B7280' },
    { name: 'Bearish', value: 15, color: '#EF4444' }
  ]

  const marketInsights = [
    {
      title: 'TopShot Offer Volume Up 23%',
      description: 'Increased interest in playoff moments driving higher offer activity',
      impact: 'positive',
      confidence: 85
    },
    {
      title: 'AllDay Acceptance Rate Declining',
      description: 'Sellers holding out for better prices, 15% drop in acceptance rate',
      impact: 'negative',
      confidence: 72
    },
    {
      title: 'Panini Market Stabilizing',
      description: 'After recent volatility, Panini offers showing consistent patterns',
      impact: 'neutral',
      confidence: 68
    }
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-400'
      case 'negative': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return 'trending-up'
      case 'negative': return 'trending-down'
      default: return 'minus'
    }
  }

  return (
    <div className="space-y-6">
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-blue-400 text-sm font-medium">Total Offers</Text>
              <Text className="text-2xl font-bold text-blue-300">1,247</Text>
              <Text className="text-blue-400 text-xs">+12% vs last week</Text>
            </div>
            <Icon name="trending-up" className="text-blue-400 text-xl" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-green-400 text-sm font-medium">Avg Offer Amount</Text>
              <Text className="text-2xl font-bold text-green-300">$892</Text>
              <Text className="text-green-400 text-xs">+8% vs last week</Text>
            </div>
            <Icon name="dollar-sign" className="text-green-400 text-xl" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-purple-400 text-sm font-medium">Acceptance Rate</Text>
              <Text className="text-2xl font-bold text-purple-300">68%</Text>
              <Text className="text-purple-400 text-xs">+3% vs last week</Text>
            </div>
            <Icon name="percent" className="text-purple-400 text-xl" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-orange-400 text-sm font-medium">Market Sentiment</Text>
              <Text className="text-2xl font-bold text-orange-300">Bullish</Text>
              <Text className="text-orange-400 text-xs">58% confidence</Text>
            </div>
            <Icon name="activity" className="text-orange-400 text-xl" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Text className="text-gray-400 text-sm">Timeframe:</Text>
            <div className="flex gap-1">
              {(['7d', '30d', '90d'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="flex items-center gap-2"
                >
                  {tf}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Text className="text-gray-400 text-sm">Platform:</Text>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value="all">All Platforms</option>
              <option value="topshot">TopShot</option>
              <option value="allday">AllDay</option>
              <option value="panini">Panini</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Offer Trends Chart */}
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <Heading level={4} className="text-white mb-4">Offer Trends ({timeframe})</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={offerTrendData}>
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
                dataKey="offers" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Offers"
              />
              <Line 
                type="monotone" 
                dataKey="avgAmount" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Avg Amount"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform Distribution */}
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <Heading level={4} className="text-white mb-4">Platform Distribution</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {platformData.map((entry, index) => (
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

        {/* Market Sentiment */}
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <Heading level={4} className="text-white mb-4">Market Sentiment</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Acceptance Rate Trend */}
        <Card className="p-6 bg-gray-900/50 border-gray-700">
          <Heading level={4} className="text-white mb-4">Acceptance Rate Trend</Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={offerTrendData}>
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
                dataKey="acceptanceRate" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Acceptance Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Market Insights */}
      <Card className="p-6 bg-gray-900/50 border-gray-700">
        <Heading level={4} className="text-white mb-4">Market Insights</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketInsights.map((insight, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div className={`flex items-center gap-1 ${getImpactColor(insight.impact)}`}>
                  <Icon name={getImpactIcon(insight.impact)} className="text-sm" />
                  <Text className="text-sm font-medium">{insight.impact.toUpperCase()}</Text>
                </div>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confidence
                </Badge>
              </div>
              <Heading level={5} className="text-white mb-2">{insight.title}</Heading>
              <Text className="text-gray-400 text-sm">{insight.description}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default MarketPulse 