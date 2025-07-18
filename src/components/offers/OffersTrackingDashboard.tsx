'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/design-system/atoms/Text'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Icon } from '@/components/design-system/atoms/Icon'
import { PriceDisplay } from '@/components/design-system/molecules/PriceDisplay'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'

interface OfferTrackingData {
  performance: {
    totalOffers: number
    acceptedOffers: number
    rejectedOffers: number
    pendingOffers: number
    successRate: number
    avgResponseTime: number
    totalValue: number
    totalROI: number
    winLossRatio: number
  }
  platformBreakdown: {
    platform: string
    offers: number
    successRate: number
    avgAmount: number
    avgResponseTime: number
    totalValue: number
  }[]
  timeAnalysis: {
    hourlyDistribution: { hour: number; offers: number; successRate: number }[]
    dailyDistribution: { day: string; offers: number; successRate: number }[]
    weeklyTrends: { week: string; offers: number; successRate: number; avgAmount: number }[]
  }
  marketIntelligence: {
    priceAnalysis: {
      avgOfferVsMarket: number
      priceEfficiency: number
      marketPosition: 'aggressive' | 'conservative' | 'market'
    }
    competitorAnalysis: {
      avgCompetitorOffers: number
      marketShare: number
      competitiveAdvantage: number
    }
    trends: {
      marketDirection: 'bullish' | 'bearish' | 'neutral'
      volumeTrend: 'increasing' | 'decreasing' | 'stable'
      priceTrend: 'increasing' | 'decreasing' | 'stable'
    }
  }
  insights: {
    recommendations: {
      title: string
      description: string
      impact: 'high' | 'medium' | 'low'
      confidence: number
      action: string
    }[]
    alerts: {
      type: 'success' | 'warning' | 'error'
      title: string
      message: string
      timestamp: Date
    }[]
  }
}

interface OffersTrackingDashboardProps {
  walletAddress: string
}

