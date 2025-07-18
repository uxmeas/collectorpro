'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
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
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

// NBA Top Shot Activity Types
type ActivityEvent = 'Sale' | 'Mint' | 'Transfer' | 'Pack Opening' | 'Listing' | 'Delisting'

interface NBATopShotActivity {
  id: string
  event: ActivityEvent
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
  thumbnail: string
  marketplaceIcon?: string
}

// Mock NBA Top Shot activity data
const generateMockActivity = (): NBATopShotActivity[] => {
  const players = [
    'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 
    'Luka Dončić', 'Jayson Tatum', 'Joel Embiid', 'Nikola Jokić',
    'Ja Morant', 'Zion Williamson', 'Anthony Davis', 'Kawhi Leonard'
  ]
  
  const plays = [
    'Poster Dunk', 'Crossover', 'Three-Pointer', 'Buzzer Beater', 
    'Block', 'Steal', 'Assist', 'Fadeaway', 'Alley-Oop', 'Stepback'
  ]
  
  const sets = [
    'Base Set', 'Rare', 'Legendary', 'Championship', 'Playoffs', 
    'All-Star', 'Rookie Debut', 'Rising Stars', 'Metallic Gold LE'
  ]
  
  const events: ActivityEvent[] = ['Sale', 'Mint', 'Transfer', 'Pack Opening', 'Listing']
  const rarities: ('Common' | 'Rare' | 'Legendary' | 'Ultimate')[] = ['Common', 'Rare', 'Legendary', 'Ultimate']
  
  const wallets = [
    'c5bb3d', 'pinkman_egg', 'collector99', 'nba_whale', 'topshot_pro',
    'moment_king', 'flow_master', 'hoop_dreams', 'nft_legend', 'crypto_baller'
  ]
  
  return Array.from({ length: 200 }, (_, i) => {
    const event = events[Math.floor(Math.random() * events.length)]
    const rarity = rarities[Math.floor(Math.random() * rarities.length)]
    const hasPrice = event === 'Sale' || event === 'Listing'
    
    return {
      id: `activity-${i}`,
      event,
      momentId: `moment-${i}`,
      playerName: players[Math.floor(Math.random() * players.length)],
      playDescription: plays[Math.floor(Math.random() * plays.length)],
      setName: sets[Math.floor(Math.random() * sets.length)],
      series: `Series ${Math.floor(Math.random() * 4) + 1}`,
      rarity,
      circulation: Math.floor(Math.random() * 50000) + 100,
      serialNumber: Math.floor(Math.random() * 10000) + 1,
      price: hasPrice ? {
        usd: Math.floor(Math.random() * 10000) + 10,
        flow: Math.floor(Math.random() * 1000) + 1
      } : undefined,
      from: wallets[Math.floor(Math.random() * wallets.length)],
      to: wallets[Math.floor(Math.random() * wallets.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)), // Last 7 days
      transactionHash: `0x${Math.random().toString(16).substring(2, 18)}`,
      thumbnail: `/api/placeholder/60/60`,
      marketplaceIcon: event === 'Sale' ? '/topshot-logo.png' : undefined
    }
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
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
  const [activities] = useState<NBATopShotActivity[]>(generateMockActivity())
  const [filters, setFilters] = useState({
    status: [] as string[],
    events: [] as string[],
    priceRange: { min: '', max: '' },
    marketplaces: [] as string[],
    leagues: [] as string[],
    sets: [] as string[]
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Filter the activities based on current filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(activity.event)) {
        return false
      }
      
      // Search filter
      if (searchTerm && !activity.playerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !activity.playDescription.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Price range filter
      if (activity.price && filters.priceRange.min && activity.price.usd < parseInt(filters.priceRange.min)) {
        return false
      }
      if (activity.price && filters.priceRange.max && activity.price.usd > parseInt(filters.priceRange.max)) {
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
            <h2 className="text-xl font-bold mb-2">NBA Top Shot Activity</h2>
            <p className="text-gray-400 text-sm">Real-time Flow blockchain transactions</p>
          </div>

          <ScrollArea className="h-[calc(100vh-140px)]">
            {/* Status Filters */}
            <FilterSection title="Status">
              <div className="space-y-3">
                {['Sale', 'Mint', 'Transfer', 'Pack Opening'].map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={status}
                      checked={filters.status.includes(status)}
                      onChange={(e) => 
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

            {/* Event Filters */}
            <FilterSection title="Event">
              <div className="space-y-3">
                {['Listing', 'Delisting', 'Item Offer', 'Collection Offer'].map(event => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={event}
                      checked={filters.events.includes(event)}
                      onChange={(e) => 
                        handleFilterChange('events', event, e.target.checked)
                      }
                    />
                    <Label htmlFor={event} className="text-sm font-normal cursor-pointer">
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Price">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: e.target.value }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                  <Input
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: e.target.value }
                    }))}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <p className="text-xs text-gray-400">USD price range</p>
              </div>
            </FilterSection>

            {/* Marketplaces */}
            <FilterSection title="Marketplaces">
              <div className="space-y-3">
                {['NBA Top Shot', 'Flowty', 'Matrix World'].map(marketplace => (
                  <div key={marketplace} className="flex items-center space-x-2">
                    <Checkbox
                      id={marketplace}
                      checked={filters.marketplaces.includes(marketplace)}
                      onChange={(e) => 
                        handleFilterChange('marketplaces', marketplace, e.target.checked)
                      }
                    />
                    <Label htmlFor={marketplace} className="text-sm font-normal cursor-pointer">
                      {marketplace}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Leagues */}
            <FilterSection title="Leagues">
              <div className="space-y-3">
                {['NBA', 'WNBA'].map(league => (
                  <div key={league} className="flex items-center space-x-2">
                    <Checkbox
                      id={league}
                      checked={filters.leagues.includes(league)}
                      onChange={(e) => 
                        handleFilterChange('leagues', league, e.target.checked)
                      }
                    />
                    <Label htmlFor={league} className="text-sm font-normal cursor-pointer">
                      {league}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Sets */}
            <FilterSection title="NBA Top Shot Sets">
              <div className="space-y-3">
                {['Base Set', 'Rare', 'Legendary', 'Championship', 'Playoffs', 'All-Star'].map(set => (
                  <div key={set} className="flex items-center space-x-2">
                    <Checkbox
                      id={set}
                      checked={filters.sets.includes(set)}
                      onChange={(e) => 
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
                <h1 className="text-2xl font-bold mb-1">Activity Feed</h1>
                <p className="text-gray-400">Live NBA Top Shot transactions on Flow blockchain</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search players or plays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-gray-800 border-gray-700"
                />
                <Button variant="outline" size="sm" className="border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

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
                <div className="col-span-3">ITEM</div>
                <div className="col-span-2">PRICE</div>
                <div className="col-span-1">RARITY</div>
                <div className="col-span-1">QTY</div>
                <div className="col-span-1">FROM</div>
                <div className="col-span-1">TO</div>
                <div className="col-span-1">TIME</div>
              </div>

              {/* Activity Rows */}
              <ScrollArea className="h-[600px]">
                {filteredActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    {/* Event */}
                    <div className="col-span-2 flex items-center gap-2">
                      <div className={cn(
                        "p-2 rounded-lg",
                        activity.event === 'Sale' ? "bg-green-600/20 text-green-400" :
                        activity.event === 'Mint' ? "bg-blue-600/20 text-blue-400" :
                        activity.event === 'Transfer' ? "bg-purple-600/20 text-purple-400" :
                        "bg-gray-600/20 text-gray-400"
                      )}>
                        {getEventIcon(activity.event)}
                      </div>
                      <span className="text-sm font-medium">{activity.event}</span>
                    </div>

                    {/* Item */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={activity.thumbnail} alt={activity.playerName} />
                        <AvatarFallback>{activity.playerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{activity.playerName}</div>
                        <div className="text-xs text-gray-400">{activity.playDescription}</div>
                        <div className="text-xs text-gray-500">{activity.setName} • #{activity.serialNumber}</div>
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
                        <span className="text-sm">{activity.rarity}</span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm">1</span>
                    </div>

                    {/* From */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-mono text-blue-400 cursor-pointer hover:underline">
                        {activity.from}
                      </span>
                    </div>

                    {/* To */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm font-mono text-blue-400 cursor-pointer hover:underline">
                        {activity.to}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-sm text-gray-400">{formatRelativeTime(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
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
                    <div className="text-lg font-bold">{filteredActivities.filter(a => a.event === 'Sale').length}</div>
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
                    <div className="text-lg font-bold">$2.1M</div>
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
                    <div className="text-sm text-gray-400">Active Traders</div>
                    <div className="text-lg font-bold">1,247</div>
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
                    <div className="text-lg font-bold">$127</div>
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