import { NextRequest, NextResponse } from 'next/server'

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

// Mock watchlist data
let mockWatchlist: WatchlistItem[] = [
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
  },
  {
    id: '4',
    asset: {
      name: 'Kevin Durant - Series 1',
      image: '/durant.jpg',
      floorPrice: 180,
      currentPrice: 165,
      platform: 'TopShot'
    },
    alerts: {
      priceAbove: 200,
      priceBelow: 150,
      volumeSpike: false,
      newListings: false,
      offerReceived: true
    },
    notes: 'Injury recovery watch',
    priority: 'low',
    addedAt: '2024-01-12',
    lastChecked: '2024-01-20T08:45:00Z',
    status: 'paused',
    priceChange: -8.3,
    volumeChange: -15.2
  },
  {
    id: '5',
    asset: {
      name: 'Luka Doncic - Series 2',
      image: '/luka.jpg',
      floorPrice: 320,
      currentPrice: 380,
      platform: 'TopShot'
    },
    alerts: {
      priceAbove: 450,
      priceBelow: 280,
      volumeSpike: true,
      newListings: true,
      offerReceived: false
    },
    notes: 'Triple-double machine',
    priority: 'high',
    addedAt: '2024-01-14',
    lastChecked: '2024-01-20T12:15:00Z',
    status: 'active',
    priceChange: 18.8,
    volumeChange: 62.3
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address') || 'demo-wallet'
    const filter = searchParams.get('filter') || 'all'
    const priority = searchParams.get('priority') || 'all'
    const status = searchParams.get('status') || 'all'

    let filteredWatchlist = [...mockWatchlist]

    // Apply filters
    if (priority !== 'all') {
      filteredWatchlist = filteredWatchlist.filter(item => item.priority === priority)
    }

    if (status !== 'all') {
      filteredWatchlist = filteredWatchlist.filter(item => item.status === status)
    }

    // Calculate stats
    const stats = {
      totalItems: mockWatchlist.length,
      activeAlerts: mockWatchlist.filter(item => item.status === 'active').length,
      triggeredAlerts: mockWatchlist.filter(item => item.status === 'triggered').length,
      priceTargets: mockWatchlist.filter(item => item.alerts.priceAbove || item.alerts.priceBelow).length,
      volumeTargets: mockWatchlist.filter(item => item.alerts.volumeSpike).length,
      totalValue: mockWatchlist.reduce((sum, item) => sum + item.asset.currentPrice, 0)
    }

    return NextResponse.json({
      success: true,
      data: {
        watchlist: filteredWatchlist,
        stats,
        walletAddress
      }
    })
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch watchlist' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, itemId, data } = body

    switch (action) {
      case 'add':
        const newItem: WatchlistItem = {
          id: Date.now().toString(),
          asset: data.asset,
          alerts: data.alerts || {
            priceAbove: null,
            priceBelow: null,
            volumeSpike: false,
            newListings: false,
            offerReceived: false
          },
          notes: data.notes || '',
          priority: data.priority || 'medium',
          addedAt: new Date().toISOString(),
          lastChecked: new Date().toISOString(),
          status: 'active',
          priceChange: 0,
          volumeChange: 0
        }
        mockWatchlist.push(newItem)
        return NextResponse.json({ success: true, data: newItem })

      case 'update':
        const updateIndex = mockWatchlist.findIndex(item => item.id === itemId)
        if (updateIndex !== -1) {
          mockWatchlist[updateIndex] = { ...mockWatchlist[updateIndex], ...data }
          return NextResponse.json({ success: true, data: mockWatchlist[updateIndex] })
        }
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })

      case 'remove':
        const removeIndex = mockWatchlist.findIndex(item => item.id === itemId)
        if (removeIndex !== -1) {
          const removedItem = mockWatchlist.splice(removeIndex, 1)[0]
          return NextResponse.json({ success: true, data: removedItem })
        }
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })

      case 'toggle_alert':
        const toggleIndex = mockWatchlist.findIndex(item => item.id === itemId)
        if (toggleIndex !== -1) {
          const { alertType, enabled } = data
          if (alertType === 'priceAbove' || alertType === 'priceBelow') {
            if (enabled) {
              mockWatchlist[toggleIndex].alerts[alertType as 'priceAbove' | 'priceBelow'] = data.value
            } else {
              mockWatchlist[toggleIndex].alerts[alertType as 'priceAbove' | 'priceBelow'] = null
            }
          } else if (alertType === 'volumeSpike' || alertType === 'newListings' || alertType === 'offerReceived') {
            (mockWatchlist[toggleIndex].alerts as any)[alertType] = enabled
          }
          return NextResponse.json({ success: true, data: mockWatchlist[toggleIndex] })
        }
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })

      case 'update_status':
        const statusIndex = mockWatchlist.findIndex(item => item.id === itemId)
        if (statusIndex !== -1) {
          mockWatchlist[statusIndex].status = data.status
          mockWatchlist[statusIndex].lastChecked = new Date().toISOString()
          return NextResponse.json({ success: true, data: mockWatchlist[statusIndex] })
        }
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 })

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing watchlist action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process action' },
      { status: 500 }
    )
  }
} 