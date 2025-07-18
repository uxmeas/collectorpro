'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/design-system/atoms/Icon'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'
import { MomentImage } from '@/components/ui/MomentImage'
import { Search, Folder, BarChart3, Eye, Check, Clock, Users, Star, Zap, ArrowRight, Play, Award, Share2, Filter, Globe, Layers } from 'lucide-react'

// Multi-platform collectibles for the hero section
const heroCollectibles = [
  { 
    id: 'topshot-lebron', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'LeBron James', 
    team: 'Lakers', 
    rarity: 'Legendary', 
    serial: '1/100', 
    imageSeed: 1, 
    editionName: '17_nba_finals_mvp_2025_ultimate',
    sport: '🏀'
  },
  { 
    id: 'panini-curry', 
    platform: 'Panini NFT', 
    type: 'Card',
    playerName: 'Stephen Curry', 
    team: 'Warriors', 
    rarity: 'Rare', 
    serial: '15/1000', 
    imageSeed: 2, 
    editionName: '16_nba_mvp_2025_legendary',
    sport: '🏀'
  },
  { 
    id: 'nflday-mahomes', 
    platform: 'NFL All Day', 
    type: 'Moment',
    playerName: 'Patrick Mahomes', 
    team: 'Chiefs', 
    rarity: 'Legendary', 
    serial: '5/100', 
    imageSeed: 3, 
    editionName: 'nfl_championship_2025',
    sport: '🏈'
  },
  { 
    id: 'panini-brady', 
    platform: 'Panini NFT', 
    type: 'Card',
    playerName: 'Tom Brady', 
    team: 'Buccaneers', 
    rarity: 'Common', 
    serial: '45/12000', 
    imageSeed: 4, 
    editionName: 'nfl_legends_2025',
    sport: '🏈'
  },
]

// Before/After comparison collectibles
const beforeAfterCollectibles = [
  { id: 'before-1', platform: 'NBA TopShot', playerName: 'Luka Dončić', team: 'Mavericks', rarity: 'Rare', serial: '7/1000', imageSeed: 5, editionName: '16_nba_mvp_2025_legendary', sport: '🏀' },
  { id: 'before-2', platform: 'Panini NFT', playerName: 'Joel Embiid', team: '76ers', rarity: 'Legendary', serial: '3/100', imageSeed: 6, editionName: '17_nba_finals_mvp_2025_ultimate', sport: '🏀' },
  { id: 'before-3', platform: 'NFL All Day', playerName: 'Josh Allen', team: 'Bills', rarity: 'Common', serial: '89/12000', imageSeed: 7, editionName: 'nfl_playoffs_2025', sport: '🏈' },
  { id: 'after-1', platform: 'NBA TopShot', playerName: 'Ja Morant', team: 'Grizzlies', rarity: 'Rare', serial: '12/1000', imageSeed: 8, editionName: '16_nba_mvp_2025_legendary', sport: '🏀' },
  { id: 'after-2', platform: 'Panini NFT', playerName: 'Damian Lillard', team: 'Bucks', rarity: 'Legendary', serial: '8/100', imageSeed: 9, editionName: '17_nba_finals_mvp_2025_ultimate', sport: '🏀' },
  { id: 'after-3', platform: 'NFL All Day', playerName: 'Justin Herbert', team: 'Chargers', rarity: 'Common', serial: '156/12000', imageSeed: 10, editionName: 'nfl_playoffs_2025', sport: '🏈' },
]

// Demo search collectibles
const searchDemoCollectibles = [
  { id: 'search-1', platform: 'NBA TopShot', playerName: 'Victor Wembanyama', team: 'Spurs', rarity: 'Ultimate', serial: '5/50', imageSeed: 11, editionName: '5_nba_rookies_2025_ultimate', sport: '🏀' },
  { id: 'search-2', platform: 'Panini NFT', playerName: 'Anthony Edwards', team: 'Timberwolves', rarity: 'Rare', serial: '23/1000', imageSeed: 12, editionName: '16_nba_mvp_2025_legendary', sport: '🏀' },
  { id: 'search-3', platform: 'NFL All Day', playerName: 'Tyrese Haliburton', team: 'Pacers', rarity: 'Common', serial: '234/12000', imageSeed: 13, editionName: 'nfl_rookies_2025', sport: '🏈' },
]

