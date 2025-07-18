'use client'

import React from 'react'
import { Asset, TopAssetsSectionProps } from '@/types/multi-platform'
import { PLATFORM_CONFIGS } from '@/lib/multi-platform-service'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Eye, 
  Star,
  Crown,
  Gem,
  Diamond,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  AlertTriangle,
  TrendingUpIcon,
  BarChart3,
  Flame,
  Trophy
} from 'lucide-react'

export const TopAssetsSection: React.FC<TopAssetsSectionProps> = ({
  assets,
  platform,
  onAssetClick
}) => {
  const config = PLATFORM_CONFIGS[platform]
  const topAssets = assets.slice(0, 3) // Show top 3 most valuable

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'ultimate':
        return <Crown className="w-4 h-4 text-yellow-400" />
      case 'legendary':
        return <Gem className="w-4 h-4 text-purple-400" />
      case 'rare':
        return <Diamond className="w-4 h-4 text-blue-400" />
      default:
        return <Star className="w-4 h-4 text-gray-400" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'ultimate':
        return 'text-yellow-400'
      case 'legendary':
        return 'text-purple-400'
      case 'rare':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const getMarketTrend = (asset: Asset) => {
    // Simulate market trend based on asset data
    const trend = Math.random() > 0.5 ? 'bullish' : 'bearish'
    const percentage = (Math.random() * 20 + 5).toFixed(1)
    return { trend, percentage }
  }

  const getOpportunityScore = (asset: Asset) => {
    // Calculate opportunity score based on various factors
    const roi = asset.roi || 0
    const volume = asset.volume24h || 0
    const rarity = asset.rarity.toLowerCase()
    
    let score = 0
    if (roi > 0.2) score += 30
    if (volume > 50) score += 25
    if (rarity === 'legendary' || rarity === 'ultimate') score += 20
    if (asset.offers && asset.offers.length > 0) score += 15
    if (parseInt(asset.serialNumber) <= 1000) score += 10
    
    return Math.min(score, 100)
  }

  if (topAssets.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{config.icon}</div>
          <h3 className="text-lg font-semibold text-white mb-2">No Assets Found</h3>
          <p className="text-gray-400">No assets available for {config.name}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">🏆 Most Valuable Assets</h3>
          <p className="text-sm text-gray-400">Top performers in your {config.name} collection</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-400">
            Total: {formatValue(topAssets.reduce((sum, asset) => sum + asset.currentPrice, 0))}
          </div>
          <Button size="sm" variant="outline" className="text-gray-400 border-gray-600">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {topAssets.map((asset, index) => {
          const marketTrend = getMarketTrend(asset)
          const opportunityScore = getOpportunityScore(asset)
          
          return (
            <div
              key={asset.id}
              onClick={() => onAssetClick(asset)}
              className="group cursor-pointer"
            >
              <div className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                ${index === 0 
                  ? 'border-yellow-500/50 bg-yellow-500/5 shadow-lg shadow-yellow-500/10' 
                  : index === 1 
                  ? 'border-gray-400/50 bg-gray-400/5 shadow-lg shadow-gray-400/10'
                  : 'border-orange-500/50 bg-orange-500/5 shadow-lg shadow-orange-500/10'
                }
                hover:scale-[1.02] hover:shadow-xl
              `}>
                {/* Rank Badge */}
                <div className={`
                  absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${index === 0 
                    ? 'bg-yellow-500 text-black' 
                    : index === 1 
                    ? 'bg-gray-400 text-black'
                    : 'bg-orange-500 text-white'
                  }
                `}>
                  #{index + 1}
                </div>

                <div className="flex items-start space-x-4">
                  {/* Asset Image */}
                  <div className="relative">
                    <div className="w-16 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden">
                      <img 
                        src={asset.imageUrl} 
                        alt={asset.player}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/300/400'
                        }}
                      />
                    </div>
                    {/* Platform Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center text-xs">
                      {PLATFORM_CONFIGS[asset.platform].icon}
                    </div>
                    {/* Opportunity Indicator */}
                    {opportunityScore > 70 && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Flame className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Asset Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white truncate">{asset.player}</h4>
                        {getRarityIcon(asset.rarity)}
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {PLATFORM_CONFIGS[asset.platform].name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {formatValue(asset.currentPrice)}
                        </div>
                        <div className={`text-sm ${
                          asset.roi && asset.roi >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {asset.roi && asset.roi >= 0 ? '+' : ''}{(asset.roi || 0) * 100}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <div className="flex items-center space-x-4">
                        <span>{asset.team}</span>
                        <span>#{asset.serialNumber}</span>
                        <span className={getRarityColor(asset.rarity)}>{asset.rarity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {asset.volume24h && asset.volume24h > 0 && (
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                            {asset.volume24h} vol
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Market Trend */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {marketTrend.trend === 'bullish' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          marketTrend.trend === 'bullish' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {marketTrend.trend === 'bullish' ? '+' : '-'}{marketTrend.percentage}% 7d
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-400">{opportunityScore}% opportunity</span>
                      </div>
                    </div>

                    {/* Offers Section */}
                    {asset.offers && asset.offers.length > 0 && (
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">
                            Highest Offer: {formatValue(Math.max(...asset.offers.map(o => o.amount)))}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {asset.offers.length} active offers
                        </div>
                      </div>
                    )}

                    {/* Performance Indicator */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {asset.profit && asset.profit >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          asset.profit && asset.profit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {asset.profit && asset.profit >= 0 ? '+' : ''}{formatValue(Math.abs(asset.profit || 0))} P&L
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500/30 transition-all duration-200 pointer-events-none" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Market Insights */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Market Insights</h4>
          <BarChart3 className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-gray-300">Best Performer</span>
            <span className="text-green-400 font-medium">
              {topAssets[0]?.player} +{((topAssets[0]?.roi || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-gray-300">Total Value</span>
            <span className="text-blue-400 font-medium">
              {formatValue(topAssets.reduce((sum, asset) => sum + asset.currentPrice, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button size="sm" variant="outline" className="text-gray-400 border-gray-600">
            <Zap className="w-4 h-4 mr-2" />
            Quick Sell
          </Button>
          <Button size="sm" variant="outline" className="text-gray-400 border-gray-600">
            <Eye className="w-4 h-4 mr-2" />
            Track Offers
          </Button>
        </div>
        <div className="text-sm text-gray-400">
          {assets.length} total assets
        </div>
      </div>
    </Card>
  )
} 