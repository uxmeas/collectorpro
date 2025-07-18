'use client'

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Grid, List, TrendingUp, TrendingDown, ExternalLink, Heart, AlertCircle, Star, X, Menu, BarChart3 } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Slider } from "@/components/ui/slider"
import { useDebounce } from '@/hooks/useDebounce'
import { discoveryService, DiscoveryMoment, DiscoveryFilters, MarketAnalytics } from '@/lib/discovery-service'
import { UnifiedTable } from '@/components/table/UnifiedTable'
import { momentTableColumns, MomentGridCard, MomentListItem } from '@/components/table/configs/MomentTableConfig'

function DiscoverPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State management
  const [moments, setMoments] = useState<DiscoveryMoment[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('trending')
  const [showFilters, setShowFilters] = useState(false) // Default hidden on mobile
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [marketAnalytics, setMarketAnalytics] = useState<MarketAnalytics | null>(null)
  
  // Filter state
  const [filters, setFilters] = useState<DiscoveryFilters>({
    search: '',
    playTypes: [],
    players: [],
    teams: [],
    sets: [],
    rarityTiers: [],
    series: [],
    priceRange: [0, 5000],
    serialRange: [1, 10000],
    topShotScoreRange: [0, 1000000],
    marketCapRange: [0, 10000000],
    volumeRange: [0, 1000],
    showDealsOnly: false,
    showTrendingOnly: false,
    momentum: [],
    liquidityMin: 0
  })
  
  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 200)
  
  // Initialize from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search')
    const urlSort = searchParams.get('sort')
    const urlDeals = searchParams.get('deals')
    const urlTrending = searchParams.get('trending')
    
    if (urlSearch) {
      setFilters(prev => ({ ...prev, search: urlSearch }))
    }
    if (urlSort) setSortBy(urlSort)
    if (urlDeals === 'true') {
      setFilters(prev => ({ ...prev, showDealsOnly: true }))
    }
    if (urlTrending === 'true') {
      setFilters(prev => ({ ...prev, showTrendingOnly: true }))
    }
    
    // Show filters on desktop by default
    if (window.innerWidth >= 1024) {
      setShowFilters(true)
    }
  }, [searchParams])
  
  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    
    if (filters.search) params.set('search', filters.search)
    if (sortBy !== 'trending') params.set('sort', sortBy)
    if (filters.showDealsOnly) params.set('deals', 'true')
    if (filters.showTrendingOnly) params.set('trending', 'true')
    
    const newUrl = `/discover${params.toString() ? `?${params.toString()}` : ''}`
    router.replace(newUrl, { scroll: false })
  }, [filters, sortBy, router])
  
  // Update URL when relevant state changes
  useEffect(() => {
    const timer = setTimeout(updateURL, 300)
    return () => clearTimeout(timer)
  }, [updateURL])
  
  // Load initial data and analytics
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [momentsData, analyticsData] = await Promise.all([
          discoveryService.searchMoments(filters, sortBy),
          discoveryService.getMarketAnalytics()
        ])
        
        setMoments(momentsData)
        setMarketAnalytics(analyticsData)
      } catch (error) {
        console.error('Failed to load discovery data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [filters, sortBy])
  
  // Handle search suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (debouncedSearch && debouncedSearch.length >= 2) {
        const suggestions = await discoveryService.getSearchSuggestions(debouncedSearch)
        setSearchSuggestions(suggestions)
        setShowSuggestions(true)
      } else {
        setSearchSuggestions([])
        setShowSuggestions(false)
      }
    }
    
    getSuggestions()
  }, [debouncedSearch])
  
  // Filter update helpers
  const updateFilter = <K extends keyof DiscoveryFilters>(key: K, value: DiscoveryFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const toggleArrayFilter = <K extends keyof DiscoveryFilters>(key: K, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [key]: newArray }
    })
  }
  
  const clearAllFilters = () => {
    setFilters({
      search: '',
      playTypes: [],
      players: [],
      teams: [],
      sets: [],
      rarityTiers: [],
      series: [],
      priceRange: [0, 5000],
      serialRange: [1, 10000],
      topShotScoreRange: [0, 1000000],
      marketCapRange: [0, 10000000],
      volumeRange: [0, 1000],
      showDealsOnly: false,
      showTrendingOnly: false,
      momentum: [],
      liquidityMin: 0
    })
  }
  
  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const SAMPLE_TEAMS = [
    { id: 'lal', name: 'Los Angeles Lakers', abbreviation: 'LAL', logo: '🏀' },
    { id: 'gsw', name: 'Golden State Warriors', abbreviation: 'GSW', logo: '⚡' },
    { id: 'mia', name: 'Miami Heat', abbreviation: 'MIA', logo: '🔥' },
    { id: 'bos', name: 'Boston Celtics', abbreviation: 'BOS', logo: '🍀' },
    { id: 'dal', name: 'Dallas Mavericks', abbreviation: 'DAL', logo: '🐎' },
  ]

  const SAMPLE_PLAYERS = [
    { id: '1', name: 'LeBron James', image: '👑' },
    { id: '2', name: 'Stephen Curry', image: '🎯' },
    { id: '3', name: 'Kevin Durant', image: '🐍' },
    { id: '4', name: 'Giannis Antetokounmpo', image: '🦌' },
    { id: '5', name: 'Luka Dončić', image: '🧙' },
  ]

  const PLAY_TYPES = ['Dunk', 'Three Pointer', 'Assist', 'Block', 'Steal', 'Rebound', 'Layup', 'Free Throw']
  const RARITY_TIERS = ['Common', 'Rare', 'Legendary', 'Ultimate']
  const SERIES = ['Series 1', 'Series 2', 'Series 3', 'Series 4']
  const SET_NAMES = ['Base Set', 'Playoffs', 'Rookie Debut', 'Rising Stars', 'Champion', 'Finals']

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1a1a1a]/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold">Discover NBA Top Shot</h1>
              <p className="text-gray-400 text-sm hidden sm:block">Find moments faster than anywhere else</p>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Sort Controls */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-2 lg:px-3 py-2 text-xs lg:text-sm"
              >
                <option value="trending">Trending</option>
                <option value="deals">Best Deals</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="volume">Volume</option>
                <option value="rarity">Rarity</option>
                <option value="recent">Recently Listed</option>
              </select>
              
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-2 lg:px-3"
                size="sm"
              >
                {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>
          
          {/* Market Analytics Bar */}
          {marketAnalytics && !loading && (
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <div className="text-gray-400">Total Volume 24h</div>
                <div className="font-bold text-green-400">{formatPrice(marketAnalytics.totalVolume24h)}</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <div className="text-gray-400">Avg Price</div>
                <div className="font-bold">{formatPrice(marketAnalytics.avgPrice)}</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <div className="text-gray-400">Market Sentiment</div>
                <div className={`font-bold ${
                  marketAnalytics.marketSentiment === 'bullish' ? 'text-green-400' :
                  marketAnalytics.marketSentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {marketAnalytics.marketSentiment.toUpperCase()}
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3">
                <div className="text-gray-400">Active Deals</div>
                <div className="font-bold text-orange-400">{marketAnalytics.bestDeals.length}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-[#1a1a1a] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <FilterContent />
              </div>
            </div>
          )}
          
          {/* Desktop Filter Sidebar */}
          {showFilters && (
            <div className="hidden lg:block w-80 flex-shrink-0">
              <Card className="bg-[#1a1a1a] border-gray-800 sticky top-24">
                <FilterContent />
              </Card>
            </div>
          )}
          
          {/* Main Content - Unified Table */}
          <div className="flex-1">
            <UnifiedTable
              columns={momentTableColumns}
              data={moments}
              loading={loading}
              enableSorting={true}
              enableFiltering={true}
              enableVirtualization={true}
              defaultViewMode={{ mode: 'grid', gridColumns: 4 }}
              searchPlaceholder="Search moments..."
              emptyStateMessage="No moments found"
              loadingMessage="Loading moments..."
              containerHeight={800}
              onRowClick={(moment) => {
                console.log('Clicked moment:', moment.id)
                // Could navigate to moment detail page
              }}
              renderGridCard={(moment, index) => (
                <MomentGridCard
                  moment={moment}
                  index={index}
                  onRowClick={(moment) => console.log('Grid card clicked:', moment.id)}
                />
              )}
              renderListItem={(moment, index) => (
                <MomentListItem
                  moment={moment}
                  index={index}
                  onRowClick={(moment) => console.log('List item clicked:', moment.id)}
                />
              )}
              className="bg-[#0a0a0a]"
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Filter Content Component
  function FilterContent() {
    return (
      <CardContent className="p-6 space-y-6">
        {/* Header with Clear */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            Clear All
          </Button>
        </div>
        
        {/* Search with Suggestions */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Player, team, play type..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 bg-[#0a0a0a] border-gray-700"
            />
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border border-gray-700 rounded-lg mt-1 z-10 max-h-40 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-sm"
                    onClick={() => {
                      updateFilter('search', suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Quick Filters</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.showDealsOnly ? 'primary' : 'outline'}
              size="sm"
              onClick={() => updateFilter('showDealsOnly', !filters.showDealsOnly)}
              className="text-xs"
            >
              🔥 Deals Only
            </Button>
            <Button
              variant={filters.showTrendingOnly ? 'primary' : 'outline'}
              size="sm"
              onClick={() => updateFilter('showTrendingOnly', !filters.showTrendingOnly)}
              className="text-xs"
            >
              📈 Trending
            </Button>
          </div>
        </div>
        
        {/* Play Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Play Type</label>
          <div className="grid grid-cols-2 gap-2">
            {PLAY_TYPES.map(playType => (
              <Button
                key={playType}
                variant={filters.playTypes.includes(playType) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter('playTypes', playType)}
                className="justify-start text-xs"
              >
                {playType}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Players */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Players</label>
          <div className="space-y-2">
            {SAMPLE_PLAYERS.map(player => (
              <Button
                key={player.id}
                variant={filters.players.includes(player.name) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter('players', player.name)}
                className="w-full justify-start text-left"
              >
                <span className="mr-2">{player.image}</span>
                <span className="text-xs">{player.name}</span>
              </Button>
            ))}
          </div>
        </div>
        
        {/* Teams */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Teams</label>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_TEAMS.map(team => (
              <Button
                key={team.id}
                variant={filters.teams.includes(team.name) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter('teams', team.name)}
                className="justify-start text-xs"
              >
                <span className="mr-1">{team.logo}</span>
                {team.abbreviation}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Rarity */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Rarity</label>
          <div className="space-y-2">
            {RARITY_TIERS.map(rarity => (
              <Button
                key={rarity}
                variant={filters.rarityTiers.includes(rarity) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter('rarityTiers', rarity)}
                className="w-full justify-start text-xs"
              >
                {rarity}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Price Range</label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              max={5000}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>
        
        {/* Serial Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Serial Number</label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.serialRange[0]}
              onChange={(e) => updateFilter('serialRange', [parseInt(e.target.value) || 1, filters.serialRange[1]])}
              className="bg-[#0a0a0a] border-gray-700 text-xs"
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.serialRange[1]}
              onChange={(e) => updateFilter('serialRange', [filters.serialRange[0], parseInt(e.target.value) || 10000])}
              className="bg-[#0a0a0a] border-gray-700 text-xs"
            />
          </div>
        </div>
      </CardContent>
    )
  }
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DiscoverPageContent />
    </Suspense>
  )
} 