'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '../components/layout/Navigation'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  BarChart3,
  Shield,
  Clock,
  Users,
  Award,
  Eye,
  Zap
} from 'lucide-react'

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPreference = 'dark' // Default to dark for pro trader feel
    const initialTheme = savedTheme || systemPreference
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation onThemeToggle={toggleTheme} currentTheme={theme} />
      
      {/* Hero Section - NBA Court Pattern Background */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* NBA Court Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none">
            <circle cx="500" cy="300" r="60" stroke="currentColor" strokeWidth="2"/>
            <circle cx="500" cy="300" r="120" stroke="currentColor" strokeWidth="1"/>
            <path d="M0 150 Q250 150 500 150 Q750 150 1000 150" stroke="currentColor" strokeWidth="1"/>
            <path d="M0 450 Q250 450 500 450 Q750 450 1000 450" stroke="currentColor" strokeWidth="1"/>
            <rect x="0" y="250" width="190" height="100" stroke="currentColor" strokeWidth="1" fill="none"/>
            <rect x="810" y="250" width="190" height="100" stroke="currentColor" strokeWidth="1" fill="none"/>
            <circle cx="150" cy="300" r="60" stroke="currentColor" strokeWidth="1"/>
            <circle cx="850" cy="300" r="60" stroke="currentColor" strokeWidth="1"/>
          </svg>
        </div>

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Value Proposition */}
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Tracking $2.3M in NBA TopShot Portfolios
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  The Professional
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    NBA TopShot
                  </span>
                  Analytics Platform
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  Track, analyze, and optimize your digital basketball card portfolio like a Wall Street trader. 
                  <span className="text-blue-400 font-semibold"> See which moments are undervalued before everyone else.</span>
                </p>

                {/* Key Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Real-time P&L tracking with exact ROI percentages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Get alerts when moments go below market value</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Bloomberg Terminal-style professional interface</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    asChild
                    size="xl"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
                  >
                    <Link href="/pricing">
                      Start Free 7-Day Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    size="xl"
                    className="px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 text-lg"
                  >
                    <Link href="/dashboard?wallet=demo-wallet">
                      View Live Demo
                      <Play className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Social Proof Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">$2.3M</div>
                    <div className="text-sm text-gray-400">Portfolio Value Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">+23%</div>
                    <div className="text-sm text-gray-400">Avg ROI Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">1,247</div>
                    <div className="text-sm text-gray-400">Active Collectors</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Screenshot */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-800 p-1">
                  <div className="bg-black rounded-lg p-6">
                    {/* Mock Terminal Interface */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400">CollectorPRO Terminal</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Portfolio Value</span>
                          <span className="text-green-400 font-mono text-lg">$47,832.50</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Total P&L</span>
                          <span className="text-green-400 font-mono">+$12,441.23 (+35.1%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Best Performer</span>
                          <span className="text-blue-400 font-mono">Ja Morant #2834 (+127%)</span>
                        </div>
                      </div>

                      {/* Mock Chart */}
                      <div className="h-32 bg-gray-900 rounded border border-gray-800 flex items-end justify-center p-4">
                        <div className="flex items-end gap-1 h-full">
                          {[65, 45, 78, 56, 89, 67, 92, 75, 83, 91, 88, 95].map((height, i) => (
                            <div 
                              key={i} 
                              className="bg-blue-500 w-3 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 text-center">
                        Live market data • Updated every 5 minutes
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating metrics */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                  +$1,247 Today
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Live Updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-950">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stop Guessing. Start <span className="text-blue-400">Winning</span>.
            </h2>
            <p className="text-xl text-gray-300">
              Most TopShot collectors are flying blind, missing profitable opportunities every day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-red-400 mb-6">Without CollectorPRO:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-300">Missing Profitable Moments</div>
                    <div className="text-gray-400 text-sm">No alerts when moments drop below market value</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-300">No Portfolio Insights</div>
                    <div className="text-gray-400 text-sm">Can't track actual ROI or identify best performers</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-300">Tax Season Nightmare</div>
                    <div className="text-gray-400 text-sm">Manually calculating gains/losses for hundreds of moments</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-400 mb-6">With CollectorPRO:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-300">Never Miss a Deal</div>
                    <div className="text-gray-400 text-sm">Instant alerts when undervalued moments hit the market</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-300">Professional Analytics</div>
                    <div className="text-gray-400 text-sm">Real-time P&L, ROI tracking, and performance insights</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-300">One-Click Tax Reports</div>
                    <div className="text-gray-400 text-sm">Export complete gain/loss reports for accountants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Maximize Your TopShot Profits
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Professional-grade tools that give you the edge over casual collectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Portfolio Tracking */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Portfolio Tracking</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  See your exact P&L, ROI, and portfolio value in real-time. Track performance across all your moments with precision.
                </p>
                <div className="text-sm text-blue-400 font-semibold">
                  ✓ Real-time valuations ✓ ROI calculations ✓ Performance charts
                </div>
              </CardContent>
            </Card>

            {/* Market Intelligence */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">Market Intelligence</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Get alerts when moments you want go on sale below market value. Never miss a profitable opportunity again.
                </p>
                <div className="text-sm text-green-400 font-semibold">
                  ✓ Price alerts ✓ Market analysis ✓ Opportunity detection
                </div>
              </CardContent>
            </Card>

            {/* Smart Analytics */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Analytics</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Identify undervalued players before the market catches up. Data-driven insights for smarter collecting.
                </p>
                <div className="text-sm text-purple-400 font-semibold">
                  ✓ Player analysis ✓ Trend detection ✓ Value predictions
                </div>
              </CardContent>
            </Card>

            {/* Professional Reports */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold">Tax Reports</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Export complete tax reports and portfolio summaries for accountants. Make tax season effortless.
                </p>
                <div className="text-sm text-yellow-400 font-semibold">
                  ✓ Gain/loss reports ✓ CSV exports ✓ Accountant-ready
                </div>
              </CardContent>
            </Card>

            {/* Lightning Fast */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold">Lightning Fast</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Sub-200ms filtering through thousands of moments. Virtual scrolling handles massive collections smoothly.
                </p>
                                 <div className="text-sm text-cyan-400 font-semibold">
                   ✓ Sub-200ms response ✓ Virtual scrolling ✓ No lag with 1000+ moments
                 </div>
              </CardContent>
            </Card>

            {/* Bloomberg Terminal */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">Pro Interface</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Bloomberg Terminal-inspired design for serious collectors. Professional tools for professional results.
                </p>
                <div className="text-sm text-red-400 font-semibold">
                  ✓ Dark theme ✓ Pro layouts ✓ Advanced charts
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-950">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results from Real Collectors
            </h2>
            <p className="text-xl text-gray-300">
              Don't just take our word for it - see the actual impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">+47%</div>
                  <div className="text-gray-300 font-semibold mb-2">Average ROI Increase</div>
                  <div className="text-gray-400 text-sm">
                    "Got alerts for Ja Morant moments 2 days before his playoff run. Made $3,200 profit."
                  </div>
                  <div className="text-xs text-gray-500 mt-3">- TopShot Collector since 2021</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">$28K</div>
                  <div className="text-gray-300 font-semibold mb-2">Portfolio Value Tracked</div>
                  <div className="text-gray-400 text-sm">
                    "Finally know exactly what my collection is worth. The tax reports saved me hours."
                  </div>
                  <div className="text-xs text-gray-500 mt-3">- Professional Collector</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 p-6">
              <CardContent className="p-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">156</div>
                  <div className="text-gray-300 font-semibold mb-2">Profitable Alerts</div>
                  <div className="text-gray-400 text-sm">
                    "The platform paid for itself in the first week. Caught 3 undervalued Curry moments."
                  </div>
                  <div className="text-xs text-gray-500 mt-3">- Day Trader</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">$2.3M</div>
              <div className="text-gray-400">Portfolio Value Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">23%</div>
              <div className="text-gray-400">Avg ROI Improvement</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">1,247</div>
              <div className="text-gray-400">Active Collectors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">4.9★</div>
              <div className="text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Professional Edge
            </h2>
            <p className="text-xl text-gray-300">
              Start with our Starter plan and upgrade as your portfolio grows
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <Card className="bg-gray-900 border-gray-800 relative">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Starter</h3>
                  <div className="text-3xl font-bold mb-1">$9.99</div>
                  <div className="text-gray-400 text-sm mb-6">/month</div>
                  
                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Up to 100 moments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Real-time P&L tracking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Basic price alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">CSV exports</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/pricing">Start Free Trial</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pro - Most Popular */}
            <Card className="bg-gradient-to-b from-blue-900/50 to-purple-900/50 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <div className="text-3xl font-bold mb-1">$19.99</div>
                  <div className="text-gray-400 text-sm mb-6">/month</div>
                  
                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Unlimited moments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Smart price alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Professional reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/pricing">Start Free Trial</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-gray-900 border-gray-800 relative">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold mb-1">$49.99</div>
                  <div className="text-gray-400 text-sm mb-6">/month</div>
                  
                  <div className="space-y-3 text-left mb-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Everything in Pro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Multi-portfolio support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">API access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Custom reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Dedicated support</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href="/pricing">Start Free Trial</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400">
              All plans include 7-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Turn Your TopShot Collection Into a Professional Portfolio?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join 1,247 collectors who are already maximizing their TopShot profits with CollectorPRO
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                asChild
                size="xl"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
              >
                <Link href="/pricing">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="xl"
                className="px-8 py-4 border-gray-600 text-gray-300 hover:bg-gray-800 text-lg"
              >
                <Link href="/dashboard?wallet=demo-wallet">
                  See Live Demo
                  <Eye className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            <p className="text-gray-400 text-sm">
              Free 7-day trial • No credit card required • Setup in under 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">CollectorPRO</div>
            <p className="text-gray-400 mb-6">
              The professional NBA TopShot analytics platform trusted by serious collectors
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
              <Link href="/dashboard?wallet=demo-wallet" className="hover:text-white">Demo</Link>
              <Link href="/discover" className="hover:text-white">Features</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}