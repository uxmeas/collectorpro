import { FlowBlockchainService } from './flow-blockchain'

// Enhanced moment data with analytics
export interface DiscoveryMoment {
  id: string
  playId: string
  serialNumber: number
  playerName: string
  playerImage: string
  teamName: string
  teamLogo: string
  playType: string
  setName: string
  series: string
  rarityTier: string
  currentPrice: number
  priceChange24h: number
  priceChangePercent: number
  priceChange7d: number
  priceChange30d: number
  topShotScore: number
  momentImage: string
  videoUrl: string
  supply: number
  burned: number
  circulatingSupply: number
  marketplaceUrl: string
  priceHistory: Array<{ timestamp: number; price: number; volume: number }>
  lastSale: number
  lowestAsk: number
  highestBid: number
  isDeal: boolean
  dealScore: number
  trendScore: number
  volumeScore: number
  rarityScore: number
  liquidityScore: number
  marketCap: number
  avgHoldTime: number
  uniqueOwners: number
  salesLast24h: number
  salesLast7d: number
  volatilityIndex: number
  momentum: 'bullish' | 'bearish' | 'neutral'
  supportLevel: number
  resistanceLevel: number
  rsi: number // Relative Strength Index
  recommendations: Array<{
    type: 'buy' | 'sell' | 'hold' | 'watch'
    reason: string
    confidence: number
  }>
}

export interface DiscoveryFilters {
  search: string
  playTypes: string[]
  players: string[]
  teams: string[]
  sets: string[]
  rarityTiers: string[]
  series: string[]
  priceRange: [number, number]
  serialRange: [number, number]
  topShotScoreRange: [number, number]
  marketCapRange: [number, number]
  volumeRange: [number, number]
  showDealsOnly: boolean
  showTrendingOnly: boolean
  momentum: string[]
  liquidityMin: number
}

export interface MarketAnalytics {
  totalMoments: number
  totalVolume24h: number
  avgPrice: number
  priceChangePercent: number
  topGainers: DiscoveryMoment[]
  topLosers: DiscoveryMoment[]
  trendingMoments: DiscoveryMoment[]
  bestDeals: DiscoveryMoment[]
  newListings: DiscoveryMoment[]
  rareFinds: DiscoveryMoment[]
  marketSentiment: 'bullish' | 'bearish' | 'neutral'
  volatilityIndex: number
  liquidityIndex: number
}

