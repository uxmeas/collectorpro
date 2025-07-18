import { NextRequest, NextResponse } from 'next/server'

export interface Offer {
  id: string
  type: 'received' | 'made' | 'completed' | 'expired' | 'rejected'
  assetId: string
  assetName: string
  assetImage: string
  platform: 'topshot' | 'allday' | 'panini'
  offerAmount: number
  currentValue: number
  percentageChange: number
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
  timestamp: Date
  expiresAt: Date
  buyerAddress?: string
  sellerAddress?: string
  offerTrend: 'increasing' | 'decreasing' | 'stable'
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('address')
    const type = searchParams.get('type') // 'received', 'made', 'all'
    const platform = searchParams.get('platform') // 'topshot', 'allday', 'panini', 'all'

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Mock offers data - in production, this would fetch from blockchain/API
    const mockOffers: Offer[] = [
      {
        id: '1',
        type: 'received',
        assetId: 'moment_1',
        assetName: 'LeBron James - 2023 Playoffs',
        assetImage: '/api/placeholder/60/60',
        platform: 'topshot',
        offerAmount: 1250,
        currentValue: 1100,
        percentageChange: 13.6,
        status: 'pending',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours left
        buyerAddress: '0x1234...5678',
        offerTrend: 'increasing',
        marketSentiment: 'bullish'
      },
      {
        id: '2',
        type: 'made',
        assetId: 'moment_2',
        assetName: 'Stephen Curry - Championship Moment',
        assetImage: '/api/placeholder/60/60',
        platform: 'topshot',
        offerAmount: 850,
        currentValue: 920,
        percentageChange: -7.6,
        status: 'pending',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours left
        sellerAddress: '0x8765...4321',
        offerTrend: 'decreasing',
        marketSentiment: 'bearish'
      },
      {
        id: '3',
        type: 'completed',
        assetId: 'moment_3',
        assetName: 'Giannis Antetokounmpo - MVP Season',
        assetImage: '/api/placeholder/60/60',
        platform: 'allday',
        offerAmount: 2100,
        currentValue: 2100,
        percentageChange: 0,
        status: 'accepted',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        buyerAddress: '0x1234...5678',
        offerTrend: 'stable',
        marketSentiment: 'neutral'
      },
      {
        id: '4',
        type: 'expired',
        assetId: 'moment_4',
        assetName: 'Kevin Durant - All-Star Game',
        assetImage: '/api/placeholder/60/60',
        platform: 'panini',
        offerAmount: 650,
        currentValue: 720,
        percentageChange: -9.7,
        status: 'expired',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        buyerAddress: '0x1234...5678',
        offerTrend: 'decreasing',
        marketSentiment: 'bearish'
      },
      {
        id: '5',
        type: 'received',
        assetId: 'moment_5',
        assetName: 'Luka Dončić - Triple Double',
        assetImage: '/api/placeholder/60/60',
        platform: 'topshot',
        offerAmount: 1800,
        currentValue: 1650,
        percentageChange: 9.1,
        status: 'pending',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours left
        buyerAddress: '0x9876...5432',
        offerTrend: 'increasing',
        marketSentiment: 'bullish'
      },
      {
        id: '6',
        type: 'made',
        assetId: 'moment_6',
        assetName: 'Ja Morant - Rookie Season',
        assetImage: '/api/placeholder/60/60',
        platform: 'allday',
        offerAmount: 750,
        currentValue: 680,
        percentageChange: 10.3,
        status: 'pending',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours left
        sellerAddress: '0x5432...9876',
        offerTrend: 'increasing',
        marketSentiment: 'bullish'
      },
      {
        id: '7',
        type: 'rejected',
        assetId: 'moment_7',
        assetName: 'Nikola Jokić - MVP Performance',
        assetImage: '/api/placeholder/60/60',
        platform: 'panini',
        offerAmount: 950,
        currentValue: 1200,
        percentageChange: -20.8,
        status: 'rejected',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
        expiresAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        buyerAddress: '0x1111...2222',
        offerTrend: 'decreasing',
        marketSentiment: 'bearish'
      },
      {
        id: '8',
        type: 'completed',
        assetId: 'moment_8',
        assetName: 'Joel Embiid - Scoring Title',
        assetImage: '/api/placeholder/60/60',
        platform: 'topshot',
        offerAmount: 1400,
        currentValue: 1400,
        percentageChange: 0,
        status: 'accepted',
        timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        expiresAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
        buyerAddress: '0x3333...4444',
        offerTrend: 'stable',
        marketSentiment: 'neutral'
      }
    ]

