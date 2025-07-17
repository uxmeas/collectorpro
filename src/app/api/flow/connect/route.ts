import { NextRequest, NextResponse } from 'next/server';
import { FlowBlockchainService } from '../../../../lib/flow-blockchain';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Initialize Flow blockchain service
    const flowService = new FlowBlockchainService(walletAddress);

    // Get user's NBA Top Shot moments from Flow blockchain
    const moments = await flowService.getNBATopShotMoments();
    
    // Get current market prices
    const momentIds = moments.map(m => m.id);
    const marketPrices = await flowService.getMarketPrices(momentIds);
    
    // Update moments with current prices
    const updatedMoments = moments.map(moment => ({
      ...moment,
      currentValue: marketPrices[moment.id] || moment.currentValue,
    }));

    // Calculate portfolio stats
    const portfolio = flowService.calculatePortfolio(updatedMoments);

    // Get collection statistics
    const collectionStats = await flowService.getCollectionStats();

    // Get transaction history
    const transactions = await flowService.getTransactionHistory();

    // Get real-time market data
    const marketData = await flowService.getRealTimeMarketData();

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        moments: updatedMoments,
        portfolio,
        collectionStats,
        transactions,
        marketData,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Flow blockchain connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to Flow blockchain',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Initialize Flow blockchain service
    const flowService = new FlowBlockchainService(walletAddress);

    // Get user's NBA Top Shot moments from Flow blockchain
    const moments = await flowService.getNBATopShotMoments();
    
    // Calculate portfolio stats
    const portfolio = flowService.calculatePortfolio(moments);

    // Get collection statistics
    const collectionStats = await flowService.getCollectionStats();

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        moments,
        portfolio,
        collectionStats,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Flow blockchain fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Flow blockchain data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 