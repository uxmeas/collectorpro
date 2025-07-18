'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  RefreshCw,
  Loader2,
  ExternalLink
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
  
  if (days > 0) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit'
    }).replace(',', ' ')
  }
  if (hours > 0) return `${hours}h ago`
  return `${minutes}m ago`
}

const formatPrice = (price: { usd: number; flow: number }) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price.usd)

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-gray-700 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors"
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
    priceRange: { min: '', max: '' },
    sets: [] as string[]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('LATEST PURCHASES')

  // Fetch real NBA TopShot activity data
  const fetchActivityData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
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
        const transformedActivities = data.data.transactions.map((tx: any) => ({
          ...tx,
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
      setActivities([])
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivityData()
    const interval = setInterval(() => {
      fetchActivityData(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchActivityData()
    }
  }, [filters])

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (filters.status.length > 0 && !filters.status.includes(activity.type)) {
        return false
      }
      
      if (searchTerm && !activity.playerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !activity.playDescription.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
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

  const tabs = ['EXPLORE', 'MOMENTS', 'PACKS', 'LATEST PURCHASES', 'TOP PURCHASES', 'VIP NFTS']

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* NBA TopShot Header Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex items-center gap-8 px-6 py-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-sm font-medium transition-colors pb-4 border-b-2",
                activeTab === tab 
                  ? "text-white border-blue-500" 
                  : "text-gray-400 hover:text-gray-300 border-transparent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-white">Filters</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search moments..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchActivityData()}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
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
                    <Label htmlFor={status} className="text-sm text-gray-300 cursor-pointer">
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

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
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Input
                    placeholder="Max USD"
                    value={filters.priceRange.max}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: e.target.value }
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Sets">
              <div className="space-y-3">
                {['Base Set', 'Rare', 'Legendary', 'Championship', 'Playoffs', 'All-Star'].map(set => (
                  <div key={set} className="flex items-center space-x-2">
                    <Checkbox
                      id={set}
                      checked={filters.sets.includes(set)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('sets', set, e.target.checked)
                      }
                    />
                    <Label htmlFor={set} className="text-sm text-gray-300 cursor-pointer">
                      {set}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>
          </ScrollArea>
        </div>

        {/* Main Content - Exact NBA TopShot Table */}
        <div className="flex-1 bg-gray-900">
          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg m-6">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm">Error loading data: {error}</span>
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

          {/* NBA TopShot Transactions Table */}
          <div className="overflow-x-auto">
            {/* Table Header - Exact NBA TopShot Style */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-2">MOMENT</div>
              <div className="col-span-1">PRICE</div>
              <div className="col-span-2">SERIAL</div>
              <div className="col-span-1">PARALLEL</div>
              <div className="col-span-2">SET</div>
              <div className="col-span-1">SERIES</div>
              <div className="col-span-1">BUYER</div>
              <div className="col-span-1">SELLER</div>
              <div className="col-span-1">DATE/TIME</div>
              <div className="col-span-1">TX</div>
            </div>

            {/* Loading State */}
            {loading && activities.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  <span className="text-gray-400">Loading NBA TopShot transactions...</span>
                </div>
              </div>
            )}

            {/* Transaction Rows - Exact NBA TopShot Style */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filteredActivities.map((activity, index) => (
                <div 
                  key={`${activity.id}-${index}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  {/* MOMENT - Small thumbnail + player name */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      <img 
                        src={activity.thumbnail || '/api/placeholder/48/48'} 
                        alt={activity.playerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium text-sm uppercase tracking-wide truncate">
                        {activity.playerName}
                      </div>
                    </div>
                  </div>

                  {/* PRICE - Green text like NBA TopShot */}
                  <div className="col-span-1 flex items-center">
                    {activity.price ? (
                      <span className="text-green-400 font-bold text-sm">
                        {formatPrice(activity.price)}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">—</span>
                    )}
                  </div>

                  {/* SERIAL - Rarity + Serial Number */}
                  <div className="col-span-2 flex items-center">
                    <div className="text-sm">
                      <div className="text-white">
                        {activity.rarity}
                      </div>
                      <div className="text-gray-400">
                        #{activity.serialNumber}
                      </div>
                    </div>
                  </div>

                  {/* PARALLEL */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-500 text-sm">--</span>
                  </div>

                  {/* SET */}
                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-300 text-sm">{activity.setName}</span>
                  </div>

                  {/* SERIES */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-300 text-sm">{activity.series}</span>
                  </div>

                  {/* BUYER */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-blue-400 text-sm font-mono">
                      @{activity.to.length > 10 ? `${activity.to.substring(0, 8)}...` : activity.to}
                    </span>
                  </div>

                  {/* SELLER */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-blue-400 text-sm font-mono">
                      @{activity.from.length > 10 ? `${activity.from.substring(0, 8)}...` : activity.from}
                    </span>
                  </div>

                  {/* DATE/TIME */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-gray-400 text-xs">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>

                  {/* TX - Transaction Link */}
                  <div className="col-span-1 flex items-center">
                    <ExternalLink className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!loading && filteredActivities.length === 0 && !error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No transactions found</h3>
                    <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
} 