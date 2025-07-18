'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MomentImageProps {
  momentId: string
  playerName: string
  rarity: string
  size?: number
  className?: string
  showAttribution?: boolean
  showRarityBadge?: boolean
  editionName?: string
}

// Generate actual NBA TopShot moment image URLs using real CDN
function generateNBATopShotImageURL(momentId: string, editionName: string, size: number = 161): string {
  // Real NBA TopShot CDN URL pattern
  // Format: https://assets.nbatopshot.com/resize/editions/[edition_id]/[moment_id]/play_[moment_id]_[edition]_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=[size]&cv=1
  
  // Clean and format the moment ID and edition name
  const cleanMomentId = momentId.replace(/[^a-zA-Z0-9-]/g, '')
  const cleanEditionName = editionName?.replace(/[^a-zA-Z0-9_]/g, '') || 'common'
  
  return `https://assets.nbatopshot.com/resize/editions/${cleanEditionName}/${cleanMomentId}/play_${cleanMomentId}_${cleanEditionName}_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=${size}&cv=1`
}

// Fallback placeholder system for when CDN fails
function generateFallbackImage(momentId: string, playerName: string, rarity: string, size: number = 161): string {
  const seed = momentId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)
  const playerSeed = playerName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4)
  const combinedSeed = `${seed}${playerSeed}`
  
  return `https://picsum.photos/${size}/${size}?random=${combinedSeed}&blur=1`
}

// Rarity color mapping
const rarityColors = {
  'Common': 'bg-gray-500',
  'Fandom': 'bg-green-500',
  'Rare': 'bg-blue-500',
  'Legendary': 'bg-orange-500',
  'Ultimate': 'bg-purple-500'
}

export function MomentImage({ 
  momentId, 
  playerName, 
  rarity, 
  size = 161, 
  className,
  showAttribution = true,
  showRarityBadge = true,
  editionName
}: MomentImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    // Try NBA TopShot CDN first, then fallback to placeholder
    const topShotUrl = generateNBATopShotImageURL(momentId, editionName || 'common', size)
    setImageUrl(topShotUrl)
    setIsLoading(true)
    setHasError(false)
    setIsFallback(false)
  }, [momentId, playerName, rarity, size, editionName])

  // Image caching optimization
  useEffect(() => {
    if (imageUrl && !isFallback) {
      // Preload image for better performance
      const img = new Image()
      img.src = imageUrl
      img.onload = () => {
        // Image loaded successfully, cache it
        if (typeof window !== 'undefined' && 'caches' in window) {
          caches.open('nba-topshot-images').then(cache => {
            cache.add(imageUrl).catch(() => {
              // Silently fail if caching fails
            })
          })
        }
      }
    }
  }, [imageUrl, isFallback])

  const handleImageLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleImageError = () => {
    // If NBA TopShot CDN fails, try fallback
    if (!isFallback) {
      const fallbackUrl = generateFallbackImage(momentId, playerName, rarity, size)
      setImageUrl(fallbackUrl)
      setIsFallback(true)
      setIsLoading(true)
    } else {
      // If fallback also fails, show error state
      setHasError(true)
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {/* Main Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${playerName} NBA TopShot Moment`}
          className="w-full h-full object-cover transition-opacity duration-200"
          style={{ minHeight: size, minWidth: size }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-lg font-bold mb-1">🏀</div>
            <div className="text-white text-xs font-bold">NBA</div>
          </div>
        </div>
      )}
      
      {/* Rarity Badge */}
      {showRarityBadge && !isLoading && !hasError && (
        <div className="absolute top-2 left-2">
          <div className={cn(
            'px-2 py-1 rounded text-xs font-bold text-white shadow-lg',
            rarityColors[rarity as keyof typeof rarityColors] || 'bg-gray-500'
          )}>
            {rarity.charAt(0)}
          </div>
        </div>
      )}
      
      {/* Attribution */}
      {showAttribution && !isLoading && !hasError && (
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded backdrop-blur-sm">
          {isFallback ? 'Placeholder' : 'TopShot'}
        </div>
      )}
      
      {/* Player Name Overlay (for larger images) */}
      {size >= 200 && !isLoading && !hasError && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <div className="text-white text-xs font-medium truncate">
            {playerName}
          </div>
        </div>
      )}
      
      {/* Fair Use Disclaimer (subtle) */}
      {!isFallback && !isLoading && !hasError && (
        <div className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/80 text-white text-xs px-1 py-0.5 rounded text-center max-w-16">
            Fair Use
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for tables
export function MomentImageCompact({ 
  momentId, 
  playerName, 
  rarity, 
  size = 48,
  className,
  editionName
}: Omit<MomentImageProps, 'showAttribution' | 'showRarityBadge'>) {
  return (
    <MomentImage
      momentId={momentId}
      playerName={playerName}
      rarity={rarity}
      size={size}
      className={className}
      showAttribution={false}
      showRarityBadge={false}
      editionName={editionName}
    />
  )
}

// Card version with enhanced styling
export function MomentImageCard({ 
  momentId, 
  playerName, 
  rarity, 
  size = 300,
  className,
  editionName
}: Omit<MomentImageProps, 'showAttribution'>) {
  return (
    <div className={cn('group relative', className)}>
      <MomentImage
        momentId={momentId}
        playerName={playerName}
        rarity={rarity}
        size={size}
        showAttribution={true}
        showRarityBadge={true}
        className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-200"
        editionName={editionName}
      />
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
    </div>
  )
} 