const OffersTrackingDashboard: React.FC<OffersTrackingDashboardProps> = ({ walletAddress }) => {
  const [trackingData, setTrackingData] = useState<OfferTrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState('30d')
  const [activeSection, setActiveSection] = useState<'overview' | 'performance' | 'timing' | 'market' | 'insights'>('overview')

  useEffect(() => {
    fetchTrackingData()
  }, [walletAddress, timeframe])

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/offers/tracking?address=${walletAddress}&timeframe=${timeframe}`)
      const data = await response.json()
      
      if (data.success) {
        setTrackingData(data.tracking)
      } else {
        setError(data.error || 'Failed to fetch tracking data')
      }
    } catch (err) {
      setError('Network error while fetching tracking data')
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  if (loading) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon name="loader" className="text-blue-400 text-4xl mx-auto mb-4 animate-spin" />
        <Text className="text-gray-400">Loading tracking analytics...</Text>
      </Card>
    )
  }

  if (error || !trackingData) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon name="alert-circle" className="text-red-400 text-4xl mx-auto mb-4" />
        <Heading level={3} className="text-red-400 mb-2">Error Loading Data</Heading>
        <Text className="text-gray-400">{error || 'No tracking data available'}</Text>
        <Button 
          onClick={fetchTrackingData} 
          className="mt-4"
          variant="outline"
        >
          <Icon name="refresh-cw" className="text-sm mr-2" />
          Retry
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-white mb-2">Offers Tracking Dashboard</Heading>
          <Text className="text-gray-400">Comprehensive analytics and market intelligence for your offer strategy</Text>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
            <Icon name="download" className="text-sm mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: 'bar-chart' },
          { id: 'performance', label: 'Performance', icon: 'target' },
          { id: 'timing', label: 'Timing', icon: 'clock' },
          { id: 'market', label: 'Market Intel', icon: 'trending-up' },
          { id: 'insights', label: 'Insights', icon: 'lightbulb' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon name={tab.icon} className="text-sm mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Success Rate</Text>
                  <Text className="text-2xl font-bold text-white">{trackingData.performance.successRate.toFixed(1)}%</Text>
                  <Text className="text-green-400 text-sm">+3.2% vs last period</Text>
                </div>
                <Icon name="target" className="text-blue-400 text-2xl" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Total Offers</Text>
                  <Text className="text-2xl font-bold text-white">{trackingData.performance.totalOffers}</Text>
                  <Text className="text-blue-400 text-sm">{trackingData.performance.pendingOffers} pending</Text>
                </div>
                <Icon name="send" className="text-green-400 text-2xl" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Total Value</Text>
                  <PriceDisplay amount={trackingData.performance.totalValue} className="text-2xl font-bold text-white" />
                  <Text className="text-green-400 text-sm">+12.3% ROI</Text>
                </div>
                <Icon name="dollar-sign" className="text-green-400 text-2xl" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Win/Loss Ratio</Text>
                  <Text className="text-2xl font-bold text-white">{trackingData.performance.winLossRatio.toFixed(2)}</Text>
                  <Text className="text-green-400 text-sm">Excellent ratio</Text>
                </div>
                <Icon name="trending-up" className="text-green-400 text-2xl" />
              </div>
            </Card>
          </div>

          {/* Platform Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Platform Success Rates</Heading>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trackingData.platformBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="platform" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="successRate" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Platform Distribution</Heading>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={trackingData.platformBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="offers"
                    label={({ platform, offers }) => `${platform}: ${offers}`}
                  >
                    {trackingData.platformBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

          {/* Recent Alerts */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Recent Alerts</Heading>
            <div className="space-y-3">
              {trackingData.insights.alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  alert.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                  'bg-red-500/10 border border-red-500/20'
                }`}>
                  <Icon 
                    name={alert.type === 'success' ? 'check-circle' : 
                          alert.type === 'warning' ? 'alert-triangle' : 'x-circle'} 
                    className={`text-sm ${
                      alert.type === 'success' ? 'text-green-400' :
                      alert.type === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`} 
                  />
                  <div className="flex-1">
                    <Text className="text-white font-medium">{alert.title}</Text>
                    <Text className="text-gray-300 text-sm">{alert.message}</Text>
                  </div>
                  <Text className="text-gray-400 text-xs">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Performance Section */}
      {activeSection === 'performance' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Text className="text-gray-400 text-sm mb-2">Accepted Offers</Text>
              <Text className="text-3xl font-bold text-green-400">{trackingData.performance.acceptedOffers}</Text>
              <Text className="text-gray-400 text-sm">
                {((trackingData.performance.acceptedOffers / trackingData.performance.totalOffers) * 100).toFixed(1)}% of total
              </Text>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Text className="text-gray-400 text-sm mb-2">Rejected Offers</Text>
              <Text className="text-3xl font-bold text-red-400">{trackingData.performance.rejectedOffers}</Text>
              <Text className="text-gray-400 text-sm">
                {((trackingData.performance.rejectedOffers / trackingData.performance.totalOffers) * 100).toFixed(1)}% of total
              </Text>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Text className="text-gray-400 text-sm mb-2">Avg Response Time</Text>
              <Text className="text-3xl font-bold text-yellow-400">{trackingData.performance.avgResponseTime}h</Text>
              <Text className="text-gray-400 text-sm">Industry avg: 6.2h</Text>
            </Card>
          </div>

          {/* Platform Performance Table */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Platform Performance Breakdown</Heading>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-gray-400">Platform</th>
                    <th className="text-right py-3 text-gray-400">Offers</th>
                    <th className="text-right py-3 text-gray-400">Success Rate</th>
                    <th className="text-right py-3 text-gray-400">Avg Amount</th>
                    <th className="text-right py-3 text-gray-400">Response Time</th>
                    <th className="text-right py-3 text-gray-400">Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {trackingData.platformBreakdown.map((platform, index) => (
                    <tr key={platform.platform} className="border-b border-gray-800">
                      <td className="py-3 text-white">{platform.platform}</td>
                      <td className="py-3 text-right text-white">{platform.offers}</td>
                      <td className="py-3 text-right">
                        <Badge 
                          variant={platform.successRate >= 70 ? 'default' : 
                                  platform.successRate >= 50 ? 'outline' : 'destructive'}
                          className="text-xs"
                        >
                          {platform.successRate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-white">
                        <PriceDisplay amount={platform.avgAmount} />
                      </td>
                      <td className="py-3 text-right text-white">{platform.avgResponseTime}h</td>
                      <td className="py-3 text-right text-white">
                        <PriceDisplay amount={platform.totalValue} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Timing Section */}
      {activeSection === 'timing' && (
        <div className="space-y-6">
          {/* Hourly Distribution */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Hourly Offer Distribution</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trackingData.timeAnalysis.hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="successRate" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Daily Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Daily Success Rates</Heading>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trackingData.timeAnalysis.dailyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="successRate" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Weekly Trends</Heading>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trackingData.timeAnalysis.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="successRate" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="avgAmount" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      )}

      {/* Market Intelligence Section */}
      {activeSection === 'market' && (
        <div className="space-y-6">
          {/* Market Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Text className="text-gray-400 text-sm mb-2">Market Position</Text>
              <Badge 
                variant={trackingData.marketIntelligence.priceAnalysis.marketPosition === 'aggressive' ? 'destructive' :
                        trackingData.marketIntelligence.priceAnalysis.marketPosition === 'conservative' ? 'outline' : 'default'}
                className="text-lg px-3 py-1"
              >
                {trackingData.marketIntelligence.priceAnalysis.marketPosition.charAt(0).toUpperCase() + 
                 trackingData.marketIntelligence.priceAnalysis.marketPosition.slice(1)}
              </Badge>
              <Text className="text-gray-400 text-sm mt-2">
                {trackingData.marketIntelligence.priceAnalysis.avgOfferVsMarket >= 0 ? '+' : ''}
                {trackingData.marketIntelligence.priceAnalysis.avgOfferVsMarket.toFixed(1)}% vs market
              </Text>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Text className="text-gray-400 text-sm mb-2">Price Efficiency</Text>
              <Text className="text-3xl font-bold text-green-400">
                {trackingData.marketIntelligence.priceAnalysis.priceEfficiency.toFixed(1)}%
              </Text>
              <Text className="text-gray-400 text-sm">Above average</Text>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Text className="text-gray-400 text-sm mb-2">Market Share</Text>
              <Text className="text-3xl font-bold text-blue-400">
                {trackingData.marketIntelligence.competitorAnalysis.marketShare.toFixed(1)}%
              </Text>
              <Text className="text-gray-400 text-sm">Of total market</Text>
            </Card>
          </div>

          {/* Market Trends */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Market Trends</Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Icon 
                  name={trackingData.marketIntelligence.trends.marketDirection === 'bullish' ? 'trending-up' : 
                        trackingData.marketIntelligence.trends.marketDirection === 'bearish' ? 'trending-down' : 'minus'} 
                  className={`text-2xl mx-auto mb-2 ${
                    trackingData.marketIntelligence.trends.marketDirection === 'bullish' ? 'text-green-400' :
                    trackingData.marketIntelligence.trends.marketDirection === 'bearish' ? 'text-red-400' : 'text-gray-400'
                  }`} 
                />
                <Text className="text-white font-medium">Market Direction</Text>
                <Text className="text-gray-400 text-sm capitalize">
                  {trackingData.marketIntelligence.trends.marketDirection}
                </Text>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Icon 
                  name={trackingData.marketIntelligence.trends.volumeTrend === 'increasing' ? 'trending-up' : 
                        trackingData.marketIntelligence.trends.volumeTrend === 'decreasing' ? 'trending-down' : 'minus'} 
                  className={`text-2xl mx-auto mb-2 ${
                    trackingData.marketIntelligence.trends.volumeTrend === 'increasing' ? 'text-green-400' :
                    trackingData.marketIntelligence.trends.volumeTrend === 'decreasing' ? 'text-red-400' : 'text-gray-400'
                  }`} 
                />
                <Text className="text-white font-medium">Volume Trend</Text>
                <Text className="text-gray-400 text-sm capitalize">
                  {trackingData.marketIntelligence.trends.volumeTrend}
                </Text>
              </div>
              
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Icon 
                  name={trackingData.marketIntelligence.trends.priceTrend === 'increasing' ? 'trending-up' : 
                        trackingData.marketIntelligence.trends.priceTrend === 'decreasing' ? 'trending-down' : 'minus'} 
                  className={`text-2xl mx-auto mb-2 ${
                    trackingData.marketIntelligence.trends.priceTrend === 'increasing' ? 'text-green-400' :
                    trackingData.marketIntelligence.trends.priceTrend === 'decreasing' ? 'text-red-400' : 'text-gray-400'
                  }`} 
                />
                <Text className="text-white font-medium">Price Trend</Text>
                <Text className="text-gray-400 text-sm capitalize">
                  {trackingData.marketIntelligence.trends.priceTrend}
                </Text>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Insights Section */}
      {activeSection === 'insights' && (
        <div className="space-y-6">
          {/* Recommendations */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Smart Recommendations</Heading>
            <div className="space-y-4">
              {trackingData.insights.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.impact === 'high' ? 'bg-blue-500/10 border-blue-500' :
                  rec.impact === 'medium' ? 'bg-yellow-500/10 border-yellow-500' :
                  'bg-gray-500/10 border-gray-500'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <Heading level={5} className="text-white">{rec.title}</Heading>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={rec.impact === 'high' ? 'default' : 
                                rec.impact === 'medium' ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  <Text className="text-gray-300 text-sm mb-3">{rec.description}</Text>
                  <div className="flex items-center gap-2">
                    <Icon name="zap" className="text-blue-400 text-sm" />
                    <Text className="text-blue-400 text-sm font-medium">{rec.action}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default OffersTrackingDashboard 