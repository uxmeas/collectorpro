'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  ShoppingCart,
  Package,
  ArrowRightLeft,
  Clock,
  DollarSign,
  Users,
  Star,
  Zap,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

// NBA Top Shot Activity Types
type ActivityEvent = 'Sale' | 'Mint' | 'Transfer' | 'Pack Opening' | 'Listing' | 'Delisting'

interface NBATopShotActivity {
  id: string
  type: ActivityEvent
  momentId: string
  playerName: string
  playDescription: string
  setName: string
  series: string
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Ultimate'
  circulation: number
  serialNumber: number
  price?: {
    usd: number
    flow: number
  }
  from: string
  to: string
  timestamp: Date
  transactionHash: string
  blockHeight?: number
  thumbnail?: string
  metadata?: {
    teamName?: string
    gameDate?: string
    playCategory?: string
    videoUrl?: string
  }
}

interface ActivityMetrics {
  totalTransactions: number
  totalVolume: { usd: number; flow: number }
  averagePrice: { usd: number; flow: number }
  uniqueTraders: number
  topPlayer: string
  topSet: string
  priceChange24h: number
  volumeChange24h: number
}

// Utility functions
const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const formatPrice = (price: { usd: number; flow: number }) => ({
  usd: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price.usd),
  flow: `${price.flow.toLocaleString()} FLOW`
})

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common': return 'bg-gray-500'
    case 'Rare': return 'bg-blue-500'
    case 'Legendary': return 'bg-purple-500'
    case 'Ultimate': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const getEventIcon = (event: ActivityEvent) => {
  switch (event) {
    case 'Sale': return <ShoppingCart className="h-4 w-4" />
    case 'Mint': return <Zap className="h-4 w-4" />
    case 'Transfer': return <ArrowRightLeft className="h-4 w-4" />
    case 'Pack Opening': return <Package className="h-4 w-4" />
    case 'Listing': return <TrendingUp className="h-4 w-4" />
    default: return <Activity className="h-4 w-4" />
  }
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-gray-800 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-200 hover:text-white transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<NBATopShotActivity[]>([])
  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const [filters, setFilters] = useState({
    status: [] as string[],
    events: [] as string[],
    priceRange: { min: '', max: '' },
    marketplaces: [] as string[],
    leagues: [] as string[],
    sets: [] as string[]
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch real NBA TopShot activity data
  const fetchActivityData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      // Add filters to params
      if (filters.status.length > 0) {
        params.append('eventTypes', filters.status.join(','))
      }
      if (filters.priceRange.min) {
        params.append('minPrice', filters.priceRange.min)
      }
      if (filters.priceRange.max) {
        params.append('maxPrice', filters.priceRange.max)
      }
      if (filters.sets.length > 0) {
        params.append('sets', filters.sets.join(','))
      }
      
      params.append('limit', '100')
      params.append('offset', '0')

      console.log('🔄 Fetching real NBA TopShot activity data...')
      
      const response = await fetch(`/api/activity?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Transform API data to component format
        const transformedActivities = data.data.transactions.map((tx: any) => ({
          ...tx,
          event: tx.type, // Map 'type' to 'event' for backwards compatibility
          timestamp: new Date(tx.timestamp)
        }))
        
        setActivities(transformedActivities)
        setMetrics(data.data.metrics)
        setLastUpdate(new Date())
        
        console.log(`✅ Loaded ${transformedActivities.length} real NBA TopShot transactions`)
      } else {
        throw new Error(data.message || 'Failed to fetch activity data')
      }
    } catch (err) {
      console.error('❌ Error fetching activity data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load activity data')
      
      // Fallback to some basic data if real API fails
      setActivities([])
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchActivityData()
    
    const interval = setInterval(() => {
      fetchActivityData(false) // Don't show loading spinner for auto-refresh
    }, 30000) // 30 seconds
    
    return () => clearInterval(interval)
  }, []) // Only run on mount

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchActivityData()
    }
  }, [filters])

  // Filter the activities based on current filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Status filter (already applied in API call, but filter locally too)
      if (filters.status.length > 0 && !filters.status.includes(activity.type)) {
        return false
      }
      
      // Search filter
      if (searchTerm && !activity.playerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !activity.playDescription.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Additional local filtering can be added here
      return true
    })
  }, [activities, filters, searchTerm])

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...(prev[category as keyof typeof prev] as string[]), value]
        : (prev[category as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: [],
      events: [],
      priceRange: { min: '', max: '' },
      marketplaces: [],
      leagues: [],
      sets: []
    })
    setSearchTerm('')
  }

  const activeFilterCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length
    if (typeof filter === 'object' && filter.min || filter.max) return count + 1
    return count
  }, 0)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 min-h-screen p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">NBA TopShot Activity</h2>
            <p className="text-gray-400 text-sm">Real-time Flow blockchain transactions</p>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-140px)]">
            {/* Status Filters */}
            <FilterSection title="Transaction Type">
              <div className="space-y-3">
                {['Sale', 'Mint', 'Transfer', 'Pack Opening'].map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={status}
                      checked={filters.status.includes(status)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('status', status, e.target.checked)
                      }
                    />
                    <Label htmlFor={status} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                      {getEventIcon(status as ActivityEvent)}
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price Range">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Min USD"
                    value={filters.priceRange.min}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: e.target.value }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                  <Input
                    placeholder="Max USD"
                    value={filters.priceRange.max}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: e.target.value }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <p className="text-xs text-gray-400">USD price range</p>
              </div>
            </FilterSection>

            {/* NBA TopShot Sets */}
            <FilterSection title="NBA TopShot Sets">
              <div className="space-y-3">
                {['Base Set', 'Rare', 'Legendary', 'Championship', 'Playoffs', 'All-Star', 'Rising Stars'].map(set => (
                  <div key={set} className="flex items-center space-x-2">
                    <Checkbox
                      id={set}
                      checked={filters.sets.includes(set)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('sets', set, e.target.checked)
                      }
                    />
                    <Label htmlFor={set} className="text-sm font-normal cursor-pointer">
                      {set}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-1 flex items-center gap-3">
                  Live NBA TopShot Activity
                  {loading && <Loader2 className="h-5 w-5 animate-spin text-blue-400" />}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">LIVE</span>
                  </div>
                </h1>
                <p className="text-gray-400">Real-time Flow blockchain transactions • Auto-refreshes every 30s</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search players or plays..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-64 bg-gray-800 border-gray-700"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchActivityData()}
                  disabled={loading}
                  className="border-gray-700"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">Error loading activity data: {error}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fetchActivityData()}
                    className="ml-auto text-red-400 hover:text-red-300"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Active filters:</span>
                {filters.status.map(status => (
                  <Badge key={status} variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {status}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('status', status, false)}
                    />
                  </Badge>
                ))}
                {(filters.priceRange.min || filters.priceRange.max) && (
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                    ${filters.priceRange.min || '0'} - ${filters.priceRange.max || '∞'}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: { min: '', max: '' } }))}
                    />
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-gray-400 hover:text-white"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Activity Table */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 text-sm font-medium text-gray-400">
                <div className="col-span-2">EVENT</div>
                <div className="col-span-3">MOMENT</div>
                <div className="col-span-2">PRICE</div>
                <div className="col-span-1">RARITY</div>
                <div className="col-span-1">SERIAL</div>
                <div className="col-span-1">FROM</div>
                <div className="col-span-1">TO</div>
                <div className="col-span-1">TIME</div>
              </div>

              {/* Loading State */}
              {loading && activities.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                    <span className="text-gray-400">Loading real NBA TopShot transactions...</span>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && activities.length === 0 && !error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No transactions found</h3>
                    <p className="text-gray-400">Try adjusting your filters or check back later.</p>
                  </div>
                </div>
              )}

              {/* Activity Rows */}
              {filteredActivities.length > 0 && (
                <ScrollArea className="h-[600px]">
                  {filteredActivities.map((activity, index) => (
                    <div 
                      key={`${activity.id}-${index}`}
                      className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Event */}
                      <div className="col-span-2 flex items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg",
                          activity.type === 'Sale' ? "bg-green-600/20 text-green-400" :
                          activity.type === 'Mint' ? "bg-blue-600/20 text-blue-400" :
                          activity.type === 'Transfer' ? "bg-purple-600/20 text-purple-400" :
                          "bg-gray-600/20 text-gray-400"
                        )}>
                          {getEventIcon(activity.type)}
                        </div>
                        <span className="text-sm font-medium">{activity.type}</span>
                      </div>

                      {/* Moment */}
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={activity.thumbnail} alt={activity.playerName} />
                          <AvatarFallback>{activity.playerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{activity.playerName}</div>
                          <div className="text-xs text-gray-400">{activity.playDescription}</div>
                          <div className="text-xs text-gray-500">{activity.setName}</div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 flex items-center">
                        {activity.price ? (
                          <div>
                            <div className="font-medium text-sm">{formatPrice(activity.price).usd}</div>
                            <div className="text-xs text-gray-400">{formatPrice(activity.price).flow}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </div>

                      {/* Rarity */}
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", getRarityColor(activity.rarity))} />
                          <span className="text-xs">{activity.rarity}</span>
                        </div>
                      </div>

                      {/* Serial Number */}
                      <div className="col-span-1 flex items-center">
                        <span className="text-sm">#{activity.serialNumber}</span>
                      </div>

                      {/* From */}
                      <div className="col-span-1 flex items-center">
                        <span className="text-xs font-mono text-blue-400 cursor-pointer hover:underline">
                          {activity.from.length > 8 ? `${activity.from.substring(0, 6)}...` : activity.from}
                        </span>
                      </div>

                      {/* To */}
                      <div className="col-span-1 flex items-center">
                        <span className="text-xs font-mono text-blue-400 cursor-pointer hover:underline">
                          {activity.to.length > 8 ? `${activity.to.substring(0, 6)}...` : activity.to}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="col-span-1 flex items-center">
                        <span className="text-sm text-gray-400">{formatRelativeTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Footer Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Total Sales</div>
                    <div className="text-lg font-bold">
                      {metrics?.totalTransactions || filteredActivities.filter(a => a.type === 'Sale').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Volume (24h)</div>
                    <div className="text-lg font-bold">
                      {metrics?.totalVolume ? formatPrice(metrics.totalVolume).usd : '—'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <Users className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Unique Traders</div>
                    <div className="text-lg font-bold">
                      {metrics?.uniqueTraders || '—'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600/20 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Avg Sale Price</div>
                    <div className="text-lg font-bold">
                      {metrics?.averagePrice ? formatPrice(metrics.averagePrice).usd : '—'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 