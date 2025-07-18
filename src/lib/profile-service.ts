// Generate actual NBA TopShot moment image URLs using real CDN
function generateNBATopShotImageURL(momentId: string, editionName: string, size: number = 161): string {
  // Real NBA TopShot CDN URL pattern
  const cleanMomentId = momentId.replace(/[^a-zA-Z0-9-]/g, '')
  const cleanEditionName = editionName?.replace(/[^a-zA-Z0-9_]/g, '') || 'common'
  
  return `https://assets.nbatopshot.com/resize/editions/${cleanEditionName}/${cleanMomentId}/play_${cleanMomentId}_${cleanEditionName}_capture_Hero_2880_2880_Black.jpg?format=webp&quality=80&width=${size}&cv=1`
}

interface UserProfile {
  wallet: string
  username: string
  country: string
  joinedDate: string
  fanBadges: string[]
  verification: string[]
  topShotScore: number
  topShotRank: string
  completedSets: number
  totalMoments: number
  portfolioValue: number
  dailyChange: number
  dailyChangePercent: number
}

interface PortfolioData {
  timestamp: string
  value: number
  time: string
}

interface Offer {
  id: string
  moment: {
    player: string
    image: string
    series: string
  }
  editionType: string
  highestOffer: number
  activeOffers: number
  lowestAsk: number
  status: 'received' | 'submitted' | 'hidden'
}

interface UserMoment {
  id: string
  player: string
  image: string
  series: string
  year: string
  serial: number
  supply: number
  lowAsk: number
  highestOffer: number
  owned: number
  inPacks: number
  burned: number
  locked: number
  purchased: number
  acquired: string
}

export class ProfileService {
  private static instance: ProfileService
  private cache: Map<string, any> = new Map()

  static getInstance(): ProfileService {
    if (!this.instance) {
      this.instance = new ProfileService()
    }
    return this.instance
  }

  // Generate sample user profile data based on wallet
  async getUserProfile(wallet: string): Promise<UserProfile> {
    const cacheKey = `profile_${wallet}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const profile: UserProfile = {
      wallet,
      username: this.generateUsername(wallet),
      country: this.getRandomCountry(),
      joinedDate: this.getRandomJoinDate(),
      fanBadges: this.getRandomFanBadges(),
      verification: this.getRandomVerification(),
      topShotScore: this.getRandomScore(),
      topShotRank: this.getRandomRank(),
      completedSets: Math.floor(Math.random() * 25) + 1,
      totalMoments: Math.floor(Math.random() * 5000) + 100,
      portfolioValue: Math.random() * 200000 + 10000,
      dailyChange: (Math.random() - 0.5) * 2000,
      dailyChangePercent: (Math.random() - 0.5) * 10
    }

    this.cache.set(cacheKey, profile)
    return profile
  }

  // Generate portfolio chart data
  async getPortfolioData(wallet: string, period: string = '1D'): Promise<PortfolioData[]> {
    const cacheKey = `portfolio_${wallet}_${period}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const baseValue = Math.random() * 150000 + 50000
    const points = this.getDataPointsForPeriod(period)
    
    const data: PortfolioData[] = points.map((time: any, index: number) => ({
      timestamp: time.label,
      time: time.value,
      value: baseValue + (Math.random() - 0.5) * 10000 + (index * 500)
    }))

    this.cache.set(cacheKey, data)
    return data
  }

  // Get user offers
  async getUserOffers(wallet: string, type: 'received' | 'submitted' | 'hidden' = 'received'): Promise<Offer[]> {
    const cacheKey = `offers_${wallet}_${type}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const offers: Offer[] = this.generateSampleOffers().filter(offer => offer.status === type)
    
    this.cache.set(cacheKey, offers)
    return offers
  }

  // Get user moments collection
  async getUserMoments(wallet: string, filter: string = 'all'): Promise<UserMoment[]> {
    const cacheKey = `moments_${wallet}_${filter}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const moments = this.generateSampleMoments()
    
    this.cache.set(cacheKey, moments)
    return moments
  }

  // Helper methods
  private generateUsername(wallet: string): string {
    const usernames = ['@TopShot_King', '@CollectorPro', '@WNBA_Fan', '@FlowTrader', '@MomentHunter', '@SetBuilder', '@NBAFan2024', '@CryptoCollector']
    const hash = wallet.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return usernames[hash % usernames.length]
  }

  private getRandomCountry(): string {
    const countries = ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP']
    return countries[Math.floor(Math.random() * countries.length)]
  }

