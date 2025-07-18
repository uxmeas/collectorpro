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
  Area
} from 'recharts'

interface Offer {
  id: string
  type: 'received' | 'made' | 'completed' | 'expired' | 'rejected'
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
  responseTime?: number // hours
  counterOffers?: number
  marketPosition?: 'aggressive' | 'conservative' | 'market'
}

interface OffersMadeProps {
  offers: Offer[]
}

interface AnalyticsData {
  successRate: number
  avgResponseTime: number
  totalValue: number
  totalROI: number
  platformPerformance: {
    platform: string
    successRate: number
    avgAmount: number
    count: number
  }[]
  weeklyTrends: {
    date: string
    offers: number
    successRate: number
    avgAmount: number
  }[]
  marketInsights: {
    title: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
    confidence: number
  }[]
}

const OffersMade: React.FC<OffersMadeProps> = ({ offers }) => {
  const [withdrawing, setWithdrawing] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'offers' | 'analytics' | 'insights'>('offers')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  // Calculate analytics from offers data
  useEffect(() => {
    if (offers.length > 0) {
      const madeOffers = offers.filter(o => o.type === 'made')
      const acceptedOffers = madeOffers.filter(o => o.status === 'accepted')
      const rejectedOffers = madeOffers.filter(o => o.status === 'rejected')
      
      const successRate = (acceptedOffers.length / madeOffers.length) * 100
      const avgResponseTime = madeOffers.reduce((sum, o) => sum + (o.responseTime || 0), 0) / madeOffers.length
      const totalValue = madeOffers.reduce((sum, o) => sum + o.offerAmount, 0)
      const totalROI = madeOffers.reduce((sum, o) => {
        if (o.status === 'accepted') {
          return sum + ((o.currentValue - o.offerAmount) / o.offerAmount) * 100
        }
        return sum
      }, 0) / acceptedOffers.length

      // Platform performance
      const platformStats = ['topshot', 'allday', 'panini'].map(platform => {
        const platformOffers = madeOffers.filter(o => o.platform === platform)
        const platformAccepted = platformOffers.filter(o => o.status === 'accepted')
        return {
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          successRate: platformOffers.length > 0 ? (platformAccepted.length / platformOffers.length) * 100 : 0,
          avgAmount: platformOffers.length > 0 ? platformOffers.reduce((sum, o) => sum + o.offerAmount, 0) / platformOffers.length : 0,
          count: platformOffers.length
        }
      })

      // Weekly trends (mock data for now)
      const weeklyTrends = [
        { date: 'Mon', offers: 3, successRate: 67, avgAmount: 850 },
        { date: 'Tue', offers: 5, successRate: 80, avgAmount: 920 },
        { date: 'Wed', offers: 2, successRate: 50, avgAmount: 780 },
        { date: 'Thu', offers: 4, successRate: 75, avgAmount: 1100 },
        { date: 'Fri', offers: 6, successRate: 83, avgAmount: 950 },
        { date: 'Sat', offers: 3, successRate: 67, avgAmount: 820 },
        { date: 'Sun', offers: 2, successRate: 100, avgAmount: 890 }
      ]

      // Market insights
      const marketInsights = [
        {
          title: 'Market Volatility',
          description: 'High volatility detected in TopShot market',
          impact: 'neutral' as const,
          confidence: 85
        },
        {
          title: 'Price Trends',
          description: 'Overall upward trend in collectible values',
          impact: 'positive' as const,
          confidence: 72
        },
        {
          title: 'Competition Level',
          description: 'Increased competition for rare moments',
          impact: 'negative' as const,
          confidence: 68
        }
      ]

      setAnalytics({
        successRate,
        avgResponseTime,
        totalValue,
        totalROI,
        platformPerformance: platformStats,
        weeklyTrends,
        marketInsights
      })
    }
  }, [offers])

  const handleWithdraw = async (offerId: string) => {
    setWithdrawing(offerId)
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'withdraw', offerId })
      })
      
      if (response.ok) {
        console.log('Offer withdrawn successfully')
        // TODO: Update local state
      }
    } catch (error) {
      console.error('Error withdrawing offer:', error)
    } finally {
      setWithdrawing(null)
    }
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diff < 0) return 'Expired'
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'accepted': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'expired': return 'text-gray-400'
      case 'withdrawn': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'clock'
      case 'accepted': return 'check-circle'
      case 'rejected': return 'x-circle'
      case 'expired': return 'alert-circle'
      case 'withdrawn': return 'undo'
      default: return 'circle'
    }
  }

  const getRecommendation = (offer: Offer) => {
    if (offer.percentageChange > 10) {
      return { action: 'increase', reason: 'Asset value up significantly, consider higher offer' }
    } else if (offer.percentageChange < -10) {
      return { action: 'decrease', reason: 'Asset value down, you may be overpaying' }
    } else if (offer.marketSentiment === 'bullish') {
      return { action: 'hold', reason: 'Market sentiment positive, current offer looks good' }
    }
    return { action: 'hold', reason: 'Market stable, maintain current offer' }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  if (offers.length === 0) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon name="send" className="text-gray-500 text-4xl mx-auto mb-4" />
        <Heading level={3} className="text-gray-400 mb-2">No Offers Made</Heading>
        <Text className="text-gray-500">You haven't made any offers yet. Browse the marketplace to make your first offer.</Text>
      </Card>
    )
  }

  const madeOffers = offers.filter(o => o.type === 'made')

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'offers' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Icon name="list" className="text-sm mr-2" />
          Offers ({madeOffers.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Icon name="bar-chart" className="text-sm mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Icon name="lightbulb" className="text-sm mr-2" />
          Insights
        </button>
      </div>

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          {madeOffers.map((offer) => {
            const recommendation = getRecommendation(offer)
            return (
              <Card key={offer.id} className="p-6 bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Asset Image */}
                  <div className="relative">
                    <img
                      src={offer.assetImage}
                      alt={offer.assetName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <Badge 
                      variant="outline" 
                      className="absolute -top-2 -right-2 text-xs bg-gray-800 border-gray-600"
                    >
                      {offer.platform.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Offer Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <Heading level={4} className="text-white mb-1 truncate">
                          {offer.assetName}
                        </Heading>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>To: {offer.sellerAddress}</span>
                          <span>•</span>
                          <span>{offer.timestamp.toLocaleDateString()}</span>
                          {offer.responseTime && (
                            <>
                              <span>•</span>
                              <span>Response: {offer.responseTime}h</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2 ml-4">
                        <div className={`flex items-center gap-1 ${getStatusColor(offer.status)}`}>
                          <Icon name={getStatusIcon(offer.status)} className="text-sm" />
                          <Text className="text-xs font-medium capitalize">{offer.status}</Text>
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <Text className="text-gray-400 text-sm mb-1">Your Offer</Text>
                        <PriceDisplay 
                          amount={offer.offerAmount} 
                          className="text-xl font-bold text-blue-400" 
                        />
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <Text className="text-gray-400 text-sm mb-1">Current Value</Text>
                        <div className="flex items-center gap-2">
                          <PriceDisplay 
                            amount={offer.currentValue} 
                            className="text-xl font-bold text-white" 
                          />
                          <Badge 
                            variant={offer.percentageChange >= 0 ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {offer.percentageChange >= 0 ? '+' : ''}{offer.percentageChange.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Smart Recommendation */}
                    {offer.status === 'pending' && (
                      <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="lightbulb" className="text-blue-400 text-sm" />
                          <Text className="text-sm font-medium text-blue-400">Smart Recommendation</Text>
                        </div>
                        <Text className="text-sm text-gray-300">{recommendation.reason}</Text>
                        <div className="flex gap-2 mt-2">
                          {recommendation.action === 'increase' && (
                            <Button size="sm" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                              <Icon name="trending-up" className="text-sm mr-1" />
                              Increase Offer
                            </Button>
                          )}
                          {recommendation.action === 'decrease' && (
                            <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                              <Icon name="trending-down" className="text-sm mr-1" />
                              Lower Offer
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {offer.status === 'pending' && (
                          <Button
                            onClick={() => handleWithdraw(offer.id)}
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/10"
                            size="sm"
                            disabled={withdrawing === offer.id}
                          >
                            {withdrawing === offer.id ? (
                              <>
                                <Icon name="loader" className="text-sm mr-1 animate-spin" />
                                Withdrawing...
                              </>
                            ) : (
                              <>
                                <Icon name="undo" className="text-sm mr-1" />
                                Withdraw
                              </>
                            )}
                          </Button>
                        )}
                        
                        {offer.status === 'accepted' && (
                          <Badge variant="default" className="bg-green-600 text-white">
                            <Icon name="check" className="text-sm mr-1" />
                            Offer Accepted!
                          </Badge>
                        )}
                        
                        {offer.status === 'rejected' && (
                          <Badge variant="destructive">
                            <Icon name="x" className="text-sm mr-1" />
                            Offer Rejected
                          </Badge>
                        )}
                        
                        {offer.status === 'expired' && (
                          <Badge variant="outline" className="text-gray-400 border-gray-500">
                            <Icon name="clock" className="text-sm mr-1" />
                            Offer Expired
                          </Badge>
                        )}
                      </div>

                      {/* Expiration */}
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="clock" className="text-yellow-400" />
                        <Text className={`font-medium ${
                          offer.status === 'expired' ? 'text-gray-400' : 'text-yellow-400'
                        }`}>
                          {getTimeRemaining(offer.expiresAt)}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Success Rate</Text>
                  <Text className="text-2xl font-bold text-white">{analytics.successRate.toFixed(1)}%</Text>
                </div>
                <Icon name="target" className="text-blue-400 text-2xl" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Avg Response</Text>
                  <Text className="text-2xl font-bold text-white">{analytics.avgResponseTime.toFixed(1)}h</Text>
                </div>
                <Icon name="clock" className="text-yellow-400 text-2xl" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Total Value</Text>
                  <PriceDisplay amount={analytics.totalValue} className="text-2xl font-bold text-white" />
                </div>
                <Icon name="dollar-sign" className="text-green-400 text-2xl" />
              </div>
            </Card>
            
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-gray-400 text-sm">Avg ROI</Text>
                  <Text className={`text-2xl font-bold ${analytics.totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.totalROI >= 0 ? '+' : ''}{analytics.totalROI.toFixed(1)}%
                  </Text>
                </div>
                <Icon name="trending-up" className="text-green-400 text-2xl" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trends */}
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Weekly Performance</Heading>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics.weeklyTrends}>
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

            {/* Platform Performance */}
            <Card className="p-4 bg-gray-900/50 border-gray-700">
              <Heading level={4} className="text-white mb-4">Platform Success Rates</Heading>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.platformPerformance}>
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
          </div>

          {/* Platform Breakdown */}
          <Card className="p-4 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Platform Distribution</Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.platformPerformance.map((platform, index) => (
                <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <Text className="text-white font-medium">{platform.platform}</Text>
                      <Text className="text-gray-400 text-sm">{platform.count} offers</Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <Text className="text-white font-bold">{platform.successRate.toFixed(1)}%</Text>
                    <PriceDisplay amount={platform.avgAmount} className="text-gray-400 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && analytics && (
        <div className="space-y-6">
          {/* Market Insights */}
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Market Intelligence</Heading>
            <div className="space-y-4">
              {analytics.marketInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-lg">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    insight.impact === 'positive' ? 'bg-green-400' :
                    insight.impact === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Heading level={5} className="text-white">{insight.title}</Heading>
                      <Badge 
                        variant={insight.impact === 'positive' ? 'default' : 
                                insight.impact === 'negative' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                    <Text className="text-gray-300 text-sm">{insight.description}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 bg-gray-900/50 border-gray-700">
            <Heading level={4} className="text-white mb-4">Smart Recommendations</Heading>
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="trending-up" className="text-blue-400" />
                  <Text className="text-blue-400 font-medium">Increase TopShot Activity</Text>
                </div>
                <Text className="text-gray-300 text-sm">
                  Your TopShot offers have a 78% success rate. Consider making 2-3 more offers this week.
                </Text>
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="clock" className="text-yellow-400" />
                  <Text className="text-yellow-400 font-medium">Timing Optimization</Text>
                </div>
                <Text className="text-gray-300 text-sm">
                  Offers made on Tuesdays and Fridays have 15% higher acceptance rates.
                </Text>
              </div>
              
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="target" className="text-green-400" />
                  <Text className="text-green-400 font-medium">Price Strategy</Text>
                </div>
                <Text className="text-gray-300 text-sm">
                  Your offers are 8% below market average. Consider increasing by 5-10% for better success.
                </Text>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default OffersMade 