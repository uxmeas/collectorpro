'use client'

import React, { useState, useMemo } from 'react'
import { Pack, PackTrackingProps } from '@/types/multi-platform'
import { PLATFORM_CONFIGS } from '@/lib/multi-platform-service'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock,
  Eye,
  Star,
  Filter,
  Calendar,
  Hash,
  TrendingUpIcon,
  TrendingDownIcon,
  Target,
  Trophy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  BarChart3,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Brain,
  Lightbulb,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2
} from 'lucide-react'

export const PackTracking: React.FC<PackTrackingProps> = ({
  packs,
  platform,
  onPackClick,
  onFollowPack
}) => {
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'unopened' | 'opened' | 'sold'>('all')
  const config = PLATFORM_CONFIGS[platform]

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const packTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - packTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  // Calculate pack P&L metrics
  const calculatePackPL = (pack: Pack) => {
    const purchasePrice = pack.price || 0
    const estimatedValue = pack.estimatedValue || 0
    const sellPrice = pack.sellPrice || 0
    
    let profit = 0
    let percentage = 0
    let isGain = false
    let isLoss = false
    let timing = 'neutral'
    let recommendation = ''

    if (pack.status === 'sold' && sellPrice > 0) {
      // Sold pack analysis
      profit = sellPrice - purchasePrice
      percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0
      isGain = profit > 0
      isLoss = profit < 0
      
      // Market timing analysis
      if (estimatedValue > sellPrice) {
        timing = 'early'
        recommendation = 'Sold too early - contents worth more now'
      } else if (sellPrice > estimatedValue * 1.2) {
        timing = 'perfect'
        recommendation = 'Excellent timing - sold at peak value'
      } else if (sellPrice > estimatedValue) {
        timing = 'good'
        recommendation = 'Good timing - sold above estimated value'
      } else {
        timing = 'poor'
        recommendation = 'Could have held longer for better value'
      }
    } else if (pack.status === 'opened') {
      // Opened pack analysis
      profit = estimatedValue - purchasePrice
      percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0
      isGain = profit > 0
      isLoss = profit < 0
      
      if (profit > 0) {
        recommendation = 'Profitable pack - consider holding or selling'
      } else {
        recommendation = 'Underwater pack - consider averaging down'
      }
    } else {
      // Unopened pack analysis
      profit = estimatedValue - purchasePrice
      percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0
      isGain = profit > 0
      isLoss = profit < 0
      
      if (profit > purchasePrice * 0.3) {
        recommendation = 'High potential - consider opening soon'
      } else if (profit > 0) {
        recommendation = 'Moderate potential - monitor market trends'
      } else {
        recommendation = 'Low potential - consider selling unopened'
      }
    }

    return {
      profit,
      percentage,
      isGain,
      isLoss,
      timing,
      recommendation,
      purchasePrice,
      estimatedValue,
      sellPrice
    }
  }

  // Calculate overall pack performance metrics
  const packMetrics = useMemo(() => {
    const soldPacks = packs.filter(p => p.status === 'sold')
    const openedPacks = packs.filter(p => p.status === 'opened')
    const unopenedPacks = packs.filter(p => p.status === 'unopened')
    
    let totalInvested = 0
    let totalValue = 0
    let totalProfit = 0
    let soldProfit = 0
    let openedProfit = 0
    let unopenedProfit = 0
    let bestPack: { pack: Pack; profit: number; percentage: number } | null = null
    let worstPack: { pack: Pack; profit: number; percentage: number } | null = null
    let perfectTiming = 0
    let goodTiming = 0
    let poorTiming = 0

    packs.forEach(pack => {
      const pl = calculatePackPL(pack)
      totalInvested += pl.purchasePrice
      
      if (pack.status === 'sold') {
        totalValue += pl.sellPrice
        soldProfit += pl.profit
        if (pl.timing === 'perfect') perfectTiming++
        else if (pl.timing === 'good') goodTiming++
        else if (pl.timing === 'poor') poorTiming++
      } else if (pack.status === 'opened') {
        totalValue += pl.estimatedValue
        openedProfit += pl.profit
      } else {
        totalValue += pl.estimatedValue
        unopenedProfit += pl.profit
      }
      
      totalProfit += pl.profit
      
      if (!bestPack || pl.percentage > bestPack.percentage) {
        bestPack = { pack, ...pl }
      }
      if (!worstPack || pl.percentage < worstPack.percentage) {
        worstPack = { pack, ...pl }
      }
    })

    const totalROI = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0
    const timingScore = soldPacks.length > 0 ? ((perfectTiming + goodTiming) / soldPacks.length) * 100 : 0

    return {
      totalInvested,
      totalValue,
      totalProfit,
      totalROI,
      soldProfit,
      openedProfit,
      unopenedProfit,
      soldPacks: soldPacks.length,
      openedPacks: openedPacks.length,
      unopenedPacks: unopenedPacks.length,
      bestPack: bestPack as { pack: Pack; profit: number; percentage: number } | null,
      worstPack: worstPack as { pack: Pack; profit: number; percentage: number } | null,
      timingScore,
      perfectTiming,
      goodTiming,
      poorTiming
    }
  }, [packs])

  // Filter packs based on status
  const filteredPacks = useMemo(() => {
    if (filterStatus === 'all') return packs
    return packs.filter(pack => pack.status === filterStatus)
  }, [packs, filterStatus])

  const getPackIcon = (status: Pack['status']) => {
    switch (status) {
      case 'unopened':
        return <Package className="w-4 h-4 text-blue-400" />
      case 'opened':
        return <Eye className="w-4 h-4 text-green-400" />
      case 'sold':
        return <DollarSign className="w-4 h-4 text-purple-400" />
      default:
        return <Package className="w-4 h-4 text-gray-400" />
    }
  }

  const getPackColor = (status: Pack['status']) => {
    switch (status) {
      case 'unopened':
        return 'border-blue-500/20 bg-blue-500/5'
      case 'opened':
        return 'border-green-500/20 bg-green-500/5'
      case 'sold':
        return 'border-purple-500/20 bg-purple-500/5'
      default:
        return 'border-gray-500/20 bg-gray-500/5'
    }
  }

  const getTimingIcon = (timing: string) => {
    switch (timing) {
      case 'perfect':
        return <Trophy className="w-4 h-4 text-yellow-400" />
      case 'good':
        return <TrendingUpIcon className="w-4 h-4 text-green-400" />
      case 'early':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />
      case 'poor':
        return <TrendingDownIcon className="w-4 h-4 text-red-400" />
      default:
        return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'perfect':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'good':
        return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'early':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'poor':
        return 'text-red-400 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Pack Tracking</h3>
          <p className="text-sm text-gray-400">Monitor pack performance and ROI</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-gray-400 border-gray-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="text-sm text-gray-400">
            {filteredPacks.length} packs
          </div>
        </div>
      </div>

      {/* Pack Performance Summary */}
      <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Pack Performance</h4>
          <BarChart3 className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-gray-300">Total Invested</span>
            <span className="text-blue-400 font-medium">
              {formatValue(packMetrics.totalInvested)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-gray-300">Current Value</span>
            <span className="text-green-400 font-medium">
              {formatValue(packMetrics.totalValue)}
            </span>
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg border ${
            packMetrics.totalProfit >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <span className="text-gray-300">Total P&L</span>
            <span className={`font-medium ${
              packMetrics.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {packMetrics.totalProfit >= 0 ? '+' : ''}{formatValue(packMetrics.totalProfit)}
            </span>
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg border ${
            packMetrics.totalROI >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <span className="text-gray-300">Total ROI</span>
            <span className={`font-medium ${
              packMetrics.totalROI >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {packMetrics.totalROI >= 0 ? '+' : ''}{packMetrics.totalROI.toFixed(1)}%
            </span>
          </div>
        </div>
        
        {/* Timing Performance */}
        {packMetrics.soldPacks > 0 && (
          <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Market Timing Score</span>
              <span className="text-sm text-blue-400">{packMetrics.timingScore.toFixed(1)}%</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-400">{packMetrics.perfectTiming} perfect</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUpIcon className="w-3 h-3 text-green-400" />
                <span className="text-gray-400">{packMetrics.goodTiming} good</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDownIcon className="w-3 h-3 text-red-400" />
                <span className="text-gray-400">{packMetrics.poorTiming} poor</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Packs</option>
                <option value="unopened">Unopened</option>
                <option value="opened">Opened</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Pack List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredPacks.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">No Packs Found</h4>
            <p className="text-gray-400">No packs match your current filters</p>
          </div>
        ) : (
          filteredPacks.map((pack) => {
            const pl = calculatePackPL(pack)
            
            return (
              <div
                key={pack.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.01]
                  ${getPackColor(pack.status)}
                `}
              >
                <div className="flex items-start space-x-4">
                  {/* Pack Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                      {getPackIcon(pack.status)}
                    </div>
                  </div>

                  {/* Pack Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">{pack.name}</h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            {config.icon} {pack.platform}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded border ${
                            getTimingColor(pl.timing)
                          }`}>
                            {getTimingIcon(pl.timing)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {formatValue(pack.price)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTimeAgo(pack.purchaseDate)}
                        </div>
                      </div>
                    </div>

                    {/* P&L Information */}
                    <div className="mb-2">
                      <div className={`flex items-center space-x-2 text-sm ${
                        pl.isGain ? 'text-green-400' : pl.isLoss ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        <span>Purchase: {formatValue(pl.purchasePrice)}</span>
                        <span>→</span>
                        {pack.status === 'sold' ? (
                          <>
                            <span>Sold: {formatValue(pl.sellPrice)}</span>
                            <span>→</span>
                            <span className={`flex items-center space-x-1 ${
                              pl.isGain ? 'text-green-400' : pl.isLoss ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              <span>{pl.isGain ? '+' : ''}{formatValue(pl.profit)}</span>
                              <span>({pl.isGain ? '+' : ''}{pl.percentage.toFixed(1)}%)</span>
                              {pl.isGain ? <TrendingUpIcon className="w-3 h-3" /> : pl.isLoss ? <TrendingDownIcon className="w-3 h-3" /> : null}
                            </span>
                          </>
                        ) : (
                          <>
                            <span>Est. Value: {formatValue(pl.estimatedValue)}</span>
                            <span>→</span>
                            <span className={`flex items-center space-x-1 ${
                              pl.isGain ? 'text-green-400' : pl.isLoss ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              <span>{pl.isGain ? '+' : ''}{formatValue(pl.profit)}</span>
                              <span>({pl.isGain ? '+' : ''}{pl.percentage.toFixed(1)}%)</span>
                              {pl.isGain ? <TrendingUpIcon className="w-3 h-3" /> : pl.isLoss ? <TrendingDownIcon className="w-3 h-3" /> : null}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Market Timing Analysis */}
                    {pack.status === 'sold' && (
                      <div className="mb-2 p-2 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Market Timing:</span>
                          <span className={`text-xs font-medium ${
                            pl.timing === 'perfect' ? 'text-yellow-400' :
                            pl.timing === 'good' ? 'text-green-400' :
                            pl.timing === 'early' ? 'text-orange-400' :
                            'text-red-400'
                          }`}>
                            {pl.timing.charAt(0).toUpperCase() + pl.timing.slice(1)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 mt-1">
                          {pl.recommendation}
                        </div>
                      </div>
                    )}

                    {/* Pack Contents */}
                    {pack.contents && pack.contents.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Pack Contents</span>
                          {pack.estimatedValue && (
                            <span className="text-sm text-green-400">
                              Value: {formatValue(pack.estimatedValue)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {pack.contents.slice(0, 3).map((content, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-400">
                              <span>{content.player}</span>
                              <span>•</span>
                              <span>{formatValue(content.currentPrice)}</span>
                            </div>
                          ))}
                          {pack.contents.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{pack.contents.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-400 border-gray-600"
                          onClick={() => onPackClick(pack)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        {pack.status === 'unopened' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className={`border-gray-600 ${
                              pack.isFollowing ? 'text-yellow-400' : 'text-gray-400'
                            }`}
                            onClick={() => onFollowPack(pack.id, !pack.isFollowing)}
                          >
                            <Star className={`w-3 h-3 mr-1 ${pack.isFollowing ? 'fill-current' : ''}`} />
                            {pack.isFollowing ? 'Following' : 'Follow'}
                          </Button>
                        )}
                      </div>
                      
                      {/* Smart Recommendation */}
                      <div className="flex items-center space-x-1">
                        <Lightbulb className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400 font-medium">
                          {pl.recommendation.split(' - ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Best/Worst Pack Performance */}
      {(packMetrics.bestPack || packMetrics.worstPack) && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <h4 className="text-sm font-semibold text-white mb-3">Performance Highlights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packMetrics.bestPack && (
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Best Pack</span>
                  <Trophy className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{packMetrics.bestPack.pack.name}</div>
                    <div className="text-xs text-gray-400">{packMetrics.bestPack.pack.platform}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">
                      +{formatValue(packMetrics.bestPack.profit)}
                    </div>
                    <div className="text-green-400 text-sm">
                      +{packMetrics.bestPack.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {packMetrics.worstPack && (
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Worst Pack</span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{packMetrics.worstPack.pack.name}</div>
                    <div className="text-xs text-gray-400">{packMetrics.worstPack.pack.platform}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">
                      {formatValue(packMetrics.worstPack.profit)}
                    </div>
                    <div className="text-red-400 text-sm">
                      {packMetrics.worstPack.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
} 