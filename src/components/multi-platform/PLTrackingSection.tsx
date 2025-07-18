'use client'

import React, { useMemo } from 'react'
import { Activity, Asset, PLTrackingSectionProps } from '@/types/multi-platform'
import { PLATFORM_CONFIGS } from '@/lib/multi-platform-service'
import { Card } from '@/components/ui/Card'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  BarChart3,
  Target,
  Trophy,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Calendar,
  TrendingUpIcon,
  TrendingDownIcon
} from 'lucide-react'

export const PLTrackingSection: React.FC<PLTrackingSectionProps> = ({
  activities,
  assets,
  platform
}) => {
  const config = PLATFORM_CONFIGS[platform]

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  // Calculate comprehensive P&L metrics
  const plMetrics = useMemo(() => {
    const buyActivities = activities.filter(a => a.type === 'buy' && a.asset)
    const sellActivities = activities.filter(a => a.type === 'sell' && a.asset)
    
    let totalInvested = 0
    let currentValue = 0
    let unrealizedGains = 0
    let realizedGains = 0
    let bestInvestment: { asset: any; profit: number; percentage: number } | null = null
    let worstInvestment: { asset: any; profit: number; percentage: number } | null = null
    let totalTransactions = 0
    let profitableTransactions = 0

    // Calculate unrealized gains/losses from current assets
    assets.forEach(asset => {
      const purchasePrice = asset.acquisitionPrice || 0
      const currentPrice = asset.currentPrice || 0
      
      totalInvested += purchasePrice
      currentValue += currentPrice
      
      const profit = currentPrice - purchasePrice
      unrealizedGains += profit
      
      const percentage = purchasePrice > 0 ? (profit / purchasePrice) * 100 : 0
      
      if (!bestInvestment || percentage > bestInvestment.percentage) {
        bestInvestment = {
          asset,
          profit,
          percentage
        }
      }
      
      if (!worstInvestment || percentage < worstInvestment.percentage) {
        worstInvestment = {
          asset,
          profit,
          percentage
        }
      }
    })

    // Calculate realized gains/losses from sold items
    sellActivities.forEach(activity => {
      if (activity.asset) {
        const sellPrice = activity.amount || 0
        const purchasePrice = activity.asset.acquisitionPrice || 0
        const profit = sellPrice - purchasePrice
        realizedGains += profit
        totalTransactions++
        
        if (profit > 0) {
          profitableTransactions++
        }
      }
    })

    const totalGains = unrealizedGains + realizedGains
    const totalROI = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0
    const winRate = totalTransactions > 0 ? (profitableTransactions / totalTransactions) * 100 : 0

    return {
      totalInvested,
      currentValue,
      unrealizedGains,
      realizedGains,
      totalGains,
      totalROI,
      bestInvestment: bestInvestment as { asset: { player: string; serialNumber: string }; profit: number; percentage: number } | null,
      worstInvestment: worstInvestment as { asset: { player: string; serialNumber: string }; profit: number; percentage: number } | null,
      totalTransactions,
      profitableTransactions,
      winRate
    }
  }, [activities, assets])

  // Calculate 7-day and 30-day performance
  const performanceMetrics = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const recentActivities = activities.filter(a => new Date(a.timestamp) >= sevenDaysAgo)
    const monthlyActivities = activities.filter(a => new Date(a.timestamp) >= thirtyDaysAgo)

    // Simulate performance based on activity volume and recent market trends
    const recentGains = recentActivities.reduce((sum, activity) => {
      if (activity.type === 'sell' && activity.asset) {
        const sellPrice = activity.amount || 0
        const purchasePrice = activity.asset.acquisitionPrice || 0
        return sum + (sellPrice - purchasePrice)
      }
      return sum
    }, 0)

    const monthlyGains = monthlyActivities.reduce((sum, activity) => {
      if (activity.type === 'sell' && activity.asset) {
        const sellPrice = activity.amount || 0
        const purchasePrice = activity.asset.acquisitionPrice || 0
        return sum + (sellPrice - purchasePrice)
      }
      return sum
    }, 0)

    return {
      sevenDayGains: recentGains,
      thirtyDayGains: monthlyGains,
      sevenDayROI: plMetrics.totalInvested > 0 ? (recentGains / plMetrics.totalInvested) * 100 : 0,
      thirtyDayROI: plMetrics.totalInvested > 0 ? (monthlyGains / plMetrics.totalInvested) * 100 : 0
    }
  }, [activities, plMetrics.totalInvested])

  return (
    <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">P&L Tracking</h3>
          <p className="text-sm text-gray-400">Comprehensive portfolio performance analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Real-time</span>
        </div>
      </div>

      {/* Main P&L Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total Invested</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400">
            {formatValue(plMetrics.totalInvested)}
          </div>
        </div>

        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Current Value</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-400">
            {formatValue(plMetrics.currentValue)}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          plMetrics.unrealizedGains >= 0 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Unrealized</span>
            {plMetrics.unrealizedGains >= 0 ? (
              <TrendingUpIcon className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className={`text-xl font-bold ${
            plMetrics.unrealizedGains >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {plMetrics.unrealizedGains >= 0 ? '+' : ''}{formatValue(plMetrics.unrealizedGains)}
          </div>
          <div className={`text-sm ${
            plMetrics.unrealizedGains >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {plMetrics.totalInvested > 0 ? (plMetrics.unrealizedGains / plMetrics.totalInvested * 100).toFixed(1) : '0'}%
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          plMetrics.realizedGains >= 0 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Realized</span>
            {plMetrics.realizedGains >= 0 ? (
              <Trophy className="w-4 h-4 text-green-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <div className={`text-xl font-bold ${
            plMetrics.realizedGains >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {plMetrics.realizedGains >= 0 ? '+' : ''}{formatValue(plMetrics.realizedGains)}
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Best/Worst Investments */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white">Investment Performance</h4>
          
          {plMetrics.bestInvestment && (
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Best Investment</span>
                <Trophy className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{plMetrics.bestInvestment.asset.player}</div>
                  <div className="text-xs text-gray-400">#{plMetrics.bestInvestment.asset.serialNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">
                    +{formatValue(plMetrics.bestInvestment.profit)}
                  </div>
                  <div className="text-green-400 text-sm">
                    +{plMetrics.bestInvestment.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {plMetrics.worstInvestment && (
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Worst Investment</span>
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{plMetrics.worstInvestment.asset.player}</div>
                  <div className="text-xs text-gray-400">#{plMetrics.worstInvestment.asset.serialNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold">
                    {formatValue(plMetrics.worstInvestment.profit)}
                  </div>
                  <div className="text-red-400 text-sm">
                    {plMetrics.worstInvestment.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trading Statistics */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white">Trading Statistics</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">Total ROI</div>
              <div className={`text-lg font-bold ${
                plMetrics.totalROI >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {plMetrics.totalROI >= 0 ? '+' : ''}{plMetrics.totalROI.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">Win Rate</div>
              <div className="text-lg font-bold text-blue-400">
                {plMetrics.winRate.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">7-Day P&L</div>
              <div className={`text-lg font-bold ${
                performanceMetrics.sevenDayGains >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {performanceMetrics.sevenDayGains >= 0 ? '+' : ''}{formatValue(performanceMetrics.sevenDayGains)}
              </div>
            </div>

            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">30-Day P&L</div>
              <div className={`text-lg font-bold ${
                performanceMetrics.thirtyDayGains >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {performanceMetrics.thirtyDayGains >= 0 ? '+' : ''}{formatValue(performanceMetrics.thirtyDayGains)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Target className="w-4 h-4" />
            <span>{plMetrics.totalTransactions} transactions</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Percent className="w-4 h-4" />
            <span>{plMetrics.profitableTransactions} profitable</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            plMetrics.totalROI >= 0 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {plMetrics.totalROI >= 0 ? '+' : ''}{plMetrics.totalROI.toFixed(1)}% Total ROI
          </div>
        </div>
      </div>
    </Card>
  )
} 