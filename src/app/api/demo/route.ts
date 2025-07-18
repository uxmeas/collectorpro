import { NextRequest, NextResponse } from 'next/server';

// Simple demo portfolio data for testing
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('address') || 'demo-wallet';

    console.log(`🎯 Demo API called for wallet: ${walletAddress}`);

    // Generate simple demo data with required fields
    const demoMoments = Array.from({ length: 25 }, (_, i) => {
      const players = ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Luka Dončić'];
      const teams = ['Los Angeles Lakers', 'Golden State Warriors', 'Brooklyn Nets', 'Milwaukee Bucks', 'Dallas Mavericks'];
      const sets = ['Base Set', 'Metallic Gold LE', 'Cool Cats', 'Handles', 'Throwdowns'];
      const rarities = ['COMMON', 'RARE', 'LEGENDARY', 'ULTIMATE'];
      
      const player = players[i % players.length];
      const team = teams[i % teams.length];
      const set = sets[i % sets.length];
      const rarity = rarities[i % rarities.length];
      
      const basePrice = rarity === 'ULTIMATE' ? 1000 : rarity === 'LEGENDARY' ? 500 : rarity === 'RARE' ? 100 : 25;
      const purchasePrice = basePrice + (Math.random() - 0.5) * basePrice * 0.4;
      const currentValue = purchasePrice * (0.8 + Math.random() * 0.6); // 80%-140% of purchase
      
      return {
        id: `demo-${i + 1}`,
        playId: `play-${i + 1}`,
        momentId: `moment-${i + 1}`,
        topShotLink: `https://nbatopshot.com/moment/${i + 1}`,
        
        // Player Info
        playerName: player,
        playerId: `player-${i + 1}`,
        playerSlug: player.toLowerCase().replace(' ', '-'),
        rookieStatus: i % 5 === 0,
        mvpYear: i % 10 === 0,
        championshipYear: i % 8 === 0,
        
        // Team Info
        teamName: team,
        teamId: `team-${i + 1}`,
        teamSlug: team.toLowerCase().replace(' ', '-'),
        teamAbbreviation: team.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase(),
        
        // Play Info
        playCategory: ['Dunk', 'Three Pointer', 'Assist', 'Block'][i % 4],
        playType: 'Regular Season',
        playDescription: `Amazing play by ${player}`,
        playSlug: `play-${i + 1}`,
        
        // Set Info
        set: set,
        setName: set,
        setSlug: set.toLowerCase().replace(' ', '-'),
        series: `Series ${Math.floor(i / 5) + 1}`,
        seriesName: `Series ${Math.floor(i / 5) + 1}`,
        seriesSlug: `series-${Math.floor(i / 5) + 1}`,
        season: '2022-23',
        seasonYear: 2023,
        
        // Rarity
        rarity: rarity,
        tier: rarity,
        parallel: 'Standard',
        parallelType: 'Standard',
        
        // Serial & Circulation
        serialNumber: Math.floor(Math.random() * 1000) + 1,
        totalCirculation: Math.floor(Math.random() * 5000) + 1000,
        circulationCount: Math.floor(Math.random() * 5000) + 1000,
        circulationRank: Math.floor(Math.random() * 1000) + 1,
        circulationPercentile: Math.random() * 100,
        uniqueOwners: Math.floor(Math.random() * 500) + 100,
        ownershipPercentage: Math.random() * 5,
        
        // Game Info
        gameDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        gameId: `game-${i + 1}`,
        gameSlug: `game-${i + 1}`,
        homeTeam: team,
        awayTeam: teams[(i + 1) % teams.length],
        homeScore: Math.floor(Math.random() * 50) + 80,
        awayScore: Math.floor(Math.random() * 50) + 80,
        quarter: Math.floor(Math.random() * 4) + 1,
        timeRemaining: '00:00',
        gameResult: 'Win',
        playoffGame: false,
        championshipGame: false,
        allStarGame: false,
        
        // Media
        imageURL: `https://assets.nbatopshot.com/media/${i + 1}/preview.jpg`,
        videoURL: `https://assets.nbatopshot.com/media/${i + 1}/video.mp4`,
        momentURL: `https://nbatopshot.com/moment/${i + 1}`,
        thumbnailURL: `https://assets.nbatopshot.com/media/${i + 1}/thumbnail.jpg`,
        
        // Financial
        purchasePrice: purchasePrice,
        purchaseDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        purchaseTransactionId: `tx-${i + 1}`,
        currentValue: currentValue,
        trueValue: currentValue * (0.95 + Math.random() * 0.1),
        lowAsk: currentValue * 0.9,
        highBid: currentValue * 0.85,
        highestOffer: currentValue * 0.8,
        averagePrice: currentValue * (0.95 + Math.random() * 0.1),
        medianPrice: currentValue * (0.9 + Math.random() * 0.2),
        floorPrice: currentValue * 0.8,
        ceilingPrice: currentValue * 1.5,
        lastSalePrice: currentValue * (0.9 + Math.random() * 0.2),
        lastSaleDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        lastSaleTransactionId: `sale-tx-${i + 1}`,
        
        // Performance
        gainLoss: currentValue - purchasePrice,
        gainLossPercentage: ((currentValue - purchasePrice) / purchasePrice) * 100,
        holdingPeriod: Math.floor(Math.random() * 365),
        annualizedROI: Math.random() * 50 - 10,
        totalReturn: currentValue - purchasePrice,
        
        // Market metrics (simplified)
        priceChange4h: (Math.random() - 0.5) * 10,
        priceChange24h: (Math.random() - 0.5) * 20,
        priceChange7d: (Math.random() - 0.5) * 40,
        priceChange30d: (Math.random() - 0.5) * 60,
        volume4h: Math.floor(Math.random() * 1000),
        volume24h: Math.floor(Math.random() * 5000),
        volume7d: Math.floor(Math.random() * 25000),
        volume30d: Math.floor(Math.random() * 100000),
        salesCount4h: Math.floor(Math.random() * 10),
        salesCount24h: Math.floor(Math.random() * 50),
        salesCount7d: Math.floor(Math.random() * 200),
        salesCount30d: Math.floor(Math.random() * 800),
        
        // Listing data
        listingsCount: Math.floor(Math.random() * 20) + 1,
        activeListings: Math.floor(Math.random() * 10) + 1,
        lowestListing: currentValue * 0.95,
        highestListing: currentValue * 1.2,
        lockStatus: Math.random() > 0.8,
        challengeReward: Math.random() > 0.7,
        challengeEligible: Math.random() > 0.6,
        
        // Scores
        rarityScore: Math.random() * 100,
        scarcityScore: Math.random() * 100,
        desirabilityScore: Math.random() * 100,
        marketCap: currentValue * 1000,
        liquidityScore: Math.random() * 100,
        
        // Player stats (simplified)
        playerStats: {
          points: Math.floor(Math.random() * 30) + 10,
          rebounds: Math.floor(Math.random() * 15) + 2,
          assists: Math.floor(Math.random() * 12) + 1,
          steals: Math.floor(Math.random() * 3),
          blocks: Math.floor(Math.random() * 3),
          minutes: Math.floor(Math.random() * 20) + 20,
          plusMinus: Math.floor(Math.random() * 20) - 10,
          fieldGoalPercentage: Math.random() * 0.4 + 0.4,
          threePointPercentage: Math.random() * 0.4 + 0.3,
          freeThrowPercentage: Math.random() * 0.2 + 0.7,
          efficiency: Math.random() * 30 + 10
        },
        
        // Special attributes (simplified)
        specialAttributes: {
          commemorative: Math.random() > 0.8,
          limitedEdition: Math.random() > 0.7,
          firstMoment: i === 0
        }
      };
    });

    // Calculate simple analytics
    const totalValue = demoMoments.reduce((sum, m) => sum + m.currentValue, 0);
    const totalCost = demoMoments.reduce((sum, m) => sum + m.purchasePrice, 0);
    const totalProfit = totalValue - totalCost;
    const profitPercentage = (totalProfit / totalCost) * 100;

    const analytics = {
      overview: {
        totalValue,
        totalMoments: demoMoments.length,
        totalAcquisitionCost: totalCost,
        totalProfit,
        profitPercentage,
        lastUpdated: new Date().toISOString()
      },
      performance: {
        dailyChange: (Math.random() - 0.5) * 10,
        weeklyChange: (Math.random() - 0.5) * 25,
        monthlyChange: (Math.random() - 0.5) * 50,
        allTimeChange: profitPercentage
      },
      breakdown: {
        byRarity: {},
        byTeam: {},
        byPlayer: {},
        bySet: {}
      },
      topHoldings: demoMoments
        .sort((a, b) => b.currentValue - a.currentValue)
        .slice(0, 5)
        .map(moment => ({
          id: moment.id,
          playerName: moment.playerName,
          teamName: moment.teamName,
          rarity: moment.rarity,
          serialNumber: moment.serialNumber,
          currentValue: moment.currentValue,
          acquisitionPrice: moment.purchasePrice,
          profit: moment.gainLoss,
          profitPercentage: moment.gainLossPercentage,
          imageURL: moment.imageURL
        })),
      marketInsights: {
        trendingPlayers: ['LeBron James', 'Stephen Curry', 'Kevin Durant'],
        marketTrend: 'bullish' as const,
        volume24h: demoMoments.reduce((sum, m) => sum + m.volume24h, 0),
        averagePrice: totalValue / demoMoments.length
      }
    };

    console.log(`✅ Generated ${demoMoments.length} demo moments`);

    return NextResponse.json({
      success: true,
      data: {
        wallet: walletAddress,
        moments: demoMoments,
        analytics,
        metadata: {
          isDemo: true,
          generatedAt: new Date().toISOString(),
          totalMoments: demoMoments.length,
          message: 'Demo data for testing CollectorPRO features'
        }
      }
    });

  } catch (error) {
    console.error('❌ Demo API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate demo data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 