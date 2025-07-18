'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus
} from 'lucide-react'

interface OfferIndicatorProps {
  offer: {
    id: string
    amount: number
    floorPrice: number
    expiresAt: string
    isHot: boolean
    isFair: boolean
    isLow: boolean
    isExpiring: boolean
    isStrategic: boolean
    status: 'pending' | 'accepted' | 'declined' | 'expired' | 'countered'
  }
  onAction: (action: 'accept' | 'decline' | 'counter', amount?: number) => void
  showQuickActions?: boolean
}

const OfferIndicators: React.FC<OfferIndicatorProps> = ({ 
  offer, 
  onAction, 
  showQuickActions = true 
}) => {
  const getIndicators = () => {
    const indicators = []
    
    if (offer.isHot) {
      indicators.push({
        emoji: '🔥',
        label: 'Hot offer',
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        description: 'Above floor price'
      })
    }
    
    if (offer.isFair) {
      indicators.push({
        emoji: '💡',
        label: 'Fair offer',
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        description: 'Near floor price'
      })
    }
    
    if (offer.isLow) {
      indicators.push({
        emoji: '🗑️',
        label: 'Low offer',
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        description: 'Significantly below floor'
      })
    }
    
    if (offer.isExpiring) {
      indicators.push({
        emoji: '⏰',
        label: 'Expiring soon',
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        description: '< 24 hours remaining'
      })
    }
    
    if (offer.isStrategic) {
      indicators.push({
        emoji: '🎯',
        label: 'Strategic offer',
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        description: 'Good buying opportunity'
      })
    }
    
    return indicators
  }

  const getStatusIndicator = () => {
    switch (offer.status) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          label: 'Pending',
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        }
      case 'accepted':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          label: 'Accepted',
          color: 'bg-green-500/20 text-green-400 border-green-500/30'
        }
      case 'declined':
        return {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
          label: 'Declined',
          color: 'bg-red-500/20 text-red-400 border-red-500/30'
        }
      case 'expired':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-gray-500" />,
          label: 'Expired',
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
      case 'countered':
        return {
          icon: <Target className="w-4 h-4 text-purple-500" />,
          label: 'Countered',
          color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        }
      default:
        return {
          icon: <Clock className="w-4 h-4 text-gray-500" />,
          label: 'Unknown',
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }
  }

  const getPriceComparison = () => {
    const percentage = (offer.amount / offer.floorPrice) * 100
    const difference = offer.amount - offer.floorPrice
    
    if (percentage >= 100) {
      return {
        text: `+${difference.toLocaleString()}`,
        color: 'text-green-400',
        description: `${percentage.toFixed(1)}% of floor`
      }
    } else if (percentage >= 95) {
      return {
        text: `${difference.toLocaleString()}`,
        color: 'text-blue-400',
        description: `${percentage.toFixed(1)}% of floor`
      }
    } else {
      return {
        text: `${difference.toLocaleString()}`,
        color: 'text-red-400',
        description: `${percentage.toFixed(1)}% of floor`
      }
    }
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const expiresAt = new Date(offer.expiresAt)
    const diff = expiresAt.getTime() - now.getTime()
    
    if (diff <= 0) {
      return { text: 'Expired', color: 'text-red-400' }
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return { text: `${days}d remaining`, color: 'text-gray-400' }
    } else if (hours > 0) {
      return { text: `${hours}h ${minutes}m`, color: hours < 2 ? 'text-orange-400' : 'text-gray-400' }
    } else {
      return { text: `${minutes}m`, color: 'text-red-400' }
    }
  }

  const handleQuickCounter = (percentage: number) => {
    const newAmount = Math.round(offer.amount * (1 + percentage / 100))
    onAction('counter', newAmount)
  }

  const indicators = getIndicators()
  const statusIndicator = getStatusIndicator()
  const priceComparison = getPriceComparison()
  const timeRemaining = getTimeRemaining()

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-4">
        {/* Status and Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {statusIndicator.icon}
            <Badge variant="secondary" className={statusIndicator.color}>
              {statusIndicator.label}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">
              ${offer.amount.toLocaleString()}
            </p>
            <p className={`text-sm ${priceComparison.color}`}>
              {priceComparison.text} ({priceComparison.description})
            </p>
          </div>
        </div>

        {/* Visual Indicators */}
        {indicators.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {indicators.map((indicator, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={indicator.color}
                title={indicator.description}
              >
                {indicator.emoji} {indicator.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Time Remaining */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className={`text-sm ${timeRemaining.color}`}>
              {timeRemaining.text}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Floor: ${offer.floorPrice.toLocaleString()}
          </div>
        </div>

        {/* Quick Actions */}
        {showQuickActions && offer.status === 'pending' && (
          <div className="space-y-2">
            {/* Primary Actions */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onAction('accept')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onAction('decline')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>

            {/* Quick Counter Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickCounter(5)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                +5%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickCounter(10)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                +10%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickCounter(15)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                +15%
              </Button>
            </div>
          </div>
        )}

        {/* Mobile Swipe Instructions */}
        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-blue-300">
            <TrendingUp className="w-3 h-3" />
            <span>Mobile: Swipe right to accept, left to decline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OfferIndicators 