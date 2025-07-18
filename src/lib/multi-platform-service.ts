import { 
  Platform, 
  PlatformConfig, 
  Asset, 
  Activity, 
  Pack, 
  PortfolioMetrics, 
  MultiPlatformPortfolio
} from '@/types/multi-platform'

// Platform configurations
export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  topshot: {
    id: 'topshot',
    name: 'TopShot',
    fullName: 'NBA Top Shot',
    blockchain: 'Flow',
    color: '#3B82F6',
    icon: '🏀',
    contractAddress: '0x0b2a3299cc857e29',
    marketplaceUrl: 'https://nbatopshot.com',
    enabled: true
  },
  allday: {
    id: 'allday',
    name: 'AllDay',
    fullName: 'NFL All Day',
    blockchain: 'Flow',
    color: '#10B981',
    icon: '🏈',
    contractAddress: '0x329feb3ab062d289',
    marketplaceUrl: 'https://allday.com',
    enabled: true
  },
  panini: {
    id: 'panini',
    name: 'PaniniNFT',
    fullName: 'Panini NFT',
    blockchain: 'Ethereum',
    color: '#F59E0B',
    icon: '⚽',
    contractAddress: '0x2d0d57d004f82e9f141c2fd5f8b8a2657bd1faa7',
    marketplaceUrl: 'https://paninidigital.com',
    enabled: true
  },
  all: {
    id: 'all',
    name: 'All Collections',
    fullName: 'All Platforms',
    blockchain: 'Multi',
    color: '#8B5CF6',
    icon: '🎯',
    contractAddress: '',
    marketplaceUrl: '',
    enabled: true
  }
}

export class MultiPlatformService {
  // Get comprehensive multi-platform portfolio
  async getMultiPlatformPortfolio(walletAddress: string): Promise<MultiPlatformPortfolio> {
    console.log(`🔍 MULTI-PLATFORM: Fetching portfolio for wallet: ${walletAddress}`)
    
    const platforms = ['topshot', 'allday', 'panini'] as Platform[]
    const platformData: Record<Platform, PortfolioMetrics> = {} as Record<Platform, PortfolioMetrics>
    
    // Fetch data for each platform
    for (const platform of platforms) {
      try {
        platformData[platform] = await this.getPlatformPortfolio(walletAddress, platform)
      } catch (error) {
        console.error(`❌ Error fetching ${platform} data:`, error)
        platformData[platform] = this.getEmptyPortfolioMetrics(platform)
      }
    }

    // Calculate combined metrics
    const combined = this.calculateCombinedMetrics(platformData)
    
    // Get top assets across all platforms
    const allAssets = Object.values(platformData).flatMap(p => p.topAssets)
    const topAssets = allAssets
      .sort((a, b) => b.currentPrice - a.currentPrice)
      .slice(0, 10)

    // Get recent activity across all platforms
    const allActivities = Object.values(platformData).flatMap(p => p.recentActivity)
    const recentActivity = allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    // Get pack tracking across all platforms
    const allPacks = [
      ...Object.values(platformData).flatMap(p => p.unopenedPacks),
      ...Object.values(platformData).flatMap(p => p.openedPacks),
      ...Object.values(platformData).flatMap(p => p.soldPacks || [])
    ]

    return {
      combined,
      platforms: platformData,
      topAssets,
      recentActivity,
      packTracking: allPacks
    }
  }

