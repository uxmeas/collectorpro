'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/design-system/atoms/Icon'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Target, 
  Activity,
  Eye,
  Star,
  Filter,
  Download,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  Zap,
  Trophy,
  AlertTriangle,
  TrendingUpIcon,
  TrendingDownIcon,
  Clock,
  Users,
  Award,
  Crown,
  Target as TargetIcon,
  CheckCircle,
  XCircle,
  Minus,
  Plus,
  Percent,
  Hash,
  Layers,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  ScatterChart,
  Gauge,
  Flame,
  Snowflake,
  Diamond,
  Gem,
  Sparkles,
  Database,
  Bot,
  Bookmark
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, ScatterChart as RechartsScatterChart, Scatter } from 'recharts'

// Multi-platform imports
import { Platform, Asset, Activity as ActivityType, Pack, MultiPlatformPortfolio } from '@/types/multi-platform'
import { MultiPlatformService } from '@/lib/multi-platform-service'
import { PlatformToggle } from '@/components/multi-platform/PlatformToggle'
import { TopAssetsSection } from '@/components/multi-platform/TopAssetsSection'
import { ActivityFeed } from '@/components/multi-platform/ActivityFeed'
import { PackTracking } from '@/components/multi-platform/PackTracking'
import { PLTrackingSection } from '@/components/multi-platform/PLTrackingSection'
import { PortfolioPerformance } from '@/components/multi-platform/PortfolioPerformance'
import OffersDashboard from '@/components/offers/OffersDashboard'
import OfferAnalyticsDisplay from '@/components/offers/OfferAnalyticsDisplay'
import WatchlistDashboard from '@/components/watchlist/WatchlistDashboard'
import ScoutChat from '@/components/scout/ScoutChat'
import FlowTransactionTracker from '@/components/flow/FlowTransactionTracker'

// Bloomberg Terminal imports
import BloombergHeaderBar from '@/components/bloomberg/BloombergHeaderBar'
import '@/styles/bloomberg-colors.css'

// Bloomberg Terminal-style Portfolio Metrics Hook
interface Alert {
  type: string
  message: string
  icon: React.ComponentType<any>
  priority: string
}

