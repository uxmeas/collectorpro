// Multi-Platform Collector Dashboard Types

export type Platform = 'topshot' | 'allday' | 'panini' | 'all'

export interface PlatformConfig {
  id: Platform
  name: string
  fullName: string
  blockchain: 'Flow' | 'Ethereum' | 'Multi'
  color: string
  icon: string
  contractAddress: string
  marketplaceUrl: string
  enabled: boolean
}

export interface Asset {
  id: string
  platform: Platform
  player: string
  team: string
  currentPrice: number
  acquisitionPrice?: number
  profit?: number
  roi?: number
  serialNumber: string
  rarity: string
  set: string
  imageUrl: string
  momentUrl: string
  lastSale?: string
  volume24h?: number
  marketCap?: number
  offers?: Offer[]
  packId?: string
  isPack?: boolean
  packContents?: Asset[]
  packValue?: number
}

export interface Offer {
  id: string
  amount: number
  currency: string
  platform: Platform
  timestamp: string
  status: 'active' | 'expired' | 'accepted'
}

export interface Activity {
  id: string
  type: 'buy' | 'sell' | 'pack_open' | 'pack_sell' | 'offer_received' | 'offer_accepted'
  platform: Platform
  asset?: Asset
  amount?: number
  quantity?: number
  timestamp: string
  transactionHash?: string
  description: string
  packContents?: Asset[]
  packValue?: number
}

export interface Pack {
  id: string
  platform: Platform
  name: string
  price: number
  estimatedValue: number
  status: 'unopened' | 'opened' | 'sold'
  purchaseDate: string
  openDate?: string
  sellDate?: string
  sellPrice?: number
  contents?: Asset[]
  isFollowing?: boolean
}

export interface PortfolioMetrics {
  platform: Platform
  totalValue: number
  totalProfit: number
  roi: number
  totalAssets: number
  topAssets: Asset[]
  recentActivity: Activity[]
  unopenedPacks: Pack[]
  openedPacks: Pack[]
  soldPacks?: Pack[]
  performance7d: number
  performance30d: number
}

export interface MultiPlatformPortfolio {
  combined: PortfolioMetrics
  platforms: Record<Platform, PortfolioMetrics>
  topAssets: Asset[]
  recentActivity: Activity[]
  packTracking: Pack[]
}

export interface PlatformToggleProps {
  selectedPlatform: Platform
  onPlatformChange: (platform: Platform) => void
  portfolio: MultiPlatformPortfolio
}

export interface TopAssetsSectionProps {
  assets: Asset[]
  platform: Platform
  onAssetClick: (asset: Asset) => void
}

export interface ActivityFeedProps {
  activities: Activity[]
  platform: Platform
  filters: ActivityFilters
  onFilterChange: (filters: ActivityFilters) => void
}

export interface ActivityFilters {
  types: string[]
  platforms: Platform[]
  dateRange: '1d' | '7d' | '30d' | 'all'
}

export interface PackTrackingProps {
  packs: Pack[]
  platform: Platform
  onPackClick: (pack: Pack) => void
  onFollowPack: (packId: string, follow: boolean) => void
}

export interface PLTrackingSectionProps {
  activities: Activity[]
  assets: Asset[]
  platform: Platform
}

// Platform-specific data structures
export interface TopShotMoment extends Asset {
  playId: string
  setId: string
  playCategory: string
  playType: string
  editionSize: number
  isRetired: boolean
}

export interface AllDayMoment extends Asset {
  playId: string
  setId: string
  playCategory: string
  playType: string
  editionSize: number
  isRetired: boolean
}

export interface PaniniNFT extends Asset {
  tokenId: string
  contractAddress: string
  metadata: Record<string, any>
} 