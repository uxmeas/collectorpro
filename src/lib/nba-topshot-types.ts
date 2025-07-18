// Ultimate NBA Top Shot Data Types
// Based on real NBA Top Shot user data with 40+ comprehensive fields
// Matching professional NFT marketplace standards (OpenSea, Magic Eden)

export interface NBATopShotMoment {
  // Core Identification
  id: string;
  playId: string;
  momentId: string;
  topShotLink: string;
  
  // Player Information
  playerName: string;
  playerId: string;
  playerSlug: string;
  rookieStatus: boolean;
  mvpYear: boolean;
  championshipYear: boolean;
  
  // Team Information
  teamName: string;
  teamId: string;
  teamSlug: string;
  teamAbbreviation: string;
  
  // Play Information
  playCategory: string;
  playType: string;
  playDescription: string;
  playSlug: string;
  
  // Set & Series Information
  set: string;
  setName: string;
  setSlug: string;
  series: string;
  seriesName: string;
  seriesSlug: string;
  season: string;
  seasonYear: number;
  
  // Rarity & Tier Information
  rarity: string;
  tier: string;
  parallel: string;
  parallelType: string;
  
  // Serial Number Information
  serialNumber: number;
  totalCirculation: number;
  circulationRank: number;
  circulationPercentile: number;
  uniqueOwners: number;
  ownershipPercentage: number;
  
  // Game Information
  gameDate: string;
  gameId: string;
  gameSlug: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  gameResult: string;
  playoffGame: boolean;
  championshipGame: boolean;
  allStarGame: boolean;
  
  // Visual & Media
  imageURL: string;
  videoURL: string;
  momentURL: string;
  thumbnailURL: string;
  
  // Financial Data
  purchasePrice: number;
  purchaseDate: string;
  purchaseTransactionId: string;
  currentValue: number;
  trueValue: number;
  lowAsk: number;
  highBid: number;
  highestOffer: number;
  averagePrice: number;
  medianPrice: number;
  floorPrice: number;
  ceilingPrice: number;
  lastSalePrice: number;
  lastSaleDate: string;
  lastSaleTransactionId: string;
  
  // Performance Metrics
  gainLoss: number;
  gainLossPercentage: number;
  holdingPeriod: number; // days
  annualizedROI: number;
  totalReturn: number;
  
  // Market Metrics
  priceChange4h: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  volume4h: number;
  volume24h: number;
  volume7d: number;
  volume30d: number;
  salesCount4h: number;
  salesCount24h: number;
  salesCount7d: number;
  salesCount30d: number;
  
  // Listing & Trading Data
  listingsCount: number;
  activeListings: number;
  lowestListing: number;
  highestListing: number;
  lockStatus: boolean;
  challengeReward: boolean;
  challengeEligible: boolean;
  
  // Rarity & Scarcity Scores
  rarityScore: number;
  scarcityScore: number;
  desirabilityScore: number;
  marketCap: number;
  liquidityScore: number;
  
