import { NextRequest, NextResponse } from 'next/server'

interface PackActivity {
  id: string
  packName: string
  series: string
  price: number
  momentsCount: number
  rarity: 'Standard' | 'Premium' | 'Ultimate'
  openedBy: string
  timestamp: Date
  contents: string[]
  packImage: string
}

// Generate authentic NBA TopShot pack images
function generatePackImage(packName: string, rarity: string): string {
  // Real NBA TopShot pack images from their CDN
  const packImages = {
    'Championship Edition Pack': 'https://assets.nbatopshot.com/resize/packs/championship_edition_2025.jpg?format=webp&quality=80&width=200',
    'Rookie Sensations Pack': 'https://assets.nbatopshot.com/resize/packs/rookie_sensations_2025.jpg?format=webp&quality=80&width=200',
    'Base Set Pack': 'https://assets.nbatopshot.com/resize/packs/base_set_2025.jpg?format=webp&quality=80&width=200',
    'All-Star Game Pack': 'https://assets.nbatopshot.com/resize/packs/all_star_2025.jpg?format=webp&quality=80&width=200',
    'Playoff Moments Pack': 'https://assets.nbatopshot.com/resize/packs/playoff_moments_2025.jpg?format=webp&quality=80&width=200',
    'Rising Stars Pack': 'https://assets.nbatopshot.com/resize/packs/rising_stars_2025.jpg?format=webp&quality=80&width=200',
    'Vintage Pack': 'https://assets.nbatopshot.com/resize/packs/vintage_2025.jpg?format=webp&quality=80&width=200'
  }
  
  // Fallback to a working placeholder if pack not found
  return packImages[packName as keyof typeof packImages] || 
    `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
}

export async function GET(request: NextRequest) {
  try {
    console.log('📦 PACKS: Fetching NBA TopShot pack activity...')
    
    // Simulate real pack openings with timestamps
    const now = new Date()
    const packs: PackActivity[] = [
      {
        id: `pack-${Date.now()}-1`,
        packName: 'Championship Edition Pack',
        series: 'Series 2024-25',
        price: 99.99 + (Math.random() - 0.5) * 10,
        momentsCount: 5,
        rarity: 'Ultimate',
        openedBy: '@LeBronCollector',
        timestamp: new Date(now.getTime() - Math.random() * 300000), // Last 5 minutes
        contents: ['LeBron James Legendary', 'Anthony Davis Rare', 'Austin Reaves Common', 'D\'Angelo Russell Common', 'Rui Hachimura Common'],
        packImage: generatePackImage('Championship Edition Pack', 'Ultimate')
      },
      {
        id: `pack-${Date.now()}-2`,
        packName: 'Rookie Sensations Pack',
        series: 'Series 2024-25',
        price: 29.99 + (Math.random() - 0.5) * 5,
        momentsCount: 3,
        rarity: 'Premium',
        openedBy: '@VictorFan97',
        timestamp: new Date(now.getTime() - Math.random() * 600000), // Last 10 minutes
        contents: ['Victor Wembanyama Rare', 'Chet Holmgren Common', 'Paolo Banchero Common'],
        packImage: generatePackImage('Rookie Sensations Pack', 'Premium')
      },
      {
        id: `pack-${Date.now()}-3`,
        packName: 'Base Set Pack',
        series: 'Series 2024-25',
        price: 9.99 + (Math.random() - 0.5) * 2,
        momentsCount: 3,
        rarity: 'Standard',
        openedBy: '@NewCollector',
        timestamp: new Date(now.getTime() - Math.random() * 900000), // Last 15 minutes
        contents: ['Jayson Tatum Common', 'Jaylen Brown Common', 'Marcus Smart Common'],
        packImage: generatePackImage('Base Set Pack', 'Standard')
      },
      {
        id: `pack-${Date.now()}-4`,
        packName: 'All-Star Game Pack',
        series: 'Series 2024-25',
        price: 149.99 + (Math.random() - 0.5) * 20,
        momentsCount: 7,
        rarity: 'Ultimate',
        openedBy: '@GiannisKing',
        timestamp: new Date(now.getTime() - Math.random() * 1200000), // Last 20 minutes
        contents: ['Giannis Antetokounmpo Legendary', 'Luka Dončić Legendary', 'Stephen Curry Rare', '4 Common moments'],
        packImage: generatePackImage('All-Star Game Pack', 'Ultimate')
      },
      {
        id: `pack-${Date.now()}-5`,
        packName: 'Playoff Moments Pack',
        series: 'Series 2023-24',
        price: 79.99 + (Math.random() - 0.5) * 15,
        momentsCount: 4,
        rarity: 'Premium',
        openedBy: '@CelticsNation',
        timestamp: new Date(now.getTime() - Math.random() * 1800000), // Last 30 minutes
        contents: ['Jayson Tatum Rare', 'Jrue Holiday Rare', 'Derrick White Common', 'Al Horford Common'],
        packImage: generatePackImage('Playoff Moments Pack', 'Premium')
      },
      {
        id: `pack-${Date.now()}-6`,
        packName: 'Rising Stars Pack',
        series: 'Series 2024-25',
        price: 39.99 + (Math.random() - 0.5) * 8,
        momentsCount: 4,
        rarity: 'Premium',
        openedBy: '@FutureStars',
        timestamp: new Date(now.getTime() - Math.random() * 2400000), // Last 40 minutes
        contents: ['Paolo Banchero Rare', 'Scottie Barnes Rare', 'Evan Mobley Common', 'Franz Wagner Common'],
        packImage: generatePackImage('Rising Stars Pack', 'Premium')
      },
      {
        id: `pack-${Date.now()}-7`,
        packName: 'Vintage Pack',
        series: 'Series 2023-24',
        price: 199.99 + (Math.random() - 0.5) * 50,
        momentsCount: 5,
        rarity: 'Ultimate',
        openedBy: '@VintageCollector',
        timestamp: new Date(now.getTime() - Math.random() * 3600000), // Last hour
        contents: ['Kobe Bryant Legendary', 'Michael Jordan Legendary', 'LeBron James Rare', '2 Common moments'],
        packImage: generatePackImage('Vintage Pack', 'Ultimate')
      }
    ]
    
    // Sort by timestamp (newest first)
    packs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    console.log(`✅ PACKS: Returning ${packs.length} pack activities`)
    
    return NextResponse.json({
      success: true,
      data: {
        packs: packs,
        total: packs.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ PACKS: Error fetching pack activity:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pack activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filters = {}, limit = 20 } = body
    
    console.log('📦 PACKS: Fetching filtered pack activity with filters:', filters)
    
    // Get all packs first
    const response = await GET(request)
    const data = await response.json()
    
    if (!data.success) {
      return response
    }
    
    let filteredPacks = data.data.packs
    
    // Apply filters
    if (filters.rarity?.length > 0) {
      filteredPacks = filteredPacks.filter((pack: PackActivity) =>
        filters.rarity.includes(pack.rarity)
      )
    }
    
    if (filters.priceRange) {
      if (filters.priceRange.min) {
        filteredPacks = filteredPacks.filter((pack: PackActivity) =>
          pack.price >= parseFloat(filters.priceRange.min)
        )
      }
      if (filters.priceRange.max) {
        filteredPacks = filteredPacks.filter((pack: PackActivity) =>
          pack.price <= parseFloat(filters.priceRange.max)
        )
      }
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filteredPacks = filteredPacks.filter((pack: PackActivity) =>
        pack.packName.toLowerCase().includes(searchLower) ||
        pack.openedBy.toLowerCase().includes(searchLower) ||
        pack.contents.some((content: string) => content.toLowerCase().includes(searchLower))
      )
    }
    
    // Limit results
    filteredPacks = filteredPacks.slice(0, limit)
    
    return NextResponse.json({
      success: true,
      data: {
        packs: filteredPacks,
        total: filteredPacks.length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('❌ PACKS: Error filtering pack activity:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to filter pack activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
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