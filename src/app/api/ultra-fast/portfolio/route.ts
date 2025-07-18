import { NextRequest, NextResponse } from 'next/server'
import { EnhancedFlowBlockchainService } from '../../../../lib/flow-blockchain-enhanced'

// In-memory cache for lightning-fast responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

// Performance monitoring
const performanceLog = {
  requests: 0,
  cacheHits: 0,
  averageResponseTime: 0,
  lastCleanup: Date.now()
}

// Cache cleanup - runs every 5 minutes
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000
const DEFAULT_TTL = 10 * 60 * 1000 // 10 minutes

function cleanupCache() {
  const now = Date.now()
  if (now - performanceLog.lastCleanup > CACHE_CLEANUP_INTERVAL) {
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        cache.delete(key)
      }
    }
    performanceLog.lastCleanup = now
  }
}

function getCachedData(key: string) {
  cleanupCache()
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    performanceLog.cacheHits++
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any, ttl: number = DEFAULT_TTL) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

// Optimized moment processing for minimal data transfer
function optimizeMomentData(moment: any) {
  return {
    // Core identifiers
    id: moment.id,
    playId: moment.playId,
    
    // Essential display data
    playerName: moment.playerName,
    teamName: moment.teamName,
    set: moment.set,
    rarity: moment.rarity,
    serialNumber: moment.serialNumber,
    
    // Critical financial data
    currentValue: moment.currentValue,
    purchasePrice: moment.purchasePrice,
    gainLoss: moment.gainLoss,
    gainLossPercentage: moment.gainLossPercentage,
    
    // Key market data
    lowAsk: moment.lowAsk,
    highestOffer: moment.highestOffer,
    priceChange24h: moment.priceChange24h,
    
    // Essential metadata
    totalCirculation: moment.totalCirculation,
    rarityScore: moment.rarityScore,
    purchaseDate: moment.purchaseDate,
    badges: moment.metadata.badges.slice(0, 5), // Limit for performance
    
    // Special attributes (compressed)
    lockStatus: moment.lockStatus,
    challengeReward: moment.challengeReward,
    
    // Computed fields for sorting/filtering
    profitMargin: ((moment.currentValue - moment.purchasePrice) / moment.purchasePrice) * 100,
    discountFromFMV: moment.trueValue ? ((moment.trueValue - moment.currentValue) / moment.trueValue) * 100 : 0,
    liquidityScore: moment.liquidityScore || 0,
    
    // Performance optimizations
    searchText: `${moment.playerName} ${moment.teamName} ${moment.set} ${moment.serialNumber}`.toLowerCase(),
    sortKey: moment.currentValue // Pre-computed sort key
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  performanceLog.requests++
  
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    console.log(`⚡ ULTRA-FAST: Processing request for wallet: ${address}`)

    // Check cache first for lightning-fast responses
    const cacheKey = `ultra_portfolio_${address}`
    const cachedResult = getCachedData(cacheKey)
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime
      console.log(`🚀 CACHE HIT: Response in ${responseTime}ms (${performanceLog.cacheHits}/${performanceLog.requests} cache rate)`)
      
      return NextResponse.json({
        success: true,
        data: cachedResult,
        performance: {
          responseTime,
          cached: true,
          cacheHitRate: (performanceLog.cacheHits / performanceLog.requests * 100).toFixed(1)
        }
      })
    }

    // Fetch data with performance monitoring
    const service = new EnhancedFlowBlockchainService()
    
    console.log(`🔍 ULTRA-FAST: Fetching comprehensive moments for wallet: ${address}`)
    const fetchStartTime = Date.now()
    const moments = await service.getComprehensiveMoments(address)
    const fetchTime = Date.now() - fetchStartTime
    
    console.log(`📊 ULTRA-FAST: Processing ${moments.length} moments`)
    const processStartTime = Date.now()
    
    // Optimize data for ultra-fast frontend processing
    const optimizedMoments = moments.map(optimizeMomentData)
    
    // Pre-compute analytics for instant dashboard loading
    const analytics = {
      totalMoments: moments.length,
      totalValue: optimizedMoments.reduce((sum, m) => sum + m.currentValue, 0),
      totalCost: optimizedMoments.reduce((sum, m) => sum + m.purchasePrice, 0),
      totalProfit: optimizedMoments.reduce((sum, m) => sum + m.gainLoss, 0),
      
      // Performance-optimized breakdowns
      rarityBreakdown: optimizedMoments.reduce((acc, m) => {
        acc[m.rarity] = (acc[m.rarity] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      
      teamBreakdown: optimizedMoments.reduce((acc, m) => {
        acc[m.teamName] = (acc[m.teamName] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      
      setBreakdown: optimizedMoments.reduce((acc, m) => {
        acc[m.set] = (acc[m.set] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      
      // Top performers for instant display
      topPerformers: optimizedMoments
        .sort((a, b) => b.gainLoss - a.gainLoss)
        .slice(0, 10)
        .map(m => ({
          id: m.id,
          playerName: m.playerName,
          gainLoss: m.gainLoss,
          gainLossPercentage: m.gainLossPercentage
        })),
      
      // Instant filter options
      filterOptions: {
        players: [...new Set(optimizedMoments.map(m => m.playerName))].sort(),
        teams: [...new Set(optimizedMoments.map(m => m.teamName))].sort(),
        sets: [...new Set(optimizedMoments.map(m => m.set))].sort(),
        rarities: [...new Set(optimizedMoments.map(m => m.rarity))].sort(),
        priceRange: {
          min: Math.min(...optimizedMoments.map(m => m.currentValue)),
          max: Math.max(...optimizedMoments.map(m => m.currentValue))
        },
        serialRange: {
          min: Math.min(...optimizedMoments.map(m => m.serialNumber)),
          max: Math.max(...optimizedMoments.map(m => m.serialNumber))
        }
      }
    }
    
    const processTime = Date.now() - processStartTime
    
    const result = {
      wallet: address,
      moments: optimizedMoments,
      analytics,
      performance: {
        totalMoments: moments.length,
        optimizedMoments: optimizedMoments.length,
        dataReduction: ((moments.length - optimizedMoments.length) / moments.length * 100).toFixed(1),
        fetchTime,
        processTime
      },
      lastUpdated: new Date().toISOString()
    }

    // Cache result for lightning-fast subsequent requests
    setCachedData(cacheKey, result, DEFAULT_TTL)
    
    const responseTime = Date.now() - startTime
    performanceLog.averageResponseTime = (performanceLog.averageResponseTime + responseTime) / 2
    
    console.log(`✅ ULTRA-FAST: Complete in ${responseTime}ms (fetch: ${fetchTime}ms, process: ${processTime}ms)`)
    console.log(`📈 PERFORMANCE: Avg response time: ${performanceLog.averageResponseTime.toFixed(0)}ms`)
    
    return NextResponse.json({
      success: true,
      data: result,
      performance: {
        responseTime,
        fetchTime,
        processTime,
        cached: false,
        cacheHitRate: (performanceLog.cacheHits / performanceLog.requests * 100).toFixed(1),
        averageResponseTime: performanceLog.averageResponseTime.toFixed(0)
      }
    })

  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error(`❌ ULTRA-FAST ERROR after ${responseTime}ms:`, error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch portfolio data',
        performance: {
          responseTime,
          cached: false,
          error: true
        }
      },
      { status: 500 }
    )
  }
}

// Performance monitoring endpoint
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'clear-cache') {
    cache.clear()
    performanceLog.cacheHits = 0
    performanceLog.requests = 0
    performanceLog.averageResponseTime = 0
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared and performance stats reset'
    })
  }
  
  if (action === 'stats') {
    return NextResponse.json({
      success: true,
      stats: {
        ...performanceLog,
        cacheSize: cache.size,
        cacheHitRate: performanceLog.requests > 0 ? (performanceLog.cacheHits / performanceLog.requests * 100).toFixed(1) : 0,
        memoryUsage: process.memoryUsage()
      }
    })
  }
  
  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  )
} 