const useMultiPlatformPortfolio = (walletAddress: string) => {
  const [portfolio, setPortfolio] = useState<MultiPlatformPortfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/multi-platform/portfolio?address=${walletAddress}`)
        const data = await response.json()
        
        if (data.success) {
          setPortfolio(data.portfolio)
          setError(null)
        } else {
          throw new Error(data.error || 'Failed to load portfolio')
        }
      } catch (err) {
        console.error('Error fetching multi-platform portfolio:', err)
        setError('Failed to load portfolio data')
      } finally {
        setLoading(false)
      }
    }

    if (walletAddress) {
      fetchPortfolio()
    }
  }, [walletAddress])

  return { portfolio, loading, error }
}

function MultiPlatformCollectorDashboard() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get('wallet') || 'demo-wallet'
  const { portfolio, loading, error } = useMultiPlatformPortfolio(walletAddress)
  
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all')
  const [activityFilters, setActivityFilters] = useState({
    types: [] as string[],
    platforms: [] as Platform[],
    dateRange: 'all' as const
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const handleAssetClick = (asset: Asset) => {
    console.log('Asset clicked:', asset)
    // TODO: Navigate to asset detail page
  }

  const handlePackClick = (pack: Pack) => {
    console.log('Pack clicked:', pack)
    // TODO: Navigate to pack detail page
  }

  const handleFollowPack = (packId: string, follow: boolean) => {
    console.log('Follow pack:', packId, follow)
    // TODO: Update pack following status
  }

  const handleActivityFilterChange = (filters: any) => {
    setActivityFilters(filters)
  }

  // Bloomberg Terminal handlers
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Trigger portfolio refresh
      const response = await fetch(`/api/multi-platform/portfolio?address=${walletAddress}`)
      const data = await response.json()
      if (data.success) {
        // Portfolio will be updated via the hook
        console.log('Portfolio refreshed successfully')
      }
    } catch (error) {
      console.error('Error refreshing portfolio:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleExport = () => {
    // Export portfolio data
    const exportData = {
      portfolio: portfolio,
      platform: selectedPlatform,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `collectorpro-portfolio-${selectedPlatform}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get current platform data
  const currentPlatformData = useMemo(() => {
    if (!portfolio) return null
    return selectedPlatform === 'all' ? portfolio.combined : portfolio.platforms[selectedPlatform]
  }, [portfolio, selectedPlatform])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading multi-platform portfolio...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl mb-2">Failed to Load Portfolio</h2>
          <p className="text-gray-400 mb-4">{error || 'Unknown error occurred'}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Bloomberg Terminal Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold tracking-tight">CollectorPRO Terminal</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-blue-400 font-medium">Dashboard</Link>
                <Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors">Marketplace</Link>
                <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</Link>
                <Link href="/research" className="text-gray-400 hover:text-white transition-colors">Research</Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search moments, players, sets..."
                  className="bg-gray-900/50 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all w-64"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Platform Toggle */}
        <div className="mb-8">
          <PlatformToggle
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            portfolio={portfolio}
          />
        </div>

        {/* Quick Offer Analytics Display */}
        <div className="mb-8">
          <OfferAnalyticsDisplay />
        </div>

        {/* Bloomberg Terminal Header Bar */}
        <div className="mb-8">
          <BloombergHeaderBar
            portfolioData={currentPlatformData}
            selectedPlatform={selectedPlatform}
            onRefresh={handleRefresh}
            onExport={handleExport}
            isRefreshing={isRefreshing}
          />
        </div>

        {/* Portfolio Performance Overview */}
        <div className="mb-8">
          <PortfolioPerformance
            totalInvested={currentPlatformData?.totalValue ? currentPlatformData.totalValue * 0.8 : 2847}
            currentValue={currentPlatformData?.totalValue || 3234}
            totalProfit={currentPlatformData?.totalProfit || 387}
            roi={currentPlatformData?.roi ? currentPlatformData.roi * 100 : 13.6}
            recentActivity={currentPlatformData?.recentActivity || []}
            topAssets={currentPlatformData?.topAssets || []}
          />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Priority 1: Top Assets Section */}
          <div className="lg:col-span-1">
            <TopAssetsSection
              assets={currentPlatformData?.topAssets || []}
              platform={selectedPlatform}
              onAssetClick={handleAssetClick}
            />
          </div>

          {/* Priority 2: Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed
              activities={currentPlatformData?.recentActivity || []}
              platform={selectedPlatform}
              filters={activityFilters}
              onFilterChange={handleActivityFilterChange}
            />
          </div>

          {/* Priority 3: Pack Tracking */}
          <div className="lg:col-span-1">
            <PackTracking
              packs={portfolio.packTracking}
              platform={selectedPlatform}
              onPackClick={handlePackClick}
              onFollowPack={handleFollowPack}
            />
          </div>
        </div>

        {/* P&L Tracking Section */}
        <div className="mb-8">
          <PLTrackingSection
            activities={currentPlatformData?.recentActivity || []}
            assets={currentPlatformData?.topAssets || []}
            platform={selectedPlatform}
          />
        </div>

        {/* Offers Management Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Offers Management</h2>
              <p className="text-gray-400">Track incoming offers, manage outgoing offers, and analyze market intelligence</p>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-500">
              <Star className="w-4 h-4 mr-1" />
              Premium Feature
            </Badge>
          </div>
          <OffersDashboard walletAddress={walletAddress} />
        </div>

        {/* Watchlist & Alerts Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Watchlist & Alerts</h2>
              <p className="text-gray-400">Track buying/selling opportunities with smart alerts and notifications</p>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-500">
              <Bookmark className="w-4 h-4 mr-1" />
              Essential Feature
            </Badge>
          </div>
          <WatchlistDashboard />
        </div>

        {/* Scout AI Collecting Buddy */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Scout - Your AI Collecting Buddy</h2>
              <p className="text-gray-400">Chat about collecting, discover insights, and share your passion for cards</p>
            </div>
            <Badge variant="outline" className="text-purple-400 border-purple-500">
              <Bot className="w-4 h-4 mr-1" />
              AI Companion
            </Badge>
          </div>
          <ScoutChat />
        </div>

        {/* Flow Transaction Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Flow Transaction Tracker</h2>
              <p className="text-gray-400">Real-time Flow blockchain transaction tracking with purchase price extraction</p>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-500">
              <Database className="w-4 h-4 mr-1" />
              Live Blockchain Data
            </Badge>
          </div>
          <FlowTransactionTracker walletAddress={walletAddress} />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Performance Chart */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Portfolio Performance</h3>
                <p className="text-sm text-gray-400">Track your collection's value over time</p>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { date: 'Jan', value: 45000 },
                  { date: 'Feb', value: 52000 },
                  { date: 'Mar', value: 48000 },
                  { date: 'Apr', value: 61000 },
                  { date: 'May', value: 58000 },
                  { date: 'Jun', value: 65000 },
                  { date: 'Jul', value: currentPlatformData?.totalValue || 72000 }
                ]}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Platform Distribution</h3>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'TopShot', value: portfolio.platforms.topshot?.totalValue || 0, color: '#3B82F6' },
                      { name: 'AllDay', value: portfolio.platforms.allday?.totalValue || 0, color: '#10B981' },
                      { name: 'Panini', value: portfolio.platforms.panini?.totalValue || 0, color: '#F59E0B' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'TopShot', value: portfolio.platforms.topshot?.totalValue || 0, color: '#3B82F6' },
                      { name: 'AllDay', value: portfolio.platforms.allday?.totalValue || 0, color: '#10B981' },
                      { name: 'Panini', value: portfolio.platforms.panini?.totalValue || 0, color: '#F59E0B' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2 mt-4">
              {[
                { name: 'TopShot', value: portfolio.platforms.topshot?.totalValue || 0, color: '#3B82F6' },
                { name: 'AllDay', value: portfolio.platforms.allday?.totalValue || 0, color: '#10B981' },
                { name: 'Panini', value: portfolio.platforms.panini?.totalValue || 0, color: '#F59E0B' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{formatValue(item.value)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <MultiPlatformCollectorDashboard />
    </Suspense>
  )
} 