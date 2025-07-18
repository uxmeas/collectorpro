'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '../ui/Card'
import { Button } from '../ui/Button'
import { cn, formatCurrency, formatPercentage } from '../../lib/utils'
import { NBATopShotMoment } from '../../lib/nba-topshot-types'

interface MomentCardProps {
  moment: NBATopShotMoment
  viewMode?: 'grid' | 'list'
  onViewDetails?: (moment: NBATopShotMoment) => void
  onFavorite?: (moment: NBATopShotMoment) => void
  isFavorited?: boolean
  showAnalytics?: boolean
}

export function MomentCard({ 
  moment, 
  viewMode = 'grid',
  onViewDetails,
  onFavorite,
  isFavorited = false,
  showAnalytics = true
}: MomentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isProfit = moment.gainLoss > 0
  const rarityColor = {
    'COMMON': 'bg-gray-500',
    'RARE': 'bg-blue-500',
    'LEGENDARY': 'bg-purple-500',
    'ULTIMATE': 'bg-yellow-500'
  }[moment.rarity] || 'bg-gray-500'

  if (viewMode === 'list') {
    return (
      <Card variant="interactive" className="p-0">
        <div className="flex items-center p-4 space-x-4">
          {/* Image */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="w-full h-full bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
              {!imageError ? (
                <Image
                  src={moment.imageURL || '/placeholder-moment.jpg'}
                  alt={`${moment.playerName} - ${moment.playCategory}`}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] truncate">
                  {moment.playerName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] truncate">
                  {moment.playCategory} • {moment.teamName}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={cn("text-xs px-2 py-1 rounded-full text-white", rarityColor)}>
                    {moment.rarity}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    #{moment.serialNumber}/{moment.totalCirculation}
                  </span>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="font-semibold text-[var(--text-primary)]">
                  {formatCurrency(moment.currentValue)}
                </div>
                {showAnalytics && (
                  <div className={cn(
                    "text-sm font-medium",
                    isProfit ? "text-[var(--success-500)]" : "text-[var(--error-500)]"
                  )}>
                    {isProfit ? '+' : ''}{formatCurrency(moment.gainLoss)} ({formatPercentage(moment.gainLossPercentage)})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFavorite?.(moment)}
              className={cn(isFavorited && "text-red-500")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(moment)}
            >
              View
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="interactive" className="group overflow-hidden">
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative aspect-square bg-[var(--bg-secondary)] overflow-hidden">
          {!imageError ? (
            <Image
              src={moment.imageURL || '/placeholder-moment.jpg'}
              alt={`${moment.playerName} - ${moment.playCategory}`}
              fill
              className={cn(
                "object-cover transition-all duration-300 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onFavorite?.(moment)
                }}
                className={cn(
                  "bg-white/90 hover:bg-white backdrop-blur-sm",
                  isFavorited && "text-red-500"
                )}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </Button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails?.(moment)
                }}
                className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
              >
                View Details
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2">
            <span className={cn("text-xs px-2 py-1 rounded-full text-white font-medium", rarityColor)}>
              {moment.rarity}
            </span>
          </div>

          {showAnalytics && (
            <div className="absolute bottom-2 right-2">
              <div className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                isProfit 
                  ? "bg-[var(--success-500)] text-white" 
                  : "bg-[var(--error-500)] text-white"
              )}>
                {isProfit ? '+' : ''}{formatPercentage(moment.gainLossPercentage)}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[var(--text-primary)] truncate">
                {moment.playerName}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] truncate">
                {moment.playCategory}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[var(--text-secondary)]">Serial</span>
            <span className="font-medium text-[var(--text-primary)]">
              #{moment.serialNumber}/{moment.totalCirculation}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] text-sm">Value</span>
            <div className="text-right">
              <div className="font-semibold text-[var(--text-primary)]">
                {formatCurrency(moment.currentValue)}
              </div>
              {showAnalytics && (
                <div className={cn(
                  "text-xs",
                  isProfit ? "text-[var(--success-500)]" : "text-[var(--error-500)]"
                )}>
                  {isProfit ? '+' : ''}{formatCurrency(moment.gainLoss)}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Grid container for moment cards
export function MomentGrid({ 
  moments, 
  viewMode = 'grid',
  ...cardProps 
}: {
  moments: NBATopShotMoment[]
  viewMode?: 'grid' | 'list'
} & Omit<MomentCardProps, 'moment'>) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {moments.map((moment) => (
          <MomentCard
            key={moment.id}
            moment={moment}
            viewMode="list"
            {...cardProps}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {moments.map((moment) => (
        <MomentCard
          key={moment.id}
          moment={moment}
          viewMode="grid"
          {...cardProps}
        />
      ))}
    </div>
  )
} 