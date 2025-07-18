/**
 * Bloomberg Terminal Utility Functions
 * Professional financial data formatting and processing
 */

export interface BloombergMetric {
  label: string
  value: number
  change?: number
  changePeriod?: string
  format: 'currency' | 'number' | 'percentage'
  priority: 'high' | 'medium' | 'low'
  color?: 'positive' | 'negative' | 'neutral' | 'warning' | 'info'
}

/**
 * Format currency values in Bloomberg Terminal style
 * Examples: $1,247,892 → $1.2M, $247,892 → $247.9K
 */
export function formatBloombergCurrency(value: number): string {
  if (value === 0) return '$0'
  
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  
  if (absValue >= 1000000000) {
    return `${sign}$${(absValue / 1000000000).toFixed(1)}B`
  }
  if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(1)}M`
  }
  if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(1)}K`
  }
  
  return `${sign}$${absValue.toLocaleString()}`
}

/**
 * Format percentage values in Bloomberg Terminal style
 * Examples: 0.0561 → +5.61%, -0.0234 → -2.34%
 */
export function formatBloombergPercentage(value: number): string {
  if (value === 0) return '0.00%'
  
  const sign = value > 0 ? '+' : ''
  const formatted = (value * 100).toFixed(2)
  return `${sign}${formatted}%`
}

/**
 * Format large numbers in Bloomberg Terminal style
 * Examples: 1247892 → 1.2M, 247892 → 247.9K
 */
export function formatBloombergNumber(value: number): string {
  if (value === 0) return '0'
  
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  
  if (absValue >= 1000000000) {
    return `${sign}${(absValue / 1000000000).toFixed(1)}B`
  }
  if (absValue >= 1000000) {
    return `${sign}${(absValue / 1000000).toFixed(1)}M`
  }
  if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(1)}K`
  }
  
  return `${sign}${absValue.toLocaleString()}`
}

/**
 * Determine Bloomberg color based on value change
 */
export function getBloombergColor(value: number, threshold: number = 0): 'positive' | 'negative' | 'neutral' {
  if (value > threshold) return 'positive'
  if (value < -threshold) return 'negative'
  return 'neutral'
}

/**
 * Format change value with period indicator
 * Examples: +$12,456 (+5.3%) 24h
 */
export function formatBloombergChange(
  change: number, 
  percentage: number, 
  period: string = '24h'
): string {
  const changeFormatted = formatBloombergCurrency(change)
  const percentageFormatted = formatBloombergPercentage(percentage)
  return `${changeFormatted} (${percentageFormatted}) ${period}`
}

/**
 * Get Bloomberg CSS class based on value and type
 */
export function getBloombergClass(value: number, type: 'color' | 'bg' = 'color'): string {
  const color = getBloombergColor(value)
  return `bloomberg-${type}-${color}`
}

/**
 * Format timestamp in Bloomberg Terminal style
 * Examples: 14:30:45, 2024-01-15 14:30
 */
export function formatBloombergTimestamp(date: Date, includeDate: boolean = false): string {
  const time = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  if (!includeDate) return time
  
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  return `${dateStr} ${time}`
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 1 : 0
  return (newValue - oldValue) / oldValue
}

/**
 * Generate Bloomberg-style metric data from portfolio data
 */
export function generateBloombergMetrics(portfolioData: any): BloombergMetric[] {
  const metrics: BloombergMetric[] = []
  
  if (portfolioData?.totalValue) {
    metrics.push({
      label: 'PORTFOLIO',
      value: portfolioData.totalValue,
      format: 'currency',
      priority: 'high',
      color: 'info'
    })
  }
  
  if (portfolioData?.totalProfit !== undefined) {
    metrics.push({
      label: 'P&L',
      value: portfolioData.totalProfit,
      format: 'currency',
      priority: 'high',
      color: getBloombergColor(portfolioData.totalProfit)
    })
  }
  
  if (portfolioData?.roi !== undefined) {
    metrics.push({
      label: 'ROI',
      value: portfolioData.roi * 100,
      format: 'percentage',
      priority: 'high',
      color: getBloombergColor(portfolioData.roi)
    })
  }
  
  if (portfolioData?.totalAssets) {
    metrics.push({
      label: 'ASSETS',
      value: portfolioData.totalAssets,
      format: 'number',
      priority: 'medium',
      color: 'neutral'
    })
  }
  
  if (portfolioData?.packsTracked) {
    metrics.push({
      label: 'PACKS',
      value: portfolioData.packsTracked,
      format: 'number',
      priority: 'low',
      color: 'info'
    })
  }
  
  return metrics
}

/**
 * Format value based on Bloomberg format type
 */
export function formatBloombergValue(value: number, format: 'currency' | 'number' | 'percentage'): string {
  switch (format) {
    case 'currency':
      return formatBloombergCurrency(value)
    case 'percentage':
      return formatBloombergPercentage(value)
    case 'number':
      return formatBloombergNumber(value)
    default:
      return value.toString()
  }
} 