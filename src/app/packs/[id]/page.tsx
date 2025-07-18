'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Separator } from "@/components/ui/separator"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface PackData {
  id: string
  name: string
  title: string
  description: string
  price: number
  originalPrice: number
  forSale: number
  totalPacks: number
  packsOpened: number
  dropDate: string
  momentsPerPack: number
  packType: string
  guaranteedRare: boolean
  image: string
  rarityBreakdown: {
    common: { current: number; total: number }
    rare: { current: number; total: number }
    legendary: { current: number; total: number }
    ultimate: { current: number; total: number }
  }
  momentsData: MomentData[]
  recentPurchases: PurchaseData[]
  topPurchases: PurchaseData[]
}

interface MomentData {
  id: string
  player: string
  team: string
  series: string
  tier: 'WNBA' | 'NBA'
  special: string
  lowNumber: number
  remaining: number
  lowAsk: number
  avgSale: number
  lastSale: number
  image: string
  rarity: 'common' | 'rare' | 'legendary' | 'ultimate'
  isSignatureEdition: boolean
}

interface PurchaseData {
  id: string
  buyer: string
  price: number
  datetime: string
  avatar: string
}

// Sample pack data matching NBA Top Shot Fresh Gems pack
const getPackData = (id: string): PackData => ({
  id,
  name: "FRESH GEMS: GUARANTEED HIT",
  title: "WNBA Fresh Gems",
  description: "Each pack comes with a guaranteed Fresh Gem with a chance for something even rarer! Fresh Gems are the newest and most exciting moments featuring the top WNBA players.",
  price: 299.00,
  originalPrice: 150.00,
  forSale: 15,
  totalPacks: 360,
  packsOpened: 296,
  dropDate: "Jul 9, 2025, 4PM",
  momentsPerPack: 3,
  packType: "Rare",
  guaranteedRare: true,
  image: "/pack-fresh-gems.png",
  rarityBreakdown: {
    common: { current: 96, total: 585 },
    rare: { current: 96, total: 495 },
    legendary: { current: 0, total: 0 },
    ultimate: { current: 0, total: 0 }
  },
  momentsData: [
    {
      id: "1",
      player: "Paige Bueckers",
      team: "University of Connecticut",
      series: "WNBA Fresh Gems",
      tier: "WNBA",
      special: "Signature Edition",
      lowNumber: 7,
      remaining: 7,
      lowAsk: 1495,
      avgSale: 999.50,
      lastSale: 1000,
      image: "/player-paige.jpg",
      rarity: 'rare',
      isSignatureEdition: true
    },
    {
      id: "2", 
      player: "Sonja Citron",
      team: "Notre Dame",
      series: "WNBA Fresh Gems",
      tier: "WNBA",
      special: "",
      lowNumber: 2,
      remaining: 16,
      lowAsk: 699,
      avgSale: 305,
      lastSale: 308,
      image: "/player-sonja.jpg",
      rarity: 'common',
      isSignatureEdition: false
    },
    {
      id: "3",
      player: "A'ja Wilson",
      team: "Las Vegas Aces",
      series: "WNBA Fresh Gems",
      tier: "WNBA", 
      special: "Signature Edition",
      lowNumber: 3,
      remaining: 2,
      lowAsk: 1399,
      avgSale: 536.60,
      lastSale: 620,
      image: "/player-aja.jpg",
      rarity: 'legendary',
      isSignatureEdition: true
    },
    {
      id: "4",
      player: "Jonquel Jones",
      team: "New York Liberty",
      series: "WNBA Fresh Gems",
      tier: "WNBA",
      special: "",
      lowNumber: 15,
      remaining: 3,
      lowAsk: 505,
      avgSale: 454.90,
      lastSale: 425,
      image: "/player-jonquel.jpg",
      rarity: 'rare',
      isSignatureEdition: false
    }
  ],
  recentPurchases: [
    { id: "1", buyer: "sonichoppstar", price: 300.00, datetime: "Jul 15, 25 10:11 PM", avatar: "/avatar1.jpg" },
    { id: "2", buyer: "kiddo2003", price: 299.00, datetime: "Jul 16, 25 12:57 PM", avatar: "/avatar2.jpg" },
    { id: "3", buyer: "CoachJake", price: 297.00, datetime: "Jul 16, 25 2:15 PM", avatar: "/avatar3.jpg" },
    { id: "4", buyer: "immysanta", price: 297.00, datetime: "Jul 25, 25 1:07 PM", avatar: "/avatar4.jpg" },
    { id: "5", buyer: "CoachJake", price: 294.00, datetime: "Jul 16, 25 6:32 PM", avatar: "/avatar3.jpg" },
    { id: "6", buyer: "CoachJake", price: 293.00, datetime: "Jul 16, 25 7:18 PM", avatar: "/avatar3.jpg" },
    { id: "7", buyer: "sonichoppstar", price: 290.00, datetime: "Jul 16, 25 11:24 AM", avatar: "/avatar1.jpg" },
    { id: "8", buyer: "elecortho", price: 290.00, datetime: "Jul 16, 25 8:13 PM", avatar: "/avatar5.jpg" },
    { id: "9", buyer: "immysanta", price: 289.00, datetime: "Jul 16, 25 11:54 AM", avatar: "/avatar4.jpg" },
    { id: "10", buyer: "CoachJake", price: 289.00, datetime: "Jul 16, 25 9:18 PM", avatar: "/avatar3.jpg" }
  ],
  topPurchases: [
    { id: "1", buyer: "sonichoppstar", price: 300.00, datetime: "Jul 15, 25 10:11 PM", avatar: "/avatar1.jpg" },
    { id: "2", buyer: "kiddo2003", price: 299.00, datetime: "Jul 16, 25 12:57 PM", avatar: "/avatar2.jpg" },
    { id: "3", buyer: "CoachJake", price: 297.00, datetime: "Jul 16, 25 2:15 PM", avatar: "/avatar3.jpg" },
    { id: "4", buyer: "immysanta", price: 297.00, datetime: "Jul 25, 25 1:07 PM", avatar: "/avatar4.jpg" }
  ]
})