  // Player Performance Stats
  playerStats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    minutes: number;
    plusMinus: number;
    fieldGoalPercentage: number;
    threePointPercentage: number;
    freeThrowPercentage: number;
    efficiency: number;
  };
  
  // Special Attributes
  specialAttributes: {
    commemorative: boolean;
    limitedEdition: boolean;
    firstMoment: boolean;
    milestoneMoment: boolean;
    recordBreaking: boolean;
    gameWinner: boolean;
    buzzerBeater: boolean;
    alleyOop: boolean;
    posterDunk: boolean;
    noLookPass: boolean;
    behindTheBack: boolean;
    crossover: boolean;
    stepback: boolean;
    fadeaway: boolean;
    euroStep: boolean;
    spinMove: boolean;
    pumpFake: boolean;
    putback: boolean;
    tipIn: boolean;
    fastBreak: boolean;
    transition: boolean;
    halfCourt: boolean;
    fullCourt: boolean;
    overtime: boolean;
    doubleOvertime: boolean;
    tripleOvertime: boolean;
    playoffMoment: boolean;
    finalsMoment: boolean;
    allStarMoment: boolean;
    rookieMoment: boolean;
    mvpMoment: boolean;
    championshipMoment: boolean;
    recordMoment: boolean;
    historicMoment: boolean;
    viralMoment: boolean;
    iconicMoment: boolean;
    legendaryMoment: boolean;
    ultimateMoment: boolean;
  };
  
  // Metadata & Tags
  metadata: {
    tags: string[];
    badges: string[];
    achievements: string[];
    specialEvents: string[];
    commemorative: boolean;
    limitedEdition: boolean;
    challengeEligible: boolean;
    challengeReward: boolean;
    lockStatus: boolean;
    tradeable: boolean;
    transferable: boolean;
    burnable: boolean;
    mintable: boolean;
    pausable: boolean;
    upgradeable: boolean;
  };
  
  // Blockchain Information
  blockchain: {
    contractAddress: string;
    tokenId: string;
    blockNumber: number;
    transactionHash: string;
    gasUsed: number;
    gasPrice: number;
    network: 'flow' | 'ethereum';
    walletAddress: string;
    mintDate: string;
    mintTransactionId: string;
    creatorAddress: string;
    royaltyPercentage: number;
  };
  
  // Analytics & Market Intelligence
  analytics: {
    priceChange24h: number;
    priceChange7d: number;
    priceChange30d: number;
    volumeChange24h: number;
    volumeChange7d: number;
    volumeChange30d: number;
    marketTrend: 'bullish' | 'bearish' | 'neutral';
    volatility: number;
    liquidity: number;
    momentum: number;
    demandScore: number;
    supplyScore: number;
    marketSentiment: number;
    pricePrediction: number;
    riskScore: number;
    opportunityScore: number;
  };
  
  // Portfolio Context
  portfolioContext: {
    acquisitionDate: string;
    acquisitionPrice: number;
    acquisitionTransactionId: string;
    holdingPeriod: number;
    profitLoss: number;
    profitLossPercentage: number;
    annualizedROI: number;
    portfolioWeight: number;
    portfolioRank: number;
    isTopHolding: boolean;
    isWorstHolding: boolean;
    daysSinceAcquisition: number;
  };

  // Convenience aliases for direct access (computed properties)
  acquisitionPrice?: number;
  profit?: number;
  profitPercentage?: number;
}

export interface PortfolioAnalytics {
  // Overview
  overview: {
    totalValue: number;
    totalMoments: number;
    totalAcquisitionCost: number;
    totalProfit: number;
    profitPercentage: number;
    averageROI: number;
    weightedAverageROI: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
    portfolioWeight: number;
    marketCap: number;
    lastUpdated: string;
  };
  
  // Performance Metrics
  performance: {
    dailyChange: number;
    dailyChangePercentage: number;
    weeklyChange: number;
    weeklyChangePercentage: number;
    monthlyChange: number;
    monthlyChangePercentage: number;
    quarterlyChange: number;
    quarterlyChangePercentage: number;
    yearlyChange: number;
    yearlyChangePercentage: number;
    allTimeChange: number;
    allTimeChangePercentage: number;
    bestPerformingDay: string;
    worstPerformingDay: string;
    bestPerformingWeek: string;
    worstPerformingWeek: string;
    bestPerformingMonth: string;
    worstPerformingMonth: string;
  };
  
  // Breakdowns
  breakdown: {
    byRarity: Record<string, RarityBreakdown>;
    byTeam: Record<string, TeamBreakdown>;
    byPlayer: Record<string, PlayerBreakdown>;
    bySet: Record<string, SetBreakdown>;
    bySeries: Record<string, SeriesBreakdown>;
    bySeason: Record<string, SeasonBreakdown>;
    byPlayType: Record<string, PlayTypeBreakdown>;
    byParallel: Record<string, ParallelBreakdown>;
    byTier: Record<string, TierBreakdown>;
    byAcquisitionDate: Record<string, DateBreakdown>;
    byGameType: Record<string, GameTypeBreakdown>;
    bySpecialAttribute: Record<string, SpecialAttributeBreakdown>;
  };
  
