'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChainSelector } from '@/components/blockchain/ChainSelector'
import { flowTopShotService, FlowCollectionData, FlowMarketData } from '@/lib/flow-topshot-service'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SortConfig {
  key: keyof FlowCollectionData | null
  direction: 'asc' | 'desc'
}

export default function PlatformsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('all-flow')
  const [collections, setCollections] = useState<FlowCollectionData[]>([])
  const [marketData, setMarketData] = useState<FlowMarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'volume24h', direction: 'desc' })

  // Load data based on selected platform
  useEffect(() => {
    loadPlatformData()
  }, [selectedPlatform])

  const loadPlatformData = async () => {
    setLoading(true)
    try {
      let collectionsData: FlowCollectionData[]
      let marketType: 'nba' | 'wnba' | 'combined'

      switch (selectedPlatform) {
        case 'nba-topshot':
          collectionsData = await flowTopShotService.getNBATopShotCollections()
          marketType = 'nba'
          break
        case 'wnba':
          collectionsData = await flowTopShotService.getWNBACollections()
          marketType = 'wnba'
          break
        default:
          collectionsData = await flowTopShotService.getCombinedFlowData()
          marketType = 'combined'
      }

      const marketAnalytics = await flowTopShotService.getFlowMarketAnalytics(marketType)
      
      setCollections(collectionsData)
      setMarketData(marketAnalytics)
    } catch (error) {
      console.error('❌ Error loading platform data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort collections
  const filteredAndSortedCollections = useMemo(() => {
    let filtered = collections.filter(collection =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.series.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        return 0
      })
    }

    return filtered
  }, [collections, searchTerm, sortConfig])

  const handleSort = (key: keyof FlowCollectionData) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    })
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`
    return `$${volume.toFixed(0)}`
  }

  const formatChange = (change: number) => {
    const formatted = change.toFixed(1)
    return change >= 0 ? `+${formatted}%` : `${formatted}%`
  }

  const getPlatformTitle = () => {
    switch (selectedPlatform) {
      case 'nba-topshot': return 'NBA Top Shot Collections'
      case 'wnba': return 'WNBA Collections'
      default: return 'All Flow Collections'
    }
  }

  const getPlatformDescription = () => {
    switch (selectedPlatform) {
      case 'nba-topshot': return "Men's basketball moments on Flow blockchain"
      case 'wnba': return "Women's basketball moments on Flow blockchain"
      default: return 'Combined NBA Top Shot and WNBA analytics'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Chain Selector */}
        <ChainSelector
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />

        {/* Market Overview */}
        {marketData && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Market Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-white font-bold text-lg">{formatVolume(marketData.totalVolume)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Sales</p>
                <p className="text-white font-bold text-lg">{marketData.totalSales.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Traders</p>
                <p className="text-white font-bold text-lg">{marketData.activeTraders.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Avg Price</p>
                <p className="text-white font-bold text-lg">{formatPrice(marketData.avgSalePrice)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Floor Price</p>
                <p className="text-white font-bold text-lg">{formatPrice(marketData.floorPrice)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Change</p>
                <p className={`font-bold text-lg ${marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatChange(marketData.change24h)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{getPlatformTitle()}</h1>
              <p className="text-gray-400">{getPlatformDescription()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white w-64"
              />
              <Button 
                onClick={loadPlatformData}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Collections Table */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortConfig.key === 'name' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('series')}
                  >
                    Series
                    {sortConfig.key === 'series' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('floorPrice')}
                  >
                    Floor
                    {sortConfig.key === 'floorPrice' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('volume24h')}
                  >
                    Volume
                    {sortConfig.key === 'volume24h' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('marketCap')}
                  >
                    Market Cap
                    {sortConfig.key === 'marketCap' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('topOffer')}
                  >
                    Top Offer
                    {sortConfig.key === 'topOffer' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('change24h')}
                  >
                    Change%
                    {sortConfig.key === 'change24h' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('sales24h')}
                  >
                    Sales
                    {sortConfig.key === 'sales24h' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort('owners')}
                  >
                    Owners
                    {sortConfig.key === 'owners' && (
                      <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Chart
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                      Loading Flow blockchain data...
                    </td>
                  </tr>
                ) : filteredAndSortedCollections.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-gray-400">
                      No collections found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCollections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {collection.type === 'nba' ? '🏀' : '🏀'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{collection.name}</p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                collection.type === 'nba' 
                                  ? 'border-blue-500/30 text-blue-400'
                                  : 'border-purple-500/30 text-purple-400'
                              }`}
                            >
                              {collection.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{collection.series}</td>
                      <td className="px-6 py-4 text-white font-medium">{formatPrice(collection.floorPrice)}</td>
                      <td className="px-6 py-4 text-white font-medium">{formatVolume(collection.volume24h)}</td>
                      <td className="px-6 py-4 text-white font-medium">{formatVolume(collection.marketCap)}</td>
                      <td className="px-6 py-4 text-white font-medium">{formatPrice(collection.topOffer)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${collection.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatChange(collection.change24h)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{collection.sales24h}</td>
                      <td className="px-6 py-4 text-gray-300">{collection.owners.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-8">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                              { value: Math.random() * 100 },
                              { value: Math.random() * 100 },
                              { value: Math.random() * 100 },
                              { value: Math.random() * 100 },
                              { value: Math.random() * 100 }
                            ]}>
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke={collection.change24h >= 0 ? "#10b981" : "#ef4444"} 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{filteredAndSortedCollections.length}</p>
              <p className="text-gray-400 text-sm">Active Collections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {formatVolume(filteredAndSortedCollections.reduce((sum, c) => sum + c.volume24h, 0))}
              </p>
              <p className="text-gray-400 text-sm">Total Volume 24h</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {filteredAndSortedCollections.reduce((sum, c) => sum + c.sales24h, 0).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Total Sales 24h</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {filteredAndSortedCollections.reduce((sum, c) => sum + c.owners, 0).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Total Owners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 