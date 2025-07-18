'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  DollarSign, 
  BarChart3,
  Lightbulb,
  Zap,
  Calendar,
  Users,
  Activity,
  Brain
} from 'lucide-react'

interface StrategyInsight {
  id: string
  category: 'pricing' | 'timing' | 'performance' | 'trends' | 'behavior'
  title: string
  description: string
  metric: string
  value: number
  previousValue?: number
  trend: 'up' | 'down' | 'stable'
  confidence: number
  actionable: boolean
  impact: 'high' | 'medium' | 'low'
  recommendation?: string
}

interface TradingPattern {
  id: string
  pattern: string
  description: string
  frequency: number
  successRate: number
  avgProfit: number
  lastUsed: string
}

interface MarketTiming {
  dayOfWeek: string
  acceptanceRate: number
  avgOfferAmount: number
  volume: number
  recommendation: string
}

const OfferStrategy: React.FC = () => {
  const [insights, setInsights] = useState<StrategyInsight[]>([])
  const [patterns, setPatterns] = useState<TradingPattern[]>([])
  const [marketTiming, setMarketTiming] = useState<MarketTiming[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showRecommendations, setShowRecommendations] = useState(true)

  useEffect(() => {
    // Load strategy insights
    const mockInsights: StrategyInsight[] = [
      {
        id: '1',
        category: 'pricing',
        title: 'Optimal Offer Acceptance Rate',
        description: 'You typically accept offers at 95% of floor price or higher',
        metric: '95% floor price',
        value: 95,
        previousValue: 92,
        trend: 'up',
        confidence: 89,
        actionable: true,
        impact: 'high',
        recommendation: 'Consider accepting offers at 93% floor price to increase volume'
      },
      {
        id: '2',
        category: 'timing',
        title: 'Best Day for Offers',
        description: 'Tuesday offers have 67% acceptance rate vs 45% average',
        metric: '67% vs 45%',
        value: 67,
        previousValue: 45,
        trend: 'up',
        confidence: 92,
        actionable: true,
        impact: 'high',
        recommendation: 'Schedule major offers for Tuesday mornings'
      },
      {
        id: '3',
        category: 'performance',
        title: 'Long-term Hold Strategy',
        description: 'Assets held >30 days receive 40% more offers',
        metric: '+40% more offers',
        value: 40,
        previousValue: 25,
        trend: 'up',
        confidence: 85,
        actionable: true,
        impact: 'medium',
        recommendation: 'Hold premium assets for at least 30 days'
      },
      {
        id: '4',
        category: 'trends',
        title: 'Curry Moment Performance',
        description: 'Your Curry moments get 2x more offers than average',
        metric: '2x more offers',
        value: 200,
        previousValue: 100,
        trend: 'up',
        confidence: 78,
        actionable: false,
        impact: 'medium'
      },
      {
        id: '5',
        category: 'behavior',
        title: 'Counter-Offer Success',
        description: 'Your counter-offers have 73% acceptance rate',
        metric: '73% success rate',
        value: 73,
        previousValue: 65,
        trend: 'up',
        confidence: 81,
        actionable: true,
        impact: 'high',
        recommendation: 'Use counter-offers more frequently, especially for high-value assets'
      },
      {
        id: '6',
        category: 'pricing',
        title: 'Floor Price Sensitivity',
        description: 'Offers below 90% floor price are rarely accepted',
        metric: '12% acceptance rate',
        value: 12,
        previousValue: 15,
        trend: 'down',
        confidence: 94,
        actionable: true,
        impact: 'high',
        recommendation: 'Avoid making offers below 90% of floor price'
      }
    ]

    const mockPatterns: TradingPattern[] = [
      {
        id: '1',
        pattern: 'Weekend Warrior',
        description: 'Make offers on weekends when activity is lower',
        frequency: 15,
        successRate: 68,
        avgProfit: 12.5,
        lastUsed: '2024-01-15'
      },
      {
        id: '2',
        pattern: 'Floor Hunter',
        description: 'Target assets at 95% of floor price',
        frequency: 23,
        successRate: 72,
        avgProfit: 8.3,
        lastUsed: '2024-01-20'
      },
      {
        id: '3',
        pattern: 'Counter Master',
        description: 'Always counter initial offers by 5-10%',
        frequency: 8,
        successRate: 73,
        avgProfit: 15.2,
        lastUsed: '2024-01-18'
      },
      {
        id: '4',
        pattern: 'Volume Trader',
        description: 'Focus on high-volume assets for quick flips',
        frequency: 12,
        successRate: 58,
        avgProfit: 6.8,
        lastUsed: '2024-01-22'
      }
    ]

    const mockMarketTiming: MarketTiming[] = [
      { dayOfWeek: 'Monday', acceptanceRate: 52, avgOfferAmount: 1850, volume: 45, recommendation: 'Good for testing offers' },
      { dayOfWeek: 'Tuesday', acceptanceRate: 67, avgOfferAmount: 2100, volume: 78, recommendation: 'Best day for major offers' },
      { dayOfWeek: 'Wednesday', acceptanceRate: 48, avgOfferAmount: 1950, volume: 62, recommendation: 'Moderate activity' },
      { dayOfWeek: 'Thursday', acceptanceRate: 55, avgOfferAmount: 2000, volume: 71, recommendation: 'Good for counter-offers' },
      { dayOfWeek: 'Friday', acceptanceRate: 61, avgOfferAmount: 2200, volume: 89, recommendation: 'High volume, good prices' },
      { dayOfWeek: 'Saturday', acceptanceRate: 43, avgOfferAmount: 1750, volume: 34, recommendation: 'Lower activity, better deals' },
      { dayOfWeek: 'Sunday', acceptanceRate: 38, avgOfferAmount: 1650, volume: 28, recommendation: 'Quiet day, aggressive offers' }
    ]

    setInsights(mockInsights)
    setPatterns(mockPatterns)
    setMarketTiming(mockMarketTiming)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing':
        return <DollarSign className="w-4 h-4" />
      case 'timing':
        return <Clock className="w-4 h-4" />
      case 'performance':
        return <BarChart3 className="w-4 h-4" />
      case 'trends':
        return <TrendingUp className="w-4 h-4" />
      case 'behavior':
        return <Brain className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getTrendIcon = (trend: StrategyInsight['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'stable':
        return <TrendingUp className="w-4 h-4 text-gray-500" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getImpactColor = (impact: StrategyInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory)

  const actionableInsights = insights.filter(insight => insight.actionable)
  const highImpactInsights = insights.filter(insight => insight.impact === 'high')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Strategy Insights</h2>
          <p className="text-gray-400">AI-powered trading intelligence and recommendations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {actionableInsights.length} actionable
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showRecommendations ? 'Hide' : 'Show'} Recommendations
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-xl font-bold text-white">73%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Profit</p>
                <p className="text-xl font-bold text-white">$245</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Offers</p>
                <p className="text-xl font-bold text-white">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Best Day</p>
                <p className="text-xl font-bold text-white">Tuesday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All ({insights.length})
        </button>
        {['pricing', 'timing', 'performance', 'trends', 'behavior'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {getCategoryIcon(category)}
            <span className="ml-2 capitalize">{category}</span>
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredInsights.map((insight) => (
          <Card key={insight.id} className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.category)}
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(insight.trend)}
                  <Badge variant="secondary" className={getImpactColor(insight.impact)}>
                    {insight.impact}
                  </Badge>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">{insight.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-white">{insight.metric}</p>
                  {insight.previousValue && (
                    <p className="text-sm text-gray-500">
                      vs {insight.previousValue} previously
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Confidence</p>
                  <p className="text-lg font-semibold text-white">{insight.confidence}%</p>
                </div>
              </div>
              
              <Progress value={insight.confidence} className="mb-3" />
              
              {showRecommendations && insight.recommendation && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-300">{insight.recommendation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trading Patterns */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Trading Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{pattern.pattern}</h4>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    {pattern.successRate}% success
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-3">{pattern.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Used {pattern.frequency} times</span>
                  <span className="text-green-400">+${pattern.avgProfit} avg profit</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Last used: {new Date(pattern.lastUsed).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Timing */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Market Timing Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 text-gray-400">Day</th>
                  <th className="text-center py-2 text-gray-400">Acceptance Rate</th>
                  <th className="text-center py-2 text-gray-400">Avg Offer</th>
                  <th className="text-center py-2 text-gray-400">Volume</th>
                  <th className="text-left py-2 text-gray-400">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {marketTiming.map((day) => (
                  <tr key={day.dayOfWeek} className="border-b border-gray-800">
                    <td className="py-3 text-white font-medium">{day.dayOfWeek}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white">{day.acceptanceRate}%</span>
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${day.acceptanceRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center text-white">${day.avgOfferAmount.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                        {day.volume}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-400 text-sm">{day.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OfferStrategy 