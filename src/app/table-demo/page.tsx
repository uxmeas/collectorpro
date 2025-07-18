'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/badge"
import { UnifiedTable } from '@/components/table/UnifiedTable'
import { momentTableColumns, MomentGridCard, MomentListItem } from '@/components/table/configs/MomentTableConfig'
import { portfolioTableColumns, PortfolioGridCard, ActivityListItem, activityTableColumns, PortfolioMoment, ActivityItem } from '@/components/table/configs/PortfolioTableConfig'
import { discoveryService, DiscoveryMoment } from '@/lib/discovery-service'

export default function TableDemoPage() {
  const [momentData, setMomentData] = useState<DiscoveryMoment[]>([])
  const [portfolioData, setPortfolioData] = useState<PortfolioMoment[]>([])
  const [activityData, setActivityData] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDemo, setActiveDemo] = useState<'moments' | 'portfolio' | 'activity'>('moments')

  useEffect(() => {
    const loadDemoData = async () => {
      setLoading(true)
      try {
        // Load moments data
        const moments = await discoveryService.searchMoments({
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
        }, 'trending')
        
        setMomentData(moments.slice(0, 50)) // Limit for demo

        // Generate sample portfolio data
        const portfolio: PortfolioMoment[] = moments.slice(0, 20).map((moment, index) => ({
          id: moment.id,
          playId: moment.id,
          serialNumber: moment.serialNumber,
          playerName: moment.playerName,
          playerImage: moment.playerImage,
          teamName: moment.teamName,
          playType: moment.playType,
          setName: moment.setName,
          series: moment.series,
          rarityTier: moment.rarityTier,
          purchasePrice: moment.currentPrice * (0.8 + Math.random() * 0.4), // Random purchase price
          purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          currentPrice: moment.currentPrice,
          priceChange: moment.priceChange24h,
          priceChangePercent: moment.priceChangePercent,
          marketplaceUrl: moment.marketplaceUrl,
          momentImage: moment.momentImage,
          locked: Math.random() > 0.8,
          inPack: Math.random() > 0.9
        }))
        
        setPortfolioData(portfolio)

        // Generate sample activity data
        const activities: ActivityItem[] = Array.from({ length: 30 }, (_, index) => {
          const randomMoment = moments[Math.floor(Math.random() * moments.length)]
          const types: ActivityItem['type'][] = ['purchase', 'sale', 'transfer', 'pack_opening', 'offer_received', 'offer_made']
          const statuses: ActivityItem['status'][] = ['completed', 'pending', 'failed']
          
          return {
            id: `activity-${index}`,
            type: types[Math.floor(Math.random() * types.length)],
            momentId: randomMoment.id,
            playerName: Math.random() > 0.3 ? randomMoment.playerName : undefined,
            playerImage: Math.random() > 0.3 ? randomMoment.playerImage : undefined,
            playType: Math.random() > 0.3 ? randomMoment.playType : undefined,
            serialNumber: Math.random() > 0.3 ? randomMoment.serialNumber : undefined,
            price: Math.random() > 0.4 ? randomMoment.currentPrice : undefined,
            fromAddress: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined,
            toAddress: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined,
            transactionHash: Math.random() > 0.3 ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            status: statuses[Math.floor(Math.random() * statuses.length)]
          }
        })
        
        setActivityData(activities)
        
      } catch (error) {
        console.error('Failed to load demo data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDemoData()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Unified Table System Demo</h1>
          <p className="text-gray-400">
            Showcasing TanStack Table with consistent styling, virtual scrolling, and multiple view modes.
          </p>
        </div>

        {/* Demo Selector */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded-lg w-fit">
            <Button
              variant={activeDemo === 'moments' ? 'primary' : 'ghost'}
              onClick={() => setActiveDemo('moments')}
              size="sm"
            >
              Moment Discovery
            </Button>
            <Button
              variant={activeDemo === 'portfolio' ? 'primary' : 'ghost'}
              onClick={() => setActiveDemo('portfolio')}
              size="sm"
            >
              Portfolio View
            </Button>
            <Button
              variant={activeDemo === 'activity' ? 'primary' : 'ghost'}
              onClick={() => setActiveDemo('activity')}
              size="sm"
            >
              Activity Feed
            </Button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">🚀 Performance</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Virtual scrolling for 1000+ items</li>
                <li>• &lt;200ms filter responses</li>
                <li>• Optimized re-renders</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">🎨 Views</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Table view with sorting</li>
                <li>• Grid view with cards</li>
                <li>• List view for mobile</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">📱 Responsive</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Mobile-optimized layouts</li>
                <li>• Touch-friendly interactions</li>
                <li>• Consistent theming</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Tables */}
        {activeDemo === 'moments' && (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Moment Discovery Table</span>
                <Badge className="bg-blue-500/20 text-blue-400">
                  {momentData.length} moments
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <UnifiedTable
                columns={momentTableColumns}
                data={momentData}
                loading={loading}
                enableSorting={true}
                enableFiltering={true}
                enableVirtualization={true}
                defaultViewMode={{ mode: 'table' }}
                searchPlaceholder="Search moments..."
                emptyStateMessage="No moments found"
                loadingMessage="Loading moments..."
                containerHeight={600}
                onRowClick={(moment) => {
                  console.log('Clicked moment:', moment.id)
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
              />
            </CardContent>
          </Card>
        )}

        {activeDemo === 'portfolio' && (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Portfolio Management Table</span>
                <Badge className="bg-green-500/20 text-green-400">
                  {portfolioData.length} owned
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <UnifiedTable
                columns={portfolioTableColumns}
                data={portfolioData}
                loading={loading}
                enableSorting={true}
                enableFiltering={true}
                enableVirtualization={true}
                defaultViewMode={{ mode: 'table' }}
                searchPlaceholder="Search your collection..."
                emptyStateMessage="No moments in portfolio"
                loadingMessage="Loading portfolio..."
                containerHeight={600}
                onRowClick={(moment) => {
                  console.log('Clicked portfolio moment:', moment.id)
                }}
                renderGridCard={(moment, index) => (
                  <PortfolioGridCard
                    moment={moment}
                    index={index}
                    onRowClick={(moment) => console.log('Portfolio card clicked:', moment.id)}
                  />
                )}
              />
            </CardContent>
          </Card>
        )}

        {activeDemo === 'activity' && (
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Activity Feed Table</span>
                <Badge className="bg-purple-500/20 text-purple-400">
                  {activityData.length} activities
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <UnifiedTable
                columns={activityTableColumns}
                data={activityData}
                loading={loading}
                enableSorting={true}
                enableFiltering={true}
                enableVirtualization={true}
                defaultViewMode={{ mode: 'table' }}
                searchPlaceholder="Search activities..."
                emptyStateMessage="No activities found"
                loadingMessage="Loading activities..."
                containerHeight={600}
                onRowClick={(activity) => {
                  console.log('Clicked activity:', activity.id)
                }}
                renderListItem={(activity, index) => (
                  <ActivityListItem
                    activity={activity}
                    index={index}
                    onRowClick={(activity) => console.log('Activity clicked:', activity.id)}
                  />
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* Usage Instructions */}
        <Card className="bg-[#1a1a1a] border-gray-800 mt-8">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Usage</h4>
              <pre className="bg-[#0a0a0a] rounded p-4 text-sm overflow-x-auto">
{`import { UnifiedTable } from '@/components/table/UnifiedTable'
import { momentTableColumns } from '@/components/table/configs/MomentTableConfig'

<UnifiedTable
  columns={momentTableColumns}
  data={moments}
  enableSorting={true}
  enableFiltering={true}
  defaultViewMode={{ mode: 'grid', gridColumns: 4 }}
  containerHeight={600}
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• <strong>View Modes:</strong> Switch between table, grid, and list views</li>
                <li>• <strong>Sorting:</strong> Click column headers to sort data</li>
                <li>• <strong>Filtering:</strong> Global search and column-specific filters</li>
                <li>• <strong>Virtual Scrolling:</strong> Handle thousands of rows smoothly</li>
                <li>• <strong>Responsive:</strong> Mobile-optimized layouts and interactions</li>
                <li>• <strong>Customizable:</strong> Custom cell renderers and view components</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance Tips</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Enable virtual scrolling for datasets &gt; 100 items</li>
                <li>• Use memo for expensive cell renderers</li>
                <li>• Implement server-side filtering for very large datasets</li>
                <li>• Debounce search inputs (already implemented)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 