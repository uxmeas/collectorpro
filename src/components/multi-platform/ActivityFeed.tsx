'use client'

import React, { useState, useMemo } from 'react'
import { Activity, ActivityFeedProps, ActivityFilters } from '@/types/multi-platform'
import { PLATFORM_CONFIGS } from '@/lib/multi-platform-service'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Hash,
  TrendingUpIcon,
  TrendingDownIcon,
  Target,
  BarChart3,
  Percent,
  Zap,
  Trophy,
  AlertTriangle,
  Lightbulb
} from 'lucide-react'

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  platform,
  filters,
  onFilterChange
}) => {
  const config = PLATFORM_CONFIGS[platform]
  const [showFilters, setShowFilters] = useState(false)

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return `${Math.floor(diffInHours / 168)}w ago`
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'buy':
        return <ShoppingCart className="w-4 h-4 text-green-400" />
      case 'sell':
        return <DollarSign className="w-4 h-4 text-blue-400" />
      case 'pack_open':
        return <Package className="w-4 h-4 text-purple-400" />
      case 'pack_sell':
        return <TrendingUp className="w-4 h-4 text-orange-400" />
      case 'offer_received':
        return <ArrowUpRight className="w-4 h-4 text-yellow-400" />
      case 'offer_accepted':
        return <ArrowDownRight className="w-4 h-4 text-green-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'buy':
        return 'border-green-500/20 bg-green-500/5'
      case 'sell':
        return 'border-blue-500/20 bg-blue-500/5'
      case 'pack_open':
        return 'border-purple-500/20 bg-purple-500/5'
      case 'pack_sell':
        return 'border-orange-500/20 bg-orange-500/5'
      case 'offer_received':
        return 'border-yellow-500/20 bg-yellow-500/5'
      case 'offer_accepted':
        return 'border-green-500/20 bg-green-500/5'
      default:
        return 'border-gray-500/20 bg-gray-500/5'
    }
  }

  // Calculate P&L for activities
  const calculatePL = (activity: Activity) => {
    if (!activity.asset) return null

    const purchasePrice = activity.amount || activity.asset.acquisitionPrice || 0
    const currentPrice = activity.asset.currentPrice || 0
    const profit = currentPrice - purchasePrice
    const percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0

    return {
      profit,
      percentage,
      isGain: profit > 0,
      isLoss: profit < 0
    }
  }

  // Calculate realized P&L for sold items
  const calculateRealizedPL = (activity: Activity) => {
    if (activity.type !== 'sell' || !activity.asset) return null

    const sellPrice = activity.amount || 0
    const purchasePrice = activity.asset.acquisitionPrice || 0
    const profit = sellPrice - purchasePrice
    const percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0

    return {
      profit,
      percentage,
      isGain: profit > 0,
      isLoss: profit < 0
    }
  }

  // Calculate market timing insights
  const calculateMarketTiming = (activity: Activity) => {
    if (!activity.asset) return null

    const purchasePrice = activity.amount || activity.asset.acquisitionPrice || 0
    const currentPrice = activity.asset.currentPrice || 0
    const priceChange = currentPrice - purchasePrice
    const percentageChange = purchasePrice > 0 ? (priceChange / purchasePrice) * 100 : 0

    let timing = 'neutral'
    let recommendation = ''
    let insight = ''

    if (activity.type === 'sell') {
      // Analyze selling decision
      if (percentageChange > 20) {
        timing = 'excellent'
        recommendation = 'Perfect timing - sold at peak value'
        insight = 'This was a great selling decision'
      } else if (percentageChange > 10) {
        timing = 'good'
        recommendation = 'Good timing - sold for solid profit'
        insight = 'Smart selling decision'
      } else if (percentageChange > 0) {
        timing = 'decent'
        recommendation = 'Decent timing - small profit'
        insight = 'Could have held longer for more profit'
      } else if (percentageChange > -10) {
        timing = 'early'
        recommendation = 'Sold too early - missed potential gains'
        insight = 'Consider holding similar assets longer'
      } else {
        timing = 'poor'
        recommendation = 'Poor timing - significant loss'
        insight = 'Market timing needs improvement'
      }
    } else if (activity.type === 'buy') {
      // Analyze buying decision
      if (percentageChange > 30) {
        timing = 'excellent'
        recommendation = 'Excellent buy - strong appreciation'
        insight = 'Great entry point, consider holding'
      } else if (percentageChange > 15) {
        timing = 'good'
        recommendation = 'Good buy - steady growth'
        insight = 'Solid investment, monitor trends'
      } else if (percentageChange > 0) {
        timing = 'decent'
        recommendation = 'Decent buy - slight gain'
        insight = 'Consider averaging down if confident'
      } else if (percentageChange > -15) {
        timing = 'early'
        recommendation = 'Bought too early - slight decline'
        insight = 'Consider averaging down on dips'
      } else {
        timing = 'poor'
        recommendation = 'Poor timing - significant decline'
        insight = 'This moment has dropped significantly - consider averaging down'
      }
    }

    return {
      timing,
      recommendation,
      insight,
      percentageChange,
      priceChange
    }
  }

  // Calculate performance indicators
  const performanceIndicators = useMemo(() => {
    const buyActivities = activities.filter(a => a.type === 'buy' && a.asset)
    const sellActivities = activities.filter(a => a.type === 'sell' && a.asset)
    
    let totalTransactions = buyActivities.length + sellActivities.length
    let profitableTransactions = 0
    let totalHoldingTime = 0
    let bestTiming: { activity: Activity; percentageChange: number } | null = null
    let worstTiming: { activity: Activity; percentageChange: number } | null = null
    let platformPerformance = {
      topshot: { transactions: 0, profit: 0, roi: 0 },
      allday: { transactions: 0, profit: 0, roi: 0 },
      panini: { transactions: 0, profit: 0, roi: 0 }
    }

    // Calculate transaction performance
    buyActivities.forEach(activity => {
      if (activity.asset) {
        const pl = calculatePL(activity)
        if (pl && pl.isGain) profitableTransactions++
        
        const timing = calculateMarketTiming(activity)
        if (timing) {
          if (!bestTiming || timing.percentageChange > bestTiming.percentageChange) {
            bestTiming = { activity, ...timing }
          }
          if (!worstTiming || timing.percentageChange < worstTiming.percentageChange) {
            worstTiming = { activity, ...timing }
          }
        }

        // Platform performance
        const platform = activity.platform as keyof typeof platformPerformance
        if (platformPerformance[platform]) {
          platformPerformance[platform].transactions++
          platformPerformance[platform].profit += pl?.profit || 0
        }
      }
    })

    sellActivities.forEach(activity => {
      if (activity.asset) {
        const realizedPL = calculateRealizedPL(activity)
        if (realizedPL && realizedPL.isGain) profitableTransactions++
        
        const timing = calculateMarketTiming(activity)
        if (timing) {
          if (!bestTiming || timing.percentageChange > bestTiming.percentageChange) {
            bestTiming = { activity, ...timing }
          }
          if (!worstTiming || timing.percentageChange < worstTiming.percentageChange) {
            worstTiming = { activity, ...timing }
          }
        }

        // Platform performance
        const platform = activity.platform as keyof typeof platformPerformance
        if (platformPerformance[platform]) {
          platformPerformance[platform].transactions++
          platformPerformance[platform].profit += realizedPL?.profit || 0
        }
      }
    })

    // Calculate ROI for each platform
    Object.keys(platformPerformance).forEach(platform => {
      const data = platformPerformance[platform as keyof typeof platformPerformance]
      if (data.transactions > 0) {
        data.roi = data.profit / data.transactions
      }
    })

    const winRate = totalTransactions > 0 ? (profitableTransactions / totalTransactions) * 100 : 0

    return {
      totalTransactions,
      profitableTransactions,
      winRate,
      bestTiming: bestTiming as { activity: Activity; percentageChange: number } | null,
      worstTiming: worstTiming as { activity: Activity; percentageChange: number } | null,
      platformPerformance
    }
  }, [activities])

  // Filter activities based on current filters
  const filteredActivities = useMemo(() => {
    let filtered = activities

    // Filter by type
    if (filters.types.length > 0) {
      filtered = filtered.filter(activity => filters.types.includes(activity.type))
    }

    // Filter by platform
    if (filters.platforms.length > 0 && !filters.platforms.includes('all')) {
      filtered = filtered.filter(activity => filters.platforms.includes(activity.platform))
    }

    // Filter by date range
    const now = new Date()
    switch (filters.dateRange) {
      case '1d':
        filtered = filtered.filter(activity => {
          const activityTime = new Date(activity.timestamp)
          return now.getTime() - activityTime.getTime() <= 24 * 60 * 60 * 1000
        })
        break
      case '7d':
        filtered = filtered.filter(activity => {
          const activityTime = new Date(activity.timestamp)
          return now.getTime() - activityTime.getTime() <= 7 * 24 * 60 * 60 * 1000
        })
        break
      case '30d':
        filtered = filtered.filter(activity => {
          const activityTime = new Date(activity.timestamp)
          return now.getTime() - activityTime.getTime() <= 30 * 24 * 60 * 60 * 1000
        })
        break
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [activities, filters])

  // Calculate portfolio performance metrics
  const portfolioMetrics = useMemo(() => {
    const buyActivities = activities.filter(a => a.type === 'buy' && a.asset)
    const sellActivities = activities.filter(a => a.type === 'sell' && a.asset)
    
    let totalInvested = 0
    let currentValue = 0
    let unrealizedGains = 0
    let realizedGains = 0
    let bestInvestment: { asset: any; profit: number; percentage: number } | null = null
    let worstInvestment: { asset: any; profit: number; percentage: number } | null = null

    // Calculate unrealized gains/losses
    buyActivities.forEach(activity => {
      if (activity.asset) {
        const purchasePrice = activity.amount || activity.asset.acquisitionPrice || 0
        const currentPrice = activity.asset.currentPrice || 0
        
        totalInvested += purchasePrice
        currentValue += currentPrice
        
        const profit = currentPrice - purchasePrice
        unrealizedGains += profit
        
        const percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0
        
        if (!bestInvestment || percentage > bestInvestment.percentage) {
          bestInvestment = {
            asset: activity.asset,
            profit,
            percentage
          }
        }
        
        if (!worstInvestment || percentage < worstInvestment.percentage) {
          worstInvestment = {
            asset: activity.asset,
            profit,
            percentage
          }
        }
      }
    })

    // Calculate realized gains/losses
    sellActivities.forEach(activity => {
      if (activity.asset) {
        const sellPrice = activity.amount || 0
        const purchasePrice = activity.asset.acquisitionPrice || 0
        const profit = sellPrice - purchasePrice
        realizedGains += profit
      }
    })

    const totalGains = unrealizedGains + realizedGains
    const totalROI = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0

    return {
      totalInvested,
      currentValue,
      unrealizedGains,
      realizedGains,
      totalGains,
      totalROI,
      bestInvestment: bestInvestment as { asset: { player: string }; profit: number; percentage: number } | null,
      worstInvestment: worstInvestment as { asset: { player: string }; profit: number; percentage: number } | null
    }
  }, [activities])

  const activityTypes = [
    { value: 'buy', label: 'Buys', icon: ShoppingCart },
    { value: 'sell', label: 'Sells', icon: DollarSign },
    { value: 'pack_open', label: 'Pack Opens', icon: Package },
    { value: 'pack_sell', label: 'Pack Sales', icon: TrendingUp },
    { value: 'offer_received', label: 'Offers', icon: ArrowUpRight }
  ]

  const dateRanges = [
    { value: '1d', label: '1 Day' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: 'all', label: 'All Time' }
  ]

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Activity Feed</h3>
          <p className="text-sm text-gray-400">Recent transactions and pack activity</p>
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
            {filteredActivities.length} activities
          </div>
        </div>
      </div>

      {/* Portfolio Performance Summary */}
      <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-white">Portfolio Performance</h4>
          <BarChart3 className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-gray-300">Total Invested</span>
            <span className="text-blue-400 font-medium">
              {formatValue(portfolioMetrics.totalInvested)}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <span className="text-gray-300">Current Value</span>
            <span className="text-green-400 font-medium">
              {formatValue(portfolioMetrics.currentValue)}
            </span>
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg border ${
            portfolioMetrics.unrealizedGains >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <span className="text-gray-300">Unrealized</span>
            <span className={`font-medium ${
              portfolioMetrics.unrealizedGains >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioMetrics.unrealizedGains >= 0 ? '+' : ''}{formatValue(portfolioMetrics.unrealizedGains)}
              <span className="ml-1">
                ({portfolioMetrics.totalInvested > 0 ? (portfolioMetrics.unrealizedGains / portfolioMetrics.totalInvested * 100).toFixed(1) : '0'}%)
              </span>
            </span>
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg border ${
            portfolioMetrics.realizedGains >= 0 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <span className="text-gray-300">Realized</span>
            <span className={`font-medium ${
              portfolioMetrics.realizedGains >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioMetrics.realizedGains >= 0 ? '+' : ''}{formatValue(portfolioMetrics.realizedGains)}
            </span>
          </div>
        </div>
        
        {/* Best/Worst Investments */}
        {(portfolioMetrics.bestInvestment || portfolioMetrics.worstInvestment) && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {portfolioMetrics.bestInvestment && (
              <div className="flex items-center justify-between p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-gray-300 text-xs">Best: {portfolioMetrics.bestInvestment.asset.player}</span>
                <span className="text-green-400 text-xs font-medium">
                  +{portfolioMetrics.bestInvestment.percentage.toFixed(1)}%
                </span>
              </div>
            )}
            {portfolioMetrics.worstInvestment && (
              <div className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <span className="text-gray-300 text-xs">Worst: {portfolioMetrics.worstInvestment.asset.player}</span>
                <span className="text-red-400 text-xs font-medium">
                  {portfolioMetrics.worstInvestment.percentage.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Performance Indicators */}
        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Performance Indicators</span>
            <BarChart3 className="w-4 h-4 text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <span className="text-gray-300">Win Rate</span>
              <span className="text-blue-400 font-medium">
                {performanceIndicators.winRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <span className="text-gray-300">Transactions</span>
              <span className="text-purple-400 font-medium">
                {performanceIndicators.totalTransactions}
              </span>
            </div>
          </div>
          
          {/* Platform Performance */}
          <div className="mt-2 space-y-1">
            <span className="text-xs text-gray-400">Platform Performance:</span>
            {Object.entries(performanceIndicators.platformPerformance).map(([platform, data]) => {
              if (data.transactions === 0) return null
              return (
                <div key={platform} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 capitalize">{platform}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{data.transactions} tx</span>
                    <span className={`font-medium ${
                      data.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.profit >= 0 ? '+' : ''}{formatValue(data.profit)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Best/Worst Timing */}
          {performanceIndicators.bestTiming && (
            <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Best Timing:</span>
                <span className="text-green-400 font-medium">
                  {performanceIndicators.bestTiming.activity.asset?.player} ({performanceIndicators.bestTiming.percentageChange >= 0 ? '+' : ''}{performanceIndicators.bestTiming.percentageChange.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
          
          {performanceIndicators.worstTiming && (
            <div className="mt-1 p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Worst Timing:</span>
                <span className="text-red-400 font-medium">
                  {performanceIndicators.worstTiming.activity.asset?.player} ({performanceIndicators.worstTiming.percentageChange.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Activity Types */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Activity Types</label>
              <div className="space-y-2">
                {activityTypes.map(type => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type.value)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.types, type.value]
                          : filters.types.filter(t => t !== type.value)
                        onFilterChange({ ...filters, types: newTypes })
                      }}
                      className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                    />
                    <type.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as any })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                size="sm"
                variant="outline"
                className="text-gray-400 border-gray-600"
                onClick={() => onFilterChange({ types: [], platforms: [], dateRange: 'all' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">No Activity Found</h4>
            <p className="text-gray-400">No activities match your current filters</p>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const pl = calculatePL(activity)
            const realizedPL = calculateRealizedPL(activity)
            
            return (
              <div
                key={activity.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.01]
                  ${getActivityColor(activity.type)}
                `}
              >
                <div className="flex items-start space-x-4">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">{activity.description}</h4>
                        {activity.asset && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                              {PLATFORM_CONFIGS[activity.platform].icon} {activity.platform}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {activity.amount && activity.amount > 0 && (
                          <div className="text-lg font-bold text-white">
                            {formatValue(activity.amount)}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          {formatTimeAgo(activity.timestamp)}
                        </div>
                      </div>
                    </div>

                    {/* P&L Information */}
                    {activity.asset && (pl || realizedPL) && (
                      <div className="mb-2">
                        {activity.type === 'buy' && pl && (
                          <div className={`flex items-center space-x-2 text-sm ${
                            pl.isGain ? 'text-green-400' : pl.isLoss ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            <span>Current Floor: {formatValue(activity.asset.currentPrice)}</span>
                            <span>→</span>
                            <span className={`flex items-center space-x-1 ${
                              pl.isGain ? 'text-green-400' : pl.isLoss ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              <span>{pl.isGain ? '+' : ''}{formatValue(pl.profit)}</span>
                              <span>({pl.isGain ? '+' : ''}{pl.percentage.toFixed(1)}%)</span>
                              {pl.isGain ? <TrendingUpIcon className="w-3 h-3" /> : pl.isLoss ? <TrendingDownIcon className="w-3 h-3" /> : null}
                            </span>
                          </div>
                        )}
                        {activity.type === 'sell' && realizedPL && (
                          <div className={`flex items-center space-x-2 text-sm ${
                            realizedPL.isGain ? 'text-green-400' : realizedPL.isLoss ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            <span>Purchase: {formatValue(activity.asset.acquisitionPrice || 0)}</span>
                            <span>→</span>
                            <span className={`flex items-center space-x-1 ${
                              realizedPL.isGain ? 'text-green-400' : realizedPL.isLoss ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              <span>{realizedPL.isGain ? '+' : ''}{formatValue(realizedPL.profit)}</span>
                              <span>({realizedPL.isGain ? '+' : ''}{realizedPL.percentage.toFixed(1)}%)</span>
                              {realizedPL.isGain ? <TrendingUpIcon className="w-3 h-3" /> : realizedPL.isLoss ? <TrendingDownIcon className="w-3 h-3" /> : null}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Market Timing Insights */}
                    {(() => {
                      const timing = calculateMarketTiming(activity)
                      if (!timing) return null
                      
                      const getTimingIcon = (timing: string) => {
                        switch (timing) {
                          case 'excellent':
                            return <Trophy className="w-3 h-3 text-yellow-400" />
                          case 'good':
                            return <TrendingUpIcon className="w-3 h-3 text-green-400" />
                          case 'decent':
                            return <Target className="w-3 h-3 text-blue-400" />
                          case 'early':
                            return <AlertTriangle className="w-3 h-3 text-orange-400" />
                          case 'poor':
                            return <TrendingDownIcon className="w-3 h-3 text-red-400" />
                          default:
                            return <Target className="w-3 h-3 text-gray-400" />
                        }
                      }

                      const getTimingColor = (timing: string) => {
                        switch (timing) {
                          case 'excellent':
                            return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                          case 'good':
                            return 'text-green-400 bg-green-500/10 border-green-500/20'
                          case 'decent':
                            return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                          case 'early':
                            return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                          case 'poor':
                            return 'text-red-400 bg-red-500/10 border-red-500/20'
                          default:
                            return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
                        }
                      }

                      return (
                        <div className="mb-2 p-2 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-400">Market Timing:</span>
                            <div className="flex items-center space-x-1">
                              {getTimingIcon(timing.timing)}
                              <span className={`text-xs font-medium px-2 py-1 rounded border ${
                                getTimingColor(timing.timing)
                              }`}>
                                {timing.timing.charAt(0).toUpperCase() + timing.timing.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-300 mb-1">
                            {timing.recommendation}
                          </div>
                          <div className="text-xs text-blue-400 flex items-center space-x-1">
                            <Lightbulb className="w-3 h-3" />
                            <span>{timing.insight}</span>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Asset Details */}
                    {activity.asset && (
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                        <span>{activity.asset.player}</span>
                        <span>{activity.asset.team}</span>
                        <span>#{activity.asset.serialNumber}</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          {activity.asset.rarity}
                        </span>
                      </div>
                    )}

                    {/* Pack Contents */}
                    {activity.packContents && activity.packContents.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Pack Contents</span>
                          {activity.packValue && (
                            <span className="text-sm text-green-400">
                              Value: {formatValue(activity.packValue)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activity.packContents.slice(0, 3).map((content, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-400">
                              <span>{content.player}</span>
                              <span>•</span>
                              <span>{formatValue(content.currentPrice)}</span>
                            </div>
                          ))}
                          {activity.packContents.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{activity.packContents.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Transaction Hash */}
                    {activity.transactionHash && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Hash className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500 font-mono">
                          {activity.transactionHash.slice(0, 8)}...{activity.transactionHash.slice(-6)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Load More */}
      {filteredActivities.length > 10 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
          <Button size="sm" variant="outline" className="text-gray-400 border-gray-600">
            <Eye className="w-4 h-4 mr-2" />
            Load More Activities
          </Button>
        </div>
      )}
    </Card>
  )
} 