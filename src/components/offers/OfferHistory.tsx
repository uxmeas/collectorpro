'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/design-system/atoms/Text'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Icon } from '@/components/design-system/atoms/Icon'
import { PriceDisplay } from '@/components/design-system/molecules/PriceDisplay'

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

interface OfferHistoryProps {
  offers: Offer[]
}

const OfferHistory: React.FC<OfferHistoryProps> = ({ offers }) => {
  const [filter, setFilter] = useState<'all' | 'accepted' | 'rejected' | 'expired'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'platform'>('date')

  const filteredOffers = offers.filter(offer => {
    if (filter === 'all') return true
    return offer.status === filter
  })

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.timestamp.getTime() - a.timestamp.getTime()
      case 'amount':
        return b.offerAmount - a.offerAmount
      case 'platform':
        return a.platform.localeCompare(b.platform)
      default:
        return 0
    }
  })

  const stats = {
    total: offers.length,
    accepted: offers.filter(o => o.status === 'accepted').length,
    rejected: offers.filter(o => o.status === 'rejected').length,
    expired: offers.filter(o => o.status === 'expired').length,
    totalValue: offers.reduce((sum, o) => sum + o.offerAmount, 0),
    avgResponseTime: 4.2 // hours - would be calculated from real data
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'expired': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return 'check-circle'
      case 'rejected': return 'x-circle'
      case 'expired': return 'alert-circle'
      default: return 'circle'
    }
  }

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  if (offers.length === 0) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon name="clock" className="text-gray-500 text-4xl mx-auto mb-4" />
        <Heading level={3} className="text-gray-400 mb-2">No Offer History</Heading>
        <Text className="text-gray-500">Your offer history will appear here once you start making and receiving offers.</Text>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <div className="text-center">
            <Text className="text-gray-400 text-sm mb-1">Total Offers</Text>
            <Text className="text-2xl font-bold text-white">{stats.total}</Text>
          </div>
        </Card>
        <Card className="p-4 bg-green-900/20 border-green-500/30">
          <div className="text-center">
            <Text className="text-green-400 text-sm mb-1">Accepted</Text>
            <Text className="text-2xl font-bold text-green-300">{stats.accepted}</Text>
          </div>
        </Card>
        <Card className="p-4 bg-red-900/20 border-red-500/30">
          <div className="text-center">
            <Text className="text-red-400 text-sm mb-1">Rejected</Text>
            <Text className="text-2xl font-bold text-red-300">{stats.rejected}</Text>
          </div>
        </Card>
        <Card className="p-4 bg-gray-800/50 border-gray-700">
          <div className="text-center">
            <Text className="text-gray-400 text-sm mb-1">Total Value</Text>
            <Text className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</Text>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-gray-900/50 border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Text className="text-gray-400 text-sm">Filter:</Text>
            <div className="flex gap-1">
              {(['all', 'accepted', 'rejected', 'expired'] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="flex items-center gap-2"
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Text className="text-gray-400 text-sm">Sort by:</Text>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="platform">Platform</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Offer List */}
      <div className="space-y-4">
        {sortedOffers.map((offer) => (
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
                      <span>{offer.buyerAddress || offer.sellerAddress}</span>
                      <span>•</span>
                      <span>{getTimeAgo(offer.timestamp)}</span>
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

                {/* Price Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <Text className="text-gray-400 text-sm mb-1">Offer Amount</Text>
                    <PriceDisplay 
                      amount={offer.offerAmount} 
                      className="text-lg font-bold text-blue-400" 
                    />
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <Text className="text-gray-400 text-sm mb-1">Current Value</Text>
                    <div className="flex items-center gap-2">
                      <PriceDisplay 
                        amount={offer.currentValue} 
                        className="text-lg font-bold text-white" 
                      />
                      <Badge 
                        variant={offer.percentageChange >= 0 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {offer.percentageChange >= 0 ? '+' : ''}{offer.percentageChange.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <Text className="text-gray-400 text-sm mb-1">Market Sentiment</Text>
                    <div className="flex items-center gap-1">
                      <Icon 
                        name={offer.offerTrend === 'increasing' ? 'trending-up' : offer.offerTrend === 'decreasing' ? 'trending-down' : 'minus'} 
                        className={`text-sm ${
                          offer.offerTrend === 'increasing' ? 'text-green-400' : 
                          offer.offerTrend === 'decreasing' ? 'text-red-400' : 'text-gray-400'
                        }`} 
                      />
                      <Text className="text-sm font-medium capitalize">{offer.marketSentiment}</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OfferHistory 