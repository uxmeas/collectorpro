'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { 
  Bell, 
  TrendingUp, 
  Target, 
  Settings,
  Activity,
  BarChart3,
  Smartphone,
  Zap,
  Brain
} from 'lucide-react'

import OffersAnalytics from './OffersAnalytics'
import OfferAlerts from './OfferAlerts'
import OfferNotifications from './OfferNotifications'
import OfferStrategy from './OfferStrategy'
import OfferIndicators from './OfferIndicators'
import SmartInsights from './SmartInsights'

interface Offer {
  id: string
  type: 'received' | 'made' | 'expired' | 'accepted' | 'declined'
  asset: {
    name: string
    image: string
    floorPrice: number
  }
  amount: number
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'countered'
  expiresAt: string
  timestamp: string
  isHot: boolean
  isFair: boolean
  isLow: boolean
  isExpiring: boolean
  isStrategic: boolean
}

interface OffersDashboardProps {
  walletAddress?: string
}

const OffersDashboard: React.FC<OffersDashboardProps> = ({ walletAddress = 'demo-wallet' }) => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchOffers()
    fetchNotifications()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/offers')
      const data = await response.json()
      
      if (data.success) {
        setOffers(data.data.offers)
      } else {
        console.error('Failed to fetch offers:', data.error)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/offers/notifications?address=demo-wallet')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data.notifications)
        setUnreadCount(data.data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleOfferAction = async (action: 'accept' | 'counter' | 'decline', amount?: number) => {
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchOffers() // Refresh offers
        fetchNotifications() // Refresh notifications
      }
    } catch (error) {
      console.error('Error performing offer action:', error)
    }
  }

  const getStats = () => {
    const totalOffers = offers.length
    const pendingOffers = offers.filter(o => o.status === 'pending').length
    const acceptedOffers = offers.filter(o => o.status === 'accepted').length
    const totalValue = offers.reduce((sum, offer) => sum + offer.amount, 0)
    
    return { totalOffers, pendingOffers, acceptedOffers, totalValue }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'alerts':
        return <OfferAlerts />
      case 'notifications':
        return <OfferNotifications />
      case 'strategy':
        return <OfferStrategy />
      case 'insights':
        return <SmartInsights />
      case 'analytics':
        return <OffersAnalytics walletAddress={walletAddress} />
      case 'mobile':
        return (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Mobile Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Swipe Actions</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Swipe right to accept offers, left to decline. Quick and intuitive mobile interaction.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">Swipe Right = Accept</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white rotate-180" />
                    </div>
                    <span className="text-gray-300">Swipe Left = Decline</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Quick Counter Buttons</h4>
                <p className="text-gray-400 text-sm mb-3">
                  One-tap counter offers with preset percentages for faster negotiations.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">+5%</Button>
                  <Button size="sm" variant="outline">+10%</Button>
                  <Button size="sm" variant="outline">+15%</Button>
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Push Notifications</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Instant alerts for new offers, expirations, and important updates.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">New offer received</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-400" />
                    <span className="text-gray-300">Offer expiring soon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Offer accepted</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Offers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {offers.slice(0, 5).map((offer) => (
                  <OfferIndicators
                    key={offer.id}
                    offer={{
                      id: offer.id,
                      amount: offer.amount,
                      floorPrice: offer.asset.floorPrice,
                      expiresAt: offer.expiresAt,
                      isHot: offer.isHot,
                      isFair: offer.isFair,
                      isLow: offer.isLow,
                      isExpiring: offer.isExpiring,
                      isStrategic: offer.isStrategic,
                      status: offer.status
                    }}
                    onAction={handleOfferAction}
                    showQuickActions={true}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Target className="w-4 h-4 mr-2" />
                  Make New Offer
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection('strategy')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Strategy Insights
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection('insights')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Smart Insights
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection('notifications')}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveSection('analytics')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Offers Management</h1>
          <p className="text-gray-400">Professional-grade offer tracking and strategy</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-500/20 text-red-400">
              {unreadCount} new
            </Badge>
          )}
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Offers</p>
                <p className="text-xl font-bold text-white">{stats.totalOffers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-xl font-bold text-white">{stats.pendingOffers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Accepted</p>
                <p className="text-xl font-bold text-white">{stats.acceptedOffers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveSection('alerts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'alerts'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Alerts ({unreadCount})
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'notifications'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveSection('strategy')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'strategy'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Strategy
        </button>
        <button
          onClick={() => setActiveSection('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'insights'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-2" />
          Smart Insights
        </button>
        <button
          onClick={() => setActiveSection('analytics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveSection('mobile')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeSection === 'mobile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4 inline mr-2" />
          Mobile
        </button>
      </div>

      {/* Content */}
      {renderSection()}
    </div>
  )
}

export default OffersDashboard 