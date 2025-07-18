import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Text } from '../atoms/Text'
import { Icon } from '../atoms/Icon'
import { cn } from '@/lib/utils'

export interface PriceDisplayProps {
  price?: number
  amount?: number
  previousPrice?: number
  currency?: string
  showTrend?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceDisplay({
  price,
  amount,
  previousPrice,
  currency = 'USD',
  showTrend = true,
  size = 'md',
  className
}: PriceDisplayProps) {
  // Support both price and amount props
  const displayPrice = price ?? amount ?? 0
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const trend = previousPrice ? displayPrice - previousPrice : 0
  const trendPercentage = previousPrice ? ((trend / previousPrice) * 100) : 0
  const isPositive = trend > 0
  const isNegative = trend < 0

  const textSizeMap = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const
  }

  const iconSizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Text
        size={textSizeMap[size]}
        weight="semibold"
        variant="primary"
      >
        {formatPrice(displayPrice)}
      </Text>

      {showTrend && previousPrice && (
        <div className={cn(
          'flex items-center space-x-1',
          isPositive && 'text-green-400',
          isNegative && 'text-red-400'
        )}>
          <Icon
            icon={isPositive ? TrendingUp : TrendingDown}
            size={iconSizeMap[size]}
            color={isPositive ? 'success' : 'error'}
          />
          <Text
            size={size === 'lg' ? 'md' : 'sm'}
            variant={isPositive ? 'success' : 'error'}
            weight="medium"
          >
            {Math.abs(trendPercentage).toFixed(1)}%
          </Text>
        </div>
      )}
    </div>
  )
} 