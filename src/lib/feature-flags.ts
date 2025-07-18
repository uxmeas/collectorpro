// Feature Flags System for Gradual Rollouts and A/B Testing

export interface FeatureFlag {
  key: string
  enabled: boolean
  description: string
  percentage?: number // For gradual rollouts (0-100)
  variants?: {
    [key: string]: {
      enabled: boolean
      percentage: number
    }
  }
}

export interface FeatureFlags {
  // Core Platform Features
  ENHANCED_PORTFOLIO_ANALYTICS: FeatureFlag
  ADVANCED_FILTERING: FeatureFlag
  REAL_TIME_PRICE_UPDATES: FeatureFlag
  
  // Phase 2 Features
  WNBA_SUPPORT: FeatureFlag
  MULTI_SPORT_DASHBOARD: FeatureFlag
  ADVANCED_CHARTING: FeatureFlag
  
  // Phase 3 Features (Monetization)
  PREMIUM_SUBSCRIPTION: FeatureFlag
  ADVANCED_ALERTS: FeatureFlag
  API_ACCESS: FeatureFlag
  CUSTOM_DASHBOARDS: FeatureFlag
  
  // Phase 4 Features (Marketplace)
  MOMENT_MARKETPLACE: FeatureFlag
  TRADING_INTERFACE: FeatureFlag
  SOCIAL_FEATURES: FeatureFlag
  
  // Experimental Features
  AI_PRICE_PREDICTIONS: FeatureFlag
  VOICE_SEARCH: FeatureFlag
  DARK_MODE_VARIANTS: FeatureFlag
}

// Default feature flag configuration
const DEFAULT_FLAGS: FeatureFlags = {
  // Currently enabled core features
  ENHANCED_PORTFOLIO_ANALYTICS: {
    key: 'ENHANCED_PORTFOLIO_ANALYTICS',
    enabled: true,
    description: 'Enhanced portfolio analytics with comprehensive metrics',
  },
  ADVANCED_FILTERING: {
    key: 'ADVANCED_FILTERING',
    enabled: true,
    description: 'Advanced filtering capabilities in tables and searches',
  },
  REAL_TIME_PRICE_UPDATES: {
    key: 'REAL_TIME_PRICE_UPDATES',
    enabled: false,
    description: 'Real-time price updates via WebSocket',
    percentage: 25, // Gradual rollout to 25% of users
  },

  // Phase 2 features - in development
  WNBA_SUPPORT: {
    key: 'WNBA_SUPPORT',
    enabled: false,
    description: 'WNBA moments and analytics support',
  },
  MULTI_SPORT_DASHBOARD: {
    key: 'MULTI_SPORT_DASHBOARD',
    enabled: false,
    description: 'Multi-sport unified dashboard',
  },
  ADVANCED_CHARTING: {
    key: 'ADVANCED_CHARTING',
    enabled: false,
    description: 'Advanced charting and visualization tools',
  },

  // Phase 3 features - monetization
  PREMIUM_SUBSCRIPTION: {
    key: 'PREMIUM_SUBSCRIPTION',
    enabled: false,
    description: 'Premium subscription tiers and features',
  },
  ADVANCED_ALERTS: {
    key: 'ADVANCED_ALERTS',
    enabled: false,
    description: 'Advanced price and market alerts',
  },
  API_ACCESS: {
    key: 'API_ACCESS',
    enabled: false,
    description: 'Public API access for developers',
  },
  CUSTOM_DASHBOARDS: {
    key: 'CUSTOM_DASHBOARDS',
    enabled: false,
    description: 'Customizable dashboard layouts',
  },

  // Phase 4 features - marketplace
  MOMENT_MARKETPLACE: {
    key: 'MOMENT_MARKETPLACE',
    enabled: false,
    description: 'Built-in moment marketplace',
  },
  TRADING_INTERFACE: {
    key: 'TRADING_INTERFACE',
    enabled: false,
    description: 'Direct trading interface',
  },
  SOCIAL_FEATURES: {
    key: 'SOCIAL_FEATURES',
    enabled: false,
    description: 'Social features and community',
  },

  // Experimental features
  AI_PRICE_PREDICTIONS: {
    key: 'AI_PRICE_PREDICTIONS',
    enabled: false,
    description: 'AI-powered price predictions',
    variants: {
      basic: { enabled: false, percentage: 50 },
      advanced: { enabled: false, percentage: 50 },
    },
  },
  VOICE_SEARCH: {
    key: 'VOICE_SEARCH',
    enabled: false,
    description: 'Voice search functionality',
  },
  DARK_MODE_VARIANTS: {
    key: 'DARK_MODE_VARIANTS',
    enabled: false,
    description: 'Alternative dark mode themes',
    variants: {
      purple: { enabled: false, percentage: 33 },
      blue: { enabled: false, percentage: 33 },
      green: { enabled: false, percentage: 34 },
    },
  },
}

class FeatureFlagService {
  private flags: FeatureFlags = DEFAULT_FLAGS
  private userFlags: Map<string, FeatureFlags> = new Map()

  // Get feature flag value for a user
  isEnabled(flagKey: keyof FeatureFlags, userId?: string): boolean {
    const flag = this.getFlag(flagKey, userId)
    if (!flag) return false

    // Check percentage-based rollout
    if (flag.percentage !== undefined) {
      if (!userId) return flag.enabled
      
      // Use userId to determine if user is in rollout percentage
      const hash = this.hashUserId(userId)
      const userPercentage = hash % 100
      return flag.enabled && userPercentage < flag.percentage
    }

    return flag.enabled
  }

  // Get variant for A/B testing
  getVariant(flagKey: keyof FeatureFlags, userId?: string): string | null {
    const flag = this.getFlag(flagKey, userId)
    if (!flag?.variants || !userId) return null

    const enabledVariants = Object.entries(flag.variants)
      .filter(([_, variant]) => variant.enabled)

    if (enabledVariants.length === 0) return null

    // Use userId to consistently assign variant
    const hash = this.hashUserId(userId)
    let cumulative = 0
    const userPercentage = hash % 100

    for (const [variantName, variant] of enabledVariants) {
      cumulative += variant.percentage
      if (userPercentage < cumulative) {
        return variantName
      }
    }

    return enabledVariants[enabledVariants.length - 1][0]
  }

  // Update feature flag (for admin interface)
  updateFlag(flagKey: keyof FeatureFlags, updates: Partial<FeatureFlag>) {
    if (this.flags[flagKey]) {
      this.flags[flagKey] = { ...this.flags[flagKey], ...updates }
    }
  }

  // Get all flags (for debugging/admin)
  getAllFlags(userId?: string): FeatureFlags {
    if (userId && this.userFlags.has(userId)) {
      return this.userFlags.get(userId)!
    }
    return this.flags
  }

  // Set user-specific overrides (for testing)
  setUserFlags(userId: string, flags: Partial<FeatureFlags>) {
    const userFlags = { ...this.flags, ...flags }
    this.userFlags.set(userId, userFlags)
  }

  private getFlag(flagKey: keyof FeatureFlags, userId?: string): FeatureFlag | null {
    if (userId && this.userFlags.has(userId)) {
      return this.userFlags.get(userId)![flagKey] || null
    }
    return this.flags[flagKey] || null
  }

  private hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

// Global instance
export const featureFlags = new FeatureFlagService() 