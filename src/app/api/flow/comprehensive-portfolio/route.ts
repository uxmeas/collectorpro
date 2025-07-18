import { NextRequest, NextResponse } from 'next/server';
import { EnhancedFlowBlockchainService } from '../../../../lib/flow-blockchain-enhanced';
import { PortfolioResponse } from '../../../../lib/nba-topshot-types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required',
        example: 'Use ?address=0x1234567890abcdef or demo-wallet for sample data'
      }, { status: 400 });
    }

    console.log(`🔍 COMPREHENSIVE: Analyzing portfolio for wallet: ${walletAddress}`);

    // Initialize enhanced Flow blockchain service
    const flowService = new EnhancedFlowBlockchainService();

    // Get comprehensive moments with all metadata from real Flow blockchain
    console.log(`📡 Fetching real NBA Top Shot data from Flow blockchain...`);
    const moments = await flowService.getComprehensiveMoments(walletAddress);
    
    // Calculate comprehensive portfolio analytics with real blockchain data
    console.log(`🧮 Calculating comprehensive analytics with real market data...`);
    const portfolio = await flowService.calculateComprehensivePortfolioAnalytics(moments);

    // Add real-time market data if available
    const momentIds = moments.map(m => m.id);
    console.log(`📈 Fetching real-time market data for ${momentIds.length} moments...`);
    const marketData = momentIds.length > 0 ? await flowService.getMarketDataForMoments(momentIds) : {};

    // Get transaction history for additional insights
    console.log(`📜 Fetching transaction history for wallet analysis...`);
    const transactionHistory = await flowService.getAccountTransactionHistory(walletAddress);

    // Get NBA Top Shot events for this wallet
    console.log(`📡 Fetching NBA Top Shot events from Flow blockchain...`);
    const events = await flowService.getTopShotEvents(walletAddress);

    const response: PortfolioResponse = {
      success: true,
      data: {
        walletAddress,
        portfolio,
        moments,
        lastUpdated: new Date().toISOString(),
      },
      // Add additional blockchain data for advanced analytics
      metadata: {
        marketData: Object.keys(marketData).length > 0 ? marketData : undefined,
        transactionHistory: transactionHistory.length > 0 ? transactionHistory.slice(0, 50) : undefined, // Limit for performance
        events: events.length > 0 ? events.slice(0, 100) : undefined, // Limit for performance
        dataSource: moments.length > 0 && moments[0].id.includes('demo') ? 'sample' : 'blockchain',
        flowNetwork: process.env.FLOW_ACCESS_NODE?.includes('testnet') ? 'testnet' : 'mainnet',
        apiVersion: '2.0',
        comprehensiveFields: moments.length > 0 ? Object.keys(moments[0]).length : 0
      }
    };

    console.log(`✅ COMPREHENSIVE: Portfolio analysis complete!`);
    console.log(`📊 Total Moments: ${moments.length}`);
    console.log(`📊 Total Value: $${portfolio.overview.totalValue.toLocaleString()}`);
    console.log(`📈 Total Profit: $${portfolio.overview.totalProfit.toLocaleString()}`);
    console.log(`📊 ROI: ${portfolio.overview.profitPercentage.toFixed(2)}%`);
    console.log(`🔗 Data Source: ${response.metadata?.dataSource}`);
    console.log(`🌐 Flow Network: ${response.metadata?.flowNetwork}`);
    console.log(`📝 Market Data Points: ${Object.keys(marketData).length}`);
    console.log(`📜 Transaction Records: ${transactionHistory.length}`);
    console.log(`📡 Blockchain Events: ${events.length}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ COMPREHENSIVE: Portfolio analysis error:', error);
    
    // Detailed error logging for debugging
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to analyze comprehensive portfolio',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Check if wallet address is valid Flow format (0x + 16 hex characters)',
        'Verify Flow blockchain connectivity',
        'Try using demo-wallet for sample data',
        'Check server logs for detailed error information'
      ]
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, options } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required in request body' 
      }, { status: 400 });
    }

    console.log(`🔍 COMPREHENSIVE: POST request - Analyzing portfolio for wallet: ${walletAddress}`);
    if (options) {
      console.log(`⚙️ Analysis options:`, options);
    }

    // Initialize enhanced Flow blockchain service
    const flowService = new EnhancedFlowBlockchainService();

    // Get comprehensive moments with enhanced options
    const moments = await flowService.getComprehensiveMoments(walletAddress);
    
    // Calculate comprehensive portfolio analytics
    const portfolio = await flowService.calculateComprehensivePortfolioAnalytics(moments);

    // Enhanced analysis based on options
    let enhancedData = {};
    if (options?.includeMarketData) {
      const momentIds = moments.map(m => m.id);
      enhancedData = {
        ...enhancedData,
        marketData: await flowService.getMarketDataForMoments(momentIds)
      };
    }

    if (options?.includeTransactionHistory) {
      enhancedData = {
        ...enhancedData,
        transactionHistory: await flowService.getAccountTransactionHistory(walletAddress)
      };
    }

    if (options?.includeEvents) {
      enhancedData = {
        ...enhancedData,
        events: await flowService.getTopShotEvents(walletAddress, options.eventTypes)
      };
    }

    const response: PortfolioResponse = {
      success: true,
      data: {
        walletAddress,
        portfolio,
        moments,
        lastUpdated: new Date().toISOString(),
        ...enhancedData
      },
    };

    console.log(`✅ COMPREHENSIVE: POST analysis complete for ${moments.length} moments`);
    console.log(`📊 Total Value: $${portfolio.overview.totalValue.toLocaleString()}`);
    console.log(`📈 Total Profit: $${portfolio.overview.totalProfit.toLocaleString()}`);
    console.log(`📊 ROI: ${portfolio.overview.profitPercentage.toFixed(2)}%`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ COMPREHENSIVE: POST Portfolio analysis error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to analyze comprehensive portfolio via POST',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 