const features = [
  {
    icon: Globe,
    title: 'Cross-Platform Organization',
    description: 'All your sports digital collectibles in one place. Stop jumping between apps to track your collections.',
    color: 'blue',
    demo: 'NBA TopShot + Panini NFT + NFL All Day in one dashboard'
  },
  {
    icon: Search,
    title: 'Universal Search',
    description: 'Find any moment or card across all platforms instantly. Never lose track of cards across multiple platforms.',
    color: 'green',
    demo: 'Search "LeBron James" → See all moments and cards across platforms'
  },
  {
    icon: BarChart3,
    title: 'Collection Analytics',
    description: 'See your complete sports collection stats and track growth across all platforms.',
    color: 'purple',
    demo: 'Complete sports collection: 847 moments + 234 cards across 3 platforms'
  },
  {
    icon: Layers,
    title: 'Platform Comparison',
    description: 'Compare your collections across different sports and platforms with detailed insights.',
    color: 'orange',
    demo: 'Compare NBA vs NFL collection growth and rarity distribution'
  }
]

const testimonials = [
  {
    quote: "Finally can track my TopShot AND Panini cards together! No more jumping between apps to see my complete collection.",
    author: "Multi-Sport Collector",
    avatar: "🏀🏈",
    collection: "1,247 collectibles",
    badge: "Cross-Platform Pro"
  },
  {
    quote: "Love seeing my entire digital sports collection organized. Great for managing collections across different platforms.",
    author: "Sports Card Fan",
    avatar: "🎯",
    collection: "2,156 collectibles",
    badge: "Multi-Platform Master"
  },
  {
    quote: "Great for managing collections across different platforms. Finally have everything in one organized dashboard.",
    author: "Digital Collector",
    avatar: "⭐",
    collection: "893 collectibles",
    badge: "Platform Pioneer"
  }
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Organize up to 100 collectibles',
      'Basic search across platforms',
      'Collection overview',
      'Email support'
    ],
    cta: 'Get Started Free',
    popular: false,
    beta: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    description: 'For serious collectors',
    features: [
      'Unlimited collectibles across all platforms',
      'Advanced cross-platform search',
      'Detailed collection analytics',
      'Export your collection data',
      'Priority support',
      'Platform comparison tools',
      'Milestone badges',
      'All current and future sports platforms included'
    ],
    cta: 'Start Free Trial',
    popular: true,
    beta: true
  }
]

