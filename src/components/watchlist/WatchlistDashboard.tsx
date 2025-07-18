'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { 
  Bookmark, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Settings,
  Plus,
  Search,
  Filter,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Trash2,
  Edit3,
  BellOff,
  BellRing,
  Zap
} from 'lucide-react'

interface WatchlistItem {
  id: string
  asset: {
    name: string
    image: string
    floorPrice: number
    currentPrice: number
    platform: string
  }
  alerts: {
    priceAbove: number | null
    priceBelow: number | null
    volumeSpike: boolean
    newListings: boolean
    offerReceived: boolean
  }
  notes: string
  priority: 'high' | 'medium' | 'low'
  addedAt: string
  lastChecked: string
  status: 'active' | 'triggered' | 'paused'
  priceChange: number
  volumeChange: number
}

interface WatchlistStats {
  totalItems: number
  activeAlerts: number
  triggeredAlerts: number
  priceTargets: number
  volumeTargets: number
  totalValue: number
}

const WatchlistDashboard: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      // Mock data for demonstration
      const mockWatchlist: WatchlistItem[] = [
        {
          id: '1',
          asset: {
            name: 'LeBron James - Series 1',
            image: '/lebron.jpg',
            floorPrice: 1200,
            currentPrice: 1350,
            platform: 'TopShot'
          },
          alerts: {
            priceAbove: 1500,
            priceBelow: 1000,
            volumeSpike: true,
            newListings: false,
            offerReceived: true
          },
          notes: 'Watch for playoff performance boost',
          priority: 'high',
          addedAt: '2024-01-15',
          lastChecked: '2024-01-20T10:30:00Z',
          status: 'active',
          priceChange: 12.5,
          volumeChange: 45.2
        },
        {
          id: '2',
          asset: {
            name: 'Stephen Curry - Series 2',
            image: '/curry.jpg',
            floorPrice: 85,
            currentPrice: 95,
            platform: 'TopShot'
          },
          alerts: {
            priceAbove: 120,
            priceBelow: 70,
            volumeSpike: false,
            newListings: true,
            offerReceived: false
          },
          notes: 'Three-point record chase potential',
          priority: 'medium',
          addedAt: '2024-01-18',
          lastChecked: '2024-01-20T09:15:00Z',
          status: 'triggered',
          priceChange: -8.3,
          volumeChange: 12.7
        },
        {
          id: '3',
          asset: {
            name: 'Giannis Antetokounmpo - Series 3',
            image: '/giannis.jpg',
            floorPrice: 450,
            currentPrice: 520,
            platform: 'TopShot'
          },
          alerts: {
            priceAbove: 600,
            priceBelow: 400,
            volumeSpike: true,
            newListings: true,
            offerReceived: true
          },
          notes: 'MVP season momentum',
          priority: 'high',
          addedAt: '2024-01-10',
          lastChecked: '2024-01-20T11:45:00Z',
          status: 'active',
          priceChange: 15.6,
          volumeChange: 78.9
        }
      ]
      
      setWatchlist(mockWatchlist)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStats = (): WatchlistStats => {
    const totalItems = watchlist.length
    const activeAlerts = watchlist.filter(item => item.status === 'active').length
    const triggeredAlerts = watchlist.filter(item => item.status === 'triggered').length
    const priceTargets = watchlist.filter(item => item.alerts.priceAbove || item.alerts.priceBelow).length
    const volumeTargets = watchlist.filter(item => item.alerts.volumeSpike).length
    const totalValue = watchlist.reduce((sum, item) => sum + item.asset.currentPrice, 0)
    
    return { totalItems, activeAlerts, triggeredAlerts, priceTargets, volumeTargets, totalValue }
  }

  const handleAddToWatchlist = (asset: any) => {
    console.log('Adding to watchlist:', asset)
    // TODO: Implement add to watchlist functionality
  }

  const handleEditAlert = (itemId: string) => {
    console.log('Editing alert for:', itemId)
    // TODO: Implement edit alert functionality
  }

  const handleRemoveFromWatchlist = (itemId: string) => {
    console.log('Removing from watchlist:', itemId)
    // TODO: Implement remove from watchlist functionality
  }

  const handleToggleAlert = (itemId: string, alertType: string) => {
    console.log('Toggling alert:', itemId, alertType)
    // TODO: Implement toggle alert functionality
  }

  const filteredWatchlist = watchlist.filter(item => {
    const matchesSearch = item.asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesPriority && matchesStatus
  })

  const stats = getStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'alerts':
        return (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alert Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Price Alerts</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Set price targets for buying and selling opportunities
                  </p>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Price Alert
                  </Button>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Volume Alerts</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Get notified of unusual trading activity
                  </p>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Volume Alert
                  </Button>
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Market Alerts</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Track new listings and offer activity
                  </p>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Market Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      
      case 'notifications':
        return (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BellRing className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium text-white">Push Notifications</p>
                      <p className="text-sm text-gray-400">Real-time alerts on your device</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-gray-400">Daily summary and urgent alerts</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">SMS Alerts</p>
                      <p className="text-sm text-gray-400">Critical price movements only</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      
      default:
        return (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search watchlist items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="triggered">Triggered</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Watchlist Items */}
            <div className="space-y-4">
              {filteredWatchlist.map((item) => (
                <Card key={item.id} className="bg-gray-900/50 border-gray-700 hover:border-blue-500/30 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-400" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{item.asset.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {item.asset.platform}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {item.priority}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                item.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'triggered' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">${item.asset.currentPrice.toLocaleString()}</span>
                              <span className={`text-xs ${
                                item.priceChange > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {item.priceChange > 0 ? '+' : ''}{item.priceChange}%
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">Vol: {item.volumeChange}%</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">Floor: ${item.asset.floorPrice.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {item.notes && (
                            <p className="text-sm text-gray-400 mt-2 italic">"{item.notes}"</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAlert(item.id)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAlert(item.id, 'price')}
                        >
                          {item.alerts.priceAbove || item.alerts.priceBelow ? (
                            <BellRing className="w-4 h-4 text-green-400" />
                          ) : (
                            <BellOff className="w-4 h-4 text-gray-400" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFromWatchlist(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Watchlist & Alerts</h1>
          <p className="text-gray-400">Track buying/selling opportunities with smart alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bookmark className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Items</p>
                <p className="text-xl font-bold text-white">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Alerts</p>
                <p className="text-xl font-bold text-white">{stats.activeAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Triggered</p>
                <p className="text-xl font-bold text-white">{stats.triggeredAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Value</p>
                <p className="text-xl font-bold text-white">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4 inline mr-2" />
          Watchlist
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Alert Management
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Notifications
        </button>
      </div>

      {/* Content */}
      {renderTab()}
    </div>
  )
}

export default WatchlistDashboard 