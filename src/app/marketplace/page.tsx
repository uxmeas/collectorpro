'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NBATopShotMoment, FilterCriteria, SortCriteria, SearchOptions } from '../../lib/nba-topshot-types'
import { MarketplaceDisclaimer } from '@/components/ui/LegalDisclaimer'

export default function MarketplaceDashboard() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState('')
  const [moments, setMoments] = useState<NBATopShotMoment[]>([])
  const [filteredMoments, setFilteredMoments] = useState<NBATopShotMoment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterCriteria[]>([])
  const [sortBy, setSortBy] = useState<SortCriteria>({ field: 'currentValue', order: 'desc' })
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid')
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [selectedSets, setSelectedSets] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(24)

  // Check for wallet address in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const walletFromUrl = urlParams.get('wallet')
    if (walletFromUrl) {
      setWalletAddress(walletFromUrl)
      connectWalletWithAddress(walletFromUrl)
    }
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...moments]

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(moment => 
        moment.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moment.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moment.set.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moment.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moment.playType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply rarity filter
    if (selectedRarities.length > 0) {
      filtered = filtered.filter(moment => selectedRarities.includes(moment.rarity))
    }

    // Apply team filter
    if (selectedTeams.length > 0) {
      filtered = filtered.filter(moment => selectedTeams.includes(moment.teamName))
    }

    // Apply set filter
    if (selectedSets.length > 0) {
      filtered = filtered.filter(moment => selectedSets.includes(moment.set))
    }

    // Apply price range filter
    filtered = filtered.filter(moment => 
      moment.currentValue >= priceRange[0] && moment.currentValue <= priceRange[1]
    )

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy.field] as number
      const bValue = b[sortBy.field] as number
      return sortBy.order === 'asc' ? aValue - bValue : bValue - aValue
    })

    setFilteredMoments(filtered)
    setCurrentPage(1)
  }, [moments, searchQuery, selectedRarities, selectedTeams, selectedSets, priceRange, sortBy])

  const connectWalletWithAddress = async (address: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/flow/comprehensive-portfolio?address=${encodeURIComponent(address)}`)
      const data = await response.json()

      if (data.success) {
        setMoments(data.data.moments)
      } else {
        setError(data.error || 'Failed to fetch portfolio data')
      }
    } catch (err) {
      setError('Failed to connect to wallet')
      console.error('Portfolio fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a valid Flow wallet address')
      return
    }
    await connectWalletWithAddress(walletAddress)
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

  const getRarityColor = (rarity: string) => {
    switch (rarity.toUpperCase()) {
      case 'COMMON': return 'text-gray-400'
      case 'RARE': return 'text-blue-400'
      case 'LEGENDARY': return 'text-purple-400'
      case 'ULTIMATE': return 'text-yellow-400'
      default: return 'text-gray-300'
    }
  }

  const getRarityBgColor = (rarity: string) => {
    switch (rarity.toUpperCase()) {
      case 'COMMON': return 'bg-gray-400/20'
      case 'RARE': return 'bg-blue-400/20'
      case 'LEGENDARY': return 'bg-purple-400/20'
      case 'ULTIMATE': return 'bg-yellow-400/20'
      default: return 'bg-gray-300/20'
    }
  }

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getUniqueValues = (field: keyof NBATopShotMoment) => {
    return [...new Set(moments.map(m => m[field] as string))].sort()
  }

  const toggleFilter = (filterType: 'rarity' | 'team' | 'set', value: string) => {
    switch (filterType) {
      case 'rarity':
        setSelectedRarities(prev => 
          prev.includes(value) 
            ? prev.filter(v => v !== value)
            : [...prev, value]
        )
        break
      case 'team':
        setSelectedTeams(prev => 
          prev.includes(value) 
            ? prev.filter(v => v !== value)
            : [...prev, value]
        )
        break
      case 'set':
        setSelectedSets(prev => 
          prev.includes(value) 
            ? prev.filter(v => v !== value)
            : [...prev, value]
        )
        break
    }
  }

  const clearAllFilters = () => {
    setSelectedRarities([])
    setSelectedTeams([])
    setSelectedSets([])
    setPriceRange([0, 10000])
    setSearchQuery('')
  }

  const paginatedMoments = filteredMoments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredMoments.length / itemsPerPage)

  if (!moments.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] text-white">
        {/* Header */}
        <header className="bg-black/70 backdrop-blur-md border-b border-[#222]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2">
                <span className="text-2xl">🏀</span>
                <span className="text-xl -ml-2">📊</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">TS Tracker Pro</h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-[#23272A] hover:bg-[#2C2F33] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Home
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight text-white">
              Professional <span className="text-[#FDB927]">Marketplace</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
              Advanced NBA Top Shot portfolio analytics with professional marketplace features.
            </p>
          </div>

          <div className="bg-[#23272A]/80 rounded-2xl p-8 border border-[#333] shadow-2xl max-w-2xl mx-auto">
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
                  className="w-full px-6 py-4 bg-[#181A1B] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent text-lg font-mono"
                />
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
                  <div className="flex items-center">
                    <span className="text-red-400 mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              <button
                onClick={connectWallet}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#C8102E] to-[#1D428A] hover:from-[#FDB927] hover:to-[#C8102E] text-white px-8 py-4 rounded-xl font-bold text-xl shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FDB927] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="inline-block h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></span>
                    Loading Portfolio...
                  </div>
                ) : (
                  'Connect Portfolio'
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D428A] to-[#181A1B] font-[Inter,sans-serif] text-white">
      {/* Header */}
      <header className="bg-black/70 backdrop-blur-md border-b border-[#222] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#C8102E] to-[#1D428A] mr-2">
              <span className="text-2xl">🏀</span>
              <span className="text-xl -ml-2">📊</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">TS Tracker Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm font-mono">{walletAddress}</span>
            <button
              onClick={() => {
                setMoments([])
                setWalletAddress('')
              }}
              className="bg-[#23272A] hover:bg-[#2C2F33] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              New Portfolio
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Legal Disclaimer */}
        <MarketplaceDisclaimer />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(moments.reduce((sum, m) => sum + (m.currentValue || 0), 0))}
            </p>
          </div>
          
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Moments</h3>
            <p className="text-3xl font-bold text-white">{moments.length}</p>
          </div>
          
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Filtered Results</h3>
            <p className="text-3xl font-bold text-white">{filteredMoments.length}</p>
          </div>
          
          <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Gain/Loss</h3>
            <p className={`text-3xl font-bold ${getTrendColor(moments.reduce((sum, m) => sum + (m.gainLoss || 0), 0))}`}>
              {formatCurrency(moments.reduce((sum, m) => sum + (m.gainLoss || 0), 0))}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#23272A]/80 rounded-xl p-6 border border-[#333] shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by player, team, set, or play type..."
                  className="w-full px-4 py-3 bg-[#181A1B] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="flex gap-4">
              <select
                value={`${sortBy.field}-${sortBy.order}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-')
                  setSortBy({ field: field as keyof NBATopShotMoment, order: order as 'asc' | 'desc' })
                }}
                className="px-4 py-3 bg-[#181A1B] border border-[#333] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent"
              >
                <option value="currentValue-desc">Value: High to Low</option>
                <option value="currentValue-asc">Value: Low to High</option>
                <option value="gainLoss-desc">Gain/Loss: High to Low</option>
                <option value="gainLoss-asc">Gain/Loss: Low to High</option>
                <option value="serialNumber-asc">Serial: Low to High</option>
                <option value="serialNumber-desc">Serial: High to Low</option>
                <option value="playerName-asc">Player: A-Z</option>
                <option value="playerName-desc">Player: Z-A</option>
                <option value="teamName-asc">Team: A-Z</option>
                <option value="teamName-desc">Team: Z-A</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-[#181A1B] border border-[#333] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-[#C8102E] text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  ⏹️
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 ${viewMode === 'list' ? 'bg-[#C8102E] text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  📋
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-3 ${viewMode === 'table' ? 'bg-[#C8102E] text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  📊
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-[#C8102E] border-[#C8102E] text-white' 
                    : 'bg-[#181A1B] border-[#333] text-gray-400 hover:text-white'
                }`}
              >
                🔧 Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[#333]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rarity Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Rarity</h4>
                  <div className="space-y-2">
                    {getUniqueValues('rarity').map(rarity => (
                      <label key={rarity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRarities.includes(rarity)}
                          onChange={() => toggleFilter('rarity', rarity)}
                          className="mr-2"
                        />
                        <span className={`text-sm ${getRarityColor(rarity)}`}>{rarity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Team Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Team</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getUniqueValues('teamName').map(team => (
                      <label key={team} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTeams.includes(team)}
                          onChange={() => toggleFilter('team', team)}
                          className="mr-2"
                        />
                        <span className="text-sm text-white">{team}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Set Filter */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Set</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getUniqueValues('set').map(set => (
                      <label key={set} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSets.includes(set)}
                          onChange={() => toggleFilter('set', set)}
                          className="mr-2"
                        />
                        <span className="text-sm text-white">{set}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        placeholder="Min"
                        className="w-full px-3 py-2 bg-[#181A1B] border border-[#333] rounded text-white text-sm"
                      />
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        placeholder="Max"
                        className="w-full px-3 py-2 bg-[#181A1B] border border-[#333] rounded text-white text-sm"
                      />
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-3 py-2 bg-[#C8102E] text-white rounded text-sm hover:bg-[#A00D24] transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {filteredMoments.length} Moments
            </h2>
            <div className="text-sm text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredMoments.length)} of {filteredMoments.length}
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedMoments.map((moment) => (
                <div key={moment.id} className="bg-[#23272A]/80 rounded-xl border border-[#333] shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Moment Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#C8102E] to-[#1D428A] flex items-center justify-center">
                    <span className="text-4xl">🏀</span>
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${getRarityBgColor(moment.rarity)} ${getRarityColor(moment.rarity)}`}>
                      {moment.rarity}
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                      #{moment.serialNumber}
                    </div>
                  </div>

                  {/* Moment Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1">{moment.playerName}</h3>
                    <p className="text-gray-400 text-sm mb-2">{moment.teamName}</p>
                    <p className="text-gray-300 text-sm mb-3">{moment.playType}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Value</span>
                        <span className="text-white font-semibold">{formatCurrency(moment.currentValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Gain/Loss</span>
                        <span className={getTrendColor(moment.gainLoss)}>
                          {formatCurrency(moment.gainLoss)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Set</span>
                        <span className="text-white">{moment.set}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {paginatedMoments.map((moment) => (
                <div key={moment.id} className="bg-[#23272A]/80 rounded-xl border border-[#333] shadow-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#C8102E] to-[#1D428A] rounded-lg flex items-center justify-center">
                      <span className="text-xl">🏀</span>
                      <div className={`absolute -top-1 -right-1 px-1 py-0.5 rounded text-xs font-bold ${getRarityBgColor(moment.rarity)} ${getRarityColor(moment.rarity)}`}>
                        {moment.rarity}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-bold text-white">{moment.playerName}</h3>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">{moment.teamName}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300">#{moment.serialNumber}</span>
                      </div>
                      <p className="text-gray-400 text-sm">{moment.playType} • {moment.set}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{formatCurrency(moment.currentValue)}</div>
                      <div className={`text-sm ${getTrendColor(moment.gainLoss)}`}>
                        {formatCurrency(moment.gainLoss)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-[#23272A]/80 rounded-xl border border-[#333] shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#181A1B]">
                    <tr>
                      <th className="text-left py-4 px-6 text-gray-300 font-medium">Player</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-medium">Team</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-medium">Serial</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-medium">Rarity</th>
                      <th className="text-left py-4 px-6 text-gray-300 font-medium">Set</th>
                      <th className="text-right py-4 px-6 text-gray-300 font-medium">Value</th>
                      <th className="text-right py-4 px-6 text-gray-300 font-medium">Gain/Loss</th>
                      <th className="text-right py-4 px-6 text-gray-300 font-medium">24h Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMoments.map((moment) => (
                      <tr key={moment.id} className="border-b border-[#333] hover:bg-[#181A1B]/50">
                        <td className="py-4 px-6 text-white font-medium">{moment.playerName}</td>
                        <td className="py-4 px-6 text-gray-300">{moment.teamName}</td>
                        <td className="py-4 px-6 text-gray-300">#{moment.serialNumber}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getRarityBgColor(moment.rarity)} ${getRarityColor(moment.rarity)}`}>
                            {moment.rarity}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{moment.set}</td>
                        <td className="py-4 px-6 text-right text-white font-semibold">{formatCurrency(moment.currentValue)}</td>
                        <td className={`py-4 px-6 text-right ${getTrendColor(moment.gainLoss)}`}>
                          {formatCurrency(moment.gainLoss)}
                        </td>
                        <td className={`py-4 px-6 text-right ${getTrendColor(moment.priceChange24h)}`}>
                          {formatPercentage(moment.priceChange24h)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#23272A] border border-[#333] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2C2F33] transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-[#C8102E] text-white'
                      : 'bg-[#23272A] border border-[#333] text-white hover:bg-[#2C2F33]'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#23272A] border border-[#333] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2C2F33] transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
} 