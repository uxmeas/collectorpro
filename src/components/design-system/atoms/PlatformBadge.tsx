'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PlatformBadgeProps {
  platform: 'NBA TopShot' | 'Panini NFT' | 'NFL All Day' | 'Soccer Platform' | 'Hockey Platform'
  variant?: 'default' | 'outline' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

const platformConfig = {
  'NBA TopShot': {
    icon: '🏀',
    color: 'blue',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    solidBg: 'bg-blue-500',
    solidText: 'text-white'
  },
  'Panini NFT': {
    icon: '🃏',
    color: 'purple',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    solidBg: 'bg-purple-500',
    solidText: 'text-white'
  },
  'NFL All Day': {
    icon: '🏈',
    color: 'orange',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    solidBg: 'bg-orange-500',
    solidText: 'text-white'
  },
  'Soccer Platform': {
    icon: '⚽',
    color: 'green',
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    solidBg: 'bg-green-500',
    solidText: 'text-white'
  },
  'Hockey Platform': {
    icon: '🏒',
    color: 'red',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    solidBg: 'bg-red-500',
    solidText: 'text-white'
  }
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export function PlatformBadge({ 
  platform, 
  variant = 'default', 
  size = 'md',
  showIcon = true,
  className 
}: PlatformBadgeProps) {
  const config = platformConfig[platform]
  
  if (!config) {
    console.warn(`Unknown platform: ${platform}`)
    return null
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'solid':
        return `${config.solidBg} ${config.solidText} border-0`
      case 'outline':
        return `bg-transparent ${config.textColor} ${config.borderColor} border`
      default:
        return `${config.bgColor} ${config.textColor} ${config.borderColor} border`
    }
  }

  return (
    <Badge 
      className={cn(
        'font-medium transition-all duration-200 hover:scale-105',
        sizeClasses[size],
        getVariantClasses(),
        className
      )}
      data-platform={platform.toLowerCase().replace(/\s+/g, '-')}
      data-testid="platform-badge"
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {platform}
    </Badge>
  )
}

// Compact version for tables and small spaces
export function PlatformBadgeCompact({ 
  platform, 
  variant = 'default',
  className 
}: Omit<PlatformBadgeProps, 'size' | 'showIcon'>) {
  return (
    <PlatformBadge
      platform={platform}
      variant={variant}
      size="sm"
      showIcon={false}
      className={className}
    />
  )
}

// Icon-only version for minimal UI
export function PlatformIcon({ 
  platform, 
  size = 'md',
  className 
}: Omit<PlatformBadgeProps, 'variant' | 'showIcon'>) {
  const config = platformConfig[platform]
  
  if (!config) return null

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full',
        config.bgColor,
        iconSizes[size],
        className
      )}
      data-platform={platform.toLowerCase().replace(/\s+/g, '-')}
      data-testid="platform-icon"
      title={platform}
    >
      <span className="text-sm">{config.icon}</span>
    </div>
  )
} 