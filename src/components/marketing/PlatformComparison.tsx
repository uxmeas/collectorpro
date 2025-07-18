'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/design-system/atoms/Icon'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'
import { Check, X, Star, Zap, Clock, Users, Globe, Layers } from 'lucide-react'

interface ComparisonFeature {
  feature: string
  description: string
  multipleApps: boolean
  collectorPRO: boolean
  highlight?: boolean
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    feature: 'Multi-Platform Support',
    description: 'Manage collections across NBA TopShot, Panini NFT, NFL All Day',
    multipleApps: false,
    collectorPRO: true,
    highlight: true
  },
  {
    feature: 'Universal Search',
    description: 'Find any moment or card across all platforms instantly',
    multipleApps: false,
    collectorPRO: true,
    highlight: true
  },
  {
    feature: 'Cross-Platform Analytics',
    description: 'See your complete sports collection stats and insights',
    multipleApps: false,
    collectorPRO: true,
    highlight: true
  },
  {
    feature: 'Platform Comparison',
    description: 'Compare collections across different sports and platforms',
    multipleApps: false,
    collectorPRO: true
  },
  {
    feature: 'Single Dashboard',
    description: 'All your collectibles organized in one place',
    multipleApps: false,
    collectorPRO: true
  },
  {
    feature: 'Time to Find Collectible',
    description: 'Average time to locate a specific moment or card',
    multipleApps: true,
    collectorPRO: true
  },
  {
    feature: 'Collection Overview',
    description: 'See your complete collection at a glance',
    multipleApps: false,
    collectorPRO: true
  },
  {
    feature: 'Export Capabilities',
    description: 'Export your complete collection data',
    multipleApps: false,
    collectorPRO: true
  },
  {
    feature: 'Search Across Platforms',
    description: 'Search for players, teams, rarities across all platforms',
    multipleApps: false,
    collectorPRO: true
  },
  {
    feature: 'App Switching Required',
    description: 'Need to switch between multiple apps',
    multipleApps: true,
    collectorPRO: false
  },
  {
    feature: 'Fragmented Data',
    description: 'Collection data spread across multiple platforms',
    multipleApps: true,
    collectorPRO: false
  },
  {
    feature: 'Limited Analytics',
    description: 'Basic stats per platform only',
    multipleApps: true,
    collectorPRO: false
  },
  {
    feature: 'No Cross-Platform Insights',
    description: 'Cannot compare collections across platforms',
    multipleApps: true,
    collectorPRO: false
  },
  {
    feature: 'Manual Collection Tracking',
    description: 'Must manually track what you own across platforms',
    multipleApps: true,
    collectorPRO: false
  },
  {
    feature: 'Multiple Subscriptions',
    description: 'May need separate tools for each platform',
    multipleApps: true,
    collectorPRO: false
  }
]

const timeComparison = {
  multipleApps: '5-10 minutes',
  collectorPRO: '0.2 seconds'
}

const costComparison = {
  multipleApps: '$15-30/month',
  collectorPRO: '$9.99/month'
}

export default function PlatformComparison() {
  const highlightFeatures = comparisonFeatures.filter(f => f.highlight)
  const allFeatures = comparisonFeatures

  return (
    <div className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Heading level={2} className="text-4xl font-bold text-white mb-4">
            CollectorPRO vs Managing Multiple Apps
          </Heading>
          <Text className="text-xl text-gray-300 max-w-3xl mx-auto">
            See why collectors are switching from juggling multiple apps to the universal sports digital collectibles platform
          </Text>
        </div>

        {/* Key Benefits Highlight */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {highlightFeatures.map((feature, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                  <Icon icon={index === 0 ? Globe : index === 1 ? Zap : Layers} className="w-6 h-6" />
                </div>
                <Heading level={3} className="text-xl font-semibold text-white mb-3">
                  {feature.feature}
                </Heading>
                <Text className="text-gray-400">
                  {feature.description}
                </Text>
                <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30">
                  CollectorPRO Only
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <Heading level={3} className="text-2xl font-bold text-white mb-2">
              Feature Comparison
            </Heading>
            <Text className="text-gray-400">
              Comprehensive comparison of managing multiple apps vs CollectorPRO
            </Text>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-6 text-gray-400 font-medium">Feature</th>
                  <th className="text-center p-6 text-gray-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Multiple Apps
                    </div>
                  </th>
                  <th className="text-center p-6 text-gray-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4 text-orange-400" />
                      CollectorPRO
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="p-6">
                      <div>
                        <div className="font-medium text-white">{feature.feature}</div>
                        <div className="text-sm text-gray-400 mt-1">{feature.description}</div>
                      </div>
                    </td>
                    <td className="text-center p-6">
                      {feature.multipleApps ? (
                        <div className="flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <X className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                    </td>
                    <td className="text-center p-6">
                      {feature.collectorPRO ? (
                        <div className="flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <X className="w-5 h-5 text-red-400" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Key Metrics Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* Multiple Apps */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 text-red-400 mb-4">
                <Users className="w-8 h-8" />
              </div>
              <Heading level={3} className="text-2xl font-bold text-white mb-2">
                Managing Multiple Apps
              </Heading>
              <Text className="text-gray-400">
                The traditional approach to sports digital collectibles
              </Text>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className="text-white">Time to Find Collectible</span>
                </div>
                <div className="text-red-400 font-bold">{timeComparison.multipleApps}</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-red-400" />
                  <span className="text-white">Apps to Manage</span>
                </div>
                <div className="text-red-400 font-bold">3-5 Apps</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-red-400" />
                  <span className="text-white">Monthly Cost</span>
                </div>
                <div className="text-red-400 font-bold">{costComparison.multipleApps}</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <X className="w-5 h-5 text-red-400" />
                  <span className="text-white">Cross-Platform Features</span>
                </div>
                <div className="text-red-400 font-bold">None</div>
              </div>
            </div>
          </Card>

          {/* CollectorPRO */}
          <Card className="bg-slate-800/50 border-orange-500/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <Heading level={3} className="text-2xl font-bold text-white mb-2">
                  CollectorPRO
                </Heading>
                <Text className="text-gray-400">
                  The universal sports digital collectibles platform
                </Text>
                <Badge className="mt-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                  Recommended
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="text-white">Time to Find Collectible</span>
                  </div>
                  <div className="text-green-400 font-bold">{timeComparison.collectorPRO}</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-green-400" />
                    <span className="text-white">Platforms Supported</span>
                  </div>
                  <div className="text-green-400 font-bold">5+ Platforms</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-green-400" />
                    <span className="text-white">Monthly Cost</span>
                  </div>
                  <div className="text-green-400 font-bold">{costComparison.collectorPRO}</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Cross-Platform Features</span>
                  </div>
                  <div className="text-green-400 font-bold">Full Support</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Heading level={3} className="text-3xl font-bold text-white mb-4">
            Ready to Unify Your Sports Collection?
          </Heading>
          <Text className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of collectors who have switched from managing multiple apps to the universal sports digital collectibles platform.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              Start Free Trial
              <Star className="w-5 h-5 ml-2" />
            </a>
            <a 
              href="/demo" 
              className="inline-flex items-center justify-center px-8 py-4 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              View Demo
              <Globe className="w-5 h-5 ml-2" />
            </a>
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            7-day free trial • No credit card required • Cancel anytime
          </div>
        </div>
      </div>
    </div>
  )
} 