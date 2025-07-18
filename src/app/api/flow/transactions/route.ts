import { NextRequest, NextResponse } from 'next/server'
import { flowTopShotService } from '@/lib/flow-topshot-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'nba' | 'wnba' | 'combined' || 'combined'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    console.log(`🔄 API: Fetching ${limit} live ${type.toUpperCase()} transactions...`)

    const transactions = await flowTopShotService.getLiveTransactions(type, limit)

    return NextResponse.json({
      success: true,
      data: transactions,
      type,
      limit,
      count: transactions.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in transactions API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch transaction data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      type = 'combined', 
      limit = 50, 
      filters = {},
      eventTypes = ['sale', 'mint', 'transfer']
    } = body
    
    console.log(`🔄 API: Fetching filtered ${type.toUpperCase()} transactions...`)

    let transactions = await flowTopShotService.getLiveTransactions(type, limit * 2) // Get more to allow for filtering

    // Apply filters
    if (filters.player) {
      transactions = transactions.filter(tx =>
        tx.playerName.toLowerCase().includes(filters.player.toLowerCase())
      )
    }

    if (filters.minPrice) {
      transactions = transactions.filter(tx => tx.price >= filters.minPrice)
    }

    if (filters.maxPrice) {
      transactions = transactions.filter(tx => tx.price <= filters.maxPrice)
    }

    if (filters.rarity) {
      transactions = transactions.filter(tx => tx.rarity === filters.rarity)
    }

    if (eventTypes.length > 0) {
      transactions = transactions.filter(tx => eventTypes.includes(tx.type))
    }

    // Limit to requested amount after filtering
    transactions = transactions.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: transactions,
      type,
      filters,
      eventTypes,
      limit,
      count: transactions.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in filtered transactions API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filtered transaction data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 