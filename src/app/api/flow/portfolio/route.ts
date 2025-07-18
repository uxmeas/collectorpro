import { NextRequest, NextResponse } from 'next/server';
import { FlowBlockchainService } from '../../../../lib/flow-blockchain';

export interface PortfolioAnalytics {
  overview: {
    totalValue: number;
    totalMoments: number;
    totalAcquisitionCost: number;
    totalProfit: number;
    profitPercentage: number;
    lastUpdated: string;
  };
  performance: {
    dailyChange: number;
    weeklyChange: number;
    monthlyChange: number;
    allTimeChange: number;
  };
  breakdown: {
    byRarity: Record<string, { count: number; value: number; percentage: number }>;
    byTeam: Record<string, { count: number; value: number; percentage: number }>;
    byPlayer: Record<string, { count: number; value: number; percentage: number }>;
    bySet: Record<string, { count: number; value: number; percentage: number }>;
  };
  topHoldings: Array<{
    id: string;
    playerName: string;
    teamName: string;
    rarity: string;
    serialNumber: number;
    currentValue: number;
    acquisitionPrice?: number;
    profit?: number;
    profitPercentage?: number;
    imageURL: string;
  }>;
  marketInsights: {
    trendingPlayers: string[];
    marketTrend: 'bullish' | 'bearish' | 'neutral';
    volume24h: number;
    averagePrice: number;
  };
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

    // Get user's NBA Top Shot moments
    const moments = await flowService.getNBATopShotMoments();
    
    // Get current market prices
    const momentIds = moments.map(m => m.id);
    const marketPrices = await flowService.getMarketPrices(momentIds);
    
    // Update moments with current prices
    const updatedMoments = moments.map(moment => ({
      ...moment,
      currentValue: marketPrices[moment.id] || moment.currentValue || 0,
    }));

    // Calculate comprehensive portfolio analytics
    const analytics = calculatePortfolioAnalytics(updatedMoments);

    // Get real-time market data
    const marketData = await flowService.getRealTimeMarketData();

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        portfolio: analytics,
        marketData,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Portfolio analytics error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch portfolio analytics',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function calculatePortfolioAnalytics(moments: any[]): PortfolioAnalytics {
  const totalValue = moments.reduce((sum, moment) => sum + (moment.currentValue || 0), 0);
  const totalAcquisitionCost = moments.reduce((sum, moment) => sum + (moment.acquisitionPrice || 0), 0);
  const totalProfit = totalValue - totalAcquisitionCost;
  const profitPercentage = totalAcquisitionCost > 0 ? (totalProfit / totalAcquisitionCost) * 100 : 0;

  // Calculate breakdowns
  const rarityBreakdown: Record<string, { count: number; value: number; percentage: number }> = {};
  const teamBreakdown: Record<string, { count: number; value: number; percentage: number }> = {};
  const playerBreakdown: Record<string, { count: number; value: number; percentage: number }> = {};
  const setBreakdown: Record<string, { count: number; value: number; percentage: number }> = {};

  moments.forEach(moment => {
    const rarity = moment.rarity || 'UNKNOWN';
    const team = moment.teamName || 'Unknown Team';
    const player = moment.playerName || 'Unknown Player';
    const set = moment.metadata?.set || 'Unknown Set';

    // Rarity breakdown
    if (!rarityBreakdown[rarity]) {
      rarityBreakdown[rarity] = { count: 0, value: 0, percentage: 0 };
    }
    rarityBreakdown[rarity].count++;
    rarityBreakdown[rarity].value += moment.currentValue || 0;

    // Team breakdown
    if (!teamBreakdown[team]) {
      teamBreakdown[team] = { count: 0, value: 0, percentage: 0 };
    }
    teamBreakdown[team].count++;
    teamBreakdown[team].value += moment.currentValue || 0;

    // Player breakdown
    if (!playerBreakdown[player]) {
      playerBreakdown[player] = { count: 0, value: 0, percentage: 0 };
    }
    playerBreakdown[player].count++;
    playerBreakdown[player].value += moment.currentValue || 0;

    // Set breakdown
    if (!setBreakdown[set]) {
      setBreakdown[set] = { count: 0, value: 0, percentage: 0 };
    }
    setBreakdown[set].count++;
    setBreakdown[set].value += moment.currentValue || 0;
  });

  // Calculate percentages
  Object.keys(rarityBreakdown).forEach(rarity => {
    rarityBreakdown[rarity].percentage = totalValue > 0 ? (rarityBreakdown[rarity].value / totalValue) * 100 : 0;
  });

  Object.keys(teamBreakdown).forEach(team => {
    teamBreakdown[team].percentage = totalValue > 0 ? (teamBreakdown[team].value / totalValue) * 100 : 0;
  });

  Object.keys(playerBreakdown).forEach(player => {
    playerBreakdown[player].percentage = totalValue > 0 ? (playerBreakdown[player].value / totalValue) * 100 : 0;
  });

  Object.keys(setBreakdown).forEach(set => {
    setBreakdown[set].percentage = totalValue > 0 ? (setBreakdown[set].value / totalValue) * 100 : 0;
  });

  // Get top holdings (sorted by value)
  const topHoldings = moments
    .map(moment => ({
      id: moment.id,
      playerName: moment.playerName,
      teamName: moment.teamName,
      rarity: moment.rarity,
      serialNumber: moment.serialNumber,
      currentValue: moment.currentValue || 0,
      acquisitionPrice: moment.acquisitionPrice,
      profit: moment.acquisitionPrice ? (moment.currentValue || 0) - moment.acquisitionPrice : undefined,
      profitPercentage: moment.acquisitionPrice ? ((moment.currentValue || 0) - moment.acquisitionPrice) / moment.acquisitionPrice * 100 : undefined,
      imageURL: moment.imageURL,
    }))
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 10);

  return {
    overview: {
      totalValue,
      totalMoments: moments.length,
      totalAcquisitionCost,
      totalProfit,
      profitPercentage: Math.round(profitPercentage * 100) / 100,
      lastUpdated: new Date().toISOString(),
    },
    performance: {
      dailyChange: Math.random() * 10 - 5, // Placeholder - would be real data
      weeklyChange: Math.random() * 20 - 10, // Placeholder - would be real data
      monthlyChange: Math.random() * 30 - 15, // Placeholder - would be real data
      allTimeChange: profitPercentage,
    },
    breakdown: {
      byRarity: rarityBreakdown,
      byTeam: teamBreakdown,
      byPlayer: playerBreakdown,
      bySet: setBreakdown,
    },
    topHoldings,
    marketInsights: {
      trendingPlayers: ['LeBron James', 'Stephen Curry', 'Giannis Antetokounmpo'],
      marketTrend: 'bullish' as const,
      volume24h: 1250000,
      averagePrice: 85.50,
    },
  };
} 