const RARITY_COLORS = {
  common: '#6b7280',
  rare: '#3b82f6', 
  legendary: '#f59e0b',
  ultimate: '#ef4444'
}

export default function PackDetailPage() {
  const params = useParams()
  const packId = params.id as string
  const [packData, setPackData] = useState<PackData | null>(null)
  const [activeTab, setActiveTab] = useState<'recent' | 'top'>('recent')
  const [tierFilter, setTierFilter] = useState<'all' | 'WNBA' | 'NBA'>('all')

  useEffect(() => {
    // Simulate loading pack data
    setPackData(getPackData(packId))
  }, [packId])

  if (!packData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pack details...</p>
        </div>
      </div>
    )
  }

  const remainingPercentage = ((packData.totalPacks - packData.packsOpened) / packData.totalPacks) * 100

  const pieData = [
    { name: 'Opened', value: packData.packsOpened, color: '#374151' },
    { name: 'Remaining', value: packData.totalPacks - packData.packsOpened, color: '#3b82f6' }
  ]

  const filteredMoments = tierFilter === 'all' 
    ? packData.momentsData 
    : packData.momentsData.filter(m => m.tier === tierFilter)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header Breadcrumb */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-400">
            <span>Packs</span> / <span className="text-white">{packData.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column - Pack Image & Details */}
          <div className="xl:col-span-3 space-y-6">
            {/* Pack 3D Visualization */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-600 via-pink-500 to-purple-800 rounded-xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-2">💎</div>
                  <div className="text-white font-bold text-lg">FRESH GEMS</div>
                </div>
              </div>
            </div>

            {/* About This Pack */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">About This Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {packData.description}
                </p>
              </CardContent>
            </Card>

            {/* Pack Content Remaining */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Pack Content Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={60}
                          strokeWidth={0}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xl font-bold text-white">{packData.totalPacks - packData.packsOpened}/{packData.totalPacks}</div>
                      <div className="text-xs text-gray-400">{Math.round(remainingPercentage)}%</div>
                    </div>
                  </div>
                </div>

                {/* Rarity Breakdown */}
                <div className="space-y-3">
                  {Object.entries(packData.rarityBreakdown).map(([key, value]) => {
                    const percentage = value.total > 0 ? Math.round((value.current / value.total) * 100) : 0
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300 capitalize">{key}</span>
                          <span className="text-white">{value.current}/{value.total} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Pack Header & Purchase */}
          <div className="xl:col-span-6 space-y-6">
            {/* Pack Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{packData.name}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
                <div><span className="text-gray-500">Dropped:</span> <span className="text-white">{packData.dropDate}</span></div>
                <div><span className="text-gray-500">Moments per pack:</span> <span className="text-white">{packData.momentsPerPack}</span></div>
                <div><span className="text-gray-500">Pack type:</span> <span className="text-white">{packData.packType}</span></div>
                <div><span className="text-gray-500">Original Pack Price:</span> <span className="text-white">${packData.originalPrice.toFixed(2)} USD</span></div>
              </div>
            </div>

            {/* Purchase Section */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-lg text-gray-400">{packData.forSale} For Sale</div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-6 rounded-lg">
                    BUY FOR ${packData.price.toFixed(2)}
                  </Button>
                  <p className="text-sm text-gray-400">
                    You're buying at the lowest ask, 1 pack(s) left at this price
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Moments You Could Pull Table */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-xl">Moments You Could Pull</CardTitle>
                <div className="flex items-center gap-2">
                  <select 
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value as 'all' | 'WNBA' | 'NBA')}
                    className="bg-[#0a0a0a] border border-gray-600 rounded px-3 py-1 text-white text-sm"
                  >
                    <option value="all">All Tiers</option>
                    <option value="WNBA">WNBA</option>
                    <option value="NBA">NBA</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-800">
                  <div className="col-span-5">MOMENT</div>
                  <div className="col-span-2">SPECIAL</div>
                  <div className="col-span-1">LOW #</div>
                  <div className="col-span-2">REMAINING</div>
                  <div className="col-span-2">PRICE</div>
                </div>

                {/* Table Body */}
                <div className="space-y-3">
                  {filteredMoments.map((moment) => (
                    <div key={moment.id} className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-[#0f0f0f] rounded-lg transition-colors">
                      {/* Moment Info */}
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold text-sm">
                          {moment.player.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-medium text-sm">{moment.player}</h3>
                            <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                              {moment.tier}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">{moment.series}</p>
                          <p className="text-xs text-gray-500">{moment.team}</p>
                        </div>
                      </div>

                      {/* Special */}
                      <div className="col-span-2">
                        {moment.isSignatureEdition && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            Signature Edition
                          </Badge>
                        )}
                      </div>

                      {/* Low Number */}
                      <div className="col-span-1 text-white text-sm font-medium">
                        #{moment.lowNumber}
                      </div>

                      {/* Remaining */}
                      <div className="col-span-2 text-white text-sm font-medium">
                        {moment.remaining}
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-right">
                        <div className="text-sm text-white">Low Ask: ${moment.lowAsk}</div>
                        <div className="text-xs text-gray-400">Avg: ${moment.avgSale}</div>
                        <div className="text-xs text-gray-400">Last: ${moment.lastSale || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Fast Facts */}
          <div className="xl:col-span-3">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Fast Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl text-white font-bold">${packData.originalPrice} USD</div>
                  <div className="text-sm text-gray-400">Price</div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div>
                  <div className="text-white font-semibold">100% of Packs</div>
                  <div className="text-sm text-gray-400">Include 1x guaranteed Rare Fresh Gem Moment</div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div>
                  <div className="text-white font-semibold">5% of Packs</div>
                  <div className="text-sm text-gray-400">Include a Fresh Gem: Signature Edition Moment</div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div>
                  <div className="text-white font-semibold">Buyback</div>
                  <div className="text-sm text-gray-400">Note: this pack does not come with a buyback.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Purchase History */}
        <div className="mt-12">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <div className="flex items-center border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`text-lg font-medium px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'recent' 
                      ? 'text-white border-blue-500' 
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  RECENT PURCHASES
                </button>
                <button
                  onClick={() => setActiveTab('top')}
                  className={`text-lg font-medium px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'top' 
                      ? 'text-white border-blue-500' 
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  TOP PURCHASES
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 font-medium mb-4 pb-2 border-b border-gray-800">
                  <div>Buyer</div>
                  <div className="text-center">Sale Price</div>
                  <div className="text-right">Date/Time</div>
                </div>
                
                {(activeTab === 'recent' ? packData.recentPurchases : packData.topPurchases).map((purchase) => (
                  <div key={purchase.id} className="grid grid-cols-3 gap-4 py-3 hover:bg-[#0f0f0f] rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {purchase.buyer[0].toUpperCase()}
                      </div>
                      <span className="text-white text-sm">{purchase.buyer}</span>
                    </div>
                    <div className="text-center text-white font-medium">${purchase.price.toFixed(2)}</div>
                    <div className="text-right text-gray-400 text-sm">{purchase.datetime}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  VIEW COMPLETE PURCHASE HISTORY
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 