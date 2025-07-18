import { NextRequest, NextResponse } from 'next/server'
import { FlowTransactionTracker } from '@/lib/flow-transaction-tracker'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get('wallet')
    const momentId = searchParams.get('momentId')

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    console.log(`🔍 Flow Transaction API called for wallet: ${wallet}`)

    const tracker = new FlowTransactionTracker()

    if (momentId) {
      // Get transaction history for a specific moment
      const transactions = await tracker.getMomentTransactionHistory(momentId)
      return NextResponse.json({ success: true, data: transactions })
    } else {
      // Get complete purchase history and P&L for wallet
      try {
        const portfolioPL = await tracker.getCompletePurchaseHistory(wallet)
        return NextResponse.json({ 
          success: true, 
          data: portfolioPL,
          demo: wallet === 'demo-wallet' || wallet.includes('demo')
        })
      } catch (error) {
        console.log('⚠️ Using demo data due to error:', error.message)
        // Return demo data when real data fails
        const demoData = {
          totalInvested: 12500,
          totalInvestedUSD: 12500,
          currentValue: 24789,
          currentValueUSD: 24789,
          totalProfit: 12289,
          totalProfitUSD: 12289,
          profitPercentage: 98.31,
          totalTransactions: 15,
          averagePurchasePrice: 833.33,
          averagePurchasePriceUSD: 833.33,
          purchaseHistory: [],
          salesHistory: [],
          mintHistory: []
        }
        return NextResponse.json({ 
          success: true, 
          data: demoData, 
          demo: true,
          error: error.message 
        })
      }
    }
  } catch (error) {
    console.error('❌ Flow Transaction API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch transaction data',
      demo: true 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, momentIds } = await req.json()

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required' 
      }, { status: 400 })
    }

    console.log(`🔍 Flow Transaction API POST called for wallet: ${walletAddress}`)

    const tracker = new FlowTransactionTracker()

    // Get purchase history
    const purchaseHistory = await tracker.getCompletePurchaseHistory(walletAddress)
    
    // Get market data for specific moments or all moments
    const momentsToFetch = momentIds || purchaseHistory.purchaseHistory.map(p => p.momentId)
    const marketData = await tracker.getMarketData(momentsToFetch)

    return NextResponse.json({
      success: true,
      walletAddress,
      purchaseHistory,
      marketData,
      analysis: {
        portfolioValue: purchaseHistory.currentValueUSD,
        totalInvested: purchaseHistory.totalInvestedUSD,
        unrealizedProfit: purchaseHistory.totalProfitUSD,
        profitPercentage: purchaseHistory.profitPercentage,
        bestPerformingMoment: findBestPerformingMoment(purchaseHistory.purchaseHistory, marketData),
        worstPerformingMoment: findWorstPerformingMoment(purchaseHistory.purchaseHistory, marketData),
        averageHoldingPeriod: calculateAverageHoldingPeriod(purchaseHistory.purchaseHistory),
        marketTrend: analyzeMarketTrend(marketData)
      }
    })
  } catch (error) {
    console.error('❌ Error in Flow transactions API POST:', error)
    return NextResponse.json({ 
      error: 'Failed to analyze transaction data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper functions for analysis
function findBestPerformingMoment(purchases: any[], marketData: Record<string, any>) {
  let bestMoment = null
  let bestReturn = -Infinity

  purchases.forEach(purchase => {
    const currentPrice = marketData[purchase.momentId]?.currentPrice || 0
    const returnPercentage = ((currentPrice - purchase.purchasePriceUSD) / purchase.purchasePriceUSD) * 100
    
    if (returnPercentage > bestReturn) {
      bestReturn = returnPercentage
      bestMoment = {
        momentId: purchase.momentId,
        purchasePrice: purchase.purchasePriceUSD,
        currentPrice,
        returnPercentage,
        purchaseDate: purchase.purchaseDate
      }
    }
  })

  return bestMoment
}

function findWorstPerformingMoment(purchases: any[], marketData: Record<string, any>) {
  let worstMoment = null
  let worstReturn = Infinity

  purchases.forEach(purchase => {
    const currentPrice = marketData[purchase.momentId]?.currentPrice || 0
    const returnPercentage = ((currentPrice - purchase.purchasePriceUSD) / purchase.purchasePriceUSD) * 100
    
    if (returnPercentage < worstReturn) {
      worstReturn = returnPercentage
      worstMoment = {
        momentId: purchase.momentId,
        purchasePrice: purchase.purchasePriceUSD,
        currentPrice,
        returnPercentage,
        purchaseDate: purchase.purchaseDate
      }
    }
  })

  return worstMoment
}

function calculateAverageHoldingPeriod(purchases: any[]): number {
  if (purchases.length === 0) return 0

  const totalDays = purchases.reduce((sum, purchase) => {
    const purchaseDate = new Date(purchase.purchaseDate)
    const now = new Date()
    const daysDiff = (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    return sum + daysDiff
  }, 0)

  return totalDays / purchases.length
}

function analyzeMarketTrend(marketData: Record<string, any>): 'bullish' | 'bearish' | 'neutral' {
  const moments = Object.values(marketData)
  if (moments.length === 0) return 'neutral'

  const totalVolume = moments.reduce((sum, moment) => sum + (moment.totalSales || 0), 0)
  const averagePrice = moments.reduce((sum, moment) => sum + (moment.currentPrice || 0), 0) / moments.length

  // Simple trend analysis based on volume and price
  if (totalVolume > 100 && averagePrice > 100) return 'bullish'
  if (totalVolume < 50 || averagePrice < 50) return 'bearish'
  return 'neutral'
} 