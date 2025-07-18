'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/design-system/atoms/Icon'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'
import { MomentImage } from '@/components/ui/MomentImage'
import { Search, Filter, Grid, List, Star, Eye, ArrowRight, Play, Globe, Layers } from 'lucide-react'

// Multi-platform demo collectibles
const demoCollectibles = [
  // NBA TopShot moments
  { 
    id: 'topshot-lebron-1', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'LeBron James', 
    team: 'Lakers', 
    rarity: 'Legendary', 
    serial: '1/100', 
    imageSeed: 1, 
    editionName: '17_nba_finals_mvp_2025_ultimate',
    sport: '🏀',
    price: '$2,450',
    searchTerms: ['lebron', 'james', 'lakers', 'legendary', 'nba', 'basketball']
  },
  { 
    id: 'topshot-curry-15', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'Stephen Curry', 
    team: 'Warriors', 
    rarity: 'Rare', 
    serial: '15/1000', 
    imageSeed: 2, 
    editionName: '16_nba_mvp_2025_legendary',
    sport: '🏀',
    price: '$890',
    searchTerms: ['curry', 'stephen', 'warriors', 'rare', 'nba', 'basketball']
  },
  { 
    id: 'topshot-giannis-123', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'Giannis Antetokounmpo', 
    team: 'Bucks', 
    rarity: 'Fandom', 
    serial: '123/15000', 
    imageSeed: 3, 
    editionName: '4_metallic_gold_le_rare',
    sport: '🏀',
    price: '$45',
    searchTerms: ['giannis', 'antetokounmpo', 'bucks', 'fandom', 'nba', 'basketball']
  },
  
  // Panini NFT cards
  { 
    id: 'panini-durant-45', 
    platform: 'Panini NFT', 
    type: 'Card',
    playerName: 'Kevin Durant', 
    team: 'Suns', 
    rarity: 'Common', 
    serial: '45/12000', 
    imageSeed: 4, 
    editionName: '3_common_2025',
    sport: '🏀',
    price: '$12',
    searchTerms: ['durant', 'kevin', 'suns', 'common', 'panini', 'card']
  },
  { 
    id: 'panini-luka-7', 
    platform: 'Panini NFT', 
    type: 'Card',
    playerName: 'Luka Dončić', 
    team: 'Mavericks', 
    rarity: 'Rare', 
    serial: '7/1000', 
    imageSeed: 5, 
    editionName: '16_nba_mvp_2025_legendary',
    sport: '🏀',
    price: '$156',
    searchTerms: ['luka', 'doncic', 'mavericks', 'rare', 'panini', 'card']
  },
  { 
    id: 'panini-embiid-3', 
    platform: 'Panini NFT', 
    type: 'Card',
    playerName: 'Joel Embiid', 
    team: '76ers', 
    rarity: 'Legendary', 
    serial: '3/100', 
    imageSeed: 6, 
    editionName: '17_nba_finals_mvp_2025_ultimate',
    sport: '🏀',
    price: '$1,200',
    searchTerms: ['embiid', 'joel', '76ers', 'legendary', 'panini', 'card']
  },
  
  // NFL All Day moments
  { 
    id: 'nflday-mahomes-5', 
    platform: 'NFL All Day', 
    type: 'Moment',
    playerName: 'Patrick Mahomes', 
    team: 'Chiefs', 
    rarity: 'Legendary', 
    serial: '5/100', 
    imageSeed: 7, 
    editionName: 'nfl_championship_2025',
    sport: '🏈',
    price: '$3,400',
    searchTerms: ['mahomes', 'patrick', 'chiefs', 'legendary', 'nfl', 'football']
  },
  { 
    id: 'nflday-allen-89', 
    platform: 'NFL All Day', 
    type: 'Moment',
    playerName: 'Josh Allen', 
    team: 'Bills', 
    rarity: 'Common', 
    serial: '89/12000', 
    imageSeed: 8, 
    editionName: 'nfl_playoffs_2025',
    sport: '🏈',
    price: '$28',
    searchTerms: ['allen', 'josh', 'bills', 'common', 'nfl', 'football']
  },
  { 
    id: 'nflday-brady-45', 
    platform: 'NFL All Day', 
    type: 'Moment',
    playerName: 'Tom Brady', 
    team: 'Buccaneers', 
    rarity: 'Common', 
    serial: '45/12000', 
    imageSeed: 9, 
    editionName: 'nfl_legends_2025',
    sport: '🏈',
    price: '$67',
    searchTerms: ['brady', 'tom', 'buccaneers', 'common', 'nfl', 'football']
  },
  
  // More NBA TopShot
  { 
    id: 'topshot-morant-12', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'Ja Morant', 
    team: 'Grizzlies', 
    rarity: 'Rare', 
    serial: '12/1000', 
    imageSeed: 10, 
    editionName: '16_nba_mvp_2025_legendary',
    sport: '🏀',
    price: '$234',
    searchTerms: ['morant', 'ja', 'grizzlies', 'rare', 'nba', 'basketball']
  },
  { 
    id: 'topshot-lillard-8', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'Damian Lillard', 
    team: 'Bucks', 
    rarity: 'Legendary', 
    serial: '8/100', 
    imageSeed: 11, 
    editionName: '17_nba_finals_mvp_2025_ultimate',
    sport: '🏀',
    price: '$1,890',
    searchTerms: ['lillard', 'damian', 'bucks', 'legendary', 'nba', 'basketball']
  },
  { 
    id: 'topshot-wembanyama-5', 
    platform: 'NBA TopShot', 
    type: 'Moment',
    playerName: 'Victor Wembanyama', 
    team: 'Spurs', 
    rarity: 'Ultimate', 
    serial: '5/50', 
    imageSeed: 12, 
    editionName: '5_nba_rookies_2025_ultimate',
    sport: '🏀',
    price: '$5,600',
    searchTerms: ['wembanyama', 'victor', 'spurs', 'ultimate', 'nba', 'basketball', 'rookie']
  }
]

