'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { MomentImage, MomentImageCard } from '../ui/MomentImage'
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Zap,
  Sparkles,
  ExternalLink,
  Play
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  action: string
  actionLink: string
  featuredMoments?: Array<{
    id: string
    playerName: string
    rarity: string
    editionName: string
    price: string
    change: string
    serialNumber: number
  }>
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CollectorPRO',
    description: 'Track your NBA TopShot portfolio with real moment images, just like LiveToken and Flowty. See your collection value in real-time with authentic NBA TopShot visuals.',
    action: 'Start Demo',
    actionLink: '/dashboard?wallet=demo-wallet',
    featuredMoments: [
      {
        id: 'lebron-james-legendary',
        playerName: 'LeBron James',
        rarity: 'Legendary',
        editionName: '17_nba_finals_mvp_2025_ultimate',
        price: '$1,250',
        change: '+127%',
        serialNumber: 42
      },
      {
        id: 'stephen-curry-rare',
        playerName: 'Stephen Curry',
        rarity: 'Rare',
        editionName: '16_nba_mvp_2025_legendary',
        price: '$890',
        change: '+89%',
        serialNumber: 1337
      },
      {
        id: 'victor-wembanyama-ultimate',
        playerName: 'Victor Wembanyama',
        rarity: 'Ultimate',
        editionName: '5_nba_rookies_2025_ultimate',
        price: '$2,100',
        change: '+156%',
        serialNumber: 23
      }
    ]
  },
  {
    id: 'connect-wallet',
    title: 'Connect Your Dapper Wallet',
    description: 'Import your NBA TopShot collection instantly. We\'ll analyze your moments and show you real-time P&L, ROI, and market opportunities.',
    action: 'Connect Wallet',
    actionLink: '/connect',
    featuredMoments: [
      {
        id: 'giannis-antetokounmpo-rare',
        playerName: 'Giannis Antetokounmpo',
        rarity: 'Rare',
        editionName: '4_metallic_gold_le_rare',
        price: '$750',
        change: '+67%',
        serialNumber: 456
      },
      {
        id: 'luka-doncic-legendary',
        playerName: 'Luka Dončić',
        rarity: 'Legendary',
        editionName: '6_nba_all_stars_2025_legendary',
        price: '$1,580',
        change: '+92%',
        serialNumber: 789
      },
      {
        id: 'ja-morant-common',
        playerName: 'Ja Morant',
        rarity: 'Common',
        editionName: '7_nba_finals_2025_common',
        price: '$45',
        change: '+23%',
        serialNumber: 3421
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Professional Analytics',
    description: 'Get Bloomberg Terminal-style insights with real NBA TopShot data. Track performance, identify undervalued moments, and optimize your portfolio.',
    action: 'View Analytics',
    actionLink: '/analytics',
    featuredMoments: [
      {
        id: 'kevin-durant-rare',
        playerName: 'Kevin Durant',
        rarity: 'Rare',
        editionName: '12_nba_playoffs_2025_rare',
        price: '$650',
        change: '+78%',
        serialNumber: 234
      },
      {
        id: 'joel-embiid-legendary',
        playerName: 'Joel Embiid',
        rarity: 'Legendary',
        editionName: '16_nba_mvp_2025_legendary',
        price: '$1,200',
        change: '+145%',
        serialNumber: 567
      },
      {
        id: 'anthony-edwards-common',
        playerName: 'Anthony Edwards',
        rarity: 'Common',
        editionName: '7_nba_finals_2025_common',
        price: '$28',
        change: '+34%',
        serialNumber: 1890
      }
    ]
  }
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">CollectorPRO</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Content */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Real NBA TopShot Moments
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {currentStepData.title}
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Step-specific benefits */}
                {currentStep === 0 && (
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Real NBA TopShot moment images from official CDN</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Live market data updated every 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Professional Bloomberg Terminal-style interface</span>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Instant portfolio import from Dapper wallet</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Real-time P&L calculations with ROI tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Market alerts for undervalued moments</span>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Advanced analytics and performance insights</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Market trend analysis and predictions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">Export reports for tax and accounting</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="xl"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
                  >
                    <Link href={currentStepData.actionLink}>
                      {currentStepData.action}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  
                  {currentStep === 0 && (
                    <Button 
                      asChild
                      variant="outline"
                      size="xl"
                      className="px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 text-lg"
                    >
                      <Link href="/pricing">
                        View Pricing
                        <ExternalLink className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-800">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="text-gray-400 hover:text-white"
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  onClick={nextStep}
                  disabled={currentStep === onboardingSteps.length - 1}
                  className="text-gray-400 hover:text-white"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Right Column - Real NBA TopShot Moments Showcase */}
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-6">
                  {/* Terminal Header */}
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-400">CollectorPRO Terminal</div>
                  </div>
                  
                  {/* Featured Moments Grid */}
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {currentStepData.featuredMoments?.map((moment) => (
                      <div key={moment.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <MomentImage
                            momentId={moment.id}
                            playerName={moment.playerName}
                            rarity={moment.rarity}
                            size={64}
                            editionName={moment.editionName}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold text-white text-lg">{moment.playerName}</div>
                                <div className="text-sm text-gray-400">#{moment.serialNumber} • {moment.rarity}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-mono text-white">{moment.price}</div>
                                <div className="text-sm text-green-400">{moment.change}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Circulation: 1,000</span>
                              <span>Owned: 45</span>
                              <span>Listed: 12</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Portfolio Summary */}
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">Portfolio Summary</h4>
                      <div className="text-sm text-green-400">+$2,847 Today</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Total Value</div>
                        <div className="text-white font-mono">$47,832.50</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Total P&L</div>
                        <div className="text-green-400 font-mono">+$12,441.23</div>
                      </div>
                      <div>
                        <div className="text-gray-400">ROI</div>
                        <div className="text-green-400 font-mono">+35.1%</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Moments</div>
                        <div className="text-white font-mono">247</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 text-center mt-4 pt-3 border-t border-gray-800">
                    Real NBA TopShot moments • Live market data • Updated every 5 minutes
                  </div>
                </div>
                
                {/* Floating metrics */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  Live Data
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Fast
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 