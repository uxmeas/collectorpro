'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface OfferAnalytics {
  activeOffers: {
    count: number
    offers: Array<{
      asset: string
      amount: number
      percentage: number
      status: 'hot' | 'fair' | 'low' | 'expiring'
    }>
  }
  myOffers: {
    count: number
    offers: Array<{
      asset: string
      amount: number
      status: 'pending' | 'accepted' | 'declined'
    }>
  }
  analytics: {
    successRate: number
    avgOfferPercentage: number
    bestOfferPercentage: number
  }
}

const OfferAnalyticsDisplay: React.FC = () => {
  const analytics: OfferAnalytics = {
    activeOffers: {
      count: 5,
      offers: [
        { asset: 'LeBron', amount: 1350, percentage: 8, status: 'hot' },
        { asset: 'Curry', amount: 95, percentage: -23, status: 'low' },
        { asset: 'Durant', amount: 187, percentage: -5, status: 'expiring' }
      ]
    },
    myOffers: {
      count: 3,
      offers: [
        { asset: 'Giannis', amount: 890, status: 'pending' },
        { asset: 'Tatum', amount: 234, status: 'pending' },
        { asset: 'Luka', amount: 445, status: 'declined' }
      ]
    },
    analytics: {
      successRate: 35,
      avgOfferPercentage: 92,
      bestOfferPercentage: 23
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'low':
        return <TrendingDown className="w-4 h-4 text-gray-500" />
      case 'expiring':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'declined':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'text-red-400'
      case 'low':
        return 'text-gray-400'
      case 'expiring':
        return 'text-orange-400'
      case 'pending':
        return 'text-yellow-400'
      case 'accepted':
        return 'text-green-400'
      case 'declined':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-400'
    if (percentage < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Offer Analytics</h2>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
          Real-time
        </Badge>
      </div>

      {/* Active Offers & My Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Offers */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📬 Active Offers ({analytics.activeOffers.count})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.activeOffers.offers.map((offer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(offer.status)}
                  <div>
                    <p className="font-medium text-white">{offer.asset}</p>
                    <p className="text-sm text-gray-400">${offer.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getPercentageColor(offer.percentage)}`}>
                    {offer.percentage > 0 ? '+' : ''}{offer.percentage}%
                  </p>
                  <p className="text-xs text-gray-500">vs floor</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Offers */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📤 My Offers ({analytics.myOffers.count})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.myOffers.offers.map((offer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(offer.status)}
                  <div>
                    <p className="font-medium text-white">{offer.asset}</p>
                    <p className="text-sm text-gray-400">${offer.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(offer.status)} border-current`}
                  >
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Metrics */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">📊 Offer Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Success Rate</span>
              <span className="text-white font-semibold">{analytics.analytics.successRate}%</span>
            </div>
            <div className="relative">
              <Progress value={analytics.analytics.successRate} className="h-2" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-400">
                  {'█'.repeat(Math.floor(analytics.analytics.successRate / 10))}
                  {'░'.repeat(10 - Math.floor(analytics.analytics.successRate / 10))}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <p className="text-sm text-gray-400">Avg Offer</p>
              <p className="text-xl font-bold text-white">{analytics.analytics.avgOfferPercentage}% of floor</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <p className="text-sm text-gray-400">Best Offer</p>
              <p className="text-xl font-bold text-green-400">+{analytics.analytics.bestOfferPercentage}% above floor</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg text-center">
              <p className="text-sm text-gray-400">Total Volume</p>
              <p className="text-xl font-bold text-white">$2,847</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">12</p>
              <p className="text-sm text-gray-400">Accepted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">8</p>
              <p className="text-sm text-gray-400">Declined</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">5</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">3</p>
              <p className="text-sm text-gray-400">Expired</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OfferAnalyticsDisplay 