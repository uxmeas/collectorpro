import React from 'react'
import { TrendingUp, TrendingDown, ExternalLink, Heart, MoreHorizontal, Copy, Star } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils'
import { MomentImageCompact } from "@/components/ui/MomentImage"

// Price Cell Component
export function PriceCell({ 
  value, 
  change, 
  changePercent, 
  currency = 'USD',
  className 
}: {
  value: number
  change?: number
  changePercent?: number
  currency?: string
  className?: string
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price)
  }

  const isPositive = changePercent ? changePercent >= 0 : change ? change >= 0 : true

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-semibold text-white">
        {formatPrice(value)}
      </span>
      {(change !== undefined || changePercent !== undefined) && (
        <div className={cn(
          "flex items-center gap-1 text-xs",
          isPositive ? "text-green-400" : "text-red-400"
        )}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {changePercent !== undefined && (
            <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
          )}
          {change !== undefined && (
            <span>({formatPrice(Math.abs(change))})</span>
          )}
        </div>
      )}
    </div>
  )
}

// Number Cell Component
export function NumberCell({ 
  value, 
  format = 'default',
  suffix,
  prefix,
  decimals,
  className 
}: {
  value: number
  format?: 'default' | 'compact' | 'percentage'
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}) {
  const formatNumber = (num: number) => {
    if (format === 'compact') {
      if (num >= 1000000) return (num / 1000000).toFixed(decimals || 1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(decimals || 1) + 'K'
      return num.toString()
    }
    
    if (format === 'percentage') {
      return (num * 100).toFixed(decimals || 2) + '%'
    }
    
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals || 0,
      maximumFractionDigits: decimals || 2
    })
  }

  return (
    <span className={cn("font-mono", className)}>
      {prefix}{formatNumber(value)}{suffix}
    </span>
  )
}

// Date Cell Component
export function DateCell({ 
  value, 
  format = 'relative',
  className 
}: {
  value: Date | string | number
  format?: 'relative' | 'short' | 'long' | 'time'
  className?: string
}) {
  const date = new Date(value)
  
  const formatDate = () => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (format === 'relative') {
      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
      return date.toLocaleDateString()
    }
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
    
    if (format === 'time') {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
    
    return date.toLocaleDateString()
  }

  return (
    <span className={cn("text-gray-400", className)} title={date.toLocaleString()}>
      {formatDate()}
    </span>
  )
}

// Image Cell Component
export function ImageCell({ 
  src, 
  alt, 
  size = 'sm',
  fallback,
  className 
}: {
  src?: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fallback?: React.ReactNode
  className?: string
}) {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  if (!src && fallback) {
    return (
      <div className={cn(
        "flex items-center justify-center rounded-lg bg-gray-800",
        sizeClasses[size],
        className
      )}>
        {fallback}
      </div>
    )
  }

  if (!src) {
    return fallback ? (
      <div className={cn(
        "rounded-lg flex items-center justify-center bg-gray-800",
        sizeClasses[size],
        className
      )}>
        {fallback}
      </div>
    ) : null
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "rounded-lg object-cover",
        sizeClasses[size],
        className
      )}
      onError={(e) => {
        if (fallback) {
          e.currentTarget.style.display = 'none'
        }
      }}
    />
  )
}

// Badge Cell Component
export function BadgeCell({ 
  value, 
  variant = 'default',
  colorMap,
  className 
}: {
  value: string | number
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  colorMap?: Record<string, string>
  className?: string
}) {
  const getVariantFromValue = (val: string | number) => {
    if (colorMap && colorMap[val.toString()]) {
      return colorMap[val.toString()]
    }
    
    const lowerVal = val.toString().toLowerCase()
    if (['active', 'completed', 'success', 'bullish'].includes(lowerVal)) return 'success'
    if (['pending', 'warning', 'neutral'].includes(lowerVal)) return 'warning'
    if (['error', 'failed', 'bearish'].includes(lowerVal)) return 'error'
    if (['info', 'processing'].includes(lowerVal)) return 'info'
    return 'default'
  }

  const variantClasses = {
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }

  const finalVariant = variant === 'default' ? getVariantFromValue(value) : variant

  return (
    <Badge 
      className={cn(
        variantClasses[finalVariant as keyof typeof variantClasses],
        className
      )}
    >
      {value}
    </Badge>
  )
}