  private getRandomJoinDate(): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const years = ['2019', '2020', '2021', '2022', '2023', '2024']
    return `${months[Math.floor(Math.random() * months.length)]} ${years[Math.floor(Math.random() * years.length)]}`
  }

  private getRandomFanBadges(): string[] {
    const teams = ['Lakers Fan', 'Warriors Fan', 'Celtics Fan', 'Raptors Fan', 'Heat Fan', 'Bulls Fan', 'Mavericks Fan', 'Nuggets Fan']
    const count = Math.floor(Math.random() * 3) + 1
    return teams.slice(0, count)
  }

  private getRandomVerification(): string[] {
    const verifications = ['Dapper VIP', 'Beta Tester', 'Community Leader', 'Verified Collector']
    const hasVerification = Math.random() > 0.5
    return hasVerification ? [verifications[Math.floor(Math.random() * verifications.length)]] : []
  }

  private getRandomScore(): number {
    return Math.floor(Math.random() * 2000000) + 100000
  }

  private getRandomRank(): string {
    const percentages = ['Top 0.01%', 'Top 0.05%', 'Top 0.1%', 'Top 0.5%', 'Top 1%', 'Top 5%', 'Top 10%']
    return percentages[Math.floor(Math.random() * percentages.length)]
  }

  private getDataPointsForPeriod(period: string): { label: string; value: string }[] {
    const now = new Date()
    const points = []

    switch (period) {
      case '1H':
        for (let i = 0; i < 12; i++) {
          const time = new Date(now.getTime() - (i * 5 * 60 * 1000))
          points.unshift({
            label: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
          })
        }
        break
      case '1D':
        for (let i = 0; i < 24; i++) {
          const time = new Date(now.getTime() - (i * 60 * 60 * 1000))
          points.unshift({
            label: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            value: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
          })
        }
        break
      case '1W':
        for (let i = 0; i < 7; i++) {
          const time = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
          points.unshift({
            label: time.toLocaleDateString('en-US', { weekday: 'short' }),
            value: time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          })
        }
        break
      default:
        return this.getDataPointsForPeriod('1D')
    }

    return points
  }

  private generateSampleOffers(): Offer[] {
    const players = [
      'Caitlin Clark', 'A\'ja Wilson', 'Breanna Stewart', 'Diana Taurasi', 'Sue Bird',
      'Sabrina Ionescu', 'Kelsey Plum', 'Angel Reese', 'Cameron Brink', 'Paige Bueckers'
    ]

    return players.map((player, index) => ({
      id: `offer_${index + 1}`,
      moment: {
        player,
        image: generateNBATopShotImageURL('profile-moment-1', 'profile_common', 40),
        series: `WNBA ${Math.random() > 0.5 ? 'METALLIC GOLD' : 'ROOKIE DEBUT'} ${new Date().getFullYear()}`
      },
      editionType: 'Edition Offer',
      highestOffer: Math.floor(Math.random() * 500) + 50,
      activeOffers: Math.floor(Math.random() * 15) + 1,
      lowestAsk: Math.floor(Math.random() * 1000) + 100,
      status: ['received', 'submitted', 'hidden'][Math.floor(Math.random() * 3)] as any
    }))
  }

  private generateSampleMoments(): UserMoment[] {
    const players = [
      'RHYNE HOWARD', 'KIKI IRIAFEN', 'VERONICA BURTON', 'ANGEL REESE', 'KAYLA THORNTON',
      'SATOU SABALLY', 'MARINE JOHANNES', 'KATE MARTIN', 'CAITLIN CLARK', 'CAMERON BRINK',
      'A\'JA WILSON', 'BREANNA STEWART', 'SABRINA IONESCU', 'KELSEY PLUM', 'DIANA TAURASI'
    ]

    const series = [
      'WNBA METALLIC GOLD LE 2025', 'WNBA ROOKIE DEBUT 2025', 'COSMIC (S1)', 
      '4 LEVEL UP', 'WNBA METALLIC GOLD LE 2024', 'CHAMPIONSHIP SERIES'
    ]

    return players.map((player, index) => ({
      id: `moment_${index + 1}`,
      player,
              image: generateNBATopShotImageURL('profile-moment-2', 'profile_common', 40),
      series: series[Math.floor(Math.random() * series.length)],
      year: '2024-25',
      serial: Math.floor(Math.random() * 1000) + 1,
      supply: Math.floor(Math.random() * 2000) + 100,
      lowAsk: Math.random() * 100 + 1,
      highestOffer: Math.random() * 80 + 1,
      owned: Math.floor(Math.random() * 500) + 50,
      inPacks: Math.floor(Math.random() * 200),
      burned: Math.floor(Math.random() * 10),
      locked: Math.floor(Math.random() * 150) + 10,
      purchased: Math.random() * 60 + 1,
      acquired: this.getRandomDate()
    }))
  }

  private getRandomDate(): string {
    const start = new Date(2024, 6, 1) // July 1, 2024
    const end = new Date()
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Clear cache for testing
  clearCache(): void {
    this.cache.clear()
  }
}

export const profileService = ProfileService.getInstance() 