import { NextRequest, NextResponse } from 'next/server'
import { MultiPlatformService } from '@/lib/multi-platform-service'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('address')
    const platform = searchParams.get('platform')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    console.log(`🔍 MULTI-PLATFORM API: Fetching portfolio for wallet: ${walletAddress}`)

    const service = new MultiPlatformService()
    
    if (platform && platform !== 'all') {
      // Fetch specific platform data
      const platformData = await service.getPlatformPortfolio(walletAddress, platform as any)
      return NextResponse.json({
        success: true,
        platform,
        data: platformData
      })
    } else {
      // Fetch all platform data
      const portfolio = await service.getMultiPlatformPortfolio(walletAddress)
      return NextResponse.json({
        success: true,
        portfolio
      })
    }
  } catch (error) {
    console.error('❌ Multi-platform API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch multi-platform portfolio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 