const platforms = ['All Platforms', 'NBA TopShot', 'Panini NFT', 'NFL All Day']
const rarities = ['All Rarities', 'Ultimate', 'Legendary', 'Rare', 'Fandom', 'Common']

export default function DemoPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms')
  const [selectedRarity, setSelectedRarity] = useState('All Rarities')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter collectibles based on search and filters
  const filteredCollectibles = demoCollectibles.filter(collectible => {
    const matchesSearch = searchTerm === '' || 
      collectible.searchTerms.some(term => 
        term.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      collectible.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collectible.team.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPlatform = selectedPlatform === 'All Platforms' || 
      collectible.platform === selectedPlatform
    
    const matchesRarity = selectedRarity === 'All Rarities' || 
      collectible.rarity === selectedRarity
    
    return matchesSearch && matchesPlatform && matchesRarity
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1} className="text-2xl font-bold text-white">
                CollectorPRO Demo
              </Heading>
              <Text className="text-gray-400">
                Multi-platform sports digital collectibles collection manager
              </Text>
            </div>
            <Button asChild>
              <a href="/register">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/30 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search across all platforms: LeBron James, Legendary, Lakers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white text-sm"
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-3"
              >
                <Icon icon={viewMode === 'grid' ? List : Grid} className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Search Results Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <div>
              Showing {filteredCollectibles.length} of {demoCollectibles.length} collectibles
              {searchTerm && ` for "${searchTerm}"`}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Cross-platform search</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Real-time filtering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCollectibles.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <Heading level={2} className="text-xl font-semibold text-gray-400 mb-2">
              No collectibles found
            </Heading>
            <Text className="text-gray-500">
              Try adjusting your search terms or filters
            </Text>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {filteredCollectibles.map((collectible) => (
              <Card
                key={collectible.id}
                className={`bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex items-center p-4' : 'p-4'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {collectible.platform}
                      </Badge>
                      <span className="text-lg">{collectible.sport}</span>
                    </div>
                    
                    <MomentImage
                      momentId={collectible.id}
                      playerName={collectible.playerName}
                      rarity={collectible.rarity}
                      size={200}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                      editionName={collectible.editionName}
                    />
                    
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="font-semibold text-white">{collectible.playerName}</div>
                        <div className="text-gray-400 text-sm">{collectible.team}</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {collectible.rarity}
                        </Badge>
                        <div className="text-green-400 font-medium text-sm">
                          {collectible.price}
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-gray-500">
                        #{collectible.serial}
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{collectible.sport}</span>
                        <Badge variant="outline" className="text-xs">
                          {collectible.platform}
                        </Badge>
                      </div>
                      
                      <MomentImage
                        momentId={collectible.id}
                        playerName={collectible.playerName}
                        rarity={collectible.rarity}
                        size={60}
                        className="w-15 h-15 object-cover rounded"
                        editionName={collectible.editionName}
                      />
                      
                      <div className="flex-1">
                        <div className="font-semibold text-white">{collectible.playerName}</div>
                        <div className="text-gray-400 text-sm">{collectible.team}</div>
                      </div>
                      
                      <div className="text-center">
                        <Badge variant="outline" className="text-xs mb-1">
                          {collectible.rarity}
                        </Badge>
                        <div className="text-green-400 font-medium text-sm">
                          {collectible.price}
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-gray-500">
                        #{collectible.serial}
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Demo Features */}
      <div className="bg-slate-800/30 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <Heading level={2} className="text-3xl font-bold text-white mb-4">
              See the Full Power of Multi-Platform Collection Management
            </Heading>
            <Text className="text-xl text-gray-300 max-w-3xl mx-auto">
              This demo shows just a glimpse. The full CollectorPRO experience includes advanced analytics, 
              cross-platform comparisons, and unlimited collection organization.
            </Text>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <Heading level={3} className="text-xl font-semibold text-white mb-3">
                Cross-Platform Organization
              </Heading>
              <Text className="text-gray-400">
                All your sports digital collectibles from NBA TopShot, Panini NFT, NFL All Day, and more in one unified dashboard.
              </Text>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
              <Search className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <Heading level={3} className="text-xl font-semibold text-white mb-3">
                Universal Search
              </Heading>
              <Text className="text-gray-400">
                Find any moment or card across all platforms instantly. Search by player, team, rarity, or platform.
              </Text>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
              <Layers className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <Heading level={3} className="text-xl font-semibold text-white mb-3">
                Platform Comparison
              </Heading>
              <Text className="text-gray-400">
                Compare your collections across different sports and platforms with detailed analytics and insights.
              </Text>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
              <a href="/register">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <div className="mt-4 text-sm text-gray-400">
              7-day free trial • No credit card required • Cancel anytime
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Text className="text-sm text-gray-500 max-w-2xl mx-auto">
              Multi-platform collection tracking tool for sports digital collectibles. Not investment advice. For organizational purposes only. 
              NBA TopShot is a product of Dapper Labs. Panini NFT is a product of Panini America. NFL All Day is a product of Dapper Labs. 
              This tool is not affiliated with or endorsed by Dapper Labs, Panini America, the NBA, NFL, or any sports league.
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
} 