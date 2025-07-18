import { NextRequest, NextResponse } from 'next/server'
import { flowTopShotService } from '@/lib/flow-topshot-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'nba' | 'wnba' | 'combined' || 'combined'
    
    console.log(`🏀 API: Fetching ${type.toUpperCase()} collections data...`)

    let collections
    switch (type) {
      case 'nba':
        collections = await flowTopShotService.getNBATopShotCollections()
        break
      case 'wnba':
        collections = await flowTopShotService.getWNBACollections()
        break
      default:
        collections = await flowTopShotService.getCombinedFlowData()
    }

    return NextResponse.json({
      success: true,
      data: collections,
      type,
      count: collections.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in collections API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch collections data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type = 'combined', filters = {} } = body
    
    console.log(`🏀 API: Fetching filtered ${type.toUpperCase()} collections...`)

    let collections
    switch (type) {
      case 'nba':
        collections = await flowTopShotService.getNBATopShotCollections()
        break
      case 'wnba':
        collections = await flowTopShotService.getWNBACollections()
        break
      default:
        collections = await flowTopShotService.getCombinedFlowData()
    }

    // Apply filters if provided
    if (filters.search) {
      collections = collections.filter(collection =>
        collection.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        collection.series.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.minFloor) {
      collections = collections.filter(collection => collection.floorPrice >= filters.minFloor)
    }

    if (filters.maxFloor) {
      collections = collections.filter(collection => collection.floorPrice <= filters.maxFloor)
    }

    if (filters.series) {
      collections = collections.filter(collection => 
        collection.series.toLowerCase().includes(filters.series.toLowerCase())
      )
    }

    return NextResponse.json({
      success: true,
      data: collections,
      type,
      filters,
      count: collections.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error in filtered collections API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filtered collections data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 