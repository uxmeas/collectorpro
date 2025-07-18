// Plugin Architecture for Multi-Platform Sports Analytics

export interface SportsPlatform {
  id: string
  name: string
  description: string
  version: string
  blockchain?: string
  supported: boolean
}

export interface MomentData {
  id: string
  platform: string
  player: string
  team: string
  league: string
  sport: string
  playType: string
  rarity: string
  serialNumber: number
  currentPrice: number
  imageUrl?: string
  videoUrl?: string
  metadata: Record<string, any>
}

export interface PlatformPlugin {
  platform: SportsPlatform
  
  // Data fetching methods
  fetchMoments(walletAddress: string): Promise<MomentData[]>
  fetchMomentDetails(momentId: string): Promise<MomentData>
  fetchMarketData(momentId: string): Promise<any>
  
  // Validation methods
  validateWalletAddress(address: string): boolean
  validateMomentId(momentId: string): boolean
  
  // Formatting methods
  formatPrice(price: number): string
  formatRarity(rarity: string): string
  
  // Configuration
  getApiEndpoints(): Record<string, string>
  getMetadata(): Record<string, any>
}

// Abstract base class for platform plugins
export abstract class BasePlatformPlugin implements PlatformPlugin {
  abstract platform: SportsPlatform

  abstract fetchMoments(walletAddress: string): Promise<MomentData[]>
  abstract fetchMomentDetails(momentId: string): Promise<MomentData>
  abstract fetchMarketData(momentId: string): Promise<any>
  abstract validateWalletAddress(address: string): boolean
  abstract validateMomentId(momentId: string): boolean

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  formatRarity(rarity: string): string {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase()
  }

  abstract getApiEndpoints(): Record<string, string>
  abstract getMetadata(): Record<string, any>
}

// NBA Top Shot Plugin (our main platform)
export class NBATopShotPlugin extends BasePlatformPlugin {
  platform: SportsPlatform = {
    id: 'nba-topshot',
    name: 'NBA Top Shot',
    description: 'Official NBA digital collectibles on Flow blockchain',
    version: '1.0.0',
    blockchain: 'Flow',
    supported: true,
  }

  async fetchMoments(walletAddress: string): Promise<MomentData[]> {
    // Implementation for NBA Top Shot API
    const response = await fetch(`/api/flow/portfolio?address=${walletAddress}`)
    const data = await response.json()
    
    return data.moments?.map((moment: any) => ({
      id: moment.id,
      platform: this.platform.id,
      player: moment.player,
      team: moment.team,
      league: 'NBA',
      sport: 'Basketball',
      playType: moment.playCategory,
      rarity: moment.rarity,
      serialNumber: moment.serialNumber,
      currentPrice: moment.currentPrice,
      imageUrl: moment.imageUrl,
      videoUrl: moment.videoUrl,
      metadata: moment,
    })) || []
  }

  async fetchMomentDetails(momentId: string): Promise<MomentData> {
    // Implementation for single moment details
    throw new Error('Not implemented')
  }

  async fetchMarketData(momentId: string): Promise<any> {
    // Implementation for market data
    throw new Error('Not implemented')
  }

  validateWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{16}$/.test(address)
  }

  validateMomentId(momentId: string): boolean {
    return momentId.length > 0
  }

  getApiEndpoints(): Record<string, string> {
    return {
      portfolio: '/api/flow/portfolio',
      moments: '/api/flow/moments',
      market: '/api/flow/market',
    }
  }

  getMetadata(): Record<string, any> {
    return {
      contractAddress: 'A.0b2a3299cc857e29.TopShot',
      chainId: 'mainnet',
      supportedFeatures: ['portfolio', 'moments', 'market_data'],
    }
  }
}

// WNBA Plugin (Phase 2)
export class WNBAPlugin extends BasePlatformPlugin {
  platform: SportsPlatform = {
    id: 'wnba',
    name: 'WNBA',
    description: 'WNBA digital collectibles',
    version: '0.1.0',
    blockchain: 'Flow',
    supported: false, // Will be enabled in Phase 2
  }

  async fetchMoments(walletAddress: string): Promise<MomentData[]> {
    // Placeholder for WNBA implementation
    return []
  }

  async fetchMomentDetails(momentId: string): Promise<MomentData> {
    throw new Error('WNBA plugin not yet implemented')
  }

  async fetchMarketData(momentId: string): Promise<any> {
    throw new Error('WNBA plugin not yet implemented')
  }

  validateWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{16}$/.test(address)
  }

  validateMomentId(momentId: string): boolean {
    return momentId.length > 0
  }

  getApiEndpoints(): Record<string, string> {
    return {
      portfolio: '/api/wnba/portfolio',
      moments: '/api/wnba/moments',
    }
  }

  getMetadata(): Record<string, any> {
    return {
      contractAddress: 'TBD',
      chainId: 'mainnet',
      supportedFeatures: ['portfolio', 'moments'],
    }
  }
}

// NFL Plugin (Future Phase)
export class NFLPlugin extends BasePlatformPlugin {
  platform: SportsPlatform = {
    id: 'nfl',
    name: 'NFL All Day',
    description: 'NFL digital collectibles',
    version: '0.1.0',
    blockchain: 'Flow',
    supported: false,
  }

  async fetchMoments(walletAddress: string): Promise<MomentData[]> {
    return []
  }

  async fetchMomentDetails(momentId: string): Promise<MomentData> {
    throw new Error('NFL plugin not yet implemented')
  }

  async fetchMarketData(momentId: string): Promise<any> {
    throw new Error('NFL plugin not yet implemented')
  }

  validateWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{16}$/.test(address)
  }

  validateMomentId(momentId: string): boolean {
    return momentId.length > 0
  }

  getApiEndpoints(): Record<string, string> {
    return {
      portfolio: '/api/nfl/portfolio',
      moments: '/api/nfl/moments',
    }
  }

  getMetadata(): Record<string, any> {
    return {
      contractAddress: 'TBD',
      chainId: 'mainnet',
      supportedFeatures: ['portfolio', 'moments'],
    }
  }
}

// Plugin Registry and Manager
class PluginRegistry {
  private plugins: Map<string, PlatformPlugin> = new Map()
  
  constructor() {
    // Register default plugins
    this.register(new NBATopShotPlugin())
    this.register(new WNBAPlugin())
    this.register(new NFLPlugin())
  }

  register(plugin: PlatformPlugin) {
    this.plugins.set(plugin.platform.id, plugin)
  }

  unregister(platformId: string) {
    this.plugins.delete(platformId)
  }

  get(platformId: string): PlatformPlugin | undefined {
    return this.plugins.get(platformId)
  }

  getAll(): PlatformPlugin[] {
    return Array.from(this.plugins.values())
  }

  getSupportedPlatforms(): PlatformPlugin[] {
    return this.getAll().filter(plugin => plugin.platform.supported)
  }

  async fetchAllMoments(walletAddress: string): Promise<MomentData[]> {
    const supportedPlugins = this.getSupportedPlatforms()
    const momentPromises = supportedPlugins.map(plugin => 
      plugin.fetchMoments(walletAddress).catch(error => {
        console.error(`Error fetching moments from ${plugin.platform.name}:`, error)
        return []
      })
    )

    const momentArrays = await Promise.all(momentPromises)
    return momentArrays.flat()
  }
}

// Global plugin registry
export const pluginRegistry = new PluginRegistry()

// React hook for using plugins
import { useState, useEffect } from 'react'

export function usePlatformPlugins() {
  const [plugins, setPlugins] = useState<PlatformPlugin[]>([])

  useEffect(() => {
    setPlugins(pluginRegistry.getAll())
  }, [])

  return {
    plugins,
    supportedPlugins: plugins.filter(p => p.platform.supported),
    getPlugin: (id: string) => pluginRegistry.get(id),
    fetchAllMoments: (walletAddress: string) => 
      pluginRegistry.fetchAllMoments(walletAddress),
  }
}

// Utility function to create new plugins
export function createPlugin(config: {
  platform: SportsPlatform
  implementation: Partial<PlatformPlugin>
}): PlatformPlugin {
  class DynamicPlugin extends BasePlatformPlugin {
    platform = config.platform

    async fetchMoments(walletAddress: string): Promise<MomentData[]> {
      return config.implementation.fetchMoments?.(walletAddress) || []
    }

    async fetchMomentDetails(momentId: string): Promise<MomentData> {
      if (config.implementation.fetchMomentDetails) {
        return config.implementation.fetchMomentDetails(momentId)
      }
      throw new Error('Not implemented')
    }

    async fetchMarketData(momentId: string): Promise<any> {
      if (config.implementation.fetchMarketData) {
        return config.implementation.fetchMarketData(momentId)
      }
      throw new Error('Not implemented')
    }

    validateWalletAddress(address: string): boolean {
      return config.implementation.validateWalletAddress?.(address) || false
    }

    validateMomentId(momentId: string): boolean {
      return config.implementation.validateMomentId?.(momentId) || false
    }

    getApiEndpoints(): Record<string, string> {
      return config.implementation.getApiEndpoints?.() || {}
    }

    getMetadata(): Record<string, any> {
      return config.implementation.getMetadata?.() || {}
    }
  }

  return new DynamicPlugin()
} 