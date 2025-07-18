import React from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Database, Zap } from 'lucide-react'

interface DataModeToggleProps {
  isRealMode: boolean
  onModeChange: (isReal: boolean) => void
  className?: string
}

export function DataModeToggle({ 
  isRealMode, 
  onModeChange, 
  className = '' 
}: DataModeToggleProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <Switch 
          checked={isRealMode} 
          onCheckedChange={onModeChange}
          className="data-mode-switch"
        />
        <Label htmlFor="data-mode" className="text-sm font-medium">
          {isRealMode ? 'Live Data' : 'Demo Mode'}
        </Label>
      </div>
      
      <Badge variant={isRealMode ? 'default' : 'outline'} className="flex items-center space-x-1">
        {isRealMode ? (
          <>
            <Zap className="w-3 h-3" />
            <span>Real Blockchain Data</span>
          </>
        ) : (
          <>
            <Database className="w-3 h-3" />
            <span>Sample Data</span>
          </>
        )}
      </Badge>
    </div>
  )
} 