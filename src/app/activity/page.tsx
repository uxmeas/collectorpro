'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronDown, 
  ChevronUp, 
  Search,
  RefreshCw,
  Loader2,
  Grid,
  List
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NBATopShotMoment {
  id: string
  playerName: string
  playDescription: string
  setName: string
  series: string
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Ultimate'
  circulation: number
  serialNumber: number
  supply: number
  lowAsk: number
  highestOffer: number
  owned: number
  inPacks: number
  burned: number
  locked: number
  listed: number
  sales: number
  playerImage: string
  teamName: string
  lastSalePrice?: number
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-gray-700 pb-3 mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-xs font-medium text-gray-300 hover:text-white transition-colors py-2"
      >
        {title}
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  )
}

export default function ActivityPage() {
  const [moments, setMoments] = useState<NBATopShotMoment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const [searchTerm, setSearchTerm] = useState('')
  const [leagueFilter, setLeagueFilter] = useState<'NBA' | 'WNBA' | 'BOTH'>('BOTH')
  const [activeTab, setActiveTab] = useState('MOMENTS')
  const [releaseDate, setReleaseDate] = useState('Latest')
  
  const [filters, setFilters] = useState({
    players: [] as string[],
    teams: [] as string[],
    sets: [] as string[],
    setNames: [] as string[],
    series: [] as string[],
    tier: [] as string[]
  })

  // Fetch real NBA TopShot marketplace data
  const fetchMarketplaceData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      console.log('🔄 Fetching live NBA TopShot marketplace data...')
      
      // This would call the real NBA TopShot marketplace API
      const response = await fetch('/api/flow/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {
            searchTerm,
            league: leagueFilter,
            ...filters
          },
          limit: 50
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setMoments(data.data.moments || [])
        setLastUpdate(new Date())
        console.log(`✅ Loaded ${data.data.moments?.length || 0} live marketplace moments`)
      } else {
        throw new Error(data.message || 'Failed to fetch marketplace data')
      }
    } catch (err) {
      console.error('❌ Error fetching marketplace data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data')
      
      // Fallback demo data that matches the mockup
      setMoments([
        {
          id: '1',
          playerName: 'SHAI GILGEOUS-ALEXANDER',
          playDescription: 'Thunder 2024',
          setName: 'Series 2024-25',
          series: 'Series 2024-25',
          rarity: 'Common',
          circulation: 3000,
          serialNumber: 1234,
          supply: 3000,
          lowAsk: 8.00,
          highestOffer: 1.00,
          owned: 65,
          inPacks: 2035,
          burned: 0,
          locked: 4,
          listed: 3,
          sales: 8,
          playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628983.png',
          teamName: 'Oklahoma City Thunder'
        },
        {
          id: '2', 
          playerName: 'GIANNIS ANTETOKOUNMPO',
          playDescription: 'Bucks 2024',
          setName: 'Series 2024-25',
          series: 'Series 2024-25',
          rarity: 'Rare',
          circulation: 1500,
          serialNumber: 5678,
          supply: 1500,
          lowAsk: 25.00,
          highestOffer: 15.00,
          owned: 32,
          inPacks: 1200,
          burned: 0,
          locked: 8,
          listed: 5,
          sales: 15,
          playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203507.png',
          teamName: 'Milwaukee Bucks'
        },
        {
          id: '3',
          playerName: 'DEAARON FOX', 
          playDescription: 'Kings 2024',
          setName: 'Series 2024-25',
          series: 'Series 2024-25', 
          rarity: 'Legendary',
          circulation: 500,
          serialNumber: 91,
          supply: 500,
          lowAsk: 75.00,
          highestOffer: 50.00,
          owned: 12,
          inPacks: 350,
          burned: 0,
          locked: 15,
          listed: 8,
          sales: 25,
          playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628368.png',
          teamName: 'Sacramento Kings'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchMarketplaceData()
    const interval = setInterval(() => {
      fetchMarketplaceData(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchMarketplaceData()
    }
  }, [filters, searchTerm, leagueFilter])

  const filteredMoments = useMemo(() => {
    return moments.filter(moment => {
      if (searchTerm && !moment.playerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (leagueFilter !== 'BOTH') {
        // Filter by league - for now assume all are NBA
        if (leagueFilter === 'WNBA') return false
      }
      return true
    })
  }, [moments, searchTerm, leagueFilter])

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...(prev[category as keyof typeof prev] as string[]), value]
        : (prev[category as keyof typeof prev] as string[]).filter(item => item !== value)
    }))
  }

  const tabs = ['MOMENTS', 'PACKS', 'LATEST PURCHASES', 'TOP PURCHASES']

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white mb-4">Activity</h1>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-sm font-medium transition-colors pb-2 border-b-2",
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
        {/* Left Sidebar - Exact mockup match */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 min-h-screen">
          {/* Search and Controls */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by players, teams, and sets"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchMarketplaceData()}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
            </div>
            
            {/* League Filter */}
            <div className="flex gap-2">
              {(['NBA', 'WNBA', 'BOTH'] as const).map((league) => (
                <button
                  key={league}
                  onClick={() => setLeagueFilter(league)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded transition-colors",
                    leagueFilter === league
                      ? "bg-white text-gray-900"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  )}
                >
                  {league}
                </button>
              ))}
            </div>
            
            {/* Release Date */}
            <div className="mt-4">
              <select 
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white text-sm rounded px-3 py-2"
              >
                <option value="Latest">Release Date: Latest</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <ScrollArea className="h-[calc(100vh-250px)] p-4">
            <FilterSection title="PLAYERS">
              <div className="space-y-2">
                {['LeBron James', 'Stephen Curry', 'Giannis Antetokounmpo', 'Luka Doncic'].map(player => (
                  <div key={player} className="flex items-center space-x-2">
                    <Checkbox
                      id={player}
                      checked={filters.players.includes(player)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('players', player, e.target.checked)
                      }
                    />
                    <Label htmlFor={player} className="text-xs text-gray-300 cursor-pointer">
                      {player}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="TEAMS">
              <div className="space-y-2">
                {['Lakers', 'Warriors', 'Bucks', 'Mavericks'].map(team => (
                  <div key={team} className="flex items-center space-x-2">
                    <Checkbox
                      id={team}
                      checked={filters.teams.includes(team)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('teams', team, e.target.checked)
                      }
                    />
                    <Label htmlFor={team} className="text-xs text-gray-300 cursor-pointer">
                      {team}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="SETS">
              <div className="space-y-2">
                {['Base Set', 'Rare', 'Legendary'].map(set => (
                  <div key={set} className="flex items-center space-x-2">
                    <Checkbox
                      id={set}
                      checked={filters.sets.includes(set)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('sets', set, e.target.checked)
                      }
                    />
                    <Label htmlFor={set} className="text-xs text-gray-300 cursor-pointer">
                      {set}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="SET NAMES">
              <div className="space-y-2">
                {['2023 NBA PLAYOFFS ROUND', '2024 NBA PLAYOFFS'].map(setName => (
                  <div key={setName} className="flex items-center space-x-2">
                    <Checkbox
                      id={setName}
                      checked={filters.setNames.includes(setName)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('setNames', setName, e.target.checked)
                      }
                    />
                    <Label htmlFor={setName} className="text-xs text-gray-300 cursor-pointer">
                      {setName}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="SERIES">
              <div className="space-y-2">
                {['Series 2024-25', 'Series 2023-24'].map(series => (
                  <div key={series} className="flex items-center space-x-2">
                    <Checkbox
                      id={series}
                      checked={filters.series.includes(series)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('series', series, e.target.checked)
                      }
                    />
                    <Label htmlFor={series} className="text-xs text-gray-300 cursor-pointer">
                      {series}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="TIER">
              <div className="space-y-2">
                {['Common', 'Fandom', 'Rare', 'Legendary', 'Ultimate'].map(tier => (
                  <div key={tier} className="flex items-center space-x-2">
                    <Checkbox
                      id={tier}
                      checked={filters.tier.includes(tier)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFilterChange('tier', tier, e.target.checked)
                      }
                    />
                    <Label htmlFor={tier} className="text-xs text-gray-300 cursor-pointer">
                      {tier}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>
          </ScrollArea>
        </div>

        {/* Main Content - Marketplace Table */}
        <div className="flex-1 bg-gray-900">
          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg m-6">
              <span className="text-red-400 text-sm">Error loading data: {error}</span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-700 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-2">MOMENT</div>
              <div className="col-span-1">SUPPLY</div>
              <div className="col-span-1">LOW ASK</div>
              <div className="col-span-1">HIGHEST OFFER</div>
              <div className="col-span-1">OWNED</div>
              <div className="col-span-1">IN PACKS</div>
              <div className="col-span-1">BURNED</div>
              <div className="col-span-1">LOCKED</div>
              <div className="col-span-1">LISTED</div>
              <div className="col-span-1">SALES</div>
              <div className="col-span-1"></div>
            </div>

            {/* Loading State */}
            {loading && moments.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                  <span className="text-gray-400">Loading live marketplace data...</span>
                </div>
              </div>
            )}

            {/* Moment Rows */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filteredMoments.map((moment) => (
                <div 
                  key={moment.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  {/* MOMENT - Player photo and name */}
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      <img 
                        src={moment.playerImage}
                        alt={moment.playerName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if NBA image fails
                          (e.target as HTMLImageElement).src = '/api/placeholder/48/48'
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {moment.playerName}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {moment.playDescription}
                      </div>
                    </div>
                  </div>

                  {/* SUPPLY */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.supply.toLocaleString()}</span>
                  </div>

                  {/* LOW ASK */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-green-400 font-bold text-sm">
                      ${moment.lowAsk.toFixed(2)}
                    </span>
                  </div>

                  {/* HIGHEST OFFER */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">${moment.highestOffer.toFixed(2)}</span>
                  </div>

                  {/* OWNED */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.owned}</span>
                  </div>

                  {/* IN PACKS */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.inPacks.toLocaleString()}</span>
                  </div>

                  {/* BURNED */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.burned}</span>
                  </div>

                  {/* LOCKED */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.locked}</span>
                  </div>

                  {/* LISTED */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.listed}</span>
                  </div>

                  {/* SALES */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-white text-sm">{moment.sales}</span>
                  </div>

                  {/* BUY NOW */}
                  <div className="col-span-1 flex items-center">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                    >
                      BUY NOW
                    </Button>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!loading && filteredMoments.length === 0 && !error && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No moments found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
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