'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"

interface Platform {
  id: string
  name: string
  description: string
  volume24h: string
  change24h: number
  floorPrice: string
  collections: number
  status?: 'live' | 'coming-soon'
}

const flowPlatforms: Platform[] = [
  {
    id: 'all-flow',
    name: 'All Top Shot',
    description: 'NBA + WNBA Combined Analytics',
    volume24h: '$1.2M',
    change24h: 5.7,
    floorPrice: '$12',
    collections: 847,
    status: 'live'
  },
  {
    id: 'nba-topshot',
    name: 'NBA Top Shot',
    description: "Men's Basketball Moments",
    volume24h: '$987K',
    change24h: 4.2,
    floorPrice: '$15',
    collections: 642,
    status: 'live'
  },
  {
    id: 'wnba',
    name: 'WNBA',
    description: "Women's Basketball Moments",
    volume24h: '$213K',
    change24h: 8.1,
    floorPrice: '$8',
    collections: 205,
    status: 'live'
  }
]

interface ChainSelectorProps {
  selectedPlatform: string
  onPlatformChange: (platformId: string) => void
}

export function ChainSelector({ selectedPlatform, onPlatformChange }: ChainSelectorProps) {
  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Flow Blockchain Platforms</h2>
          <p className="text-gray-400 text-sm mt-1">NBA Top Shot & WNBA Analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm font-medium">Live Flow Data</span>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {flowPlatforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => onPlatformChange(platform.id)}
            className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-blue-500/50 hover:bg-gray-800/30 ${
              selectedPlatform === platform.id
                ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/20'
                : 'border-gray-700 bg-gray-800/20'
            }`}
          >
            {/* Status Badge */}
            {platform.status && (
              <Badge 
                variant={platform.status === 'live' ? 'default' : 'secondary'}
                className={`absolute top-3 right-3 text-xs ${
                  platform.status === 'live' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                }`}
              >
                {platform.status === 'live' ? 'Live' : 'Soon'}
              </Badge>
            )}

            {/* Platform Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-white text-lg">{platform.name}</h3>
                <p className="text-gray-400 text-sm">{platform.description}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-gray-400 text-xs font-medium">24h Volume</p>
                  <p className="text-white font-semibold">{platform.volume24h}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium">24h Change</p>
                  <p className={`font-semibold ${platform.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {platform.change24h >= 0 ? '+' : ''}{platform.change24h}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium">Floor Price</p>
                  <p className="text-white font-semibold">{platform.floorPrice}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium">Collections</p>
                  <p className="text-white font-semibold">{platform.collections.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedPlatform === platform.id && (
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>

      {/* Phase 2 Teaser */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Phase 2: Multi-Blockchain</h4>
            <p className="text-gray-400 text-sm">Panini (Ethereum) + More Platforms Coming Soon</p>
          </div>
          <Badge variant="outline" className="text-gray-400 border-gray-600">
            Coming Soon
          </Badge>
        </div>
      </div>
    </div>
  )
} 