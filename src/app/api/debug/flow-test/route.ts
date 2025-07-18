import { NextRequest, NextResponse } from 'next/server';
import { FlowBlockchainService } from '../../../../lib/flow-blockchain';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required',
        example: 'Use ?address=0x1234567890abcdef'
      }, { status: 400 });
    }

    console.log(`🔍 DEBUG: Testing Flow wallet: ${walletAddress}`);

    // Initialize Flow blockchain service
    const flowService = new FlowBlockchainService(walletAddress);

    // Test 1: Validate wallet address
    const isValidAddress = /^0x[a-fA-F0-9]{16}$/.test(walletAddress);
    
    // Test 2: Get account info
    let accountInfo = null;
    let accountError = null;
    try {
      accountInfo = await flowService.getAccountInfo();
    } catch (error) {
      accountError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test 3: Get NBA Top Shot moments
    let moments: any[] = [];
    let momentsError = null;
    try {
      moments = await flowService.getNBATopShotMoments();
    } catch (error) {
      momentsError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test 4: Get collection stats
    let collectionStats = null;
    let statsError = null;
    try {
      collectionStats = await flowService.getCollectionStats();
    } catch (error) {
      statsError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test 5: Calculate portfolio
    let portfolio = null;
    if (moments.length > 0) {
      portfolio = flowService.calculatePortfolio(moments);
    }

    return NextResponse.json({
      success: true,
      debug: {
        walletAddress,
        isValidAddress,
        tests: {
          accountInfo: {
            success: !accountError,
            error: accountError,
            data: accountInfo ? {
              address: (accountInfo as any).address,
              balance: (accountInfo as any).balance,
              contracts: (accountInfo as any).contracts ? Object.keys((accountInfo as any).contracts) : [],
              keys: (accountInfo as any).keys ? (accountInfo as any).keys.length : 0,
            } : null
          },
          moments: {
            success: !momentsError,
            error: momentsError,
            count: moments.length,
            sample: moments.slice(0, 2).map(m => ({
              id: m.id,
              playerName: m.playerName,
              rarity: m.rarity,
              currentValue: m.currentValue
            }))
          },
          collectionStats: {
            success: !statsError,
            error: statsError,
            data: collectionStats
          },
          portfolio: {
            success: !!portfolio,
            data: portfolio
          }
        },
        recommendations: {
          hasTopShotContract: accountInfo && (accountInfo as any).contracts ? 
            Object.keys((accountInfo as any).contracts).some(c => c.includes('TopShot')) : false,
          hasMomentCollection: moments.length > 0,
          isTestWallet: ['0x1d4b4b0d7f8e9c2a', '0x2c3d4e5f6a7b8c9d', '0x3e4f5a6b7c8d9e0f'].includes(walletAddress),
          nextSteps: moments.length === 0 ? [
            'Check if wallet has NBA Top Shot moments',
            'Verify wallet address format (0x + 16 characters)',
            'Try a different wallet with known Top Shot moments',
            'Check Flow network status'
          ] : [
            'Wallet has moments! Portfolio analytics should work.',
            'Check browser console for detailed logs'
          ]
        }
      }
    });
  } catch (error) {
    console.error('Flow debug error:', error);
    return NextResponse.json({ 
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 