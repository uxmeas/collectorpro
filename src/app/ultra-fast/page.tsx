'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { NBATopShotMoment, PortfolioAnalytics } from '../../lib/nba-topshot-types'

// Performance-optimized debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Memoized moment row component for performance
const MomentRow = memo(({ 
  moment, 
  index, 
  isSelected, 
  onSelect, 
  formatCurrency, 
  formatPercentage, 
  getTrendColor, 
  getRarityColor 
}: {
  moment: NBATopShotMoment
  index: number
  isSelected: boolean
  onSelect: (id: string) => void
  formatCurrency: (amount: number) => string
  formatPercentage: (value: number) => string
  getTrendColor: (value: number) => string
  getRarityColor: (rarity: string) => string
}) => {
  const handleClick = useCallback(() => {
    onSelect(moment.id)
  }, [moment.id, onSelect])

  return (
    <tr 
      onClick={handleClick}
      className={`border-b border-[#30363D] hover:bg-[#21262D]/50 transition-colors cursor-pointer ${
        isSelected ? 'bg-[#C8102E]/10' : ''
      }`}
      style={{ height: '60px' }} // Fixed height for virtual scrolling
    >
      <td className="py-3 px-4">
        <div>
          <div className="font-medium text-white text-sm">{moment.playerName}</div>
          <div className="text-gray-400 text-xs">{moment.teamName}</div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-300 text-sm">{moment.set}</td>
      <td className="py-3 px-4 text-right">
        <span className="font-mono text-white text-sm">#{moment.serialNumber}</span>
        <div className="text-gray-400 text-xs">of {moment.totalCirculation.toLocaleString()}</div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(moment.rarity)} bg-gray-800`}>
          {moment.rarity}
        </span>
      </td>
      <td className="py-3 px-4 text-right font-mono text-white font-medium text-sm">
        {formatCurrency(moment.currentValue)}
      </td>
      <td className="py-3 px-4 text-right font-mono text-gray-300 text-sm">
        {formatCurrency(moment.purchasePrice)}
      </td>
      <td className="py-3 px-4 text-right">
        <div className={`font-mono font-medium text-sm ${getTrendColor(moment.gainLoss)}`}>
          {formatCurrency(moment.gainLoss)}
        </div>
        <div className={`text-xs ${getTrendColor(moment.gainLoss)}`}>
          {formatPercentage(moment.gainLossPercentage)}
        </div>
      </td>
      <td className="py-3 px-4 text-right font-mono text-white text-sm">
        {moment.rarityScore.toFixed(0)}
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {moment.metadata.badges.slice(0, 2).map(badge => (
            <span key={badge} className="px-1 py-0.5 bg-[#C8102E] text-white text-xs rounded">
              {badge}
            </span>
          ))}
          {moment.metadata.badges.length > 2 && (
            <span className="text-gray-400 text-xs">+{moment.metadata.badges.length - 2}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-gray-400 font-mono text-xs">
        {moment.purchaseDate}
      </td>
      <td className="py-3 px-4 text-right">
        <span className={`text-xs ${getTrendColor(moment.priceChange24h)}`}>
          {formatPercentage(moment.priceChange24h)}
        </span>
      </td>
      <td className="py-3 px-4 text-right font-mono text-gray-300 text-sm">
        {formatCurrency(moment.lowAsk)}
      </td>
      <td className="py-3 px-4 text-right font-mono text-gray-300 text-sm">
        {formatCurrency(moment.highestOffer)}
      </td>
    </tr>
  )
})

MomentRow.displayName = 'MomentRow'

// Virtual scrolling component for handling large datasets
const VirtualizedTable = memo(({ 
  moments, 
  containerHeight, 
  rowHeight, 
  selectedMoments, 
  onSelectMoment,
  formatCurrency,
  formatPercentage,
  getTrendColor,
  getRarityColor
}: {
  moments: NBATopShotMoment[]
  containerHeight: number
  rowHeight: number
  selectedMoments: Set<string>
  onSelectMoment: (id: string) => void
  formatCurrency: (amount: number) => string
  formatPercentage: (value: number) => string
  getTrendColor: (value: number) => string
  getRarityColor: (rarity: string) => string
}) => {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.floor(scrollTop / rowHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / rowHeight) + 5, // Buffer rows
    moments.length
  )

  const visibleMoments = moments.slice(startIndex, endIndex)
  const totalHeight = moments.length * rowHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return (
    <div 
      className="overflow-auto" 
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <table className="w-full text-xs">
          <thead className="bg-[#21262D] border-b border-[#30363D] sticky top-0 z-10">
            <tr>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Player</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Set</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Serial</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Rarity</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">FMV</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Paid</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">P&L</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">TSS</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Badges</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Acquired</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">24h</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Low Ask</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">High Offer</th>
            </tr>
          </thead>
          <tbody style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
            {visibleMoments.map((moment, index) => (
              <MomentRow
                key={moment.id}
                moment={moment}
                index={startIndex + index}
                isSelected={selectedMoments.has(moment.id)}
                onSelect={onSelectMoment}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
                getTrendColor={getTrendColor}
                getRarityColor={getRarityColor}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

VirtualizedTable.displayName = 'VirtualizedTable'

// Memoized filter component
const FilterSidebar = memo(({ 
  filters, 
  onFiltersChange, 
  moments, 
  isCollapsed, 
  onToggleCollapse 
}: {
  filters: any
  onFiltersChange: (filters: any) => void
  moments: NBATopShotMoment[]
  isCollapsed: boolean
  onToggleCollapse: () => void
}) => {
  const uniqueValues = useMemo(() => ({
    players: [...new Set(moments.map(m => m.playerName))].sort(),
    sets: [...new Set(moments.map(m => m.set))].sort(),
    teams: [...new Set(moments.map(m => m.teamName))].sort(),
    rarities: [...new Set(moments.map(m => m.rarity))].sort(),
  }), [moments])

  const handleFilterChange = useCallback((filterType: string, value: any) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    })
  }, [filters, onFiltersChange])

  const toggleArrayFilter = useCallback((filterType: string, value: string) => {
    const currentArray = filters[filterType] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v: string) => v !== value)
      : [...currentArray, value]
    
    handleFilterChange(filterType, newArray)
  }, [filters, handleFilterChange])

  if (isCollapsed) {
    return (
      <div className="w-12 bg-[#161B22] border-r border-[#30363D] h-screen sticky top-[120px] flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-white transition-colors"
        >
          📊
        </button>
      </div>
    )
  }

  return (
    <aside className="w-80 bg-[#161B22] border-r border-[#30363D] h-screen sticky top-[120px] overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Lightning Filters</h3>
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ←
          </button>
        </div>

        {/* Instant Search */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">⚡ Instant Search</label>
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            placeholder="Player, team, set, serial..."
            className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C8102E] transition-all"
          />
        </div>

        {/* High-Performance Multi-Select Filters */}
        <div className="grid grid-cols-1 gap-4">
          {/* Players */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Players ({uniqueValues.players.length})
            </label>
            <div className="max-h-32 overflow-y-auto bg-[#0D1117] border border-[#30363D] rounded">
              {uniqueValues.players.slice(0, 20).map(player => (
                <label key={player} className="flex items-center px-2 py-1 hover:bg-[#21262D] text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.selectedPlayers || []).includes(player)}
                    onChange={() => toggleArrayFilter('selectedPlayers', player)}
                    className="mr-2 text-[#C8102E]"
                  />
                  <span className="text-gray-300 truncate">{player}</span>
                </label>
              ))}
              {uniqueValues.players.length > 20 && (
                <div className="px-2 py-1 text-xs text-gray-500">
                  +{uniqueValues.players.length - 20} more...
                </div>
              )}
            </div>
          </div>

          {/* Sets */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Sets ({uniqueValues.sets.length})
            </label>
            <div className="max-h-24 overflow-y-auto bg-[#0D1117] border border-[#30363D] rounded">
              {uniqueValues.sets.map(set => (
                <label key={set} className="flex items-center px-2 py-1 hover:bg-[#21262D] text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.selectedSets || []).includes(set)}
                    onChange={() => toggleArrayFilter('selectedSets', set)}
                    className="mr-2 text-[#C8102E]"
                  />
                  <span className="text-gray-300 truncate">{set}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Teams */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Teams ({uniqueValues.teams.length})
            </label>
            <div className="max-h-24 overflow-y-auto bg-[#0D1117] border border-[#30363D] rounded">
              {uniqueValues.teams.map(team => (
                <label key={team} className="flex items-center px-2 py-1 hover:bg-[#21262D] text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.selectedTeams || []).includes(team)}
                    onChange={() => toggleArrayFilter('selectedTeams', team)}
                    className="mr-2 text-[#C8102E]"
                  />
                  <span className="text-gray-300 truncate">{team}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rarities */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Rarities</label>
            <div className="space-y-1">
              {uniqueValues.rarities.map(rarity => (
                <label key={rarity} className="flex items-center text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.selectedRarities || []).includes(rarity)}
                    onChange={() => toggleArrayFilter('selectedRarities', rarity)}
                    className="mr-2 text-[#C8102E]"
                  />
                  <span className="text-gray-300">{rarity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Ranges - Optimized */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Price Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minPrice || 0}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                placeholder="Min"
                className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-[#C8102E]"
              />
              <input
                type="number"
                value={filters.maxPrice || 100000}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                placeholder="Max"
                className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-[#C8102E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Serial Range</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.minSerial || 1}
                onChange={(e) => handleFilterChange('minSerial', Number(e.target.value))}
                placeholder="Min Serial"
                className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-[#C8102E]"
              />
              <input
                type="number"
                value={filters.maxSerial || 50000}
                onChange={(e) => handleFilterChange('maxSerial', Number(e.target.value))}
                placeholder="Max Serial"
                className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs focus:ring-1 focus:ring-[#C8102E]"
              />
            </div>
          </div>
        </div>

        {/* Quick Clear */}
        <button
          onClick={() => onFiltersChange({})}
          className="w-full px-3 py-2 bg-[#C8102E] hover:bg-[#A00D24] text-white rounded text-xs font-medium transition-colors"
        >
          ⚡ Clear All Filters
        </button>
      </div>
    </aside>
  )
})

FilterSidebar.displayName = 'FilterSidebar'

export default function UltraFastDashboard() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState('')
  const [moments, setMoments] = useState<NBATopShotMoment[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMoments, setSelectedMoments] = useState<Set<string>>(new Set())
  const [filtersCollapsed, setFiltersCollapsed] = useState(false)

  // Performance-optimized filter state
  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedPlayers: [] as string[],
    selectedSets: [] as string[],
    selectedTeams: [] as string[],
    selectedRarities: [] as string[],
    minPrice: 0,
    maxPrice: 100000,
    minSerial: 1,
    maxSerial: 50000,
  })

  // Debounced search for instant performance
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 150)
  const debouncedPriceRange = useDebounce({ min: filters.minPrice, max: filters.maxPrice }, 300)

  // Load portfolio with caching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const walletFromUrl = urlParams.get('wallet')
    if (walletFromUrl) {
      setWalletAddress(walletFromUrl)
      loadPortfolioWithCache(walletFromUrl)
    }
  }, [])

  const loadPortfolioWithCache = useCallback(async (address: string) => {
    const cacheKey = `portfolio_${address}`
    const cached = sessionStorage.getItem(cacheKey)
    
    if (cached) {
      try {
        const data = JSON.parse(cached)
        setMoments(data.moments)
        setPortfolio(data.portfolio)
        return
      } catch (e) {
        // Cache invalid, continue to fetch
      }
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/flow/comprehensive-portfolio?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (data.success) {
        setMoments(data.data.moments)
        setPortfolio(data.data.portfolio)
        
        // Cache the data for instant subsequent loads
        sessionStorage.setItem(cacheKey, JSON.stringify(data.data))
      } else {
        setError(data.error || 'Failed to load portfolio')
      }
    } catch (err) {
      setError('Failed to connect to wallet')
      console.error('Portfolio load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Ultra-fast filtering with memoization
  const filteredMoments = useMemo(() => {
    let filtered = [...moments]

    // Search filter with debouncing
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(moment => 
        moment.playerName.toLowerCase().includes(query) ||
        moment.teamName.toLowerCase().includes(query) ||
        moment.set.toLowerCase().includes(query) ||
        moment.serialNumber.toString().includes(query)
      )
    }

    // Array filters - optimized
    if (filters.selectedPlayers.length > 0) {
      const playerSet = new Set(filters.selectedPlayers)
      filtered = filtered.filter(moment => playerSet.has(moment.playerName))
    }

    if (filters.selectedSets.length > 0) {
      const setSet = new Set(filters.selectedSets)
      filtered = filtered.filter(moment => setSet.has(moment.set))
    }

    if (filters.selectedTeams.length > 0) {
      const teamSet = new Set(filters.selectedTeams)
      filtered = filtered.filter(moment => teamSet.has(moment.teamName))
    }

    if (filters.selectedRarities.length > 0) {
      const raritySet = new Set(filters.selectedRarities)
      filtered = filtered.filter(moment => raritySet.has(moment.rarity))
    }

    // Price range filter with debouncing
    filtered = filtered.filter(moment => 
      moment.currentValue >= debouncedPriceRange.min && 
      moment.currentValue <= debouncedPriceRange.max &&
      moment.serialNumber >= filters.minSerial &&
      moment.serialNumber <= filters.maxSerial
    )

    return filtered
  }, [moments, debouncedSearchQuery, filters, debouncedPriceRange])

  // Memoized utility functions
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }, [])

  const formatPercentage = useCallback((value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }, [])

  const getTrendColor = useCallback((value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }, [])

  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity.toUpperCase()) {
      case 'COMMON': return 'text-gray-400'
      case 'RARE': return 'text-blue-400'
      case 'LEGENDARY': return 'text-purple-400'
      case 'ULTIMATE': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }, [])

  const handleSelectMoment = useCallback((id: string) => {
    setSelectedMoments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const connectWallet = useCallback(async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid Flow wallet address')
      return
    }
    await loadPortfolioWithCache(walletAddress)
  }, [walletAddress, loadPortfolioWithCache])

  if (!moments.length && !loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] font-[Inter,sans-serif] text-white">
        <header className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
                <span className="text-lg">⚡</span>
              </div>
              <h1 className="text-xl font-bold text-white">UltraFast Analytics</h1>
              <span className="text-xs text-gray-400 bg-[#21262D] px-2 py-1 rounded">Lightning Speed</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              ⚡ Ultra-Fast NBA Top Shot Analytics
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Lightning-fast performance with virtual scrolling, instant filtering, 
              and enterprise-grade optimizations. Built for speed and scale.
            </p>
          </div>

          <div className="bg-[#161B22] rounded-lg p-8 border border-[#30363D]">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Flow Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x1234567890abcdef"
                  className="w-full px-4 py-3 bg-[#0D1117] border border-[#30363D] rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent font-mono"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-4 text-red-300">
                  <div className="flex items-center">
                    <span className="text-red-400 mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              <button
                onClick={connectWallet}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-6 py-3 rounded font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB927] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Loading Ultra-Fast Analytics...
                  </div>
                ) : (
                  '⚡ Load Lightning-Fast Portfolio'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] font-[Inter,sans-serif] text-white">
      {/* Header */}
      <header className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
                <span className="text-lg">⚡</span>
              </div>
              <h1 className="text-xl font-bold text-white">UltraFast Analytics</h1>
              <span className="text-xs text-gray-400 bg-[#21262D] px-2 py-1 rounded">Lightning Speed</span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{walletAddress}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400">
              ⚡ {filteredMoments.length} / {moments.length} moments
            </div>
            <button
              onClick={() => {
                setMoments([])
                setPortfolio(null)
                setWalletAddress('')
                setSelectedMoments(new Set())
                sessionStorage.clear()
              }}
              className="text-xs bg-[#21262D] hover:bg-[#30363D] text-gray-300 px-3 py-2 rounded border border-[#30363D] transition-colors"
            >
              New Portfolio
            </button>
          </div>
        </div>

        {/* Performance Overview Bar */}
        {portfolio && (
          <div className="bg-[#0D1117] border-b border-[#30363D] px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-xs text-gray-400">Total Moments</span>
                  <div className="text-lg font-bold text-white">{portfolio.overview.totalMoments}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Total FMV</span>
                  <div className="text-lg font-bold text-white">{formatCurrency(portfolio.overview.totalValue)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Unrealized P&L</span>
                  <div className={`text-lg font-bold ${getTrendColor(portfolio.overview.totalProfit)}`}>
                    {formatCurrency(portfolio.overview.totalProfit)} ({formatPercentage(portfolio.overview.profitPercentage)})
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Selected</span>
                  <div className="text-lg font-bold text-[#C8102E]">{selectedMoments.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-green-400">
                  ⚡ Ultra-Fast Mode Active
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Lightning-Fast Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          moments={moments}
          isCollapsed={filtersCollapsed}
          onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
        />

        {/* Main Content with Virtual Scrolling */}
        <main className="flex-1">
          <div className="p-6">
            <div className="bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden">
              <VirtualizedTable
                moments={filteredMoments}
                containerHeight={600}
                rowHeight={60}
                selectedMoments={selectedMoments}
                onSelectMoment={handleSelectMoment}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
                getTrendColor={getTrendColor}
                getRarityColor={getRarityColor}
              />
            </div>

            {/* Performance Stats */}
            <div className="mt-4 bg-[#161B22] rounded-lg border border-[#30363D] p-4">
              <div className="flex justify-between items-center text-xs">
                <div className="flex gap-6">
                  <span className="text-gray-400">Filtered: {filteredMoments.length} moments</span>
                  <span className="text-gray-400">Total Value: {formatCurrency(filteredMoments.reduce((sum, m) => sum + m.currentValue, 0))}</span>
                  <span className="text-gray-400">Selected: {selectedMoments.size} moments</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-green-400">⚡ Virtual Scrolling Active</span>
                  <span className="text-green-400">🚀 Instant Filters</span>
                  <span className="text-green-400">💾 Cached Data</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 