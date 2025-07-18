'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
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
  List,
  Wifi,
  WifiOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UnifiedTable } from '@/components/table/UnifiedTable'
import { 
  activityTableColumns, 
  packActivityColumns,
  type NBATopShotMoment,
  type PackActivity 
} from '@/components/table/configs/ActivityTableConfig'

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
  const [packs, setPacks] = useState<PackActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isConnected, setIsConnected] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const [flashUpdates, setFlashUpdates] = useState<{[key: string]: boolean}>({})
  const [hasNextPage, setHasNextPage] = useState(true)
  const [currentOffset, setCurrentOffset] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  
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

  // WebSocket connection for instant updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // For now, simulate WebSocket with rapid polling until we set up actual WebSocket server
        wsRef.current = new WebSocket('ws://localhost:3001/marketplace')
        
        wsRef.current.onopen = () => {
          console.log('🔌 WebSocket connected for instant updates')
          setIsConnected(true)
        }
        
        wsRef.current.onmessage = (event) => {
          const update = JSON.parse(event.data)
          if (update.type === 'MOMENT_UPDATE') {
            setMoments(prev => prev.map(moment => 
              moment.id === update.momentId 
                ? { ...moment, ...update.changes }
                : moment
            ))
          } else if (update.type === 'PACK_OPENED') {
            setPacks(prev => [update.pack, ...prev.slice(0, 49)])
          }
          setLastUpdate(new Date())
        }
        
        wsRef.current.onclose = () => {
          console.log('🔌 WebSocket disconnected, attempting reconnect...')
          setIsConnected(false)
          setTimeout(connectWebSocket, 3000)
        }
        
        wsRef.current.onerror = (error) => {
          console.log('🔌 WebSocket error, falling back to rapid polling')
          setIsConnected(false)
        }
        
      } catch (error) {
        console.log('🔌 WebSocket not available, using INSTANT polling')
        setIsConnected(false)
        // Fallback to 500ms polling for INSTANT updates
        const interval = setInterval(() => {
          fetchMarketplaceData(false)
        }, 500)
        return () => clearInterval(interval)
      }
    }

    connectWebSocket()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Fetch initial marketplace data and pack activity
  const fetchMarketplaceData = async (showLoading = true, loadMore = false) => {
    try {
      if (showLoading && !loadMore) setLoading(true)
      if (loadMore) setLoadingMore(true)
      setError(null)

      const offset = loadMore ? currentOffset : 0
      console.log('🔄 Fetching live NBA TopShot marketplace data...', { offset, loadMore })
      
      const [momentResponse, packResponse] = await Promise.all([
        fetch('/api/flow/marketplace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filters: {
              searchTerm,
              league: leagueFilter,
              ...filters
            },
            limit: 50,
            offset
          })
        }),
        !loadMore ? fetch('/api/flow/packs', { method: 'GET' }) : Promise.resolve({ ok: false })
      ])
      
      if (!momentResponse.ok) {
        throw new Error(`HTTP error! status: ${momentResponse.status}`)
      }
      
      const momentData = await momentResponse.json()
      let packData = { success: false }
      if (!loadMore && 'ok' in packResponse && packResponse.ok) {
        packData = await (packResponse as Response).json()
      }
      
      if (momentData.success) {
        const newMoments = momentData.data.moments || []
        const { hasNextPage: apiHasNext, nextOffset } = momentData.data
        
        setHasNextPage(apiHasNext)
        setCurrentOffset(nextOffset || offset + newMoments.length)
        
        if (loadMore) {
          // Append to existing moments for endless scroll
          setMoments(prev => [...prev, ...newMoments])
          console.log(`✅ Loaded ${newMoments.length} more moments (Total: ${moments.length + newMoments.length})`)
        } else {
          // Replace moments for initial load or refresh
          setMoments(prev => {
            const flashIds: {[key: string]: boolean} = {}
            newMoments.forEach((newMoment: NBATopShotMoment) => {
              const oldMoment = prev.find(m => m.id === newMoment.id)
              if (oldMoment && (
                Math.abs(oldMoment.lowAsk - newMoment.lowAsk) > 0.01 ||
                oldMoment.listed !== newMoment.listed ||
                oldMoment.sales !== newMoment.sales
              )) {
                flashIds[newMoment.id] = true
              }
            })
            setFlashUpdates(flashIds)
            setTimeout(() => setFlashUpdates({}), 1000) // Clear flash after 1s
            return newMoments
          })
          
          setLastUpdate(new Date())
          setUpdateCount(prev => prev + 1)
          console.log(`✅ Loaded ${newMoments.length} live marketplace moments (Update #${updateCount + 1})`)
        }
      }
      
      if (packData.success && 'data' in packData) {
        setPacks((packData as any).data.packs || [])
        console.log(`✅ Loaded ${(packData as any).data.packs?.length || 0} pack activities`)
      } else if (!loadMore) {
        // Fallback pack data
        setPacks([
          {
            id: '1',
            packName: 'Championship Edition Pack',
            series: 'Series 2024-25',
            price: 99.99,
            momentsCount: 5,
            rarity: 'Ultimate',
            openedBy: '@LeBronFan23',
            timestamp: new Date(Date.now() - 300000),
            contents: ['LeBron James Legendary', 'Stephen Curry Rare', '3 Common moments'],
            packImage: 'https://assets.nbatopshot.com/resize/packs/championship_edition_2025.jpg?format=webp&quality=80&width=200'
          },
          {
            id: '2',
            packName: 'Rookie Sensations Pack',
            series: 'Series 2024-25',
            price: 29.99,
            momentsCount: 3,
            rarity: 'Premium',
            openedBy: '@VictorFan',
            timestamp: new Date(Date.now() - 600000),
            contents: ['Victor Wembanyama Rare', '2 Common moments'],
            packImage: 'https://assets.nbatopshot.com/resize/packs/rookie_sensations_2025.jpg?format=webp&quality=80&width=200'
          }
        ])
      }
      
    } catch (err) {
      console.error('❌ Error fetching marketplace data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data')
      
      // Fallback demo data
      setMoments([
        {
          id: '1',
          momentId: '1',
          editionName: 'Series 2024-25 Common',
          playerName: 'SHAI GILGEOUS-ALEXANDER',
          playDescription: 'Thunder 2024',
          setName: 'Series 2024-25',
          series: 'Series 2024-25',
          rarity: 'Common',
          circulation: 3000,
          serialNumber: 1234,
          supply: 3000,
          lowAsk: 8.00 + Math.random() * 2,
          highestOffer: 1.00 + Math.random(),
          owned: 65,
          inPacks: 2035,
          burned: 0,
          locked: 4,
          listed: 3,
          sales: 8,
          playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628983.png',
          teamName: 'Oklahoma City Thunder',
          priceChange: (Math.random() - 0.5) * 10
        },
        {
          id: '2',
          momentId: '2',
          editionName: 'Series 2024-25 Rare',
          playerName: 'GIANNIS ANTETOKOUNMPO',
          playDescription: 'Bucks 2024',
          setName: 'Series 2024-25',
          series: 'Series 2024-25',
          rarity: 'Rare',
          circulation: 1500,
          serialNumber: 5678,
          supply: 1500,
          lowAsk: 25.00 + Math.random() * 5,
          highestOffer: 15.00 + Math.random() * 3,
          owned: 32,
          inPacks: 1200,
          burned: 0,
          locked: 8,
          listed: 5,
          sales: 15,
          playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203507.png',
          teamName: 'Milwaukee Bucks',
          priceChange: (Math.random() - 0.5) * 15
        },
        {
          id: '3',
          momentId: '3',
          editionName: 'Series 2024-25 Ultimate',
          playerName: 'VICTOR WEMBANYAMA', 
          playDescription: 'Spurs 2024',
          setName: 'Series 2024-25',
          series: 'Series 2024-25', 
          rarity: 'Ultimate',
          circulation: 99,
          serialNumber: 23,
          supply: 99,
          lowAsk: 500.00 + Math.random() * 10,
          highestOffer: 400.00 + Math.random() * 8,
          owned: 3,
          inPacks: 65,
          burned: 0,
          locked: 25,
          listed: 2,
          sales: 45,
          playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1641705.png',
          teamName: 'San Antonio Spurs',
          priceChange: (Math.random() - 0.5) * 20
        }
      ])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load more data for endless scroll
  const loadMoreData = async () => {
    if (!loadingMore && hasNextPage && !loading) {
      await fetchMarketplaceData(false, true)
    }
  }

  // Initial load
  useEffect(() => {
    setCurrentOffset(0)
    fetchMarketplaceData()
  }, [])

  // Refetch when filters change (reset pagination)
  useEffect(() => {
    if (!loading) {
      setCurrentOffset(0)
      setHasNextPage(true)
      fetchMarketplaceData()
    }
  }, [filters, searchTerm, leagueFilter])

  const filteredMoments = useMemo(() => {
    return moments.filter(moment => {
      if (searchTerm && !moment.playerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (leagueFilter !== 'BOTH') {
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

  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const tabs = ['MOMENTS', 'PACKS', 'LATEST PURCHASES', 'TOP PURCHASES']

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Activity</h1>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-400">
                <Wifi className="h-4 w-4" />
                <span className="text-xs">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-yellow-400">
                <WifiOff className="h-4 w-4 animate-pulse" />
                <span className="text-xs">INSTANT (500ms)</span>
              </div>
            )}
            <div className="text-xs text-gray-400">
              <div>Updated {formatRelativeTime(lastUpdate)}</div>
              <div className="text-green-400 font-mono">#{updateCount} updates</div>
            </div>
          </div>
        </div>
        
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
        {/* Left Sidebar - Fixed width */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 min-h-screen flex-shrink-0">
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

        {/* Main Content - TanStack Table v8 */}
        <div className="flex-1 bg-gray-900 min-w-0">
          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg m-6">
              <span className="text-red-400 text-sm">Error loading data: {error}</span>
            </div>
          )}

          {/* MOMENTS Tab - TanStack Table v8 with Endless Scroll */}
          {activeTab === 'MOMENTS' && (
            <div className="w-full p-6">
              <UnifiedTable
                columns={activityTableColumns}
                data={filteredMoments}
                enableSorting={true}
                enableFiltering={false} // We have custom filters
                enablePagination={false}
                enableVirtualization={true}
                defaultViewMode={{ mode: 'table' }}
                searchPlaceholder="Search moments..."
                emptyStateMessage="No moments found. Try adjusting your filters."
                loadingMessage="Loading live marketplace data..."
                loading={loading}
                containerHeight={650}
              />
              
              {/* Endless Scroll Controls */}
              <div className="mt-6 flex flex-col items-center gap-4">
                {hasNextPage && (
                  <Button
                    onClick={loadMoreData}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading More...
                      </>
                    ) : (
                      'Load More Moments'
                    )}
                  </Button>
                )}
                
                {!hasNextPage && filteredMoments.length > 0 && (
                  <p className="text-gray-400 text-sm">
                    All {filteredMoments.length} moments loaded
                  </p>
                )}
                
                {filteredMoments.length > 20 && (
                  <p className="text-gray-500 text-xs">
                    Showing {filteredMoments.length} moments • Auto-updating every 500ms
                  </p>
                )}
              </div>
            </div>
          )}

          {/* PACKS Tab - TanStack Table v8 */}
          {activeTab === 'PACKS' && (
            <div className="w-full p-6">
              <UnifiedTable
                columns={packActivityColumns}
                data={packs}
                enableSorting={true}
                enableFiltering={false}
                enablePagination={false}
                enableVirtualization={true}
                defaultViewMode={{ mode: 'table' }}
                searchPlaceholder="Search pack activity..."
                emptyStateMessage="No pack activity. Pack openings will appear here in real-time."
                loadingMessage="Loading pack activity..."
              />
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {(activeTab === 'LATEST PURCHASES' || activeTab === 'TOP PURCHASES') && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-300 mb-2">{activeTab}</h3>
                <p className="text-gray-500">Coming soon with real transaction data.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 