  // Top Holdings & Performance
  topHoldings: NBATopShotMoment[];
  worstHoldings: NBATopShotMoment[];
  bestPerformers: NBATopShotMoment[];
  worstPerformers: NBATopShotMoment[];
  mostProfitable: NBATopShotMoment[];
  leastProfitable: NBATopShotMoment[];
  highestGainers: NBATopShotMoment[];
  biggestLosers: NBATopShotMoment[];
  
  // Market Insights
  marketInsights: {
    trendingPlayers: TrendingPlayer[];
    trendingTeams: TrendingTeam[];
    trendingSets: TrendingSet[];
    marketTrend: 'bullish' | 'bearish' | 'neutral';
    volume24h: number;
    volume7d: number;
    volume30d: number;
    averagePrice: number;
    medianPrice: number;
    floorPrice: number;
    ceilingPrice: number;
    activeListings: number;
    totalSales24h: number;
    totalSales7d: number;
    totalSales30d: number;
    marketCap: number;
    totalSupply: number;
    uniqueOwners: number;
    averageHoldingPeriod: number;
  };
  
  // Risk Analysis
  riskAnalysis: {
    concentrationRisk: number;
    volatilityRisk: number;
    liquidityRisk: number;
    marketRisk: number;
    diversificationScore: number;
    riskAdjustedReturn: number;
    var95: number; // Value at Risk 95%
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
  };
  
  // Historical Data
  historicalData: {
    dailyValues: HistoricalDataPoint[];
    weeklyValues: HistoricalDataPoint[];
    monthlyValues: HistoricalDataPoint[];
    priceHistory: PriceHistoryPoint[];
    volumeHistory: VolumeHistoryPoint[];
    performanceHistory: PerformanceHistoryPoint[];
  };
  
  // Opportunities & Insights
  opportunities: {
    undervaluedMoments: NBATopShotMoment[];
    overvaluedMoments: NBATopShotMoment[];
    goodDeals: NBATopShotMoment[];
    sellingOpportunities: NBATopShotMoment[];
    buyingOpportunities: NBATopShotMoment[];
    arbitrageOpportunities: ArbitrageOpportunity[];
    marketInefficiencies: MarketInefficiency[];
  };
}

export interface RarityBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface TeamBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  players: string[];
  moments: NBATopShotMoment[];
}

export interface PlayerBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  teams: string[];
  moments: NBATopShotMoment[];
}

export interface SetBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  series: string[];
  moments: NBATopShotMoment[];
}

export interface SeriesBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  sets: string[];
  moments: NBATopShotMoment[];
}

export interface SeasonBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface PlayTypeBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface ParallelBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface TierBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface DateBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface GameTypeBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface SpecialAttributeBreakdown {
  count: number;
  value: number;
  percentage: number;
  averageValue: number;
  totalAcquisitionCost: number;
  totalProfit: number;
  profitPercentage: number;
  moments: NBATopShotMoment[];
}

export interface TrendingPlayer {
  playerName: string;
  playerId: string;
  volume24h: number;
  volumeChange24h: number;
  averagePrice: number;
  priceChange24h: number;
  salesCount24h: number;
  listingsCount: number;
  marketCap: number;
  trend: 'up' | 'down' | 'stable';
  rarity: string;
  tier: string;
  teamName: string;
}

export interface TrendingTeam {
  teamName: string;
  teamId: string;
  volume24h: number;
  volumeChange24h: number;
  averagePrice: number;
  priceChange24h: number;
  salesCount24h: number;
  listingsCount: number;
  marketCap: number;
  trend: 'up' | 'down' | 'stable';
  playerCount: number;
  momentCount: number;
}

export interface TrendingSet {
  setName: string;
  setSlug: string;
  volume24h: number;
  volumeChange24h: number;
  averagePrice: number;
  priceChange24h: number;
  salesCount24h: number;
  listingsCount: number;
  marketCap: number;
  trend: 'up' | 'down' | 'stable';
  series: string;
  season: string;
  rarity: string;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
  change: number;
  changePercentage: number;
  volume: number;
  transactions: number;
  moments: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  volume: number;
  sales: number;
  listings: number;
}

