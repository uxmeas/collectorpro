'use client'

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trophy,
  Gauge,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Activity
} from 'lucide-react'
import { Platform, PortfolioMetrics } from '@/types/multi-platform'
import { 
  formatBloombergCurrency, 
  formatBloombergPercentage, 
  formatBloombergNumber,
  getBloombergColor,
  formatBloombergTimestamp,
  generateBloombergMetrics,
  formatBloombergValue,
  BloombergMetric
} from '@/lib/bloomberg-utils'

interface BloombergHeaderBarProps {
  portfolioData: PortfolioMetrics | null
  selectedPlatform: Platform
  onRefresh: () => void
  onExport: () => void
  isRefreshing?: boolean
}

const BloombergHeaderBar: React.FC<BloombergHeaderBarProps> = ({
  portfolioData,
  selectedPlatform,
  onRefresh,
  onExport,
  isRefreshing = false
}) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLive, setIsLive] = useState(true)

  // Update timestamp when data refreshes
  useEffect(() => {
    if (!isRefreshing) {
      setLastUpdate(new Date())
    }
  }, [isRefreshing])

  // Generate Bloomberg metrics using utility function
  const metrics = generateBloombergMetrics(portfolioData)

  // Get Bloomberg color class
  const getBloombergColorClass = (value: number): string => {
    const color = getBloombergColor(value)
    return `bloomberg-${color}`
  }

  // Get icon for metric
  const getMetricIcon = (label: string) => {
    switch (label) {
      case 'PORTFOLIO': return DollarSign
      case 'P&L': return TrendingUp
      case 'ROI': return Gauge
      case 'ASSETS': return Trophy
      case 'PACKS': return Database
      default: return Activity
    }
  }

  return (
    <div className="bloomberg-header">
      {/* Bloomberg Metrics Row */}
      <div className="flex items-center justify-between gap-4 flex-1">
        {metrics.map((metric, index) => {
          const Icon = getMetricIcon(metric.label)
          const colorClass = getBloombergColorClass(metric.value)
          
          return (
            <div key={index} className="bloomberg-metric">
              {/* Metric Icon and Label */}
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="bloomberg-metric-label">{metric.label}</span>
              </div>
              
              {/* Main Value */}
              <div className={`bloomberg-metric-value ${colorClass}`}>
                {formatBloombergValue(metric.value, metric.format)}
              </div>
              
              {/* Change Indicator (if available) */}
              {metric.change !== undefined && (
                <div className={`bloomberg-metric-change ${getBloombergColorClass(metric.change)}`}>
                  {metric.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : metric.change < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  <span>
                    {formatBloombergValue(metric.change, metric.format)}
                    {metric.changePeriod && ` ${metric.changePeriod}`}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bloomberg Action Bar */}
      <div className="flex items-center gap-4 border-l border-gray-700 pl-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 bloomberg-pulse' : 'bg-red-400'}`}></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {isLive ? 'Live' : 'Offline'}
          </span>
        </div>
        
        {/* Last Update */}
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Clock className="w-3 h-3" />
          <span>{formatBloombergTimestamp(lastUpdate)}</span>
        </div>
        
        {/* Platform Indicator */}
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <span className="font-bold uppercase tracking-wider">{selectedPlatform}</span>
          {selectedPlatform === 'all' && (
            <span className="text-xs opacity-75">(Multi)</span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`bloomberg-button ${isRefreshing ? 'refreshing' : ''}`}
            title="Refresh Data"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button
            onClick={onExport}
            className="bloomberg-button"
            title="Export Data"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BloombergHeaderBar 