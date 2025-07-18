'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { profileService } from '@/lib/profile-service'

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

const UserProfilePage = () => {
  const params = useParams()
  const wallet = params?.wallet as string
  
  const [activeTab, setActiveTab] = useState('overview')
  const [portfolioPeriod, setPortfolioPeriod] = useState('1D')
  const [offersTab, setOffersTab] = useState('received')
  const [momentsFilter, setMomentsFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  
  // State for dynamic data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [userMoments, setUserMoments] = useState<UserMoment[]>([])

  const navigationTabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'moments', label: 'MOMENTS' },
    { id: 'packs', label: 'PACKS' },
    { id: 'sets', label: 'SETS' },
    { id: 'leaderboards', label: 'LEADERBOARDS' }, 
    { id: 'teams', label: 'TEAMS' }
  ]

  const portfolioPeriods = ['1H', '1D', '1W', '1M', '1Y', 'ALL']
  const offersTabs = ['RECEIVED', 'SUBMITTED', 'HIDDEN']

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'CA': '🇨🇦',
      'US': '🇺🇸',
      'UK': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'AU': '🇦🇺',
      'JP': '🇯🇵'
    }
    return flags[countryCode] || '🌍'
  }

  // Load user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!wallet) return
      
      setLoading(true)
      try {
        const [profile, portfolio, userOffers, moments] = await Promise.all([
          profileService.getUserProfile(wallet),
          profileService.getPortfolioData(wallet, portfolioPeriod),
          profileService.getUserOffers(wallet, offersTab as any),
          profileService.getUserMoments(wallet, momentsFilter)
        ])

        setUserProfile(profile)
        setPortfolioData(portfolio)
        setOffers(userOffers)
        setUserMoments(moments)
      } catch (error) {
        console.error('Error loading profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [wallet, portfolioPeriod, offersTab, momentsFilter])

  // Update portfolio data when period changes
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!wallet) return
      
      try {
        const portfolio = await profileService.getPortfolioData(wallet, portfolioPeriod)
        setPortfolioData(portfolio)
      } catch (error) {
        console.error('Error loading portfolio data:', error)
      }
    }

    if (userProfile) {
      loadPortfolioData()
    }
  }, [portfolioPeriod, wallet, userProfile])

  // Update offers when tab changes
  useEffect(() => {
    const loadOffers = async () => {
      if (!wallet) return
      
      try {
        const userOffers = await profileService.getUserOffers(wallet, offersTab as any)
        setOffers(userOffers)
      } catch (error) {
        console.error('Error loading offers:', error)
      }
    }

    if (userProfile) {
      loadOffers()
    }
  }, [offersTab, wallet, userProfile])

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header Section */}
      <div className="px-6 py-8">
        {/* User Info Header */}
        <div className="flex items-start gap-6 mb-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl font-bold">
              ⚡
            </div>
            <div className="absolute -bottom-2 -right-2 text-2xl">
              {getCountryFlag(userProfile.country)}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl font-bold">{userProfile.username}</h1>
              <div className="text-xl">{getCountryFlag(userProfile.country)}</div>
            </div>
            
            {/* User Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-[#1a1a1a] text-gray-300">
                Joined {userProfile.joinedDate}
              </Badge>
              {userProfile.fanBadges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-900/30 text-purple-300">
                  🏀 {badge}
                </Badge>
              ))}
              {userProfile.verification.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-900/30 text-blue-300">
                  ✓ {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-blue-400">
                  {formatNumber(userProfile.topShotScore)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400">Top Shot Score</div>
                  <div className="text-sm text-green-400 font-medium">{userProfile.topShotRank}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-yellow-400">
                  {userProfile.completedSets}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400">Completed Sets</div>
                  <div className="text-sm text-gray-500">Collection Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-purple-400">
                  {formatNumber(userProfile.totalMoments)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400">Moments</div>
                  <div className="text-sm text-gray-500">Total Collection</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex gap-8">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Value Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-6">
                {/* Portfolio Value Header */}
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-2">
                    {formatCurrency(userProfile.portfolioValue)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={userProfile.dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {userProfile.dailyChange >= 0 ? '+' : ''}{formatCurrency(userProfile.dailyChange)} ({userProfile.dailyChangePercent >= 0 ? '+' : ''}{userProfile.dailyChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Time Period Toggles */}
                <div className="flex gap-4 mb-6">
                  {portfolioPeriods.map((period) => (
                    <button
                      key={period}
                      onClick={() => setPortfolioPeriod(period)}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        portfolioPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData}>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="time"
                        stroke="#9CA3AF"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                        formatter={(value: any) => [formatCurrency(value), 'Portfolio Value']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="url(#portfolioGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Balance/Insights Tabs */}
                <div className="flex gap-6 mt-6 pt-4 border-t border-gray-800">
                  <button className="text-blue-400 font-medium">Balance</button>
                  <button className="text-gray-400 hover:text-gray-300">Insights</button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Offers Section */}
          <div>
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <div className="flex gap-4">
                  {offersTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setOffersTab(tab.toLowerCase() as any)}
                      className={`text-sm font-medium ${
                        offersTab === tab.toLowerCase()
                          ? 'text-blue-400'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {offers.length > 0 ? offers.map((offer) => (
                    <div key={offer.id} className="p-4 hover:bg-[#252525] transition-colors">
                      <div className="flex items-center gap-3">
                        <img 
                          src={offer.moment.image} 
                          alt={offer.moment.player}
                          className="w-10 h-10 rounded bg-gray-700"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            {offer.moment.player}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {offer.moment.series}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-400">Highest Offer</span>
                          <div className="font-medium text-green-400">
                            ${offer.highestOffer}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Active Offers</span>
                          <div className="font-medium">{offer.activeOffers} Offers</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Lowest Ask</span>
                          <div className="font-medium">${offer.lowestAsk}</div>
                        </div>
                        <div>
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-400">
                      No {offersTab} offers
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Moments Collection Section */}
        <Card className="bg-[#1a1a1a] border-gray-800">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  My Moments: {userProfile.totalMoments}
                </button>
                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm">
                  Uncategorized: {Math.floor(userProfile.totalMoments * 0.95)}
                </button>
                <button className="bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm">
                  Shoebox: {Math.floor(userProfile.totalMoments * 0.05)}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  SELECT
                </Button>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-gray-800 rounded">
                    <div className="w-4 h-4 bg-gray-600"></div>
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded">
                    <div className="w-4 h-4 bg-gray-600"></div>
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#111111] text-xs font-medium text-gray-400 border-b border-gray-800">
              <div className="col-span-3">MOMENT</div>
              <div>SERIAL</div>
              <div>SUPPLY</div>
              <div>LOW ASK</div>
              <div>HIGHEST OFFER</div>
              <div>OWNED</div>
              <div>IN PACKS</div>
              <div>BURNED</div>
              <div>LOCKED</div>
              <div>PURCHASED</div>
              <div>ACQUIRED</div>
              <div></div>
            </div>

            {/* Table Rows */}
            <div className="space-y-1">
              {userMoments.map((moment) => (
                <div key={moment.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-[#252525] transition-colors text-sm">
                  <div className="col-span-3 flex items-center gap-3">
                    <img 
                      src={moment.image}
                      alt={moment.player}
                      className="w-10 h-10 rounded bg-gray-700"
                    />
                    <div>
                      <div className="font-medium text-white">{moment.player}</div>
                      <div className="text-xs text-gray-400">{moment.series}</div>
                      <div className="text-xs text-gray-500">Series {moment.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-mono">#{moment.serial}</div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    {moment.supply.toLocaleString()}
                  </div>
                  <div className="flex items-center font-medium">
                    ${moment.lowAsk.toFixed(2)}
                  </div>
                  <div className="flex items-center font-medium">
                    ${moment.highestOffer.toFixed(2)}
                  </div>
                  <div className="flex items-center text-gray-400">
                    {moment.owned}
                  </div>
                  <div className="flex items-center text-gray-400">
                    {moment.inPacks}
                  </div>
                  <div className="flex items-center text-gray-400">
                    {moment.burned}
                  </div>
                  <div className="flex items-center text-gray-400">
                    {moment.locked}
                  </div>
                  <div className="flex items-center font-medium">
                    ${moment.purchased.toFixed(2)}
                  </div>
                  <div className="flex items-center text-gray-400 text-xs">
                    {moment.acquired}
                  </div>
                  <div className="flex items-center">
                    <Button size="sm" variant="outline" className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700">
                      VIEW
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="p-6 border-t border-gray-800 text-center">
              <Button variant="outline" className="px-8">
                LOAD MORE
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UserProfilePage 