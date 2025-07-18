'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { NBATopShotMoment, PortfolioAnalytics } from '../../lib/nba-topshot-types'

export default function ProfessionalDashboard() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState('')
  const [moments, setMoments] = useState<NBATopShotMoment[]>([])
  const [filteredMoments, setFilteredMoments] = useState<NBATopShotMoment[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Filter States - LiveToken Style
  const [filters, setFilters] = useState({
    // Basic Filters
    searchQuery: '',
    selectedPlayers: [] as string[],
    selectedSets: [] as string[],
    selectedSeries: [] as string[],
    selectedTeams: [] as string[],
    selectedRarities: [] as string[],
    selectedPlayCategories: [] as string[],
    
    // Price Filters
    minPrice: 0,
    maxPrice: 100000,
    minFMV: 0,
    maxFMV: 100000,
    minSerial: 1,
    maxSerial: 50000,
    minDiscount: 0,
    
    // Special Filters
    jerseySerial: false,
    lastMint: false,
    neverSold: false,
    locked: null as boolean | null,
    
    // Badge Filters
    badges: {
      TS: false,
      RY: false,
      RM: false,
      RP: false,
      CY: false,
      CR: false,
      CCR: false,
      LEG: false,
      ULT: false,
      GW: false,
      BB: false
    }
  })

  // View Settings
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'cards'>('table')
  const [sortBy, setSortBy] = useState('currentValue')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)

  // Load portfolio data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const walletFromUrl = urlParams.get('wallet')
    if (walletFromUrl) {
      setWalletAddress(walletFromUrl)
      loadPortfolio(walletFromUrl)
    }
  }, [])

  // Apply filters and sorting
  const processedMoments = useMemo(() => {
    let filtered = [...moments]

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(moment => 
        moment.playerName.toLowerCase().includes(query) ||
        moment.teamName.toLowerCase().includes(query) ||
        moment.set.toLowerCase().includes(query) ||
        moment.series.toLowerCase().includes(query) ||
        moment.playType.toLowerCase().includes(query) ||
        moment.serialNumber.toString().includes(query)
      )
    }

    // Player filter
    if (filters.selectedPlayers.length > 0) {
      filtered = filtered.filter(moment => filters.selectedPlayers.includes(moment.playerName))
    }

    // Set filter
    if (filters.selectedSets.length > 0) {
      filtered = filtered.filter(moment => filters.selectedSets.includes(moment.set))
    }

    // Series filter
    if (filters.selectedSeries.length > 0) {
      filtered = filtered.filter(moment => filters.selectedSeries.includes(moment.series))
    }

    // Team filter
    if (filters.selectedTeams.length > 0) {
      filtered = filtered.filter(moment => filters.selectedTeams.includes(moment.teamName))
    }

    // Rarity filter
    if (filters.selectedRarities.length > 0) {
      filtered = filtered.filter(moment => filters.selectedRarities.includes(moment.rarity))
    }

    // Play category filter
    if (filters.selectedPlayCategories.length > 0) {
      filtered = filtered.filter(moment => filters.selectedPlayCategories.includes(moment.playCategory))
    }

    // Price range filters
    filtered = filtered.filter(moment => 
      moment.currentValue >= filters.minPrice && 
      moment.currentValue <= filters.maxPrice &&
      moment.trueValue >= filters.minFMV &&
      moment.trueValue <= filters.maxFMV &&
      moment.serialNumber >= filters.minSerial &&
      moment.serialNumber <= filters.maxSerial
    )

    // Discount filter
    if (filters.minDiscount > 0) {
      filtered = filtered.filter(moment => {
        const discount = ((moment.trueValue - moment.currentValue) / moment.trueValue) * 100
        return discount >= filters.minDiscount
      })
    }

    // Special filters
    if (filters.jerseySerial) {
      filtered = filtered.filter(moment => {
        // Check if serial matches jersey number (simplified logic)
        const jerseyNumbers = [23, 30, 35, 24, 8, 6, 1, 3, 11, 0] // Common jersey numbers
        return jerseyNumbers.includes(moment.serialNumber % 100)
      })
    }

    if (filters.neverSold) {
      filtered = filtered.filter(moment => !moment.lastSaleDate || moment.lastSaleDate === moment.blockchain.mintDate)
    }

    if (filters.locked !== null) {
      filtered = filtered.filter(moment => moment.lockStatus === filters.locked)
    }

    // Badge filters
    Object.entries(filters.badges).forEach(([badge, enabled]) => {
      if (enabled) {
        filtered = filtered.filter(moment => moment.metadata.badges.includes(badge))
      }
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof NBATopShotMoment]
      let bValue: any = b[sortBy as keyof NBATopShotMoment]

      // Handle nested properties
      if (sortBy.includes('.')) {
        const keys = sortBy.split('.')
        aValue = keys.reduce((obj, key) => obj?.[key], a)
        bValue = keys.reduce((obj, key) => obj?.[key], b)
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [moments, filters, sortBy, sortOrder])

  const loadPortfolio = async (address: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/flow/comprehensive-portfolio?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (data.success) {
        setMoments(data.data.moments)
        setPortfolio(data.data.portfolio)
      } else {
        setError(data.error || 'Failed to load portfolio')
      }
    } catch (err) {
      setError('Failed to connect to wallet')
      console.error('Portfolio load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid Flow wallet address')
      return
    }
    await loadPortfolio(walletAddress)
  }

  const exportToCSV = async () => {
    try {
      const response = await fetch(`/api/export/csv?address=${encodeURIComponent(walletAddress)}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `topshot-portfolio-${walletAddress}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('CSV export error:', err)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toUpperCase()) {
      case 'COMMON': return 'text-gray-400'
      case 'RARE': return 'text-blue-400'
      case 'LEGENDARY': return 'text-purple-400'
      case 'ULTIMATE': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }

  const getUniqueValues = (field: string) => {
    return [...new Set(moments.map(m => {
      const keys = field.split('.')
      return keys.reduce((obj, key) => obj?.[key], m)
    }).filter(Boolean))].sort()
  }

  const toggleFilter = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev].includes(value)
        ? (prev[filterType as keyof typeof prev] as string[]).filter((v: string) => v !== value)
        : [...(prev[filterType as keyof typeof prev] as string[]), value]
    }))
  }

  const toggleBadgeFilter = (badge: string) => {
    setFilters(prev => ({
      ...prev,
      badges: {
        ...prev.badges,
        [badge]: !prev.badges[badge as keyof typeof prev.badges]
      }
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      selectedPlayers: [],
      selectedSets: [],
      selectedSeries: [],
      selectedTeams: [],
      selectedRarities: [],
      selectedPlayCategories: [],
      minPrice: 0,
      maxPrice: 100000,
      minFMV: 0,
      maxFMV: 100000,
      minSerial: 1,
      maxSerial: 50000,
      minDiscount: 0,
      jerseySerial: false,
      lastMint: false,
      neverSold: false,
      locked: null,
      badges: {
        TS: false,
        RY: false,
        RM: false,
        RP: false,
        CY: false,
        CR: false,
        CCR: false,
        LEG: false,
        ULT: false,
        GW: false,
        BB: false
      }
    })
  }

  // Pagination
  const paginatedMoments = processedMoments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(processedMoments.length / itemsPerPage)

  if (!moments.length && !loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] font-[Inter,sans-serif] text-white">
        {/* Header */}
        <header className="bg-[#161B22] border-b border-[#30363D] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded bg-gradient-to-br from-[#C8102E] to-[#1D428A]">
                <span className="text-lg">📊</span>
              </div>
              <h1 className="text-xl font-bold text-white">CollectorPRO</h1>
              <span className="text-xs text-gray-400 bg-[#21262D] px-2 py-1 rounded">Professional</span>
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
              Professional Analytics Platform
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Bloomberg Terminal for NBA Top Shot. Comprehensive data analysis with 40+ fields, 
              advanced filtering, and professional market intelligence.
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
                    Loading Portfolio...
                  </div>
                ) : (
                  'Load Professional Analytics'
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
                <span className="text-lg">📊</span>
              </div>
              <h1 className="text-xl font-bold text-white">CollectorPRO</h1>
              <span className="text-xs text-gray-400 bg-[#21262D] px-2 py-1 rounded">Professional</span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{walletAddress}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={exportToCSV}
              className="text-xs bg-[#21262D] hover:bg-[#30363D] text-gray-300 px-3 py-2 rounded border border-[#30363D] transition-colors"
            >
              📥 Export CSV
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`text-xs px-3 py-2 rounded border transition-colors ${
                showFilters 
                  ? 'bg-[#C8102E] border-[#C8102E] text-white' 
                  : 'bg-[#21262D] border-[#30363D] text-gray-300 hover:bg-[#30363D]'
              }`}
            >
              🔧 Filters
            </button>
            <button
              onClick={() => {
                setMoments([])
                setPortfolio(null)
                setWalletAddress('')
              }}
              className="text-xs bg-[#21262D] hover:bg-[#30363D] text-gray-300 px-3 py-2 rounded border border-[#30363D] transition-colors"
            >
              New Portfolio
            </button>
          </div>
        </div>

        {/* Portfolio Overview Bar */}
        {portfolio && (
          <div className="bg-[#0D1117] border-b border-[#30363D] px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-xs text-gray-400">Total Moments</span>
                  <div className="text-lg font-bold text-white">{portfolio.overview.totalMoments}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Current FMV</span>
                  <div className="text-lg font-bold text-white">{formatCurrency(portfolio.overview.totalValue)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Cost Basis</span>
                  <div className="text-lg font-bold text-white">{formatCurrency(portfolio.overview.totalAcquisitionCost)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Unrealized P&L</span>
                  <div className={`text-lg font-bold ${getTrendColor(portfolio.overview.totalProfit)}`}>
                    {formatCurrency(portfolio.overview.totalProfit)} ({formatPercentage(portfolio.overview.profitPercentage)})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  Showing {processedMoments.length} of {moments.length} moments
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`text-xs px-2 py-1 rounded ${viewMode === 'table' ? 'bg-[#C8102E] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    📊
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`text-xs px-2 py-1 rounded ${viewMode === 'grid' ? 'bg-[#C8102E] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    ⏹️
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`text-xs px-2 py-1 rounded ${viewMode === 'cards' ? 'bg-[#C8102E] text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Advanced Filters Sidebar - LiveToken Style */}
        {showFilters && (
          <aside className="w-80 bg-[#161B22] border-r border-[#30363D] h-screen sticky top-[120px] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Advanced Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder="Player, team, set, serial..."
                  className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                />
              </div>

              {/* Players */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">All Players</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {getUniqueValues('playerName').map(player => (
                    <label key={player} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={filters.selectedPlayers.includes(player)}
                        onChange={() => toggleFilter('selectedPlayers', player)}
                        className="mr-2 text-[#C8102E]"
                      />
                      <span className="text-gray-300">{player}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sets */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">All Sets</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {getUniqueValues('set').map(set => (
                    <label key={set} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={filters.selectedSets.includes(set)}
                        onChange={() => toggleFilter('selectedSets', set)}
                        className="mr-2 text-[#C8102E]"
                      />
                      <span className="text-gray-300">{set}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Teams */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">All Teams</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {getUniqueValues('teamName').map(team => (
                    <label key={team} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={filters.selectedTeams.includes(team)}
                        onChange={() => toggleFilter('selectedTeams', team)}
                        className="mr-2 text-[#C8102E]"
                      />
                      <span className="text-gray-300">{team}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rarities */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">All Rarities</label>
                <div className="space-y-1">
                  {getUniqueValues('rarity').map(rarity => (
                    <label key={rarity} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={filters.selectedRarities.includes(rarity)}
                        onChange={() => toggleFilter('selectedRarities', rarity)}
                        className="mr-2 text-[#C8102E]"
                      />
                      <span className={getRarityColor(rarity)}>{rarity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                      placeholder="Min"
                      className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      placeholder="Max"
                      className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">FMV Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minFMV}
                      onChange={(e) => setFilters(prev => ({ ...prev, minFMV: Number(e.target.value) }))}
                      placeholder="Min FMV"
                      className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                    />
                    <input
                      type="number"
                      value={filters.maxFMV}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxFMV: Number(e.target.value) }))}
                      placeholder="Max FMV"
                      className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Serial Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minSerial}
                      onChange={(e) => setFilters(prev => ({ ...prev, minSerial: Number(e.target.value) }))}
                      placeholder="Min Serial"
                      className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                    />
                    <input
                      type="number"
                      value={filters.maxSerial}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxSerial: Number(e.target.value) }))}
                      placeholder="Max Serial"
                      className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Min % Discount from FMV</label>
                  <input
                    type="number"
                    value={filters.minDiscount}
                    onChange={(e) => setFilters(prev => ({ ...prev, minDiscount: Number(e.target.value) }))}
                    placeholder="0"
                    className="w-full px-2 py-1 bg-[#0D1117] border border-[#30363D] rounded text-white text-xs"
                  />
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Special Filters</label>
                <div className="space-y-2">
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={filters.jerseySerial}
                      onChange={(e) => setFilters(prev => ({ ...prev, jerseySerial: e.target.checked }))}
                      className="mr-2 text-[#C8102E]"
                    />
                    <span className="text-gray-300">Jersey Serial</span>
                  </label>
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={filters.neverSold}
                      onChange={(e) => setFilters(prev => ({ ...prev, neverSold: e.target.checked }))}
                      className="mr-2 text-[#C8102E]"
                    />
                    <span className="text-gray-300">Never Sold</span>
                  </label>
                  <div className="flex gap-2">
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="locked"
                        checked={filters.locked === true}
                        onChange={() => setFilters(prev => ({ ...prev, locked: true }))}
                        className="mr-1 text-[#C8102E]"
                      />
                      <span className="text-gray-300">Locked</span>
                    </label>
                    <label className="flex items-center text-xs">
                      <input
                        type="radio"
                        name="locked"
                        checked={filters.locked === false}
                        onChange={() => setFilters(prev => ({ ...prev, locked: false }))}
                        className="mr-1 text-[#C8102E]"
                      />
                      <span className="text-gray-300">Not Locked</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Badge Filters */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Badge Filters</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(filters.badges).map(([badge, enabled]) => (
                    <label key={badge} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={() => toggleBadgeFilter(badge)}
                        className="mr-1 text-[#C8102E]"
                      />
                      <span className="text-gray-300 text-xs">{badge}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showFilters ? 'ml-0' : ''}`}>
          <div className="p-6">
            {/* Control Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-white">
                  Portfolio Analytics
                </h2>
                <span className="text-sm text-gray-400">
                  {processedMoments.length} moments • {formatCurrency(processedMoments.reduce((sum, m) => sum + m.currentValue, 0))} total value
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order as 'asc' | 'desc')
                  }}
                  className="text-xs bg-[#161B22] border border-[#30363D] rounded px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
                >
                  <option value="currentValue-desc">FMV: High → Low</option>
                  <option value="currentValue-asc">FMV: Low → High</option>
                  <option value="gainLoss-desc">P&L: High → Low</option>
                  <option value="gainLoss-asc">P&L: Low → High</option>
                  <option value="serialNumber-asc">Serial: Low → High</option>
                  <option value="serialNumber-desc">Serial: High → Low</option>
                  <option value="playerName-asc">Player: A → Z</option>
                  <option value="playerName-desc">Player: Z → A</option>
                  <option value="rarity-asc">Rarity: A → Z</option>
                  <option value="purchaseDate-desc">Acquired: Recent</option>
                  <option value="purchaseDate-asc">Acquired: Oldest</option>
                </select>
              </div>
            </div>

            {/* Data Table */}
            {viewMode === 'table' && (
              <div className="bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[#21262D] border-b border-[#30363D]">
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
                    <tbody>
                      {paginatedMoments.map((moment) => (
                        <tr key={moment.id} className="border-b border-[#30363D] hover:bg-[#21262D]/50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-white">{moment.playerName}</div>
                              <div className="text-gray-400">{moment.teamName}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{moment.set}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="font-mono text-white">#{moment.serialNumber}</span>
                            <div className="text-gray-400">of {moment.totalCirculation.toLocaleString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(moment.rarity)} bg-gray-800`}>
                              {moment.rarity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white font-medium">
                            {formatCurrency(moment.currentValue)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-gray-300">
                            {formatCurrency(moment.purchasePrice)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className={`font-mono font-medium ${getTrendColor(moment.gainLoss)}`}>
                              {formatCurrency(moment.gainLoss)}
                            </div>
                            <div className={`text-xs ${getTrendColor(moment.gainLoss)}`}>
                              {formatPercentage(moment.gainLossPercentage)}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white">
                            {moment.rarityScore.toFixed(0)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {moment.metadata.badges.slice(0, 3).map(badge => (
                                <span key={badge} className="px-1 py-0.5 bg-[#C8102E] text-white text-xs rounded">
                                  {badge}
                                </span>
                              ))}
                              {moment.metadata.badges.length > 3 && (
                                <span className="text-gray-400 text-xs">+{moment.metadata.badges.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400 font-mono">
                            {moment.purchaseDate}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`text-xs ${getTrendColor(moment.priceChange24h)}`}>
                              {formatPercentage(moment.priceChange24h)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-gray-300">
                            {formatCurrency(moment.lowAsk)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-gray-300">
                            {formatCurrency(moment.highestOffer)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-[#161B22] border border-[#30363D] rounded text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#21262D] transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded text-xs transition-colors ${
                        currentPage === page
                          ? 'bg-[#C8102E] text-white'
                          : 'bg-[#161B22] border border-[#30363D] text-white hover:bg-[#21262D]'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-[#161B22] border border-[#30363D] rounded text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#21262D] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 