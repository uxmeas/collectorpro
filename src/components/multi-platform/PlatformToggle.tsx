'use client'

import React from 'react'
import { Platform, PlatformToggleProps } from '@/types/multi-platform'
import { PLATFORM_CONFIGS } from '@/lib/multi-platform-service'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const PlatformToggle: React.FC<PlatformToggleProps> = ({
  selectedPlatform,
  onPlatformChange,
  portfolio
}) => {
  const platforms: Platform[] = ['all', 'topshot', 'allday', 'panini']

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Platforms</h3>
        <div className="text-sm text-gray-400">
          Total: {formatValue(portfolio.combined.totalValue)}
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const config = PLATFORM_CONFIGS[platform]
          const platformData = platform === 'all' 
            ? portfolio.combined 
            : portfolio.platforms[platform]
          
          const isSelected = selectedPlatform === platform
          const hasData = platformData && platformData.totalAssets > 0
          
          return (
            <button
              key={platform}
              onClick={() => onPlatformChange(platform)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 group
                ${isSelected 
                  ? `border-${config.color.replace('#', '')} bg-${config.color.replace('#', '')}/10 shadow-lg shadow-${config.color.replace('#', '')}/25` 
                  : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/30'
                }
                ${!hasData ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              disabled={!hasData}
            >
              {/* Platform Icon */}
              <div className="flex items-center justify-center mb-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                  ${isSelected 
                    ? `bg-${config.color.replace('#', '')} shadow-lg` 
                    : 'bg-gray-700/50 group-hover:bg-gray-600/50'
                  }
                `}>
                  {config.icon}
                </div>
              </div>
              
              {/* Platform Name */}
              <div className="text-center mb-2">
                <div className={`font-semibold text-sm ${
                  isSelected ? 'text-white' : 'text-gray-300'
                }`}>
                  {config.name}
                </div>
                <div className="text-xs text-gray-400">
                  {config.fullName}
                </div>
              </div>
              
              {/* Platform Stats */}
              {hasData && (
                <div className="text-center space-y-1">
                  <div className={`text-lg font-bold ${
                    isSelected ? 'text-white' : 'text-gray-200'
                  }`}>
                    {formatValue(platformData.totalValue)}
                  </div>
                  <div className={`text-xs ${
                    platformData.roi >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {platformData.roi >= 0 ? '+' : ''}{(platformData.roi * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {platformData.totalAssets} assets
                  </div>
                </div>
              )}
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className={`absolute -top-1 -right-1 w-4 h-4 bg-${config.color.replace('#', '')} rounded-full flex items-center justify-center`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
              
              {/* Blockchain Badge */}
              <div className="absolute top-2 left-2">
                <div className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${config.blockchain === 'Flow' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : config.blockchain === 'Ethereum'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }
                `}>
                  {config.blockchain}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Platform Summary */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-400">Total Value</div>
            <div className="text-lg font-bold text-white">
              {formatValue(portfolio.combined.totalValue)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Total P&L</div>
            <div className={`text-lg font-bold ${
              portfolio.combined.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolio.combined.totalProfit >= 0 ? '+' : ''}{formatValue(portfolio.combined.totalProfit)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">ROI</div>
            <div className={`text-lg font-bold ${
              portfolio.combined.roi >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolio.combined.roi >= 0 ? '+' : ''}{(portfolio.combined.roi * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 