    // Filter offers based on query parameters
    let filteredOffers = mockOffers

    if (type && type !== 'all') {
      filteredOffers = filteredOffers.filter(offer => offer.type === type)
    }

    if (platform && platform !== 'all') {
      filteredOffers = filteredOffers.filter(offer => offer.platform === platform)
    }

    // Calculate stats
    const stats = {
      totalReceived: mockOffers.filter(o => o.type === 'received').length,
      totalMade: mockOffers.filter(o => o.type === 'made').length,
      totalValue: mockOffers.reduce((sum, o) => sum + o.offerAmount, 0),
      avgResponseTime: 4.2, // hours
      acceptanceRate: (mockOffers.filter(o => o.status === 'accepted').length / mockOffers.length) * 100
    }

    // Market pulse data
    const marketPulse = {
      offerTrends: [
        { date: 'Mon', offers: 12, avgAmount: 850, acceptanceRate: 65 },
        { date: 'Tue', offers: 18, avgAmount: 920, acceptanceRate: 72 },
        { date: 'Wed', offers: 15, avgAmount: 780, acceptanceRate: 58 },
        { date: 'Thu', offers: 22, avgAmount: 1100, acceptanceRate: 81 },
        { date: 'Fri', offers: 19, avgAmount: 950, acceptanceRate: 69 },
        { date: 'Sat', offers: 14, avgAmount: 820, acceptanceRate: 64 },
        { date: 'Sun', offers: 16, avgAmount: 890, acceptanceRate: 71 }
      ],
      platformDistribution: [
        { name: 'TopShot', value: 45, color: '#3B82F6' },
        { name: 'AllDay', value: 32, color: '#10B981' },
        { name: 'Panini', value: 23, color: '#F59E0B' }
      ],
      sentimentDistribution: [
        { name: 'Bullish', value: 58, color: '#10B981' },
        { name: 'Neutral', value: 27, color: '#6B7280' },
        { name: 'Bearish', value: 15, color: '#EF4444' }
      ],
      insights: [
        {
          title: 'TopShot Offer Volume Up 23%',
          description: 'Increased interest in playoff moments driving higher offer activity',
          impact: 'positive',
          confidence: 85
        },
        {
          title: 'AllDay Acceptance Rate Declining',
          description: 'Sellers holding out for better prices, 15% drop in acceptance rate',
          impact: 'negative',
          confidence: 72
        },
        {
          title: 'Panini Market Stabilizing',
          description: 'After recent volatility, Panini offers showing consistent patterns',
          impact: 'neutral',
          confidence: 68
        }
      ]
    }

    return NextResponse.json({
      success: true,
      offers: filteredOffers,
      stats,
      marketPulse,
      walletAddress
    })

  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, offerId, ...data } = body

    // Handle different offer actions
    switch (action) {
      case 'accept':
        console.log('Accepting offer:', offerId)
        // TODO: Implement accept logic
        return NextResponse.json({ success: true, message: 'Offer accepted' })

      case 'reject':
        console.log('Rejecting offer:', offerId)
        // TODO: Implement reject logic
        return NextResponse.json({ success: true, message: 'Offer rejected' })

      case 'withdraw':
        console.log('Withdrawing offer:', offerId)
        // TODO: Implement withdraw logic
        return NextResponse.json({ success: true, message: 'Offer withdrawn' })

      case 'counter':
        console.log('Countering offer:', offerId, data)
        // TODO: Implement counter logic
        return NextResponse.json({ success: true, message: 'Counter offer sent' })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error processing offer action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process offer action' },
      { status: 500 }
    )
  }
} 