'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/design-system/atoms/Icon'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'
import { MomentImage } from '@/components/ui/MomentImage'
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Wallet, 
  Globe, 
  BarChart3, 
  Zap, 
  Users, 
  Star,
  ExternalLink,
  Loader2
} from 'lucide-react'

interface Platform {
  id: string
  name: string
  icon: string
  description: string
  status: 'not_connected' | 'connecting' | 'connected' | 'error'
  collectiblesCount?: number
  sampleCollectibles: Array<{
    id: string
    playerName: string
    team: string
    rarity: string
    serial: string
    imageSeed: number
    editionName: string
  }>
}

const platforms: Platform[] = [
  {
    id: 'topshot',
    name: 'NBA TopShot',
    icon: '🏀',
    description: 'Connect your NBA TopShot moments and highlights',
    status: 'not_connected',
    sampleCollectibles: [
      { id: 'topshot-1', playerName: 'LeBron James', team: 'Lakers', rarity: 'Legendary', serial: '1/100', imageSeed: 1, editionName: '17_nba_finals_mvp_2025_ultimate' },
      { id: 'topshot-2', playerName: 'Stephen Curry', team: 'Warriors', rarity: 'Rare', serial: '15/1000', imageSeed: 2, editionName: '16_nba_mvp_2025_legendary' },
      { id: 'topshot-3', playerName: 'Giannis Antetokounmpo', team: 'Bucks', rarity: 'Fandom', serial: '123/15000', imageSeed: 3, editionName: '4_metallic_gold_le_rare' }
    ]
  },
  {
    id: 'panini',
    name: 'Panini NFT',
    icon: '🃏',
    description: 'Import your Panini digital trading cards',
    status: 'not_connected',
    sampleCollectibles: [
      { id: 'panini-1', playerName: 'Kevin Durant', team: 'Suns', rarity: 'Common', serial: '45/12000', imageSeed: 4, editionName: '3_common_2025' },
      { id: 'panini-2', playerName: 'Luka Dončić', team: 'Mavericks', rarity: 'Rare', serial: '7/1000', imageSeed: 5, editionName: '16_nba_mvp_2025_legendary' },
      { id: 'panini-3', playerName: 'Joel Embiid', team: '76ers', rarity: 'Legendary', serial: '3/100', imageSeed: 6, editionName: '17_nba_finals_mvp_2025_ultimate' }
    ]
  },
  {
    id: 'nflday',
    name: 'NFL All Day',
    icon: '🏈',
    description: 'Sync your NFL All Day moments and plays',
    status: 'not_connected',
    sampleCollectibles: [
      { id: 'nflday-1', playerName: 'Patrick Mahomes', team: 'Chiefs', rarity: 'Legendary', serial: '5/100', imageSeed: 7, editionName: 'nfl_championship_2025' },
      { id: 'nflday-2', playerName: 'Josh Allen', team: 'Bills', rarity: 'Common', serial: '89/12000', imageSeed: 8, editionName: 'nfl_playoffs_2025' },
      { id: 'nflday-3', playerName: 'Tom Brady', team: 'Buccaneers', rarity: 'Common', serial: '45/12000', imageSeed: 9, editionName: 'nfl_legends_2025' }
    ]
  }
]

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to CollectorPRO',
    subtitle: 'The universal sports digital collectibles collection manager',
    description: 'Connect your collections from multiple platforms and see everything organized in one place.'
  },
  {
    id: 'connect',
    title: 'Connect Your Collections',
    subtitle: 'Import your sports digital collectibles',
    description: 'Connect your wallets and accounts to import your collections from all platforms.'
  },
  {
    id: 'organize',
    title: 'Organize & Explore',
    subtitle: 'Your unified collection dashboard',
    description: 'See your complete sports collection organized with powerful search and analytics.'
  }
]