  // Get platform-specific portfolio
  async getPlatformPortfolio(walletAddress: string, platform: Platform): Promise<PortfolioMetrics> {
    console.log(`🔍 ${platform.toUpperCase()}: Fetching portfolio data`)
    
    switch (platform) {
      case 'topshot':
        return this.getTopShotPortfolio(walletAddress)
      case 'allday':
        return this.getAllDayPortfolio(walletAddress)
      case 'panini':
        return this.getPaniniPortfolio(walletAddress)
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  // TopShot (Flow) portfolio
  private async getTopShotPortfolio(walletAddress: string): Promise<PortfolioMetrics> {
    try {
      // Use existing Flow service for TopShot
      // For server-side calls, we need to use the full URL or call the service directly
      // Since this is running in an API route, we'll use sample data for now
      // In production, you'd want to call the Flow service directly here
      console.log('🔍 TOPSHOT: Using sample data for wallet:', walletAddress)
    } catch (error) {
      console.error('Error fetching TopShot data:', error)
    }

    // Return sample data if API fails
    return this.generateSampleTopShotPortfolio()
  }

  // AllDay (Flow) portfolio
  private async getAllDayPortfolio(walletAddress: string): Promise<PortfolioMetrics> {
    // AllDay uses Flow blockchain but different contract
    // For now, return sample data
    return this.generateSampleAllDayPortfolio()
  }

  // PaniniNFT (Ethereum) portfolio
  private async getPaniniPortfolio(walletAddress: string): Promise<PortfolioMetrics> {
    // PaniniNFT uses Ethereum blockchain
    // For now, return sample data
    return this.generateSamplePaniniPortfolio()
  }

  // Map TopShot moments to assets
  private mapTopShotMomentsToAssets(moments: any[]): Asset[] {
    return moments.map((moment, index) => ({
      id: moment.id || `topshot-${index}`,
      platform: 'topshot' as Platform,
      player: moment.player || moment.playerName || 'Unknown Player',
      team: moment.team || moment.teamName || 'Unknown Team',
      currentPrice: moment.currentPrice || moment.currentValue || 0,
      acquisitionPrice: moment.acquisitionPrice || 0,
      profit: moment.profit || 0,
      roi: moment.roi || 0,
      serialNumber: moment.serialNumber?.toString() || '0',
      rarity: moment.rarity || 'Common',
      set: moment.set || moment.setName || 'Unknown Set',
      imageUrl: moment.imageURL || moment.imageUrl || '/api/placeholder/300/400',
      momentUrl: moment.momentURL || moment.momentUrl || '#',
      lastSale: moment.lastSale,
      volume24h: moment.volume24h || 0,
      marketCap: moment.marketCap || 0,
      offers: this.generateSampleOffers('topshot'),
      packId: moment.packId,
      isPack: false
    }))
  }

  // Generate TopShot activities
  private generateTopShotActivities(transactions: any[], assets: Asset[]): Activity[] {
    const activities: Activity[] = []
    
    // Generate sample activities based on transactions
    transactions.forEach((tx, index) => {
      activities.push({
        id: `activity-${index}`,
        type: this.determineActivityType(tx),
        platform: 'topshot',
        asset: assets.find(a => a.id === tx.momentId),
        amount: tx.price || 0,
        quantity: tx.quantity || 1,
        timestamp: tx.timestamp || new Date().toISOString(),
        transactionHash: tx.transactionHash,
        description: this.generateActivityDescription(tx, assets.find(a => a.id === tx.momentId))
      })
    })

    // Add sample activities if no transactions
    if (activities.length === 0) {
      activities.push(
        {
          id: 'activity-1',
          type: 'buy',
          platform: 'topshot',
          asset: assets[0],
          amount: 1250,
          quantity: 1,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          description: `Bought ${assets[0]?.player} for $1,250`
        },
        {
          id: 'activity-2',
          type: 'pack_open',
          platform: 'topshot',
          amount: 0,
          quantity: 1,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          description: 'Opened Series 2024-25 Pack',
          packContents: assets.slice(0, 3),
          packValue: 2500
        }
      )
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Generate TopShot packs
  private generateTopShotPacks(packs: any[], assets: Asset[]): Pack[] {
    const packList: Pack[] = []
    
    // Generate sample packs
    packList.push(
      {
        id: 'pack-1',
        platform: 'topshot',
        name: 'Series 2024-25 Pack',
        price: 19,
        estimatedValue: 45,
        status: 'unopened',
        purchaseDate: new Date(Date.now() - 86400000).toISOString(),
        isFollowing: false
      },
      {
        id: 'pack-2',
        platform: 'topshot',
        name: 'Series 2024-25 Pack',
        price: 19,
        estimatedValue: 65,
        status: 'opened',
        purchaseDate: new Date(Date.now() - 172800000).toISOString(),
        openDate: new Date(Date.now() - 86400000).toISOString(),
        contents: assets.slice(0, 3),
        isFollowing: true
      }
    )

    return packList
  }

  // Helper methods
  private determineActivityType(tx: any): Activity['type'] {
    if (tx.type === 'pack_open') return 'pack_open'
    if (tx.type === 'pack_sell') return 'pack_sell'
    if (tx.amount > 0) return 'buy'
    return 'sell'
  }

  private generateActivityDescription(tx: any, asset?: Asset): string {
    if (tx.type === 'pack_open') return 'Opened pack'
    if (tx.type === 'pack_sell') return `Sold pack for $${tx.amount}`
    if (asset) {
      return tx.amount > 0 
        ? `Bought ${asset.player} for $${tx.amount}`
        : `Sold ${asset.player} for $${Math.abs(tx.amount)}`
    }
    return 'Transaction completed'
  }

  private generateSampleOffers(platform: Platform): any[] {
    return [
      {
        id: `offer-1`,
        amount: 1200,
        currency: 'USD',
        platform,
        timestamp: new Date().toISOString(),
        status: 'active'
      }
    ]
  }

  private calculatePerformance(assets: Asset[], days: number): number {
    // Simulate performance calculation
    return Math.random() * 20 - 10 // -10% to +10%
  }

  private calculateCombinedMetrics(platformData: Record<Platform, PortfolioMetrics>): PortfolioMetrics {
    const combined = {
      platform: 'all' as Platform,
      totalValue: 0,
      totalProfit: 0,
      roi: 0,
      totalAssets: 0,
      topAssets: [] as Asset[],
      recentActivity: [] as Activity[],
      unopenedPacks: [] as Pack[],
      openedPacks: [] as Pack[],
      performance7d: 0,
      performance30d: 0
    }

    Object.values(platformData).forEach(platform => {
      combined.totalValue += platform.totalValue
      combined.totalProfit += platform.totalProfit
      combined.totalAssets += platform.totalAssets
      combined.topAssets.push(...platform.topAssets)
      combined.recentActivity.push(...platform.recentActivity)
      combined.unopenedPacks.push(...platform.unopenedPacks)
      combined.openedPacks.push(...platform.openedPacks)
    })

    combined.roi = combined.totalValue > 0 ? combined.totalProfit / combined.totalValue : 0
    combined.topAssets = combined.topAssets
      .sort((a, b) => b.currentPrice - a.currentPrice)
      .slice(0, 10)
    combined.recentActivity = combined.recentActivity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return combined
  }

  private getEmptyPortfolioMetrics(platform: Platform): PortfolioMetrics {
    return {
      platform,
      totalValue: 0,
      totalProfit: 0,
      roi: 0,
      totalAssets: 0,
      topAssets: [],
      recentActivity: [],
      unopenedPacks: [],
      openedPacks: [],
      performance7d: 0,
      performance30d: 0
    }
  }

  // Sample data generators
  private generateSampleTopShotPortfolio(): PortfolioMetrics {
    const assets = this.generateSampleTopShotAssets()
    const activities = this.generateSampleTopShotActivities(assets)
    const packs = this.generateSampleTopShotPacks()
    
    return {
      platform: 'topshot',
      totalValue: assets.reduce((sum, asset) => sum + asset.currentPrice, 0),
      totalProfit: assets.reduce((sum, asset) => sum + (asset.profit || 0), 0),
      roi: 0.21, // 21% ROI
      totalAssets: assets.length,
      topAssets: assets.slice(0, 10),
      recentActivity: activities.slice(0, 10),
      unopenedPacks: packs.filter(p => p.status === 'unopened'),
      openedPacks: packs.filter(p => p.status === 'opened'),
      soldPacks: packs.filter(p => p.status === 'sold'),
      performance7d: 0.15,
      performance30d: 0.21
    }
  }

  private generateSampleAllDayPortfolio(): PortfolioMetrics {
    const assets = this.generateSampleAllDayAssets()
    const activities = this.generateSampleAllDayActivities(assets)
    const packs = this.generateSampleAllDayPacks()

    return {
      platform: 'allday',
      totalValue: 8920,
      totalProfit: 1560,
      roi: 0.18,
      totalAssets: assets.length,
      topAssets: assets.slice(0, 10),
      recentActivity: activities,
      unopenedPacks: packs.filter(p => p.status === 'unopened'),
      openedPacks: packs.filter(p => p.status === 'opened'),
      performance7d: 3.8,
      performance30d: 9.2
    }
  }

  private generateSamplePaniniPortfolio(): PortfolioMetrics {
    const assets = this.generateSamplePaniniAssets()
    const activities = this.generateSamplePaniniActivities(assets)
    const packs = this.generateSamplePaniniPacks()

    return {
      platform: 'panini',
      totalValue: 6780,
      totalProfit: 890,
      roi: 0.13,
      totalAssets: assets.length,
      topAssets: assets.slice(0, 10),
      recentActivity: activities,
      unopenedPacks: packs.filter(p => p.status === 'unopened'),
      openedPacks: packs.filter(p => p.status === 'opened'),
      performance7d: 2.1,
      performance30d: 6.5
    }
  }

  private generateSampleTopShotAssets(): Asset[] {
    return [
      {
        id: 'curry-3pt-4567',
        platform: 'topshot',
        player: 'Stephen Curry',
        team: 'Warriors',
        currentPrice: 124, // Floor price
        acquisitionPrice: 89, // Bought price
        profit: 35, // 124 - 89
        roi: 39.3, // (35/89) * 100
        serialNumber: '4567',
        rarity: 'Common',
        set: 'Series 2024-25',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-15',
        volume24h: 15,
        marketCap: 124000,
        offers: this.generateSampleOffers('topshot'),
        isPack: false
      },
      {
        id: 'lebron-dunk-2847',
        platform: 'topshot',
        player: 'LeBron James',
        team: 'Lakers',
        currentPrice: 987, // Floor price
        acquisitionPrice: 987, // Original price
        profit: 213, // 1200 - 987 (sold for 1200)
        roi: 21.6, // (213/987) * 100
        serialNumber: '2847',
        rarity: 'Rare',
        set: 'Series 2024-25',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-14',
        volume24h: 25,
        marketCap: 987000,
        offers: this.generateSampleOffers('topshot'),
        isPack: false
      },
      {
        id: 'giannis-playoff-234',
        platform: 'topshot',
        player: 'Giannis Antetokounmpo',
        team: 'Bucks',
        currentPrice: 156,
        acquisitionPrice: 0,
        profit: 156,
        roi: 1.0,
        serialNumber: '234',
        rarity: 'Rare',
        set: 'Playoff Series 2024',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-13',
        volume24h: 12,
        marketCap: 156000,
        offers: this.generateSampleOffers('topshot'),
        isPack: false
      }
    ]
  }

  private generateSampleAllDayAssets(): Asset[] {
    return [
      {
        id: 'allday-1',
        platform: 'allday',
        player: 'Patrick Mahomes',
        team: 'Chiefs',
        currentPrice: 892,
        acquisitionPrice: 892,
        profit: 0,
        roi: 0,
        serialNumber: '156',
        rarity: 'Rare',
        set: 'Series 2024',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-16',
        volume24h: 8,
        marketCap: 892000,
        offers: this.generateSampleOffers('allday'),
        isPack: false
      },
      {
        id: 'allday-2',
        platform: 'allday',
        player: 'Josh Allen',
        team: 'Bills',
        currentPrice: 67,
        acquisitionPrice: 0,
        profit: 67,
        roi: 1.0,
        serialNumber: '789',
        rarity: 'Common',
        set: 'Championship Series',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-15',
        volume24h: 4,
        marketCap: 67000,
        offers: this.generateSampleOffers('allday'),
        isPack: false
      }
    ]
  }

  private generateSamplePaniniAssets(): Asset[] {
    return [
      {
        id: 'panini-1',
        platform: 'panini',
        player: 'Victor Wembanyama',
        team: 'Spurs',
        currentPrice: 567,
        acquisitionPrice: 567,
        profit: 0,
        roi: 0,
        serialNumber: '2349',
        rarity: 'Rare',
        set: 'Rookie Prizm 2024',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-17',
        volume24h: 6,
        marketCap: 567000,
        offers: this.generateSampleOffers('panini'),
        isPack: false
      },
      {
        id: 'panini-2',
        platform: 'panini',
        player: 'Lionel Messi',
        team: 'Inter Miami',
        currentPrice: 1200,
        acquisitionPrice: 1100,
        profit: 100,
        roi: 0.09,
        serialNumber: '789',
        rarity: 'Legendary',
        set: 'Champions League 2024',
        imageUrl: '/api/placeholder/300/400',
        momentUrl: '#',
        lastSale: '2024-01-16',
        volume24h: 15,
        marketCap: 1200000,
        offers: this.generateSampleOffers('panini'),
        isPack: false
      }
    ]
  }

  private generateSampleTopShotActivities(assets: Asset[]): Activity[] {
    const now = new Date()
    
    return [
      {
        id: 'activity-1',
        type: 'buy',
        platform: 'topshot',
        asset: {
          id: 'curry-3pt-4567',
          platform: 'topshot',
          player: 'Stephen Curry',
          team: 'Warriors',
          currentPrice: 124, // Floor price
          acquisitionPrice: 89, // Bought price
          profit: 35, // 124 - 89
          roi: 39.3, // (35/89) * 100
          serialNumber: '4567',
          rarity: 'Common',
          set: 'Series 2024-25',
          imageUrl: '/api/placeholder/300/400',
          momentUrl: '#',
          lastSale: now.toISOString(),
          volume24h: 15,
          marketCap: 124000,
          offers: this.generateSampleOffers('topshot'),
          isPack: false
        },
        amount: 89,
        quantity: 1,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        description: 'Bought: Curry 3PT #4567 for $89',
        transactionHash: '0x1234567890abcdef'
      },
      {
        id: 'activity-2',
        type: 'sell',
        platform: 'topshot',
        asset: {
          id: 'lebron-dunk-2847',
          platform: 'topshot',
          player: 'LeBron James',
          team: 'Lakers',
          currentPrice: 987, // Floor price
          acquisitionPrice: 987, // Original price
          profit: 213, // 1200 - 987
          roi: 21.6, // (213/987) * 100
          serialNumber: '2847',
          rarity: 'Rare',
          set: 'Series 2024-25',
          imageUrl: '/api/placeholder/300/400',
          momentUrl: '#',
          lastSale: now.toISOString(),
          volume24h: 25,
          marketCap: 987000,
          offers: this.generateSampleOffers('topshot'),
          isPack: false
        },
        amount: 1200,
        quantity: 1,
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        description: 'Sold: LeBron Dunk #2847 for $1,200',
        transactionHash: '0xabcdef1234567890'
      },
      {
        id: 'activity-3',
        type: 'pack_open',
        platform: 'topshot',
        amount: 0,
        quantity: 1,
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        description: 'Opened: Playoff Pack',
        packContents: [
          {
            id: 'giannis-playoff-234',
            platform: 'topshot',
            player: 'Giannis Antetokounmpo',
            team: 'Bucks',
            currentPrice: 156,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '234',
            rarity: 'Rare',
            set: 'Playoff Series 2024',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 12,
            marketCap: 156000,
            offers: [],
            isPack: false
          }
        ],
        packValue: 156,
        transactionHash: '0xfedcba0987654321'
      },
      {
        id: 'activity-4',
        type: 'buy',
        platform: 'topshot',
        asset: assets[0],
        amount: 1250,
        quantity: 1,
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        description: `Bought ${assets[0]?.player} for $1,250`
      },
      {
        id: 'activity-5',
        type: 'pack_open',
        platform: 'topshot',
        amount: 0,
        quantity: 1,
        timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        description: 'Opened Series 2024-25 Pack',
        packContents: assets.slice(0, 3),
        packValue: 2500
      }
    ]
  }

  private generateSampleAllDayActivities(assets: Asset[]): Activity[] {
    const now = new Date()
    
    return [
      {
        id: 'activity-3',
        type: 'buy',
        platform: 'allday',
        asset: {
          id: 'mahomes-td-156',
          platform: 'allday',
          player: 'Patrick Mahomes',
          team: 'Chiefs',
          currentPrice: 892,
          acquisitionPrice: 892,
          profit: 0,
          roi: 0,
          serialNumber: '156',
          rarity: 'Rare',
          set: 'Series 2024',
          imageUrl: '/api/placeholder/300/400',
          momentUrl: '#',
          lastSale: now.toISOString(),
          volume24h: 8,
          marketCap: 892000,
          offers: this.generateSampleOffers('allday'),
          isPack: false
        },
        amount: 892,
        quantity: 1,
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        description: 'Bought: Mahomes TD #156 for $892',
        transactionHash: '0x9876543210fedcba'
      },
      {
        id: 'activity-4',
        type: 'pack_open',
        platform: 'allday',
        amount: 0,
        quantity: 1,
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        description: 'Opened: Championship Pack',
        packContents: [
          {
            id: 'allen-td-789',
            platform: 'allday',
            player: 'Josh Allen',
            team: 'Bills',
            currentPrice: 67,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '789',
            rarity: 'Common',
            set: 'Championship Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 4,
            marketCap: 67000,
            offers: [],
            isPack: false
          }
        ],
        packValue: 67,
        transactionHash: '0xba9876543210fedc'
      }
    ]
  }

  private generateSamplePaniniActivities(assets: Asset[]): Activity[] {
    const now = new Date()
    
    return [
      {
        id: 'activity-5',
        type: 'buy',
        platform: 'panini',
        asset: {
          id: 'rookie-prizm-2349',
          platform: 'panini',
          player: 'Victor Wembanyama',
          team: 'Spurs',
          currentPrice: 567,
          acquisitionPrice: 567,
          profit: 0,
          roi: 0,
          serialNumber: '2349',
          rarity: 'Rare',
          set: 'Rookie Prizm 2024',
          imageUrl: '/api/placeholder/300/400',
          momentUrl: '#',
          lastSale: now.toISOString(),
          volume24h: 6,
          marketCap: 567000,
          offers: this.generateSampleOffers('panini'),
          isPack: false
        },
        amount: 567,
        quantity: 1,
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        description: 'Bought: Rookie Prizm #2349 for $567',
        transactionHash: '0xdeadbeef12345678'
      },
      {
        id: 'activity-6',
        type: 'sell',
        platform: 'panini',
        asset: assets[0],
        amount: 1200,
        quantity: 1,
        timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        description: `Sold ${assets[0]?.player} for $1,200`,
        transactionHash: '0xbeefdead87654321'
      }
    ]
  }

  private generateSampleTopShotPacks(): Pack[] {
    const now = new Date()
    
    return [
      {
        id: 'pack-1',
        platform: 'topshot',
        name: 'Series 5 Pack',
        price: 19,
        estimatedValue: 55,
        status: 'unopened',
        purchaseDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        isFollowing: false
      },
      {
        id: 'pack-2',
        platform: 'topshot',
        name: 'Playoff Pack',
        price: 25,
        estimatedValue: 78,
        status: 'sold',
        purchaseDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        sellDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        sellPrice: 78,
        isFollowing: false,
        contents: [
          {
            id: 'tatum-playoff-456',
            platform: 'topshot',
            player: 'Jayson Tatum',
            team: 'Celtics',
            currentPrice: 42,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '456',
            rarity: 'Rare',
            set: 'Playoff Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 12,
            marketCap: 42000,
            offers: [],
            isPack: false
          },
          {
            id: 'brown-playoff-789',
            platform: 'topshot',
            player: 'Jaylen Brown',
            team: 'Celtics',
            currentPrice: 18,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '789',
            rarity: 'Common',
            set: 'Playoff Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 8,
            marketCap: 18000,
            offers: [],
            isPack: false
          },
          {
            id: 'white-playoff-123',
            platform: 'topshot',
            player: 'Derrick White',
            team: 'Celtics',
            currentPrice: 12,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '123',
            rarity: 'Common',
            set: 'Playoff Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 5,
            marketCap: 12000,
            offers: [],
            isPack: false
          }
        ]
      },
      {
        id: 'pack-3',
        platform: 'topshot',
        name: 'Series 2024-25 Pack',
        price: 19,
        estimatedValue: 45,
        status: 'opened',
        purchaseDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        openDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        isFollowing: false,
        contents: [
          {
            id: 'giannis-series-234',
            platform: 'topshot',
            player: 'Giannis Antetokounmpo',
            team: 'Bucks',
            currentPrice: 156,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '234',
            rarity: 'Legendary',
            set: 'Series 2024-25',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 25,
            marketCap: 156000,
            offers: [],
            isPack: false
          },
          {
            id: 'lillard-series-567',
            platform: 'topshot',
            player: 'Damian Lillard',
            team: 'Bucks',
            currentPrice: 23,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '567',
            rarity: 'Common',
            set: 'Series 2024-25',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 15,
            marketCap: 23000,
            offers: [],
            isPack: false
          }
        ]
      },
      {
        id: 'pack-4',
        platform: 'topshot',
        name: 'Championship Pack',
        price: 30,
        estimatedValue: 85,
        status: 'sold',
        purchaseDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        sellDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        sellPrice: 92,
        isFollowing: false,
        contents: [
          {
            id: 'jokic-championship-111',
            platform: 'topshot',
            player: 'Nikola Jokic',
            team: 'Nuggets',
            currentPrice: 45,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '111',
            rarity: 'Rare',
            set: 'Championship Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 18,
            marketCap: 45000,
            offers: [],
            isPack: false
          },
          {
            id: 'murray-championship-222',
            platform: 'topshot',
            player: 'Jamal Murray',
            team: 'Nuggets',
            currentPrice: 28,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '222',
            rarity: 'Common',
            set: 'Championship Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 12,
            marketCap: 28000,
            offers: [],
            isPack: false
          },
          {
            id: 'porter-championship-333',
            platform: 'topshot',
            player: 'Michael Porter Jr.',
            team: 'Nuggets',
            currentPrice: 19,
            acquisitionPrice: 0,
            profit: 0,
            roi: 0,
            serialNumber: '333',
            rarity: 'Common',
            set: 'Championship Series',
            imageUrl: '/api/placeholder/300/400',
            momentUrl: '#',
            lastSale: now.toISOString(),
            volume24h: 8,
            marketCap: 19000,
            offers: [],
            isPack: false
          }
        ]
      }
    ]
  }

  private generateSampleAllDayPacks(): Pack[] {
    const now = new Date()
    
    return [
      {
        id: 'pack-2',
        platform: 'allday',
        name: 'Series 2024 Pack',
        price: 15,
        estimatedValue: 35,
        status: 'unopened',
        purchaseDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        isFollowing: false
      },
      {
        id: 'pack-4',
        platform: 'allday',
        name: 'Championship Pack',
        price: 20,
        estimatedValue: 45,
        status: 'unopened',
        purchaseDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        isFollowing: false
      }
    ]
  }

  private generateSamplePaniniPacks(): Pack[] {
    const now = new Date()
    
    return [
      {
        id: 'pack-3',
        platform: 'panini',
        name: 'Champions League Pack',
        price: 25,
        estimatedValue: 55,
        status: 'unopened',
        purchaseDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        isFollowing: false
      },
      {
        id: 'pack-5',
        platform: 'panini',
        name: 'Rookie Prizm Pack',
        price: 30,
        estimatedValue: 65,
        status: 'unopened',
        purchaseDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
        isFollowing: false
      }
    ]
  }
} 