const supportedPlatforms = [
  { name: 'NBA TopShot', icon: '🏀', status: 'Supported', description: 'NBA moments and highlights' },
  { name: 'Panini NFT', icon: '🃏', status: 'Supported', description: 'Digital trading cards' },
  { name: 'NFL All Day', icon: '🏈', status: 'Supported', description: 'NFL moments and plays' },
  { name: 'Soccer Platform', icon: '⚽', status: 'Coming Soon', description: 'FIFA and soccer collectibles' },
  { name: 'Hockey Platform', icon: '🏒', status: 'Coming Soon', description: 'NHL moments and cards' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30">
              🚀 Join during beta for special pricing
            </Badge>
            
            <Heading 
              level={1} 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              data-testid="value-proposition"
            >
              Organize Your Entire Sports Digital Collectibles Collection
            </Heading>
            
            <Text 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto"
              data-testid="value-proposition"
            >
              Track NBA TopShot moments, Panini NFT cards, NFL All Day, and more - all in one powerful collection manager
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                asChild 
                className="bg-orange-600 hover:bg-orange-700 min-h-[48px] min-w-[160px] text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                data-testid="cta"
                data-cta-type="primary"
              >
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild
                className="min-h-[48px] min-w-[140px] text-lg font-semibold border-2 hover:border-orange-400 hover:text-orange-400 transition-all duration-200"
                data-testid="cta"
                data-cta-type="secondary"
              >
                <Link href="/demo">
                  <Play className="w-5 h-5 mr-2" />
                  See Demo
                </Link>
              </Button>
            </div>
            
            {/* Risk Reversal */}
            <div className="flex items-center justify-center gap-2 mb-8 text-sm text-gray-400">
              <Check className="w-4 h-4 text-green-400" />
              <span>7-day free trial, no credit card required</span>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">1,247+</div>
                <div className="text-gray-400">collectors organized</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-gray-400">sports platforms supported</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Featured</div>
                <div className="text-gray-400">in sports Discord</div>
              </div>
            </div>
          </div>
          
          {/* Hero Collectibles Grid - Multi-Platform */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {heroCollectibles.map((collectible, index) => (
              <div
                key={collectible.id}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Card className="relative bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {collectible.platform}
                      </Badge>
                      <span className="text-lg">{collectible.sport}</span>
                    </div>
                    <MomentImage
                      momentId={collectible.id}
                      playerName={collectible.playerName}
                      rarity={collectible.rarity}
                      size={128}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      editionName={collectible.editionName}
                    />
                    <div className="text-center">
                      <div className="font-semibold text-white text-sm">{collectible.playerName}</div>
                      <div className="text-gray-400 text-xs">{collectible.team}</div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {collectible.rarity}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading level={2} className="text-4xl font-bold text-white mb-4">
              All Your Sports Platforms in One Place
            </Heading>
            <Text className="text-xl text-gray-300 max-w-3xl mx-auto">
              From NBA TopShot moments to Panini NFT cards to NFL All Day - organize everything across all sports platforms
            </Text>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportedPlatforms.map((platform, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300"
                data-testid="platform-card"
                data-platform={platform.name.toLowerCase().replace(/\s+/g, '-')}
              >
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">{platform.icon}</div>
                  <Heading level={3} className="text-xl font-semibold text-white mb-2">
                    {platform.name}
                  </Heading>
                  <Text className="text-gray-400 mb-4">
                    {platform.description}
                  </Text>
                  <Badge 
                    variant={platform.status === 'Supported' ? 'secondary' : 'outline'}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {platform.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading level={2} className="text-4xl font-bold text-white mb-4">
              Messy Multi-Platform Collection vs Organized with CollectorPRO
            </Heading>
            <Text className="text-xl text-gray-300 max-w-3xl mx-auto">
              See the difference. From jumping between apps to having all your sports collectibles organized in one dashboard.
            </Text>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Before */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Icon icon={Filter} className="w-5 h-5 text-red-400" />
                </div>
                <Heading level={3} className="text-2xl font-bold text-red-400">
                  Before: Scattered Across Apps
                </Heading>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Clock} className="w-4 h-4 text-red-400" />
                  </div>
                  <Text className="text-gray-300">
                    Jump between NBA TopShot, Panini NFT, and NFL All Day apps
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Clock} className="w-4 h-4 text-red-400" />
                  </div>
                  <Text className="text-gray-300">
                    Forget which cards you own across different platforms
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Clock} className="w-4 h-4 text-red-400" />
                  </div>
                  <Text className="text-gray-300">
                    Can't see your complete sports collection in one place
                  </Text>
                </div>
              </div>
              
              {/* Before Collectibles Grid */}
              <div className="grid grid-cols-3 gap-2 opacity-60">
                {beforeAfterCollectibles.slice(0, 3).map((collectible) => (
                  <div key={collectible.id} className="relative">
                    <div className="text-xs text-gray-400 mb-1">{collectible.platform}</div>
                    <MomentImage
                      momentId={collectible.id}
                      playerName={collectible.playerName}
                      rarity={collectible.rarity}
                      size={80}
                      className="w-full h-20 object-cover rounded-lg"
                      editionName={collectible.editionName}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* After */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Icon icon={Zap} className="w-5 h-5 text-green-400" />
                </div>
                <Heading level={3} className="text-2xl font-bold text-green-400">
                  After: Unified Collection Dashboard
                </Heading>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Zap} className="w-4 h-4 text-green-400" />
                  </div>
                  <Text className="text-gray-300">
                    All platforms in one organized dashboard
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Zap} className="w-4 h-4 text-green-400" />
                  </div>
                  <Text className="text-gray-300">
                    Universal search across all sports platforms
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Zap} className="w-4 h-4 text-green-400" />
                  </div>
                  <Text className="text-gray-300">
                    Complete sports collection analytics and insights
                  </Text>
                </div>
              </div>
              
              {/* After Collectibles Grid */}
              <div className="grid grid-cols-3 gap-2">
                {beforeAfterCollectibles.slice(3, 6).map((collectible) => (
                  <div key={collectible.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300" />
                    <div className="text-xs text-gray-400 mb-1 relative z-10">{collectible.platform}</div>
                    <MomentImage
                      momentId={collectible.id}
                      playerName={collectible.playerName}
                      rarity={collectible.rarity}
                      size={80}
                      className="w-full h-20 object-cover rounded-lg relative z-10"
                      editionName={collectible.editionName}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading level={2} className="text-4xl font-bold text-white mb-4">
              Everything You Need to Organize Your Multi-Platform Collection
            </Heading>
            <Text className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful tools designed specifically for sports digital collectibles across all platforms.
            </Text>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300">
                <div className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${feature.color}-500/20 text-${feature.color}-400 mb-4`}>
                    <Icon icon={feature.icon} className="w-6 h-6" />
                  </div>
                  <Heading level={3} className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </Heading>
                  <Text className="text-gray-400 mb-4">
                    {feature.description}
                  </Text>
                  <div className="text-sm text-blue-400 font-medium">
                    {feature.demo}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Animated Demo Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading level={3} className="text-3xl font-bold text-white mb-6">
                See your complete sports digital collection in one dashboard
              </Heading>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Check} className="w-4 h-4 text-green-400" />
                  </div>
                  <Text className="text-gray-300">
                    Organize by sport, player, rarity, or platform
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Check} className="w-4 h-4 text-green-400" />
                  </div>
                  <Text className="text-gray-300">
                    Universal search across all sports platforms
                  </Text>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon={Check} className="w-4 h-4 text-green-400" />
                  </div>
                  <Text className="text-gray-300">
                    Compare collections across different sports
                  </Text>
                </div>
              </div>
            </div>
            
            {/* Search Demo */}
            <div className="relative">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm text-gray-400">Cross-Platform Search Demo</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                    <div className="text-sm">🏀</div>
                    <MomentImage
                      momentId={searchDemoCollectibles[0].id}
                      playerName={searchDemoCollectibles[0].playerName}
                      rarity={searchDemoCollectibles[0].rarity}
                      size={40}
                      className="rounded"
                      editionName={searchDemoCollectibles[0].editionName}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{searchDemoCollectibles[0].playerName}</div>
                      <div className="text-xs text-gray-400">NBA TopShot • Ultimate</div>
                    </div>
                    <div className="text-green-400 text-sm">Found!</div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                    <div className="text-sm">🃏</div>
                    <MomentImage
                      momentId={searchDemoCollectibles[1].id}
                      playerName={searchDemoCollectibles[1].playerName}
                      rarity={searchDemoCollectibles[1].rarity}
                      size={40}
                      className="rounded"
                      editionName={searchDemoCollectibles[1].editionName}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{searchDemoCollectibles[1].playerName}</div>
                      <div className="text-xs text-gray-400">Panini NFT • Rare</div>
                    </div>
                    <div className="text-green-400 text-sm">Found!</div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                    <div className="text-sm">🏈</div>
                    <MomentImage
                      momentId={searchDemoCollectibles[2].id}
                      playerName={searchDemoCollectibles[2].playerName}
                      rarity={searchDemoCollectibles[2].rarity}
                      size={40}
                      className="rounded"
                      editionName={searchDemoCollectibles[2].editionName}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white text-sm">{searchDemoCollectibles[2].playerName}</div>
                      <div className="text-xs text-gray-400">NFL All Day • Common</div>
                    </div>
                    <div className="text-green-400 text-sm">Found!</div>
                  </div>
                </div>
                <div className="text-center mt-4 text-sm text-gray-400">
                  Search "Anthony Edwards" → 3 results across platforms in 0.2s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading level={2} className="text-4xl font-bold text-white mb-4">
              Loved by Multi-Platform Collectors
            </Heading>
            <Text className="text-xl text-gray-300">
              Join 1,247+ collectors who have unified their sports digital collections
            </Text>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-slate-800/50 border-slate-700 p-6 relative"
                data-testid="social-proof"
                data-testimonial-index={index}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.collection}</div>
                  </div>
                </div>
                <Text className="text-gray-300 italic mb-4">
                  "{testimonial.quote}"
                </Text>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Award className="w-3 h-3 mr-1" />
                    {testimonial.badge}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Community Stats */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-6 py-3 border border-slate-700">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Join 1,247+ multi-platform collectors</span>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading level={2} className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </Heading>
            <Text className="text-xl text-gray-300">
              Choose the plan that fits your multi-platform collection size
            </Text>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative bg-slate-800/50 border-slate-700 p-8 ${
                  plan.popular ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      {plan.beta ? 'Beta Special' : 'Most Popular'}
                    </Badge>
                  </div>
                )}
                
                <div className="text-center">
                  <Heading level={3} className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </Heading>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <Text className="text-gray-400 mb-6">{plan.description}</Text>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Icon icon={Check} className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <Text className="text-gray-300">{feature}</Text>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    size="lg"
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                    asChild
                  >
                    <Link href="/register">
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Urgency and Risk Reversal */}
          <div className="mt-12 text-center space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
            <div className="text-orange-400 font-medium">
              ⚡ Beta pricing ends soon - lock in special rates!
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Heading level={2} className="text-4xl font-bold text-white mb-6">
            Ready to Unify Your Sports Collection?
          </Heading>
          <Text className="text-xl text-gray-300 mb-8">
            Join thousands of collectors who have unified their sports digital collections. See your complete collection organized in 2 minutes.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">
                <Play className="w-5 h-5 mr-2" />
                View Demo
              </Link>
            </Button>
          </div>
          <div className="text-sm text-gray-400">
            Featured in sports Discord • Join 1,247+ multi-platform collectors
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Text className="text-sm text-gray-500 max-w-2xl mx-auto">
              Multi-platform collection tracking tool for sports digital collectibles. Not investment advice. For organizational purposes only. 
              NBA TopShot is a product of Dapper Labs. Panini NFT is a product of Panini America. NFL All Day is a product of Dapper Labs. 
              This tool is not affiliated with or endorsed by Dapper Labs, Panini America, the NBA, NFL, or any sports league.
            </Text>
          </div>
        </div>
      </section>
    </div>
  )
}