class DiscoveryService {
  private flowService: FlowBlockchainService
  private momentCache: Map<string, DiscoveryMoment> = new Map()
  private lastCacheUpdate: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Use a dummy address for discovery service since we're using sample data
    this.flowService = new FlowBlockchainService('0x0000000000000000')
  }

  // Main discovery search with advanced filtering
  async searchMoments(filters: Partial<DiscoveryFilters>, sortBy: string = 'trending'): Promise<DiscoveryMoment[]> {
    try {
      // Get base moments (from cache or API)
      let moments = await this.getMomentsWithAnalytics()
      
      // Apply filters
      moments = this.applyFilters(moments, filters)
      
      // Apply sorting
      moments = this.applySorting(moments, sortBy)
      
      return moments
    } catch (error) {
      console.error('❌ Error searching moments:', error)
      // Return sample data for development
      return this.generateSampleMoments()
    }
  }

  // Get moments with enhanced analytics
  private async getMomentsWithAnalytics(): Promise<DiscoveryMoment[]> {
    const now = Date.now()
    
    // Use cache if available and fresh
    if (this.momentCache.size > 0 && (now - this.lastCacheUpdate) < this.CACHE_DURATION) {
      return Array.from(this.momentCache.values())
    }

    try {
      // In production, this would fetch from real APIs
      const moments = this.generateSampleMoments()
      
      // Cache the results
      this.momentCache.clear()
      moments.forEach(moment => this.momentCache.set(moment.id, moment))
      this.lastCacheUpdate = now
      
      return moments
    } catch (error) {
      console.error('❌ Error fetching moments with analytics:', error)
      return this.generateSampleMoments()
    }
  }

  // Advanced filtering logic
  private applyFilters(moments: DiscoveryMoment[], filters: Partial<DiscoveryFilters>): DiscoveryMoment[] {
    return moments.filter(moment => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = `${moment.playerName} ${moment.teamName} ${moment.playType} ${moment.setName}`.toLowerCase()
        if (!searchableText.includes(searchTerm)) return false
      }

      // Category filters
      if (filters.playTypes?.length && !filters.playTypes.includes(moment.playType)) return false
      if (filters.players?.length && !filters.players.includes(moment.playerName)) return false
      if (filters.teams?.length && !filters.teams.includes(moment.teamName)) return false
      if (filters.sets?.length && !filters.sets.includes(moment.setName)) return false
      if (filters.rarityTiers?.length && !filters.rarityTiers.includes(moment.rarityTier)) return false
      if (filters.series?.length && !filters.series.includes(moment.series)) return false

      // Range filters
      if (filters.priceRange) {
        if (moment.currentPrice < filters.priceRange[0] || moment.currentPrice > filters.priceRange[1]) return false
      }
      
      if (filters.serialRange) {
        if (moment.serialNumber < filters.serialRange[0] || moment.serialNumber > filters.serialRange[1]) return false
      }
      
      if (filters.topShotScoreRange) {
        if (moment.topShotScore < filters.topShotScoreRange[0] || moment.topShotScore > filters.topShotScoreRange[1]) return false
      }

      // Advanced filters
      if (filters.showDealsOnly && !moment.isDeal) return false
      if (filters.showTrendingOnly && moment.trendScore < 70) return false
      if (filters.momentum?.length && !filters.momentum.includes(moment.momentum)) return false
      if (filters.liquidityMin && moment.liquidityScore < filters.liquidityMin) return false

      return true
    })
  }

  // Advanced sorting with multiple criteria
  private applySorting(moments: DiscoveryMoment[], sortBy: string): DiscoveryMoment[] {
    const sorted = [...moments]
    
    switch (sortBy) {
      case 'price-desc':
        return sorted.sort((a, b) => b.currentPrice - a.currentPrice)
      
      case 'price-asc':
        return sorted.sort((a, b) => a.currentPrice - b.currentPrice)
      
      case 'trending':
        return sorted.sort((a, b) => b.trendScore - a.trendScore)
      
      case 'deals':
        return sorted.sort((a, b) => b.dealScore - a.dealScore)
      
      case 'volume':
        return sorted.sort((a, b) => b.volumeScore - a.volumeScore)
      
      case 'rarity':
        return sorted.sort((a, b) => b.rarityScore - a.rarityScore)
      
      case 'momentum':
        return sorted.sort((a, b) => {
          const momentumOrder = { 'bullish': 3, 'neutral': 2, 'bearish': 1 }
          return momentumOrder[b.momentum] - momentumOrder[a.momentum]
        })
      
      case 'recent':
        return sorted.sort((a, b) => b.serialNumber - a.serialNumber)
      
      case 'score':
        return sorted.sort((a, b) => b.topShotScore - a.topShotScore)
      
      default:
        return sorted
    }
  }

  // Get market analytics
  async getMarketAnalytics(): Promise<MarketAnalytics> {
    try {
      const allMoments = await this.getMomentsWithAnalytics()
      
      return {
        totalMoments: allMoments.length,
        totalVolume24h: allMoments.reduce((sum, m) => sum + (m.salesLast24h * m.currentPrice), 0),
        avgPrice: allMoments.reduce((sum, m) => sum + m.currentPrice, 0) / allMoments.length,
        priceChangePercent: allMoments.reduce((sum, m) => sum + m.priceChangePercent, 0) / allMoments.length,
        topGainers: allMoments.filter(m => m.priceChangePercent > 0).sort((a, b) => b.priceChangePercent - a.priceChangePercent).slice(0, 5),
        topLosers: allMoments.filter(m => m.priceChangePercent < 0).sort((a, b) => a.priceChangePercent - b.priceChangePercent).slice(0, 5),
        trendingMoments: allMoments.sort((a, b) => b.trendScore - a.trendScore).slice(0, 10),
        bestDeals: allMoments.filter(m => m.isDeal).sort((a, b) => b.dealScore - a.dealScore).slice(0, 10),
        newListings: allMoments.sort((a, b) => b.serialNumber - a.serialNumber).slice(0, 10),
        rareFinds: allMoments.filter(m => m.rarityScore > 80).slice(0, 10),
        marketSentiment: this.calculateMarketSentiment(allMoments),
        volatilityIndex: allMoments.reduce((sum, m) => sum + m.volatilityIndex, 0) / allMoments.length,
        liquidityIndex: allMoments.reduce((sum, m) => sum + m.liquidityScore, 0) / allMoments.length
      }
    } catch (error) {
      console.error('❌ Error getting market analytics:', error)
      throw error
    }
  }

  // Calculate overall market sentiment
  private calculateMarketSentiment(moments: DiscoveryMoment[]): 'bullish' | 'bearish' | 'neutral' {
    const bullishCount = moments.filter(m => m.momentum === 'bullish').length
    const bearishCount = moments.filter(m => m.momentum === 'bearish').length
    const neutralCount = moments.filter(m => m.momentum === 'neutral').length
    
    if (bullishCount > bearishCount && bullishCount > neutralCount) return 'bullish'
    if (bearishCount > bullishCount && bearishCount > neutralCount) return 'bearish'
    return 'neutral'
  }

  // Deal detection algorithm
  private calculateDealScore(moment: DiscoveryMoment): number {
    let score = 0
    
    // Price below moving average
    if (moment.currentPrice < moment.supportLevel) score += 30
    
    // High volume
    if (moment.volumeScore > 70) score += 20
    
    // Low RSI (oversold)
    if (moment.rsi < 30) score += 25
    
    // High liquidity
    if (moment.liquidityScore > 80) score += 15
    
    // Rare moments get bonus
    if (moment.rarityScore > 90) score += 10
    
    return Math.min(score, 100)
  }

  // Generate sample data for development
  private generateSampleMoments(): DiscoveryMoment[] {
    const players = [
      { name: 'LeBron James', image: '👑', team: 'Los Angeles Lakers', logo: '🏀' },
      { name: 'Stephen Curry', image: '🎯', team: 'Golden State Warriors', logo: '⚡' },
      { name: 'Kevin Durant', image: '🐍', team: 'Phoenix Suns', logo: '☀️' },
      { name: 'Giannis Antetokounmpo', image: '🦌', team: 'Milwaukee Bucks', logo: '🦌' },
      { name: 'Luka Dončić', image: '🧙', team: 'Dallas Mavericks', logo: '🐎' },
      { name: 'Nikola Jokić', image: '🃏', team: 'Denver Nuggets', logo: '⛰️' },
      { name: 'Jayson Tatum', image: '🎨', team: 'Boston Celtics', logo: '🍀' },
      { name: 'Jimmy Butler', image: '☕', team: 'Miami Heat', logo: '🔥' },
    ]

    const playTypes = ['Dunk', 'Three Pointer', 'Assist', 'Block', 'Steal', 'Layup', 'Crossover', 'Rebound']
    const rarityTiers = ['Common', 'Rare', 'Legendary', 'Ultimate']
    const seriesNames = ['Series 1', 'Series 2', 'Series 3', 'Series 4']
    const setNames = ['Base Set', 'Playoffs', 'Rookie Debut', 'Rising Stars', 'Champion', 'Finals']

    const moments: DiscoveryMoment[] = []

    for (let i = 0; i < 100; i++) {
      const player = players[Math.floor(Math.random() * players.length)]
      const playType = playTypes[Math.floor(Math.random() * playTypes.length)]
      const rarityTier = rarityTiers[Math.floor(Math.random() * rarityTiers.length)]
      const seriesName = seriesNames[Math.floor(Math.random() * seriesNames.length)]
      const setName = setNames[Math.floor(Math.random() * setNames.length)]

      const basePrice = 50 + Math.random() * 2000
      const priceChange24h = (Math.random() - 0.5) * 200
      const priceChangePercent = (priceChange24h / basePrice) * 100
      const supply = Math.floor(Math.random() * 50000) + 100
      const burned = Math.floor(Math.random() * supply * 0.1)
      const circulatingSupply = supply - burned

      // Generate price history
      const priceHistory = []
      let currentPrice = basePrice
      for (let j = 0; j < 30; j++) {
        const volume = Math.floor(Math.random() * 100)
        priceHistory.push({
          timestamp: Date.now() - (30 - j) * 24 * 60 * 60 * 1000,
          price: currentPrice + (Math.random() - 0.5) * 50,
          volume
        })
        currentPrice = priceHistory[priceHistory.length - 1].price
      }

      const volatilityIndex = Math.random() * 100
      const liquidityScore = Math.random() * 100
      const trendScore = Math.random() * 100
      const volumeScore = Math.random() * 100
      const rarityScore = rarityTiers.indexOf(rarityTier) * 25 + Math.random() * 25
      const rsi = Math.random() * 100
      
      const momentum: 'bullish' | 'bearish' | 'neutral' = 
        priceChangePercent > 5 ? 'bullish' : 
        priceChangePercent < -5 ? 'bearish' : 'neutral'

      const dealScore = Math.random() * 100
      const isDeal = dealScore > 75

      moments.push({
        id: `moment-${i}`,
        playId: `play-${i}`,
        serialNumber: Math.floor(Math.random() * 10000) + 1,
        playerName: player.name,
        playerImage: player.image,
        teamName: player.team,
        teamLogo: player.logo,
        playType,
        setName,
        series: seriesName,
        rarityTier,
        currentPrice: basePrice + priceChange24h,
        priceChange24h,
        priceChangePercent,
        priceChange7d: (Math.random() - 0.5) * 500,
        priceChange30d: (Math.random() - 0.5) * 1000,
        topShotScore: Math.floor(Math.random() * 1000000),
        momentImage: '🎬',
        videoUrl: `https://nbatopshot.com/moment/${i}`,
        supply,
        burned,
        circulatingSupply,
        marketplaceUrl: `https://nbatopshot.com/listings/p2p/${i}`,
        priceHistory,
        lastSale: basePrice + (Math.random() - 0.5) * 100,
        lowestAsk: basePrice + Math.random() * 50,
        highestBid: basePrice - Math.random() * 50,
        isDeal,
        dealScore,
        trendScore,
        volumeScore,
        rarityScore,
        liquidityScore,
        marketCap: (basePrice + priceChange24h) * circulatingSupply,
        avgHoldTime: Math.random() * 365,
        uniqueOwners: Math.floor(circulatingSupply * (0.3 + Math.random() * 0.4)),
        salesLast24h: Math.floor(Math.random() * 50),
        salesLast7d: Math.floor(Math.random() * 300),
        volatilityIndex,
        momentum,
        supportLevel: basePrice * (0.8 + Math.random() * 0.1),
        resistanceLevel: basePrice * (1.1 + Math.random() * 0.1),
        rsi,
        recommendations: [
          {
            type: isDeal ? 'buy' : Math.random() > 0.5 ? 'hold' : 'watch',
            reason: isDeal ? 'Undervalued based on recent sales' : 'Market consolidation expected',
            confidence: 60 + Math.random() * 40
          }
        ]
      })
    }

    return moments
  }

  // Get autocomplete suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return []
    
    const moments = await this.getMomentsWithAnalytics()
    const suggestions = new Set<string>()
    
    const queryLower = query.toLowerCase()
    
    moments.forEach(moment => {
      if (moment.playerName.toLowerCase().includes(queryLower)) {
        suggestions.add(moment.playerName)
      }
      if (moment.teamName.toLowerCase().includes(queryLower)) {
        suggestions.add(moment.teamName)
      }
      if (moment.playType.toLowerCase().includes(queryLower)) {
        suggestions.add(moment.playType)
      }
      if (moment.setName.toLowerCase().includes(queryLower)) {
        suggestions.add(moment.setName)
      }
    })
    
    return Array.from(suggestions).slice(0, 10)
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.momentCache.clear()
    this.lastCacheUpdate = 0
  }
}

export const discoveryService = new DiscoveryService() 