// Player Cell Component (NBA Top Shot specific)
export function PlayerCell({ 
  name, 
  team, 
  image, 
  position,
  className 
}: {
  name: string
  team?: string
  image?: string
  position?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ImageCell 
        src={image || undefined} 
        alt={name} 
        size="md" 
        fallback={<span className="text-lg">{name.charAt(0)}</span>}
      />
      <div>
        <div className="font-medium text-white">{name}</div>
        {(team || position) && (
          <div className="text-sm text-gray-400">
            {position && <span>{position}</span>}
            {team && position && <span> • </span>}
            {team && <span>{team}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// Moment Cell Component (NBA Top Shot specific)
export function MomentCell({ 
  playerName,
  playerImage,
  playType,
  setName,
  serialNumber,
  momentImage,
  rarity = 'Common',
  editionName,
  className 
}: {
  playerName: string
  playerImage?: string
  playType: string
  setName: string
  serialNumber: number
  momentImage?: string
  rarity?: string
  editionName?: string
  className?: string
}) {
  // Generate a consistent moment ID for the image component
  const momentId = `${playerName.replace(/\s+/g, '')}_${serialNumber}`
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <MomentImageCompact
          momentId={momentId}
          playerName={playerName}
          rarity={rarity}
          size={48}
          editionName={editionName}
        />
      </div>
      <div>
        <div className="font-medium text-white">{playerName}</div>
        <div className="text-sm text-gray-400">{playType}</div>
        <div className="text-xs text-gray-500">
          {setName} • #{serialNumber}
        </div>
      </div>
    </div>
  )
}

// Actions Cell Component
export function ActionsCell({ 
  actions,
  onAction,
  className 
}: {
  actions: Array<{
    label: string
    icon?: React.ReactNode
    onClick?: () => void
    href?: string
    variant?: 'default' | 'primary' | 'destructive'
  }>
  onAction?: (action: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant === 'primary' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => {
            action.onClick?.()
            onAction?.(action.label)
          }}
          className={cn(
            "px-2",
            action.variant === 'destructive' && "text-red-400 hover:text-red-300"
          )}
        >
          {action.icon}
          <span className="sr-only">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}

// Link Cell Component
export function LinkCell({ 
  href, 
  children, 
  external = false,
  className 
}: {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        "text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1",
        className
      )}
    >
      {children}
      {external && <ExternalLink className="h-3 w-3" />}
    </a>
  )
}

// Rating Cell Component
export function RatingCell({ 
  value, 
  max = 5, 
  showValue = true,
  className 
}: {
  value: number
  max?: number
  showValue?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < value ? "text-yellow-400 fill-current" : "text-gray-600"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-400">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}

// Copy Cell Component
export function CopyCell({ 
  value, 
  displayValue,
  truncate = true,
  className 
}: {
  value: string
  displayValue?: string
  truncate?: boolean
  className?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const display = displayValue || value
  const truncatedDisplay = truncate && display.length > 12 
    ? `${display.slice(0, 6)}...${display.slice(-4)}`
    : display

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="font-mono text-sm">{truncatedDisplay}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="px-1 h-6"
      >
        {copied ? (
          <span className="text-green-400 text-xs">✓</span>
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}

// Status Indicator Cell
export function StatusCell({ 
  status, 
  pulseOnActive = true,
  className 
}: {
  status: 'active' | 'inactive' | 'pending' | 'error'
  pulseOnActive?: boolean
  className?: string
}) {
  const statusConfig = {
    active: { color: 'bg-green-400', label: 'Active' },
    inactive: { color: 'bg-gray-400', label: 'Inactive' },
    pending: { color: 'bg-yellow-400', label: 'Pending' },
    error: { color: 'bg-red-400', label: 'Error' }
  }

  const config = statusConfig[status]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          config.color,
          pulseOnActive && status === 'active' && "animate-pulse"
        )}
      />
      <span className="text-sm text-gray-400">{config.label}</span>
    </div>
  )
} 