export default function MultiPlatformOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [platformsState, setPlatformsState] = useState(platforms)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectPlatform = async (platformId: string) => {
    setIsConnecting(true)
    
    // Simulate connection process
    setPlatformsState(prev => 
      prev.map(p => 
        p.id === platformId 
          ? { ...p, status: 'connecting' as const }
          : p
      )
    )

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate successful connection
    setPlatformsState(prev => 
      prev.map(p => 
        p.id === platformId 
          ? { 
              ...p, 
              status: 'connected' as const,
              collectiblesCount: Math.floor(Math.random() * 500) + 50
            }
          : p
      )
    )

    setIsConnecting(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const connectedPlatforms = platformsState.filter(p => p.status === 'connected')
  const totalCollectibles = connectedPlatforms.reduce((sum, p) => sum + (p.collectiblesCount || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Step Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-blue-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <Heading level={1} className="text-4xl font-bold text-white mb-4">
            {steps[currentStep].title}
          </Heading>
          <Text className="text-xl text-gray-300 mb-2">
            {steps[currentStep].subtitle}
          </Text>
          <Text className="text-gray-400">
            {steps[currentStep].description}
          </Text>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="text-center">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
                <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <Heading level={3} className="text-xl font-semibold text-white mb-3">
                  Multi-Platform Support
                </Heading>
                <Text className="text-gray-400">
                  Connect NBA TopShot, Panini NFT, NFL All Day, and more platforms in one place.
                </Text>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
                <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <Heading level={3} className="text-xl font-semibold text-white mb-3">
                  Universal Search
                </Heading>
                <Text className="text-gray-400">
                  Find any moment or card across all platforms instantly with powerful search.
                </Text>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 p-6 text-center">
                <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <Heading level={3} className="text-xl font-semibold text-white mb-3">
                  Collection Analytics
                </Heading>
                <Text className="text-gray-400">
                  See your complete sports collection stats and track growth across platforms.
                </Text>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
                <a href="/register">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" onClick={handleNext}>
                Continue to Setup
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <div className="grid gap-6 mb-8">
              {platformsState.map((platform) => (
                <Card key={platform.id} className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{platform.icon}</div>
                      <div>
                        <Heading level={3} className="text-xl font-semibold text-white mb-1">
                          {platform.name}
                        </Heading>
                        <Text className="text-gray-400 mb-3">
                          {platform.description}
                        </Text>
                        
                        {/* Sample Collectibles */}
                        <div className="flex gap-2">
                          {platform.sampleCollectibles.slice(0, 3).map((collectible) => (
                            <div key={collectible.id} className="relative">
                              <MomentImage
                                momentId={collectible.id}
                                playerName={collectible.playerName}
                                rarity={collectible.rarity}
                                size={48}
                                className="w-12 h-12 object-cover rounded"
                                editionName={collectible.editionName}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {platform.status === 'connected' && (
                        <div className="text-right">
                          <div className="text-green-400 font-medium">
                            {platform.collectiblesCount} collectibles
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Connected
                          </Badge>
                        </div>
                      )}
                      
                      {platform.status === 'connecting' && (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          <span className="text-blue-400">Connecting...</span>
                        </div>
                      )}
                      
                      {platform.status === 'not_connected' && (
                        <Button
                          onClick={() => handleConnectPlatform(platform.id)}
                          disabled={isConnecting}
                          variant="outline"
                        >
                          <Wallet className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex items-center gap-4">
                {connectedPlatforms.length > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalCollectibles}</div>
                    <div className="text-gray-400 text-sm">collectibles imported</div>
                  </div>
                )}
                
                <Button 
                  size="lg" 
                  onClick={handleNext}
                  disabled={connectedPlatforms.length === 0}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-500/20 rounded-full px-6 py-3 border border-green-500/30 mb-6">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">
                  {connectedPlatforms.length} platforms connected successfully!
                </span>
              </div>
              
              <Heading level={2} className="text-3xl font-bold text-white mb-4">
                Your Unified Collection Dashboard
              </Heading>
              <Text className="text-xl text-gray-300 max-w-2xl mx-auto">
                You now have {totalCollectibles} collectibles organized across {connectedPlatforms.length} platforms. 
                Start exploring your complete sports collection!
              </Text>
            </div>

            {/* Dashboard Preview */}
            <Card className="bg-slate-800/50 border-slate-700 p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{totalCollectibles}</div>
                  <div className="text-gray-400">Total Collectibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{connectedPlatforms.length}</div>
                  <div className="text-gray-400">Platforms Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">3</div>
                  <div className="text-gray-400">Sports Covered</div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <div className="flex gap-4">
                <Button size="lg" variant="outline" asChild>
                  <a href="/demo">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Demo
                  </a>
                </Button>
                <Button size="lg" asChild className="bg-orange-600 hover:bg-orange-700">
                  <a href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 