import { NextRequest, NextResponse } from 'next/server'

interface MarketplaceFilters {
  searchTerm?: string
  league?: 'NBA' | 'WNBA' | 'BOTH'
  players?: string[]
  teams?: string[]
  sets?: string[]
  setNames?: string[]
  series?: string[]
  tier?: string[]
}

interface NBATopShotMoment {
  id: string
  playerName: string
  playDescription: string
  setName: string
  series: string
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Ultimate'
  circulation: number
  serialNumber: number
  supply: number
  lowAsk: number
  highestOffer: number
  owned: number
  inPacks: number
  burned: number
  locked: number
  listed: number
  sales: number
  playerImage: string
  teamName: string
  lastSalePrice?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filters, limit = 50 } = body
    
    console.log('🔍 MARKETPLACE: Fetching NBA TopShot marketplace data with filters:', filters)
    
    // Simulate fetching from real NBA TopShot marketplace API
    // In production, this would make calls to the official NBA TopShot GraphQL API
    const moments: NBATopShotMoment[] = [
      {
        id: '1',
        playerName: 'SHAI GILGEOUS-ALEXANDER',
        playDescription: 'Thunder 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25',
        rarity: 'Common',
        circulation: 3000,
        serialNumber: 1234,
        supply: 3000,
        lowAsk: 8.00,
        highestOffer: 1.00,
        owned: 65,
        inPacks: 2035,
        burned: 0,
        locked: 4,
        listed: 3,
        sales: 8,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628983.png',
        teamName: 'Oklahoma City Thunder'
      },
      {
        id: '2', 
        playerName: 'GIANNIS ANTETOKOUNMPO',
        playDescription: 'Bucks 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25',
        rarity: 'Rare',
        circulation: 1500,
        serialNumber: 5678,
        supply: 1500,
        lowAsk: 25.00,
        highestOffer: 15.00,
        owned: 32,
        inPacks: 1200,
        burned: 0,
        locked: 8,
        listed: 5,
        sales: 15,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/203507.png',
        teamName: 'Milwaukee Bucks'
      },
      {
        id: '3',
        playerName: 'DEAARON FOX', 
        playDescription: 'Kings 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25', 
        rarity: 'Legendary',
        circulation: 500,
        serialNumber: 91,
        supply: 500,
        lowAsk: 75.00,
        highestOffer: 50.00,
        owned: 12,
        inPacks: 350,
        burned: 0,
        locked: 15,
        listed: 8,
        sales: 25,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628368.png',
        teamName: 'Sacramento Kings'
      },
      {
        id: '4',
        playerName: 'JAYSON TATUM',
        playDescription: 'Celtics 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25',
        rarity: 'Rare',
        circulation: 1200,
        serialNumber: 789,
        supply: 1200,
        lowAsk: 45.00,
        highestOffer: 35.00,
        owned: 28,
        inPacks: 890,
        burned: 0,
        locked: 12,
        listed: 6,
        sales: 22,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1628369.png',
        teamName: 'Boston Celtics'
      },
      {
        id: '5',
        playerName: 'VICTOR WEMBANYAMA',
        playDescription: 'Spurs 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25',
        rarity: 'Ultimate',
        circulation: 99,
        serialNumber: 23,
        supply: 99,
        lowAsk: 500.00,
        highestOffer: 400.00,
        owned: 3,
        inPacks: 65,
        burned: 0,
        locked: 25,
        listed: 2,
        sales: 45,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1630569.png',
        teamName: 'San Antonio Spurs'
      },
      {
        id: '6',
        playerName: 'LUKA DONČIĆ',
        playDescription: 'Mavericks 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25',
        rarity: 'Legendary',
        circulation: 750,
        serialNumber: 456,
        supply: 750,
        lowAsk: 125.00,
        highestOffer: 100.00,
        owned: 18,
        inPacks: 520,
        burned: 0,
        locked: 22,
        listed: 9,
        sales: 35,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1629029.png',
        teamName: 'Dallas Mavericks'
      },
      {
        id: '7',
        playerName: 'ANTHONY EDWARDS',
        playDescription: 'Timberwolves 2024',
        setName: 'Series 2024-25',
        series: 'Series 2024-25',
        rarity: 'Common',
        circulation: 4000,
        serialNumber: 3421,
        supply: 4000,
        lowAsk: 12.00,
        highestOffer: 8.00,
        owned: 85,
        inPacks: 2890,
        burned: 0,
        locked: 6,
        listed: 4,
        sales: 12,
        playerImage: 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1630162.png',
        teamName: 'Minnesota Timberwolves'
      }
    ]
    
    // Apply filters
    let filteredMoments = moments
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filteredMoments = filteredMoments.filter(moment => 
        moment.playerName.toLowerCase().includes(searchLower) ||
        moment.teamName.toLowerCase().includes(searchLower) ||
        moment.setName.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters?.players?.length > 0) {
      filteredMoments = filteredMoments.filter(moment =>
        filters.players.some((player: string) => 
          moment.playerName.toLowerCase().includes(player.toLowerCase())
        )
      )
    }
    
    if (filters?.teams?.length > 0) {
      filteredMoments = filteredMoments.filter(moment =>
        filters.teams.some((team: string) => 
          moment.teamName.toLowerCase().includes(team.toLowerCase())
        )
      )
    }
    
    if (filters?.tier?.length > 0) {
      filteredMoments = filteredMoments.filter(moment =>
        filters.tier.includes(moment.rarity)
      )
    }
    
    // Add some randomization to simulate live data
    filteredMoments = filteredMoments.map(moment => ({
      ...moment,
      lowAsk: moment.lowAsk + (Math.random() - 0.5) * 2, // ±$1 variation
      highestOffer: moment.highestOffer + (Math.random() - 0.5) * 1, // ±$0.50 variation
      listed: moment.listed + Math.floor((Math.random() - 0.5) * 4), // ±2 variation
      sales: moment.sales + Math.floor(Math.random() * 3) // 0-2 new sales
    }))
    
    // Limit results
    filteredMoments = filteredMoments.slice(0, limit)
    
    console.log(`✅ MARKETPLACE: Returning ${filteredMoments.length} moments`)
    
    return NextResponse.json({
      success: true,
      data: {
        moments: filteredMoments,
        total: filteredMoments.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ MARKETPLACE: Error fetching marketplace data:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch marketplace data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  // Handle GET requests with default parameters
  return POST(new NextRequest('http://localhost/api/flow/marketplace', {
    method: 'POST',
    body: JSON.stringify({ filters: {}, limit: 50 })
  }))
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 