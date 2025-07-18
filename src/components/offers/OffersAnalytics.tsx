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
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  ComposedChart,
  Area
} from 'recharts'

interface OfferAnalytics {
  successRate: {
    accepted: number
    declined: number
    expired: number
  }
  priceRanges: {
    range: string
    count: number
    avgSuccessRate: number
  }[]
  activityOverTime: {
    date: string
    received: number
    made: number
    successRate: number
  }[]
  priceVsFloor: {
    offerPrice: number
    floorPrice: number
    percentage: number
    status: 'accepted' | 'declined' | 'expired'
    assetName: string
  }[]
  hotAssets: {
    assetName: string
    offerCount: number
    avgPrice: number
    successRate: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }[]
  offerTrends: {
    period: string
    avgOfferPercentage: number
    floorPriceChange: number
    volume: number
  }[]
  bestOffers: {
    assetName: string
    offerPrice: number
    floorPrice: number
    percentage: number
    status: string
    timestamp: Date
  }[]
  missedOpportunities: {
    assetName: string
    offerPrice: number
    floorPrice: number
    percentage: number
    expiredAt: Date
    currentValue: number
  }[]
  negotiationStats: {
    totalCounterOffers: number
    acceptedCounters: number
    successRate: number
    avgCounterPercentage: number
    avgResponseTime: number
  }
}

interface OffersAnalyticsProps {
  walletAddress: string
}

