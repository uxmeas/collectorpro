'use client'

import React from 'react'
import { TrendingUp, DollarSign, BarChart3, Activity as ActivityIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Text } from '@/components/design-system/atoms/Text'
import { Badge } from '@/components/ui/badge'
import { Asset, Activity as ActivityType } from '@/types/multi-platform'

interface PortfolioPerformanceProps {
  totalInvested: number
  currentValue: number
  totalProfit: number
  roi: number
  recentActivity: ActivityType[]
  topAssets: Asset[]
}

export const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({
  totalInvested,
  currentValue,
  totalProfit,
  roi,
  recentActivity,
  topAssets
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-600'
    if (value < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPerformanceIcon = (value: number) => {
    if (value > 0) return '📈'
    if (value < 0) return '📉'
    return '➡️'
  }

  const getStatusBadge = (asset: Asset) => {
    const roi = asset.roi || 0
    if (roi > 20) return { text: 'Strong performer', color: 'bg-green-100 text-green-800' }
    if (roi > 0) return { text: 'Performing well', color: 'bg-blue-100 text-blue-800' }
    if (roi > -10) return { text: 'Holding steady', color: 'bg-yellow-100 text-yellow-800' }
    return { text: 'Underperforming', color: 'bg-red-100 text-red-800' }
  }

  const getTimingBadge = (activity: ActivityType) => {
    if (activity.type === 'sell' && activity.asset) {
      const profit = activity.asset.profit || 0
      if (profit > 0) return { text: 'smart timing 🎯', color: 'bg-green-100 text-green-800' }
      return { text: 'timing could improve', color: 'bg-yellow-100 text-yellow-800' }
    }
    return null
  }

  const totalProfitPercentage = (totalProfit / totalInvested) * 100

  return (
    <div className="space-y-6">
      {/* Portfolio Performance Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <Text variant="primary" size="xl" weight="bold" className="text-gray-900">
            Portfolio Performance
          </Text>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <Text variant="secondary" size="sm">
              Real-time tracking across all platforms
            </Text>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Text variant="primary" size="lg" weight="semibold">Total Invested</Text>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <Text variant="primary" size="xl" weight="bold" className="text-gray-900">
              {formatCurrency(totalInvested)}
            </Text>
            <Text variant="secondary" size="sm" className="mt-2">
              Across all platforms
            </Text>
          </Card>

          <Card className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Text variant="primary" size="lg" weight="semibold">Current Value</Text>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
            <Text variant="primary" size="xl" weight="bold" className="text-gray-900">
              {formatCurrency(currentValue)}
            </Text>
            <Text variant="secondary" size="sm" className="mt-2">
              Market prices
            </Text>
          </Card>

          <Card className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Text variant="primary" size="lg" weight="semibold">Total Profit/Loss</Text>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
            <Text 
              variant={totalProfit >= 0 ? "success" : "error"}
              size="xl" 
              weight="bold"
              className="text-gray-900"
            >
              {formatCurrency(totalProfit)}
            </Text>
            <Text 
              variant={totalProfit >= 0 ? "success" : "error"}
              size="sm"
              className="mt-2"
            >
              {formatPercentage(totalProfitPercentage)} ROI
            </Text>
          </Card>
        </div>

        {/* Recent Activity */}
        {recentActivity.length === 0 ? (
          <Card className="bg-white p-6">
            <Text variant="primary" size="lg" weight="bold" className="text-gray-900 mb-4">
              Recent Activity
            </Text>
            <div className="text-center py-8 text-gray-500">
              <ActivityIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <Text variant="secondary" size="md">No recent transactions</Text>
            </div>
          </Card>
        ) : (
          <Card className="bg-white p-6">
            <Text variant="primary" size="lg" weight="bold" className="text-gray-900 mb-4">
              Recent Activity
            </Text>
          
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, index) => {
                const asset = activity.asset
                const timingBadge = getTimingBadge(activity)
                
                return (
                  <div key={activity.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Text variant="primary" size="md" weight="semibold" className="font-semibold text-gray-900">
                          {activity.type === 'buy' ? 'Bought' : 'Sold'} {asset?.player}
                        </Text>
                        <Text variant="secondary" size="sm" className="text-gray-600">
                          {activity.type === 'buy' ? 
                            `Bought: ${formatCurrency(activity.amount || 0)} → Floor: ${formatCurrency(asset?.currentPrice || 0)} (${formatPercentage(asset?.roi || 0)})` :
                            `Sold: ${formatCurrency(activity.amount || 0)} → Floor: ${formatCurrency(asset?.currentPrice || 0)}`
                          }
                        </Text>
                      </div>
                      <div className="text-right">
                        <Text 
                          variant={asset?.profit && asset.profit >= 0 ? "success" : "error"}
                          size="md" 
                          weight="semibold"
                          className={`font-semibold ${getPerformanceColor(asset?.profit || 0)}`}
                        >
                          {formatCurrency(asset?.profit || 0)}
                        </Text>
                        <Text variant="secondary" size="sm" className="text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="space-y-4 mt-6">
              <Text variant="primary" size="lg" weight="bold" className="text-gray-900 mb-4">
                Performance Insights
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text variant="primary" size="md" weight="semibold" className="font-semibold text-gray-900 mb-2">
                    Best Performing Asset
                  </Text>
                  <Text variant="secondary" size="sm" className="text-gray-600">
                    {topAssets[0]?.player} - {formatPercentage(topAssets[0]?.roi || 0)} ROI
                  </Text>
                </div>
                <div>
                  <Text variant="primary" size="md" weight="semibold" className="font-semibold text-gray-900 mb-2">
                    Worst Performing Asset
                  </Text>
                  <Text variant="secondary" size="sm" className="text-gray-600">
                    {topAssets[topAssets.length - 1]?.player} - {formatPercentage(topAssets[topAssets.length - 1]?.roi || 0)} ROI
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        )}
      </Card>

      {/* Performance Insights */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <Text variant="primary" size="lg" weight="bold" className="text-gray-900 mb-4">
          💡 Performance Insights
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <Text variant="primary" size="md" weight="semibold" className="font-semibold text-gray-900 mb-2">
              Best Performer
            </Text>
            {topAssets.length > 0 && (
              <div className="flex items-center gap-2">
                <Text variant="secondary" size="sm" className="text-gray-600">
                  {topAssets[0].player} #{topAssets[0].serialNumber}
                </Text>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  +{formatPercentage(topAssets[0].roi || 0)}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <Text variant="primary" size="md" weight="semibold" className="font-semibold text-gray-900 mb-2">
              Portfolio Health
            </Text>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${roi > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <Text variant="secondary" size="sm" className="text-gray-600">
                {roi > 0 ? 'Profitable' : 'Loss'} portfolio
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 