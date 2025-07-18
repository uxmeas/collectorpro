'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Target, 
  CheckCircle,
  Flame,
  BarChart3,
  Lightbulb,
  Clock,
  Users
} from 'lucide-react'

interface Insight {
  id: string
  type: 'timing' | 'player' | 'performance' | 'market' | 'trend'
  title: string
  description: string
  value: string
  trend: 'up' | 'down' | 'neutral'
  confidence: number
  actionable: boolean
  category: string
}

const SmartInsights: React.FC = () => {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'timing',
      title: 'Monday Offer Surge',
      description: 'You get 40% more offers on Monday',
      value: '+40%',
      trend: 'up',
      confidence: 95,
      actionable: true,
      category: 'Timing'
    },
    {
      id: '2',
      type: 'player',
      title: 'Curry Market Hot',
      description: 'Curry moments get 2x more offers',
      value: '2x',
      trend: 'up',
      confidence: 88,
      actionable: true,
      category: 'Player'
    },
    {
      id: '3',
      type: 'performance',
      title: 'Above Average Acceptance',
      description: 'Your acceptance rate is above average',
      value: '+15%',
      trend: 'up',
      confidence: 92,
      actionable: false,
      category: 'Performance'
    },
    {
      id: '4',
      type: 'market',
      title: 'Hot Assets Alert',
      description: '3 assets are "hot" (multiple offers)',
      value: '3',
      trend: 'up',
      confidence: 85,
      actionable: true,
      category: 'Market'
    },
    {
      id: '5',
      type: 'trend',
      title: 'Weekend Dip',
      description: 'Offer activity drops 25% on weekends',
      value: '-25%',
      trend: 'down',
      confidence: 78,
      actionable: true,
      category: 'Timing'
    },
    {
      id: '6',
      type: 'player',
      title: 'LeBron Premium',
      description: 'LeBron offers average 15% above floor',
      value: '+15%',
      trend: 'up',
      confidence: 90,
      actionable: true,
      category: 'Player'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Timing':
        return <Calendar className="w-4 h-4" />
      case 'Player':
        return <Target className="w-4 h-4" />
      case 'Performance':
        return <CheckCircle className="w-4 h-4" />
      case 'Market':
        return <Flame className="w-4 h-4" />
      case 'Trend':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400'
    if (confidence >= 80) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getActionableBadge = (actionable: boolean) => {
    return actionable ? (
      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
        Actionable
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
        Informational
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">🧠 Smart Insights</h2>
            <p className="text-gray-400">AI-powered market intelligence and patterns</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
          <Lightbulb className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="bg-gray-900/50 border-gray-700 hover:border-purple-500/30 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.category)}
                  <span className="text-xs text-gray-400">{insight.category}</span>
                </div>
                {getActionableBadge(insight.actionable)}
              </div>
              <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-300 text-sm">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTrendIcon(insight.trend)}
                  <span className={`font-bold text-lg ${getTrendColor(insight.trend)}`}>
                    {insight.value}
                  </span>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${getConfidenceColor(insight.confidence)}`}>
                    {insight.confidence}% confidence
                  </p>
                </div>
              </div>

              {insight.actionable && (
                <div className="pt-2 border-t border-gray-700">
                  <p className="text-xs text-purple-400 font-medium">
                    💡 Action: {insight.category === 'Timing' ? 'Schedule offers for optimal timing' : 
                               insight.category === 'Player' ? 'Focus on high-demand players' :
                               insight.category === 'Market' ? 'Monitor hot assets closely' : 'Leverage market trends'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Insight Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">6</p>
              <p className="text-sm text-gray-400">Total Insights</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">4</p>
              <p className="text-sm text-gray-400">Actionable</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">87%</p>
              <p className="text-sm text-gray-400">Avg Confidence</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">3</p>
              <p className="text-sm text-gray-400">Hot Assets</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="font-medium text-white">Schedule Monday Offers</span>
              </div>
              <p className="text-sm text-gray-400">Set reminders for Monday offer creation</p>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-white">Focus on Curry</span>
              </div>
              <p className="text-sm text-gray-400">Prioritize Curry moment acquisitions</p>
            </div>
            
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-white">Monitor Hot Assets</span>
              </div>
              <p className="text-sm text-gray-400">Track the 3 hot assets closely</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SmartInsights 