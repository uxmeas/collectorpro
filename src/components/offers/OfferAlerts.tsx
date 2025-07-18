'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Eye,
  Smartphone,
  Settings,
  Volume2,
  Mail
} from 'lucide-react'

interface OfferAlert {
  id: string
  type: 'new_offer' | 'expiring' | 'counter' | 'accepted' | 'similar_sold' | 'strategy_insight'
  title: string
  message: string
  asset?: {
    name: string
    image: string
    floorPrice: number
  }
  offer?: {
    amount: number
    expiresAt: string
    isHot: boolean
    isFair: boolean
    isLow: boolean
    isExpiring: boolean
    isStrategic: boolean
  }
  timestamp: string
  isRead: boolean
  priority: 'high' | 'medium' | 'low'
  actionRequired?: boolean
}

interface StrategyInsight {
  id: string
  category: 'pricing' | 'timing' | 'performance' | 'trends'
  title: string
  description: string
  metric: string
  trend: 'up' | 'down' | 'stable'
  confidence: number
  actionable: boolean
}

const OfferAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<OfferAlert[]>([])
  const [insights, setInsights] = useState<StrategyInsight[]>([])
  const [activeTab, setActiveTab] = useState<'alerts' | 'insights' | 'settings'>('alerts')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  useEffect(() => {
    // Simulate real-time alerts
    const mockAlerts: OfferAlert[] = [
      {
        id: '1',
        type: 'new_offer',
        title: 'New offer received on LeBron James #23',
        message: 'You received a $2,450 offer for your LeBron James moment',
        asset: {
          name: 'LeBron James #23',
          image: '/api/placeholder/60/60',
          floorPrice: 2400
        },
        offer: {
          amount: 2450,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isHot: true,
          isFair: false,
          isLow: false,
          isExpiring: false,
          isStrategic: false
        },
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: 'high',
        actionRequired: true
      },
      {
        id: '2',
        type: 'expiring',
        title: 'Offer expiring in 2 hours',
        message: 'Your $1,800 offer on Curry #30 expires soon',
        asset: {
          name: 'Stephen Curry #30',
          image: '/api/placeholder/60/60',
          floorPrice: 1750
        },
        offer: {
          amount: 1800,
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          isHot: false,
          isFair: true,
          isLow: false,
          isExpiring: true,
          isStrategic: false
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionRequired: true
      },
      {
        id: '3',
        type: 'counter',
        title: 'Counter-offer received',
        message: 'Seller countered your offer with $2,200',
        asset: {
          name: 'Kevin Durant #7',
          image: '/api/placeholder/60/60',
          floorPrice: 2100
        },
        offer: {
          amount: 2200,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          isHot: false,
          isFair: true,
          isLow: false,
          isExpiring: false,
          isStrategic: true
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium',
        actionRequired: true
      },
      {
        id: '4',
        type: 'accepted',
        title: 'Your offer was accepted!',
        message: 'Congratulations! Your $1,950 offer was accepted',
        asset: {
          name: 'Giannis Antetokounmpo #34',
          image: '/api/placeholder/60/60',
          floorPrice: 1900
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'medium'
      },
      {
        id: '5',
        type: 'similar_sold',
        title: 'Similar asset sold for more',
        message: 'Similar LeBron moment sold for $2,600 (you declined $2,450)',
        asset: {
          name: 'LeBron James #23',
          image: '/api/placeholder/60/60',
          floorPrice: 2400
        },
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'low'
      }
    ]

    const mockInsights: StrategyInsight[] = [
      {
        id: '1',
        category: 'pricing',
        title: 'You typically decline offers below 95% of floor',
        description: 'Your acceptance rate for offers below 95% of floor price is only 12%',
        metric: '12% acceptance rate',
        trend: 'stable',
        confidence: 89,
        actionable: true
      },
      {
        id: '2',
        category: 'timing',
        title: 'Assets held >30 days receive 40% more offers',
        description: 'Your long-term holdings generate significantly more offer activity',
        metric: '+40% more offers',
        trend: 'up',
        confidence: 92,
        actionable: true
      },
      {
        id: '3',
        category: 'performance',
        title: 'Tuesday offers have highest acceptance rate',
        description: 'Offers made on Tuesdays have a 67% acceptance rate vs 45% average',
        metric: '67% vs 45% average',
        trend: 'up',
        confidence: 78,
        actionable: true
      },
      {
        id: '4',
        category: 'trends',
        title: 'Your Curry moments get 2x more offers than average',
        description: 'Stephen Curry moments in your portfolio receive twice as many offers',
        metric: '2x more offers',
        trend: 'up',
        confidence: 85,
        actionable: false
      }
    ]

    setAlerts(mockAlerts)
    setInsights(mockInsights)
  }, [])

  const getAlertIcon = (type: OfferAlert['type']) => {
    switch (type) {
      case 'new_offer':
        return <Bell className="w-4 h-4 text-blue-500" />
      case 'expiring':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'counter':
        return <Target className="w-4 h-4 text-purple-500" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'similar_sold':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'strategy_insight':
        return <TrendingUp className="w-4 h-4 text-indigo-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: OfferAlert['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20'
      case 'medium':
        return 'bg-orange-500/10 border-orange-500/20'
      case 'low':
        return 'bg-gray-500/10 border-gray-500/20'
      default:
        return 'bg-gray-500/10 border-gray-500/20'
    }
  }

  const getOfferIndicators = (offer?: OfferAlert['offer']) => {
    if (!offer) return null

    return (
      <div className="flex gap-1 mt-2">
        {offer.isHot && (
          <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">
            🔥 Hot
          </Badge>
        )}
        {offer.isFair && (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            💡 Fair
          </Badge>
        )}
        {offer.isLow && (
          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            🗑️ Low
          </Badge>
        )}
        {offer.isExpiring && (
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            ⏰ Expiring
          </Badge>
        )}
        {offer.isStrategic && (
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            🎯 Strategic
          </Badge>
        )}
      </div>
    )
  }

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const handleQuickAction = (alert: OfferAlert, action: 'accept' | 'decline' | 'counter') => {
    console.log(`${action} offer for ${alert.asset?.name}`)
    markAsRead(alert.id)
  }

  const getInsightIcon = (trend: StrategyInsight['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      case 'stable':
        return <TrendingUp className="w-4 h-4 text-gray-500" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Offer Alerts & Insights</h2>
          <p className="text-gray-400">Real-time notifications and strategic intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {alerts.filter(a => !a.isRead).length} new
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Alerts ({alerts.filter(a => !a.isRead).length})
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'insights'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Strategy Insights
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                alert.isRead ? 'opacity-60' : 'opacity-100'
              } ${getPriorityColor(alert.priority)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${alert.isRead ? 'text-gray-400' : 'text-white'}`}>
                          {alert.title}
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">{alert.message}</p>
                        
                        {alert.asset && (
                          <div className="flex items-center gap-2 mt-2">
                            <img 
                              src={alert.asset.image} 
                              alt={alert.asset.name}
                              className="w-8 h-8 rounded-md"
                            />
                            <span className="text-sm text-gray-300">{alert.asset.name}</span>
                            {alert.offer && (
                              <span className="text-sm text-green-400">
                                ${alert.offer.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {getOfferIndicators(alert.offer)}
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          {alert.offer?.expiresAt && (
                            <span className="text-orange-400">
                              Expires: {new Date(alert.offer.expiresAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {alert.actionRequired && !alert.isRead && (
                        <div className="flex gap-1 ml-4">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleQuickAction(alert, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleQuickAction(alert, 'decline')}
                          >
                            Decline
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleQuickAction(alert, 'counter')}
                          >
                            Counter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.trend)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{insight.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{insight.description}</p>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                            {insight.metric}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {insight.confidence}% confidence
                          </span>
                          {insight.actionable && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              Actionable
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {insight.actionable && (
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-400">Receive real-time alerts on your device</p>
                </div>
                <Button
                  variant={notificationsEnabled ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Sound Alerts</h4>
                  <p className="text-sm text-gray-400">Play sound for new offers</p>
                </div>
                <Button
                  variant={soundEnabled ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {soundEnabled ? 'On' : 'Off'}
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-400">Receive email summaries</p>
                </div>
                <Button
                  variant={emailNotifications ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className="flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {emailNotifications ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Mobile Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">Swipe Actions</h4>
                  <p className="text-sm text-gray-400">Swipe right to accept, left to decline offers</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Zap className="w-5 h-5 text-green-400" />
                <div>
                  <h4 className="font-medium text-white">Quick Counter</h4>
                  <p className="text-sm text-gray-400">One-tap counter offers (+5%, +10%, +15%)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <Bell className="w-5 h-5 text-orange-400" />
                <div>
                  <h4 className="font-medium text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-400">Instant alerts for new offers and expirations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default OfferAlerts 