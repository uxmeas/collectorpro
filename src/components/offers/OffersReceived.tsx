'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/design-system/atoms/Text'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Icon } from '@/components/design-system/atoms/Icon'
import { PriceDisplay } from '@/components/design-system/molecules/PriceDisplay'
import { 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Inbox
} from 'lucide-react'

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
  offerTrend: 'increasing' | 'decreasing' | 'stable'
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
}

interface OffersReceivedProps {
  offers: Offer[]
}

const OffersReceived: React.FC<OffersReceivedProps> = ({ offers }) => {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)

  const handleAccept = (offerId: string) => {
    console.log('Accepting offer:', offerId)
    // TODO: Implement accept logic
  }

  const handleReject = (offerId: string) => {
    console.log('Rejecting offer:', offerId)
    // TODO: Implement reject logic
  }

  const handleCounter = (offerId: string) => {
    console.log('Countering offer:', offerId)
    // TODO: Implement counter logic
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400'
      case 'bearish': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return TrendingUp
      case 'decreasing': return TrendingDown
      default: return Minus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-400'
      case 'decreasing': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (offers.length === 0) {
    return (
      <Card className="p-8 text-center bg-gray-900/50 border-gray-700">
        <Icon icon={Inbox} className="text-gray-500 text-4xl mx-auto mb-4" />
        <Heading level={3} className="text-gray-400 mb-2">No Offers Received</Heading>
        <Text className="text-gray-500">You haven't received any offers yet. Your assets will appear here when collectors make offers.</Text>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
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
                    <span>From: {offer.buyerAddress}</span>
                    <span>•</span>
                    <span>{offer.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* Market Intelligence */}
                <div className="flex items-center gap-2 ml-4">
                  <div className={`flex items-center gap-1 ${getSentimentColor(offer.marketSentiment)}`}>
                    <Icon icon={getTrendIcon(offer.offerTrend)} className="text-sm" />
                    <Text className="text-xs font-medium">{offer.marketSentiment}</Text>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs border-current ${getTrendColor(offer.offerTrend)}`}
                  >
                    {offer.offerTrend}
                  </Badge>
                </div>
              </div>

              {/* Price Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <Text className="text-gray-400 text-sm mb-1">Offer Amount</Text>
                  <PriceDisplay 
                    amount={offer.offerAmount} 
                    className="text-xl font-bold text-green-400" 
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

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleAccept(offer.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Icon icon={Check} className="text-sm mr-1" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleReject(offer.id)}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                    size="sm"
                  >
                    <Icon icon={X} className="text-sm mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleCounter(offer.id)}
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                    size="sm"
                  >
                    <Icon icon={MessageSquare} className="text-sm mr-1" />
                    Counter
                  </Button>
                </div>

                {/* Expiration */}
                <div className="flex items-center gap-2 text-sm">
                  <Icon icon={Clock} className="text-yellow-400" />
                  <Text className="text-yellow-400 font-medium">
                    Expires in {getTimeRemaining(offer.expiresAt)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default OffersReceived 