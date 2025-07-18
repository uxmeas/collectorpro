import { NextRequest, NextResponse } from 'next/server';
import { EnhancedFlowBlockchainService } from '../../../../lib/flow-blockchain-enhanced';
import { CSVExportData } from '../../../../lib/nba-topshot-types';

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

    console.log(`📊 EXPORT: Generating CSV for wallet: ${walletAddress}`);

    // Initialize enhanced Flow blockchain service
    const flowService = new EnhancedFlowBlockchainService();

    // Get comprehensive moments
    const moments = await flowService.getComprehensiveMoments(walletAddress);
    
    // Generate CSV data
    const csvData = generateCSVData(moments, walletAddress);

    // Return CSV file with headers
    const csvContent = [csvData.headers.join(','), ...csvData.rows.map(row => row.join(','))].join('\n');
    const response = new NextResponse(csvContent);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="${csvData.filename}"`);

    return response;
  } catch (error) {
    console.error('❌ CSV export error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate CSV export',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function generateCSVData(moments: any[], walletAddress: string): CSVExportData {
  const headers = [
    'ID',
    'Player Name',
    'Team Name',
    'Play Category',
    'Play Type',
    'Rarity',
    'Set',
    'Series',
    'Season',
    'Serial Number',
    'Total Circulation',
    'Circulation Rank',
    'Circulation Percentile',
    'Acquisition Price',
    'Acquisition Date',
    'Current Value',
    'Last Sale Price',
    'Last Sale Date',
    'Floor Price',
    'Ceiling Price',
    'Average Price',
    'Median Price',
    'Profit/Loss',
    'Profit Percentage',
    'Holding Period (Days)',
    'Annualized ROI',
    'Volume 24h',
    'Volume 7d',
    'Volume 30d',
    'Sales Count 24h',
    'Sales Count 7d',
    'Sales Count 30d',
    'Listings Count',
    'Lowest Listing',
    'Rarity Score',
    'Scarcity Score',
    'Desirability Score',
    'Market Cap',
    'Price Change 24h',
    'Price Change 7d',
    'Price Change 30d',
    'Volume Change 24h',
    'Volume Change 7d',
    'Volume Change 30d',
    'Market Trend',
    'Volatility',
    'Liquidity',
    'Momentum',
    'Moment URL',
    'Image URL',
    'Video URL',
    'Play Description',
    'Game Date',
    'Game ID',
    'Contract Address',
    'Token ID',
    'Network',
    'Wallet Address'
  ];

  const rows = moments.map(moment => [
    moment.id,
    moment.playerName,
    moment.teamName,
    moment.playCategory,
    moment.playType,
    moment.rarity,
    moment.set,
    moment.series,
    moment.season,
    moment.serialNumber,
    moment.totalCirculation,
    moment.circulationRank,
    moment.circulationPercentile,
    moment.acquisitionPrice || '',
    moment.acquisitionDate || '',
    moment.currentValue,
    moment.lastSalePrice || '',
    moment.lastSaleDate || '',
    moment.floorPrice || '',
    moment.ceilingPrice || '',
    moment.averagePrice || '',
    moment.medianPrice || '',
    moment.profit,
    moment.profitPercentage,
    moment.holdingPeriod,
    moment.annualizedROI,
    moment.volume24h,
    moment.volume7d,
    moment.volume30d,
    moment.salesCount24h,
    moment.salesCount7d,
    moment.salesCount30d,
    moment.listingsCount,
    moment.lowestListing,
    moment.rarityScore,
    moment.scarcityScore,
    moment.desirabilityScore,
    moment.marketCap,
    moment.analytics.priceChange24h,
    moment.analytics.priceChange7d,
    moment.analytics.priceChange30d,
    moment.analytics.volumeChange24h,
    moment.analytics.volumeChange7d,
    moment.analytics.volumeChange30d,
    moment.analytics.marketTrend,
    moment.analytics.volatility,
    moment.analytics.liquidity,
    moment.analytics.momentum,
    moment.momentURL,
    moment.imageURL,
    moment.videoURL,
    moment.playDescription,
    moment.gameDate,
    moment.gameId,
    moment.blockchain.contractAddress,
    moment.blockchain.tokenId,
    moment.blockchain.network,
    moment.blockchain.walletAddress
  ]);

  return {
    headers,
    rows,
    filename: `nba-topshot-portfolio-${walletAddress}-${new Date().toISOString().split('T')[0]}.csv`
  };
} 