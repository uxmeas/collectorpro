import { NextRequest, NextResponse } from 'next/server'

export interface OfferAnalyticsData {
  successRate: {
    accepted: number
    declined: number
    expired: number
  }
  priceRanges: {
    range: string
    count: number
    avgSuccessRate: number
  }[]
  activityOverTime: {
    date: string
    received: number
    made: number
    successRate: number
  }[]
  priceVsFloor: {
    offerPrice: number
    floorPrice: number
    percentage: number
    status: 'accepted' | 'declined' | 'expired'
    assetName: string
  }[]
  hotAssets: {
    assetName: string
    offerCount: number
    avgPrice: number
    successRate: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }[]
  offerTrends: {
    period: string
    avgOfferPercentage: number
    floorPriceChange: number
    volume: number
  }[]
  bestOffers: {
    assetName: string
    offerPrice: number
    floorPrice: number
    percentage: number
    status: string
    timestamp: Date
  }[]
  missedOpportunities: {
    assetName: string
    offerPrice: number
    floorPrice: number
    percentage: number
    expiredAt: Date
    currentValue: number
  }[]
  negotiationStats: {
    totalCounterOffers: number
    acceptedCounters: number
    successRate: number
    avgCounterPercentage: number
    avgResponseTime: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address')
    const timeframe = searchParams.get('timeframe') || '30d'

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Mock comprehensive analytics data
    const analyticsData: OfferAnalyticsData = {
      successRate: {
        accepted: 35,
        declined: 45,
        expired: 20
      },
      priceRanges: [
        { range: '$0-100', count: 12, avgSuccessRate: 75 },
        { range: '$100-500', count: 28, avgSuccessRate: 68 },
        { range: '$500-1000', count: 15, avgSuccessRate: 62 },
        { range: '$1000+', count: 8, avgSuccessRate: 55 }
      ],
      activityOverTime: [
        { date: 'Mon', received: 5, made: 3, successRate: 70 },
        { date: 'Tue', received: 8, made: 6, successRate: 75 },
        { date: 'Wed', received: 3, made: 4, successRate: 65 },
        { date: 'Thu', received: 7, made: 5, successRate: 80 },
        { date: 'Fri', received: 6, made: 7, successRate: 72 },
        { date: 'Sat', received: 4, made: 2, successRate: 68 },
        { date: 'Sun', received: 2, made: 3, successRate: 75 }
      ],
      priceVsFloor: [
        { offerPrice: 150, floorPrice: 120, percentage: 25, status: 'accepted', assetName: 'LeBron James - 2023 Playoffs' },
        { offerPrice: 200, floorPrice: 180, percentage: 11, status: 'declined', assetName: 'Stephen Curry - Championship' },
        { offerPrice: 80, floorPrice: 100, percentage: -20, status: 'expired', assetName: 'Giannis - MVP Season' },
        { offerPrice: 300, floorPrice: 250, percentage: 20, status: 'accepted', assetName: 'Kevin Durant - All-Star' },
        { offerPrice: 120, floorPrice: 150, percentage: -20, status: 'declined', assetName: 'Luka Dončić - Triple Double' },
        { offerPrice: 180, floorPrice: 160, percentage: 12.5, status: 'accepted', assetName: 'Ja Morant - Rookie Season' },
        { offerPrice: 90, floorPrice: 110, percentage: -18, status: 'expired', assetName: 'Nikola Jokić - MVP Performance' },
        { offerPrice: 250, floorPrice: 200, percentage: 25, status: 'accepted', assetName: 'Joel Embiid - Scoring Title' }
      ],
      hotAssets: [
        { 
          assetName: 'LeBron James - 2023 Playoffs', 
          offerCount: 15, 
          avgPrice: 250, 
          successRate: 80, 
          trend: 'increasing' 
        },
        { 
          assetName: 'Stephen Curry - Championship Moment', 
          offerCount: 12, 
          avgPrice: 180, 
          successRate: 75, 
          trend: 'stable' 
        },
        { 
          assetName: 'Giannis Antetokounmpo - MVP Season', 
          offerCount: 10, 
          avgPrice: 220, 
          successRate: 70, 
          trend: 'decreasing' 
        },
        { 
          assetName: 'Kevin Durant - All-Star Game', 
          offerCount: 8, 
          avgPrice: 160, 
          successRate: 65, 
          trend: 'increasing' 
        },
        { 
          assetName: 'Luka Dončić - Triple Double', 
          offerCount: 7, 
          avgPrice: 140, 
          successRate: 60, 
          trend: 'stable' 
        },
        { 
          assetName: 'Ja Morant - Rookie Season', 
          offerCount: 6, 
          avgPrice: 120, 
          successRate: 85, 
          trend: 'increasing' 
        }
      ],
      offerTrends: [
        { period: 'Week 1', avgOfferPercentage: 15, floorPriceChange: 5, volume: 25 },
        { period: 'Week 2', avgOfferPercentage: 18, floorPriceChange: 8, volume: 30 },
        { period: 'Week 3', avgOfferPercentage: 12, floorPriceChange: -3, volume: 22 },
        { period: 'Week 4', avgOfferPercentage: 20, floorPriceChange: 12, volume: 35 },
        { period: 'Week 5', avgOfferPercentage: 16, floorPriceChange: 6, volume: 28 },
        { period: 'Week 6', avgOfferPercentage: 22, floorPriceChange: 15, volume: 40 }
      ],
      bestOffers: [
        { 
          assetName: 'LeBron James - 2023 Playoffs', 
          offerPrice: 300, 
          floorPrice: 200, 
          percentage: 50, 
          status: 'accepted', 
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) 
        },
        { 
          assetName: 'Stephen Curry - Championship Moment', 
          offerPrice: 250, 
          floorPrice: 180, 
          percentage: 39, 
          status: 'pending', 
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) 
        },
        { 
          assetName: 'Giannis Antetokounmpo - MVP Season', 
          offerPrice: 280, 
          floorPrice: 220, 
          percentage: 27, 
          status: 'accepted', 
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) 
        },
        { 
          assetName: 'Kevin Durant - All-Star Game', 
          offerPrice: 200, 
          floorPrice: 160, 
          percentage: 25, 
          status: 'accepted', 
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) 
        },
        { 
          assetName: 'Luka Dončić - Triple Double', 
          offerPrice: 180, 
          floorPrice: 150, 
          percentage: 20, 
          status: 'pending', 
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) 
        }
      ],
      missedOpportunities: [
        { 
          assetName: 'LeBron James - 2023 Playoffs', 
          offerPrice: 280, 
          floorPrice: 200, 
          percentage: 40, 
          expiredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
          currentValue: 320 
        },
        { 
          assetName: 'Stephen Curry - Championship Moment', 
          offerPrice: 200, 
          floorPrice: 180, 
          percentage: 11, 
          expiredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
          currentValue: 250 
        },
        { 
          assetName: 'Giannis Antetokounmpo - MVP Season', 
          offerPrice: 240, 
          floorPrice: 220, 
          percentage: 9, 
          expiredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
          currentValue: 280 
        },
        { 
          assetName: 'Kevin Durant - All-Star Game', 
          offerPrice: 150, 
          floorPrice: 160, 
          percentage: -6, 
          expiredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
          currentValue: 190 
        },
        { 
          assetName: 'Luka Dončić - Triple Double', 
          offerPrice: 140, 
          floorPrice: 150, 
          percentage: -7, 
          expiredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
          currentValue: 180 
        }
      ],
      negotiationStats: {
        totalCounterOffers: 25,
        acceptedCounters: 18,
        successRate: 72,
        avgCounterPercentage: 8.5,
        avgResponseTime: 2.3
      }
    }

    return NextResponse.json({
      success: true,
      analytics: analyticsData,
      walletAddress,
      timeframe,
      lastUpdated: new Date()
    })

  } catch (error) {
    console.error('Error fetching offers analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'export_report':
        console.log('Exporting analytics report:', data)
        return NextResponse.json({ 
          success: true, 
          message: 'Report exported successfully',
          downloadUrl: '/api/offers/analytics/export/report.pdf'
        })

      case 'set_alerts':
        console.log('Setting analytics alerts:', data)
        return NextResponse.json({ success: true, message: 'Alerts configured' })

      case 'update_preferences':
        console.log('Updating analytics preferences:', data)
        return NextResponse.json({ success: true, message: 'Preferences updated' })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error processing analytics action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process action' },
      { status: 500 }
    )
  }
} 