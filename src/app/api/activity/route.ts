import { NextRequest, NextResponse } from 'next/server'
import { FlowActivityService, ActivityFilters } from '@/lib/flow-activity-service'

const activityService = new FlowActivityService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const filters: ActivityFilters = {}
    
    // Event types filter
    const eventTypes = searchParams.get('eventTypes')
    if (eventTypes) {
      filters.eventTypes = eventTypes.split(',')
    }
    
    // Price range filter
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      filters.priceRange = {
        min: minPrice ? parseInt(minPrice) : undefined,
        max: maxPrice ? parseInt(maxPrice) : undefined
      }
    }
    
    // Rarities filter
    const rarities = searchParams.get('rarities')
    if (rarities) {
      filters.rarities = rarities.split(',')
    }
    
    // Sets filter
    const sets = searchParams.get('sets')
    if (sets) {
      filters.sets = sets.split(',')
    }
    
    // Players filter
    const players = searchParams.get('players')
    if (players) {
      filters.players = players.split(',')
    }
    
    // Pagination
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    if (limit) {
      filters.limit = parseInt(limit)
    }
    if (offset) {
      filters.offset = parseInt(offset)
    }
    
    // Time range filter
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate || endDate) {
      filters.timeRange = {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? new Date(endDate) : undefined
      }
    }
    
    console.log('🔍 ACTIVITY: Fetching NBA Top Shot activity with filters:', filters)
    
    // Fetch activity data
    const activityData = await activityService.getNBATopShotActivity(filters)
    
    console.log(`✅ ACTIVITY: Retrieved ${activityData.transactions.length} transactions`)
    
    return NextResponse.json({
      success: true,
      data: activityData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ ACTIVITY: Error fetching activity data:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch activity data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filters, search } = body
    
    console.log('🔍 ACTIVITY: Advanced search with filters:', filters)
    
    // Build comprehensive filters
    const activityFilters: ActivityFilters = {
      ...filters,
      limit: filters.limit || 50,
      offset: filters.offset || 0
    }
    
    // Add search term processing
    if (search) {
      // This would be processed to search player names, play descriptions, etc.
      console.log('🔍 Search term:', search)
    }
    
    // Fetch activity data
    const activityData = await activityService.getNBATopShotActivity(activityFilters)
    
    // Get additional statistics
    const statistics = await activityService.getActivityStatistics()
    
    return NextResponse.json({
      success: true,
      data: {
        ...activityData,
        statistics
      },
      filters: activityFilters,
      search,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ ACTIVITY: Error in advanced search:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process activity search',
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