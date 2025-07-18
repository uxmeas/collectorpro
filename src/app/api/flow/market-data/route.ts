import { NextRequest, NextResponse } from 'next/server'
import { flowTopShotService } from '@/lib/flow-topshot-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'nba' | 'wnba' | 'combined' || 'combined'
    
    console.log(`📊 API: Fetching ${type.toUpperCase()} market analytics...`)

    const marketData = await flowTopShotService.getFlowMarketAnalytics(type)

    return NextResponse.json({
      success: true,
      data: marketData,
      type,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in market data API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch market data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'combined', timeframe = '24h' } = body
    
    console.log(`📊 API: Fetching ${type.toUpperCase()} market analytics for ${timeframe}...`)

    const marketData = await flowTopShotService.getFlowMarketAnalytics(type)

    // In a real implementation, you'd adjust data based on timeframe
    // For now, we return the same data regardless of timeframe
    return NextResponse.json({
      success: true,
      data: marketData,
      type,
      timeframe,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in market data API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch market data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 