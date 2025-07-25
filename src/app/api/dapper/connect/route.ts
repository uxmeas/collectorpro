import { NextRequest, NextResponse } from 'next/server';
import { DapperService } from '../../../../lib/dapper';

export async function POST(req: NextRequest) {
  try {
    const { dapperEmail, dapperPassword } = await req.json();

    if (!dapperEmail || !dapperPassword) {
      return NextResponse.json({ error: 'Dapper email and password are required' }, { status: 400 });
    }

    // For demo purposes, generate a sample wallet address
    // In production, this would authenticate with Dapper and get the real wallet address
    const walletAddress = '0x' + Math.random().toString(16).substring(2, 18);

    // Initialize Dapper service
    const dapperService = new DapperService(walletAddress);

    // Get user's moments with ownership verification
    const moments = await dapperService.getUserMoments(dapperEmail, dapperPassword);
    
    // Get current market prices
    const momentIds = moments.map(m => m.id);
    const marketPrices = await dapperService.getMarketPrices(momentIds);
    
    // Update moments with current prices
    const updatedMoments = moments.map(moment => ({
      ...moment,
      currentValue: marketPrices[moment.id] || moment.currentValue,
    }));

    // Calculate portfolio stats
    const totalValue = updatedMoments.reduce((sum, moment) => sum + (moment.currentValue || 0), 0);
    const totalMoments = updatedMoments.length;
    const totalAcquisitionCost = updatedMoments.reduce((sum, moment) => sum + (moment.acquisitionPrice || 0), 0);
    const totalProfit = totalValue - totalAcquisitionCost;
    const profitPercentage = totalAcquisitionCost > 0 ? (totalProfit / totalAcquisitionCost) * 100 : 0;

    // Get transaction history
    const transactions = await dapperService.getTransactionHistory();

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        moments: updatedMoments,
        portfolio: {
          totalValue,
          totalMoments,
          totalAcquisitionCost,
          totalProfit,
          profitPercentage: Math.round(profitPercentage * 100) / 100,
        },
        transactions,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Dapper connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to Dapper wallet',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('address');
    const dapperEmail = searchParams.get('email');
    const dapperPassword = searchParams.get('password');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // For manual connection, Dapper credentials are required for security
    if (!dapperEmail || !dapperPassword) {
      return NextResponse.json({ 
        error: 'Dapper email and password are required to verify wallet ownership',
        requiresCredentials: true 
      }, { status: 400 });
    }

    // Initialize Dapper service
    const dapperService = new DapperService(walletAddress);

    // Get user's moments with ownership verification
    const moments = await dapperService.getUserMoments(dapperEmail, dapperPassword);
    
    // Calculate basic stats
    const totalValue = moments.reduce((sum, moment) => sum + (moment.currentValue || 0), 0);
    const totalMoments = moments.length;

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        moments,
        portfolio: {
          totalValue,
          totalMoments,
        },
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Dapper fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Dapper data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 