import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Database, Zap, AlertTriangle } from 'lucide-react'

interface DataSourceBadgeProps {
  isReal: boolean
  source: 'Flow' | 'TopShot' | 'Demo' | 'Ethereum' | 'AllDay'
  lastUpdated?: string
  reliability?: number
  className?: string
}

export function DataSourceBadge({ 
  isReal, 
  source, 
  lastUpdated, 
  reliability = 100,
  className = '' 
}: DataSourceBadgeProps) {
  const getBadgeVariant = () => {
    if (isReal) {
      if (reliability >= 90) return 'default'
      if (reliability >= 70) return 'secondary'
      return 'destructive'
    }
    return 'outline'
  }

  const getIcon = () => {
    if (isReal) {
      if (reliability >= 90) return <Zap className="w-3 h-3" />
      return <Database className="w-3 h-3" />
    }
    return <AlertTriangle className="w-3 h-3" />
  }

  const getText = () => {
    if (isReal) {
      return `${source} Live`
    }
    return `${source} Demo`
  }

  const getColor = () => {
    if (isReal) {
      if (reliability >= 90) return 'text-green-400'
      if (reliability >= 70) return 'text-yellow-400'
      return 'text-red-400'
    }
    return 'text-gray-400'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant={getBadgeVariant()} className="flex items-center space-x-1">
        {getIcon()}
        <span className={getColor()}>{getText()}</span>
      </Badge>
      {lastUpdated && (
        <span className="text-xs text-gray-500">
          Updated {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      )}
    </div>
  )
} 