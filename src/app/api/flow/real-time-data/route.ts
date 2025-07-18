import { NextRequest, NextResponse } from 'next/server';
import { EnhancedFlowBlockchainService } from '../../../../lib/flow-blockchain-enhanced';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('address');
    const includeEvents = searchParams.get('includeEvents') === 'true';
    const includeMarketData = searchParams.get('includeMarketData') === 'true';
    const includeTransactionHistory = searchParams.get('includeTransactionHistory') === 'true';

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required',
        example: 'Use ?address=0x1234567890abcdef&includeEvents=true&includeMarketData=true',
        description: 'Real-time NBA Top Shot data from Flow blockchain'
      }, { status: 400 });
    }

    console.log(`🔍 REAL-TIME: Fetching live NBA Top Shot data for wallet: ${walletAddress}`);

    // Initialize enhanced Flow blockchain service
    const flowService = new EnhancedFlowBlockchainService();

    // Parallel data fetching for better performance
    const dataPromises = [];

    // Always get basic moment data
    console.log(`📡 Fetching comprehensive moment data from Flow blockchain...`);
    dataPromises.push(flowService.getComprehensiveMoments(walletAddress));

    // Conditionally fetch additional data
    if (includeEvents) {
      console.log(`📡 Fetching NBA Top Shot events...`);
      dataPromises.push(flowService.getTopShotEvents(walletAddress));
    } else {
      dataPromises.push(Promise.resolve([]));
    }

    if (includeTransactionHistory) {
      console.log(`📜 Fetching account transaction history...`);
      dataPromises.push(flowService.getAccountTransactionHistory(walletAddress));
    } else {
      dataPromises.push(Promise.resolve([]));
    }

    // Wait for all data to be fetched
    const [moments, events, transactionHistory] = await Promise.all(dataPromises);

    // Fetch market data for moments if requested
    let marketData = {};
    if (includeMarketData && moments.length > 0) {
      console.log(`📈 Fetching real-time market data for ${moments.length} moments...`);
      const momentIds = moments.map((m: any) => m.id);
      marketData = await flowService.getMarketDataForMoments(momentIds);
    }

    // Calculate quick analytics
    const totalValue = moments.reduce((sum: number, m: any) => sum + (m.currentValue || 0), 0);
    const totalAcquisitionCost = moments.reduce((sum: number, m: any) => sum + (m.purchasePrice || 0), 0);
    const totalProfit = totalValue - totalAcquisitionCost;
    const profitPercentage = totalAcquisitionCost > 0 ? (totalProfit / totalAcquisitionCost) * 100 : 0;

    // Analyze recent activity
    const recentEvents = events.filter((event: any) => {
      const eventTime = new Date(event.timestamp || 0).getTime();
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return eventTime > oneDayAgo;
    });

    const recentTransactions = transactionHistory.filter((tx: any) => {
      const txTime = new Date(tx.timestamp || 0).getTime();
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return txTime > oneDayAgo;
    });

    // Generate real-time insights
    const insights = {
      marketTrend: moments.length > 0 ? calculateMarketTrend(moments, marketData) : 'neutral',
      mostActivePlayer: findMostActivePlayer(moments, events),
      recentActivity: {
        last24h: {
          events: recentEvents.length,
          transactions: recentTransactions.length,
          valueChange: calculateValueChange(recentTransactions),
          avgTransactionValue: calculateAvgTransactionValue(recentTransactions)
        }
      },
      portfolioHealth: {
        diversification: calculateDiversification(moments),
        liquidity: calculateLiquidity(moments, marketData),
        riskLevel: calculateRiskLevel(moments)
      }
    };

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      walletAddress,
      realTimeData: {
        moments: moments.length,
        totalValue: Math.round(totalValue * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        profitPercentage: Math.round(profitPercentage * 100) / 100,
        insights,
        dataFreshness: {
          moments: 'live',
          marketData: includeMarketData ? 'live' : 'not_requested',
          events: includeEvents ? 'live' : 'not_requested',
          transactions: includeTransactionHistory ? 'live' : 'not_requested'
        }
      },
      flowBlockchain: {
        network: process.env.FLOW_ACCESS_NODE?.includes('testnet') ? 'testnet' : 'mainnet',
        contractAddress: '0x0b2a3299cc857e29', // NBA Top Shot contract
        lastBlockHeight: 'latest',
        apiVersion: '2.0'
      },
      // Include raw data if requested
      rawData: {
        moments: moments.slice(0, 10), // Limit for response size
        events: includeEvents ? events.slice(0, 20) : undefined,
        transactions: includeTransactionHistory ? transactionHistory.slice(0, 20) : undefined,
        marketData: includeMarketData ? marketData : undefined
      }
    };

    console.log(`✅ REAL-TIME: Data fetching complete!`);
    console.log(`📊 Live Moments: ${moments.length}`);
    console.log(`📊 Total Portfolio Value: $${totalValue.toLocaleString()}`);
    console.log(`📈 Profit/Loss: $${totalProfit.toLocaleString()} (${profitPercentage.toFixed(2)}%)`);
    console.log(`📡 Recent Events (24h): ${recentEvents.length}`);
    console.log(`📜 Recent Transactions (24h): ${recentTransactions.length}`);
    console.log(`📈 Market Trend: ${insights.marketTrend}`);
    console.log(`🌐 Flow Network: ${response.flowBlockchain.network}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ REAL-TIME: Error fetching live data:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch real-time NBA Top Shot data',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      troubleshooting: {
        commonIssues: [
          'Invalid wallet address format (should be 0x + 16 hex characters)',
          'Flow blockchain connectivity issues',
          'NBA Top Shot contract read permissions',
          'Rate limiting from Flow Access API'
        ],
        suggestions: [
          'Try demo-wallet for sample data',
          'Check Flow blockchain status',
          'Verify wallet address format',
          'Wait a moment and try again'
        ]
      }
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { 
      walletAddress, 
      options = {},
      filters = {},
      analytics = {} 
    } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Wallet address is required in request body',
        expectedFormat: {
          walletAddress: '0x1234567890abcdef',
          options: {
            includeEvents: true,
            includeMarketData: true,
            includeTransactionHistory: true,
            eventTypes: ['TopShot.Deposit', 'TopShot.Withdraw']
          },
          filters: {
            rarity: ['LEGENDARY', 'RARE'],
            minValue: 100,
            playerNames: ['LeBron James', 'Stephen Curry']
          },
          analytics: {
            timeRange: '30d',
            includeComparisons: true,
            includeProjections: true
          }
        }
      }, { status: 400 });
    }

    console.log(`🔍 REAL-TIME POST: Advanced analysis for wallet: ${walletAddress}`);
    console.log(`⚙️ Options:`, options);
    console.log(`🔍 Filters:`, filters);
    console.log(`📊 Analytics:`, analytics);

    const flowService = new EnhancedFlowBlockchainService();

    // Get comprehensive data
    const moments = await flowService.getComprehensiveMoments(walletAddress);

    // Apply filters if specified
    const filteredMoments = applyFilters(moments, filters);

    // Get additional data based on options
    const additionalData: any = {};
    
    if (options.includeEvents) {
      additionalData.events = await flowService.getTopShotEvents(walletAddress, options.eventTypes);
    }

    if (options.includeMarketData) {
      const momentIds = filteredMoments.map((m: any) => m.id);
      additionalData.marketData = await flowService.getMarketDataForMoments(momentIds);
    }

    if (options.includeTransactionHistory) {
      additionalData.transactionHistory = await flowService.getAccountTransactionHistory(walletAddress);
    }

    // Perform advanced analytics
    const advancedAnalytics = await performAdvancedAnalytics(filteredMoments, additionalData, analytics);

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      walletAddress,
      query: {
        totalMoments: moments.length,
        filteredMoments: filteredMoments.length,
        filtersApplied: Object.keys(filters).length,
        optionsEnabled: Object.keys(options).length
      },
      analytics: advancedAnalytics,
      data: {
        moments: filteredMoments,
        ...additionalData
      }
    };

    console.log(`✅ REAL-TIME POST: Advanced analysis complete!`);
    console.log(`📊 Total Moments: ${moments.length}, Filtered: ${filteredMoments.length}`);
    console.log(`📈 Analytics Modules: ${Object.keys(advancedAnalytics).length}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ REAL-TIME POST: Error performing advanced analysis:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to perform advanced real-time analysis',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Helper functions for real-time analytics
function calculateMarketTrend(moments: any[], marketData: Record<string, any>): 'bullish' | 'bearish' | 'neutral' {
  if (moments.length === 0) return 'neutral';
  
  const trends = moments.map(moment => {
    const market = marketData[moment.id];
    if (!market || !market.currentPrice || !market.lastSalePrice) return 'neutral';
    
    const priceChange = (market.currentPrice - market.lastSalePrice) / market.lastSalePrice;
    if (priceChange > 0.05) return 'bullish';
    if (priceChange < -0.05) return 'bearish';
    return 'neutral';
  });

  const bullishCount = trends.filter(t => t === 'bullish').length;
  const bearishCount = trends.filter(t => t === 'bearish').length;
  
  if (bullishCount > bearishCount * 1.5) return 'bullish';
  if (bearishCount > bullishCount * 1.5) return 'bearish';
  return 'neutral';
}

function findMostActivePlayer(moments: any[], events: any[]): string {
  const playerActivity: Record<string, number> = {};
  
  moments.forEach((moment: any) => {
    playerActivity[moment.playerName] = (playerActivity[moment.playerName] || 0) + 1;
  });

  events.forEach((event: any) => {
    // Extract player from event if available
    if (event.playerName) {
      playerActivity[event.playerName] = (playerActivity[event.playerName] || 0) + 2; // Events weighted higher
    }
  });

  const sortedPlayers = Object.entries(playerActivity).sort(([,a], [,b]) => b - a);
  return sortedPlayers.length > 0 ? sortedPlayers[0][0] : 'No activity';
}

function calculateValueChange(transactions: any[]): number {
  if (transactions.length === 0) return 0;
  
  const totalValue = transactions.reduce((sum, tx) => sum + (tx.value || 0), 0);
  return Math.round(totalValue * 100) / 100;
}

function calculateAvgTransactionValue(transactions: any[]): number {
  if (transactions.length === 0) return 0;
  
  const totalValue = transactions.reduce((sum, tx) => sum + (tx.value || 0), 0);
  return Math.round((totalValue / transactions.length) * 100) / 100;
}

function calculateDiversification(moments: any[]): number {
  if (moments.length === 0) return 0;
  
  const uniquePlayers = new Set(moments.map((m: any) => m.playerName)).size;
  const uniqueTeams = new Set(moments.map((m: any) => m.teamName)).size;
  
  const playerDiv = Math.min(uniquePlayers / moments.length * 100, 100);
  const teamDiv = Math.min(uniqueTeams / 30 * 100, 100); // 30 NBA teams
  
  return Math.round((playerDiv + teamDiv) / 2);
}

function calculateLiquidity(moments: any[], marketData: Record<string, any>): number {
  if (moments.length === 0) return 0;
  
  const liquidityScores = moments.map((m: any) => {
    const market = marketData[m.id];
    return market?.liquidity || 50; // Default medium liquidity
  });
  
  const avgLiquidity = liquidityScores.reduce((sum, score) => sum + score, 0) / liquidityScores.length;
  return Math.round(avgLiquidity);
}

function calculateRiskLevel(moments: any[]): 'low' | 'medium' | 'high' {
  if (moments.length === 0) return 'medium';
  
  const riskFactors = moments.map((m: any) => {
    let risk = 0;
    if (m.rarity === 'COMMON') risk += 1;
    if (m.rarity === 'RARE') risk += 2;
    if (m.rarity === 'LEGENDARY') risk += 3;
    if (m.rarity === 'ULTIMATE') risk += 4;
    
    if (m.totalCirculation > 10000) risk += 1;
    if (m.totalCirculation < 1000) risk += 2;
    
    return risk;
  });
  
  const avgRisk = riskFactors.reduce((sum, risk) => sum + risk, 0) / riskFactors.length;
  
  if (avgRisk < 2) return 'low';
  if (avgRisk > 3) return 'high';
  return 'medium';
}

function applyFilters(moments: any[], filters: any): any[] {
  let filtered = [...moments];
  
  if (filters.rarity && Array.isArray(filters.rarity)) {
    filtered = filtered.filter(m => filters.rarity.includes(m.rarity));
  }
  
  if (filters.minValue) {
    filtered = filtered.filter(m => (m.currentValue || 0) >= filters.minValue);
  }
  
  if (filters.maxValue) {
    filtered = filtered.filter(m => (m.currentValue || 0) <= filters.maxValue);
  }
  
  if (filters.playerNames && Array.isArray(filters.playerNames)) {
    filtered = filtered.filter(m => filters.playerNames.includes(m.playerName));
  }
  
  if (filters.teamNames && Array.isArray(filters.teamNames)) {
    filtered = filtered.filter(m => filters.teamNames.includes(m.teamName));
  }
  
  return filtered;
}

async function performAdvancedAnalytics(moments: any[], additionalData: any, analytics: any): Promise<any> {
  const results: any = {};
  
  if (analytics.includeComparisons) {
    results.comparisons = {
      vsMarketAverage: calculateMarketComparison(moments),
      vsTopCollectors: calculateCollectorComparison(moments),
      historicalPerformance: calculateHistoricalComparison(moments, additionalData.transactionHistory)
    };
  }
  
  if (analytics.includeProjections) {
    results.projections = {
      valueProjection30d: calculateValueProjection(moments, 30),
      valueProjection90d: calculateValueProjection(moments, 90),
      riskAssessment: calculateRiskAssessment(moments),
      opportunityScore: calculateOpportunityScore(moments, additionalData.marketData)
    };
  }
  
  if (analytics.timeRange) {
    results.timeRangeAnalysis = calculateTimeRangeAnalysis(moments, additionalData, analytics.timeRange);
  }
  
  return results;
}

function calculateMarketComparison(moments: any[]): any {
  // This would compare against real market data
  const totalValue = moments.reduce((sum, m) => sum + (m.currentValue || 0), 0);
  const avgValue = moments.length > 0 ? totalValue / moments.length : 0;
  
  return {
    portfolioAvgValue: avgValue,
    marketAvgValue: 250, // This would be real market data
    performanceVsMarket: avgValue > 250 ? 'above' : avgValue < 250 ? 'below' : 'average',
    percentageDifference: avgValue > 0 ? ((avgValue - 250) / 250) * 100 : 0
  };
}

function calculateCollectorComparison(moments: any[]): any {
  return {
    portfolioSize: moments.length,
    avgCollectorSize: 15, // This would be real data
    rarityDistribution: calculateRarityDistribution(moments),
    diversificationScore: calculateDiversification(moments)
  };
}

function calculateHistoricalComparison(moments: any[], transactions: any[]): any {
  return {
    totalTransactions: transactions?.length || 0,
    avgMonthlyActivity: Math.round((transactions?.length || 0) / 12 * 100) / 100,
    performanceTrend: 'stable' // This would be calculated from real data
  };
}

function calculateValueProjection(moments: any[], days: number): any {
  const currentValue = moments.reduce((sum, m) => sum + (m.currentValue || 0), 0);
  
  // Simple projection based on historical trends (would be more sophisticated with real data)
  const projectedGrowth = 0.05 * (days / 30); // 5% monthly growth assumption
  const projectedValue = currentValue * (1 + projectedGrowth);
  
  return {
    currentValue,
    projectedValue: Math.round(projectedValue * 100) / 100,
    projectedGrowth: Math.round(projectedGrowth * 10000) / 100, // As percentage
    confidence: 75 // Would be calculated based on historical accuracy
  };
}

function calculateRiskAssessment(moments: any[]): any {
  const riskLevel = calculateRiskLevel(moments);
  const diversification = calculateDiversification(moments);
  
  return {
    overallRisk: riskLevel,
    diversificationScore: diversification,
    concentrationRisk: diversification < 30 ? 'high' : diversification < 60 ? 'medium' : 'low',
    recommendations: generateRiskRecommendations(riskLevel, diversification)
  };
}

function calculateOpportunityScore(moments: any[], marketData: any): any {
  if (!marketData || moments.length === 0) {
    return {
      score: 50,
      level: 'medium',
      factors: ['Insufficient market data']
    };
  }
  
  // Calculate opportunity based on market conditions
  let score = 50;
  const factors = [];
  
  // Check for undervalued moments
  const undervalued = moments.filter((m: any) => {
    const market = marketData[m.id];
    return market && m.trueValue && market.currentPrice < m.trueValue * 0.9;
  });
  
  if (undervalued.length > 0) {
    score += 20;
    factors.push(`${undervalued.length} potentially undervalued moments`);
  }
  
  // Check market trend
  const trend = calculateMarketTrend(moments, marketData);
  if (trend === 'bullish') {
    score += 15;
    factors.push('Bullish market trend');
  } else if (trend === 'bearish') {
    score -= 15;
    factors.push('Bearish market trend');
  }
  
  score = Math.max(0, Math.min(100, score));
  
  return {
    score,
    level: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
    factors
  };
}

function calculateTimeRangeAnalysis(moments: any[], additionalData: any, timeRange: string): any {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  const recentTransactions = (additionalData.transactionHistory || []).filter((tx: any) => {
    return new Date(tx.timestamp || 0).getTime() > cutoff;
  });
  
  const recentEvents = (additionalData.events || []).filter((event: any) => {
    return new Date(event.timestamp || 0).getTime() > cutoff;
  });
  
  return {
    timeRange,
    recentActivity: {
      transactions: recentTransactions.length,
      events: recentEvents.length,
      avgDailyActivity: Math.round((recentTransactions.length + recentEvents.length) / days * 100) / 100
    },
    valueChange: calculateValueChange(recentTransactions),
    performanceSummary: {
      active: (recentTransactions.length + recentEvents.length) > 0,
      trend: recentTransactions.length > recentEvents.length ? 'buying' : 
             recentEvents.length > recentTransactions.length ? 'trading' : 'holding'
    }
  };
}

function calculateRarityDistribution(moments: any[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  moments.forEach((moment: any) => {
    const rarity = moment.rarity || 'UNKNOWN';
    distribution[rarity] = (distribution[rarity] || 0) + 1;
  });
  
  return distribution;
}

function generateRiskRecommendations(riskLevel: string, diversification: number): string[] {
  const recommendations = [];
  
  if (riskLevel === 'high') {
    recommendations.push('Consider reducing exposure to high-risk moments');
    recommendations.push('Balance portfolio with more stable assets');
  }
  
  if (diversification < 30) {
    recommendations.push('Increase diversification across players and teams');
    recommendations.push('Consider moments from different NBA conferences');
  }
  
  if (diversification < 50) {
    recommendations.push('Add moments from different play types and sets');
  }
  
  return recommendations.length > 0 ? recommendations : ['Portfolio appears well-balanced'];
} 