const OffersAnalytics: React.FC<OffersAnalyticsProps> = ({ walletAddress }) => {
  const [analytics, setAnalytics] = useState<OfferAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'charts' | 'intelligence' | 'performance'>('charts')
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899']

  useEffect(() => {
    fetchAnalyticsData()
  }, [walletAddress, selectedTimeframe])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      // Mock analytics data - in production, this would fetch from API
      const mockAnalytics: OfferAnalytics = {
        successRate: {
          accepted: 35,
          declined: 45,
          expired: 20
        },
        priceRanges: [
          { range: '$0-100', count: 12, avgSuccessRate: 75 },
          { range: '$100-500', count: 28, avgSuccessRate: 68 },
          { range: '$500-1000', count: 15, avgSuccessRate: 62 },
          { range: '$1000+', count: 8, avgSuccessRate: 55 }
        ],
        activityOverTime: [
          { date: 'Mon', received: 5, made: 3, successRate: 70 },
          { date: 'Tue', received: 8, made: 6, successRate: 75 },
          { date: 'Wed', received: 3, made: 4, successRate: 65 },
          { date: 'Thu', received: 7, made: 5, successRate: 80 },
          { date: 'Fri', received: 6, made: 7, successRate: 72 },
          { date: 'Sat', received: 4, made: 2, successRate: 68 },
          { date: 'Sun', received: 2, made: 3, successRate: 75 }
        ],
        priceVsFloor: [
          { offerPrice: 150, floorPrice: 120, percentage: 25, status: 'accepted', assetName: 'LeBron James' },
          { offerPrice: 200, floorPrice: 180, percentage: 11, status: 'declined', assetName: 'Stephen Curry' },
          { offerPrice: 80, floorPrice: 100, percentage: -20, status: 'expired', assetName: 'Giannis' },
          { offerPrice: 300, floorPrice: 250, percentage: 20, status: 'accepted', assetName: 'Kevin Durant' },
          { offerPrice: 120, floorPrice: 150, percentage: -20, status: 'declined', assetName: 'Luka Dončić' },
          { offerPrice: 180, floorPrice: 160, percentage: 12.5, status: 'accepted', assetName: 'Ja Morant' }
        ],
        hotAssets: [
          { assetName: 'LeBron James - 2023 Playoffs', offerCount: 15, avgPrice: 250, successRate: 80, trend: 'increasing' },
          { assetName: 'Stephen Curry - Championship', offerCount: 12, avgPrice: 180, successRate: 75, trend: 'stable' },
          { assetName: 'Giannis - MVP Season', offerCount: 10, avgPrice: 220, successRate: 70, trend: 'decreasing' },
          { assetName: 'Kevin Durant - All-Star', offerCount: 8, avgPrice: 160, successRate: 65, trend: 'increasing' }
        ],
        offerTrends: [
          { period: 'Week 1', avgOfferPercentage: 15, floorPriceChange: 5, volume: 25 },
          { period: 'Week 2', avgOfferPercentage: 18, floorPriceChange: 8, volume: 30 },
          { period: 'Week 3', avgOfferPercentage: 12, floorPriceChange: -3, volume: 22 },
          { period: 'Week 4', avgOfferPercentage: 20, floorPriceChange: 12, volume: 35 }
        ],
        bestOffers: [
          { assetName: 'LeBron James - 2023 Playoffs', offerPrice: 300, floorPrice: 200, percentage: 50, status: 'accepted', timestamp: new Date() },
          { assetName: 'Stephen Curry - Championship', offerPrice: 250, floorPrice: 180, percentage: 39, status: 'pending', timestamp: new Date() },
          { assetName: 'Giannis - MVP Season', offerPrice: 280, floorPrice: 220, percentage: 27, status: 'accepted', timestamp: new Date() }
        ],
        missedOpportunities: [
          { assetName: 'LeBron James - 2023 Playoffs', offerPrice: 280, floorPrice: 200, percentage: 40, expiredAt: new Date(), currentValue: 320 },
          { assetName: 'Stephen Curry - Championship', offerPrice: 200, floorPrice: 180, percentage: 11, expiredAt: new Date(), currentValue: 250 },
          { assetName: 'Giannis - MVP Season', offerPrice: 240, floorPrice: 220, percentage: 9, expiredAt: new Date(), currentValue: 280 }
        ],
        negotiationStats: {
          totalCounterOffers: 25,
          acceptedCounters: 18,
          successRate: 72,
          avgCounterPercentage: 8.5,
          avgResponseTime: 2.3
        }
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSuccessRateData = () => {
    if (!analytics) return []
    return [
      { name: 'Accepted', value: analytics.successRate.accepted, color: '#10B981' },
      { name: 'Declined', value: analytics.successRate.declined, color: '#EF4444' },
      { name: 'Expired', value: analytics.successRate.expired, color: '#F59E0B' }
    ]
  }

  const getScatterData = () => {
    if (!analytics) return []
    return analytics.priceVsFloor.map((item, index) => ({
      ...item,
      size: item.status === 'accepted' ? 8 : item.status === 'declined' ? 6 : 4
    }))
  }

  if (loading) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon name="loader" className="text-blue-400 text-4xl mx-auto mb-4 animate-spin" />
        <Text className="text-gray-400">Loading offers analytics...</Text>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon name="alert-circle" className="text-red-400 text-4xl mx-auto mb-4" />
        <Text className="text-gray-400">No analytics data available</Text>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2} className="text-white mb-2">Offers Analytics & Intelligence</Heading>
          <Text className="text-gray-400">Advanced analytics and market intelligence for your offer strategy</Text>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
            <Icon name="download" className="text-sm mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'charts' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Icon name="bar-chart" className="text-sm mr-2" />
          Charts & Analytics
        </button>
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'intelligence' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Icon name="lightbulb" className="text-sm mr-2" />
          Market Intelligence
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'performance' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Icon name="target" className="text-sm mr-2" />
          Performance Metrics
        </button>
      </div>

      {/* Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Success Rate Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Offer Success Rate</Heading>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={getSuccessRateData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {getSuccessRateData().map((entry, index) => (
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

            {/* Price Range Bar Chart */}
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Offers by Price Range</Heading>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.priceRanges}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Activity Over Time Line Chart */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Offer Activity Over Time</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analytics.activityOverTime}>
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
                <Area type="monotone" dataKey="successRate" fill="#10B981" fillOpacity={0.3} stroke="#10B981" />
                <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="made" stroke="#EF4444" strokeWidth={2} />
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Price vs Floor Scatter Plot */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Offer Price vs Floor Price</Heading>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  dataKey="floorPrice" 
                  name="Floor Price" 
                  stroke="#9CA3AF"
                  label={{ value: 'Floor Price ($)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="offerPrice" 
                  name="Offer Price" 
                  stroke="#9CA3AF"
                  label={{ value: 'Offer Price ($)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" range={[50, 200]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name, props) => [
                    `${props.payload.assetName} - ${props.payload.percentage}% vs floor`,
                    name
                  ]}
                />
                <Legend />
                <Scatter 
                  name="Accepted" 
                  data={getScatterData().filter(d => d.status === 'accepted')} 
                  fill="#10B981" 
                />
                <Scatter 
                  name="Declined" 
                  data={getScatterData().filter(d => d.status === 'declined')} 
                  fill="#EF4444" 
                />
                <Scatter 
                  name="Expired" 
                  data={getScatterData().filter(d => d.status === 'expired')} 
                  fill="#F59E0B" 
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Intelligence Tab */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          {/* Hot Assets */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">🔥 Hot Assets</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.hotAssets.map((asset, index) => (
                <div key={index} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-white font-medium truncate">{asset.assetName}</Text>
                    <Badge 
                      variant={asset.trend === 'increasing' ? 'default' : 
                              asset.trend === 'decreasing' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {asset.trend}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <Text className="text-gray-400">Offers</Text>
                      <Text className="text-white font-bold">{asset.offerCount}</Text>
                    </div>
                    <div>
                      <Text className="text-gray-400">Avg Price</Text>
                      <PriceDisplay amount={asset.avgPrice} className="text-white font-bold" />
                    </div>
                    <div>
                      <Text className="text-gray-400">Success</Text>
                      <Text className="text-white font-bold">{asset.successRate}%</Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Offer Trends */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">📈 Offer Trends</Heading>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={analytics.offerTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="period" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="volume" fill="#3B82F6" fillOpacity={0.6} />
                <Line type="monotone" dataKey="avgOfferPercentage" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="floorPriceChange" stroke="#EF4444" strokeWidth={2} />
                <Legend />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Best Offers & Missed Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">🏆 Best Offers</Heading>
              <div className="space-y-3">
                {analytics.bestOffers.map((offer, index) => (
                  <div key={index} className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Text className="text-white font-medium truncate">{offer.assetName}</Text>
                      <Badge 
                        variant={offer.status === 'accepted' ? 'default' : 
                                offer.status === 'pending' ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {offer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <PriceDisplay amount={offer.offerPrice} className="text-green-400 font-bold" />
                        <Text className="text-gray-400">vs</Text>
                        <PriceDisplay amount={offer.floorPrice} className="text-gray-400" />
                      </div>
                      <Text className="text-green-400 font-bold">+{offer.percentage}%</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">⏰ Missed Opportunities</Heading>
              <div className="space-y-3">
                {analytics.missedOpportunities.map((opportunity, index) => (
                  <div key={index} className="p-3 bg-gray-800/30 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-1">
                      <Text className="text-white font-medium truncate">{opportunity.assetName}</Text>
                      <Text className="text-red-400 text-xs">
                        {opportunity.expiredAt.toLocaleDateString()}
                      </Text>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <PriceDisplay amount={opportunity.offerPrice} className="text-red-400 font-bold" />
                        <Text className="text-gray-400">vs</Text>
                        <PriceDisplay amount={opportunity.currentValue} className="text-green-400 font-bold" />
                      </div>
                      <Text className="text-red-400 font-bold">-{opportunity.percentage}%</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Metrics Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Negotiation Success Rate */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">🤝 Negotiation Performance</Heading>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Text className="text-3xl font-bold text-blue-400">{analytics.negotiationStats.totalCounterOffers}</Text>
                <Text className="text-gray-400 text-sm">Total Counter Offers</Text>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Text className="text-3xl font-bold text-green-400">{analytics.negotiationStats.acceptedCounters}</Text>
                <Text className="text-gray-400 text-sm">Accepted Counters</Text>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Text className="text-3xl font-bold text-yellow-400">{analytics.negotiationStats.successRate}%</Text>
                <Text className="text-gray-400 text-sm">Success Rate</Text>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                <Text className="text-3xl font-bold text-purple-400">{analytics.negotiationStats.avgResponseTime}h</Text>
                <Text className="text-gray-400 text-sm">Avg Response Time</Text>
              </div>
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">💡 Performance Insights</Heading>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="trending-up" className="text-green-400" />
                  <Text className="text-green-400 font-medium">Strong Counter-Offer Performance</Text>
                </div>
                <Text className="text-gray-300 text-sm">
                  Your counter-offer success rate of {analytics.negotiationStats.successRate}% is 15% above market average. 
                  Consider being more aggressive with counter-offers.
                </Text>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="clock" className="text-yellow-400" />
                  <Text className="text-yellow-400 font-medium">Quick Response Advantage</Text>
                </div>
                <Text className="text-gray-300 text-sm">
                  Your average response time of {analytics.negotiationStats.avgResponseTime} hours is excellent. 
                  This gives you a competitive edge in fast-moving markets.
                </Text>
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="target" className="text-blue-400" />
                  <Text className="text-blue-400 font-medium">Optimization Opportunity</Text>
                </div>
                <Text className="text-gray-300 text-sm">
                  Your average counter-offer percentage of {analytics.negotiationStats.avgCounterPercentage}% is conservative. 
                  Consider increasing by 2-3% for better success rates.
                </Text>
              </div>
            </div>
          </Card>

          {/* Performance Recommendations */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">🎯 Actionable Recommendations</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="zap" className="text-blue-400" />
                  <Text className="text-blue-400 font-medium">Immediate Actions</Text>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Increase counter-offer amounts by 2-3%</li>
                  <li>• Focus on hot assets with high offer counts</li>
                  <li>• Respond to offers within 2 hours</li>
                  <li>• Avoid offers below 80% of floor price</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="trending-up" className="text-green-400" />
                  <Text className="text-green-400 font-medium">Strategic Improvements</Text>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Target assets with increasing trends</li>
                  <li>• Use market timing for better prices</li>
                  <li>• Monitor competitor offer patterns</li>
                  <li>• Set up automated offer alerts</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default OffersAnalytics 