export interface VolumeHistoryPoint {
  date: string;
  volume: number;
  transactions: number;
  averagePrice: number;
  uniqueTraders: number;
}

export interface PerformanceHistoryPoint {
  date: string;
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
  roi: number;
  bestPerformer: string;
  worstPerformer: string;
}

export interface ArbitrageOpportunity {
  momentId: string;
  playerName: string;
  currentPrice: number;
  targetPrice: number;
  potentialProfit: number;
  profitPercentage: number;
  confidence: number;
  reason: string;
}

export interface MarketInefficiency {
  type: 'pricing' | 'liquidity' | 'information' | 'timing';
  description: string;
  impact: number;
  opportunity: string;
  recommendation: string;
}

// CSV Export Structure
export interface CSVExportData {
  headers: string[];
  rows: string[][];
  filename: string;
}

// API Response Types
export interface PortfolioResponse {
  success: boolean;
  data: {
    walletAddress: string;
    portfolio: PortfolioAnalytics;
    moments: NBATopShotMoment[];
    lastUpdated: string;
  };
  metadata?: {
    marketData?: Record<string, any>;
    transactionHistory?: any[];
    events?: any[];
    dataSource?: 'sample' | 'blockchain';
    flowNetwork?: 'mainnet' | 'testnet';
    apiVersion?: string;
    comprehensiveFields?: number;
  };
  error?: string;
}

export interface MarketDataResponse {
  success: boolean;
  data: {
    marketInsights: PortfolioAnalytics['marketInsights'];
    trendingPlayers: TrendingPlayer[];
    trendingTeams: TrendingTeam[];
    trendingSets: TrendingSet[];
    lastUpdated: string;
  };
  error?: string;
}

// Blockchain Network Types
export type BlockchainNetwork = 'flow' | 'ethereum';

export interface BlockchainConfig {
  network: BlockchainNetwork;
  rpcUrl: string;
  contractAddress: string;
  apiKey?: string;
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Utility Types
export type SortOrder = 'asc' | 'desc';
export type FilterOperator = 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains' | 'between' | 'exists';

export interface FilterCriteria {
  field: keyof NBATopShotMoment;
  operator: FilterOperator;
  value: any;
}

export interface SortCriteria {
  field: keyof NBATopShotMoment;
  order: SortOrder;
}

// Search Types
export interface SearchOptions {
  query: string;
  filters: FilterCriteria[];
  sort: SortCriteria[];
  page: number;
  limit: number;
}

export interface SearchResult {
  moments: NBATopShotMoment[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Enum-like string literals for better type safety
export type MomentRarity = 
  | 'Common'
  | 'Rare'
  | 'Legendary'
  | 'Ultimate'
  | 'Genesis'
  | 'MGLE'
  | 'Holo'
  | 'Metallic'

export type PlayType = 
  | 'Dunk'
  | 'Layup'
  | 'Jump Shot'
  | '3-Pointer'
  | 'Block'
  | 'Steal'
  | 'Assist'
  | 'Rebound'
  | 'Free Throw'
  | 'Clutch'
  | 'Game Winner'

export type Team = 
  | 'Atlanta Hawks'
  | 'Boston Celtics'
  | 'Brooklyn Nets'
  | 'Charlotte Hornets'
  | 'Chicago Bulls'
  | 'Cleveland Cavaliers'
  | 'Dallas Mavericks'
  | 'Denver Nuggets'
  | 'Detroit Pistons'
  | 'Golden State Warriors'
  | 'Houston Rockets'
  | 'Indiana Pacers'
  | 'LA Clippers'
  | 'Los Angeles Lakers'
  | 'Memphis Grizzlies'
  | 'Miami Heat'
  | 'Milwaukee Bucks'
  | 'Minnesota Timberwolves'
  | 'New Orleans Pelicans'
  | 'New York Knicks'
  | 'Oklahoma City Thunder'
  | 'Orlando Magic'
  | 'Philadelphia 76ers'
  | 'Phoenix Suns'
  | 'Portland Trail Blazers'
  | 'Sacramento Kings'
  | 'San Antonio Spurs'
  | 'Toronto Raptors'
  | 'Utah Jazz'
  | 'Washington Wizards' 