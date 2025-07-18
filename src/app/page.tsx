'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '../components/layout/Navigation'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navigation onThemeToggle={toggleTheme} currentTheme={theme} />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Phase 1: NBA Top Shot & WNBA Flow Analytics
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6">
              The Ultimate
              <span className="block bg-gradient-to-r from-[var(--primary-blue)] to-[var(--secondary-purple)] bg-clip-text text-transparent">
                Flow Blockchain
              </span>
              Analytics Platform
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
              Professional NBA Top Shot & WNBA analytics with real-time Flow blockchain data, 
              advanced portfolio tracking, and SaaS subscription model ($99-199/year).
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild
                size="xl"
                className="px-8"
              >
                <Link href="/analytics">
                  Start 7-Day Free Trial
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="xl"
                className="px-8"
              >
                <Link href="/platforms">
                  View Live Data
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 text-[var(--text-tertiary)] text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--success-500)] rounded-full animate-pulse"></div>
                <span>Live Flow Blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>NBA Top Shot + WNBA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>SaaS Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything You Need to Dominate NBA Top Shot
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Professional analytics tools that give you the edge in the marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
                  </svg>
                ),
                title: "Advanced Analytics",
                description: "Bloomberg Terminal-style interface with real-time portfolio tracking, ROI analysis, and performance metrics."
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                ),
                title: "Marketplace Intelligence",
                description: "Live market data, price predictions, and opportunity alerts to help you buy low and sell high."
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                ),
                title: "Terminal Mode",
                description: "Professional trading interface with real-time data feeds and advanced filtering capabilities."
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                ),
                title: "Portfolio Optimization",
                description: "AI-powered insights to maximize your collection's value and identify the best investment opportunities."
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                ),
                title: "Smart Alerts",
                description: "Custom notifications for price changes, new listings, and market opportunities you can't afford to miss."
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
                title: "Export & Reports",
                description: "Professional reports and data exports for tax purposes, insurance, and portfolio management."
              }
            ].map((feature, index) => (
              <Card key={index} variant="elevated" className="p-8 hover:scale-105 transition-transform">
                <CardContent className="text-center">
                  <div className="text-[var(--primary-blue)] mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Trusted by Top Collectors
            </h2>
            <p className="text-xl text-[var(--text-secondary)]">
              Join thousands of successful NBA Top Shot collectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "CollectorPRO helped me optimize my portfolio and increase my ROI by 40% in just 3 months.",
                author: "Alex M.",
                title: "Top 100 Collector"
              },
              {
                quote: "The analytics are incredible. I can't imagine trading without this platform now.",
                author: "Sarah L.",
                title: "Professional Trader"
              },
              {
                quote: "Finally, a tool that gives me the data I need to make smart collecting decisions.",
                author: "Marcus R.",
                title: "Whale Collector"
              }
            ].map((testimonial, index) => (
              <Card key={index} variant="elevated" className="p-8">
                <CardContent>
                  <div className="text-[var(--primary-blue)] text-4xl mb-4">"</div>
                  <p className="text-[var(--text-primary)] mb-6 text-lg leading-relaxed">{testimonial.quote}</p>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">{testimonial.author}</div>
                    <div className="text-[var(--text-secondary)]">{testimonial.title}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container">
          <Card variant="elevated" className="p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "10,000+", label: "Active Users" },
                { number: "$50M+", label: "Portfolio Value Tracked" },
                { number: "99.9%", label: "Uptime" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-[var(--primary-blue)] mb-2">{stat.number}</div>
                  <div className="text-[var(--text-secondary)]">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
              Ready to Take Your Collection
              <span className="block text-[var(--primary-blue)]">to the Next Level?</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8">
              Join the most successful NBA Top Shot collectors using professional analytics
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="px-8">
                <Link href="/pricing">
                  Start Your Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="px-8">
                <Link href="/dashboard?wallet=demo-wallet">
                  See Live Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--secondary-purple)] rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                CollectorPRO
              </span>
            </div>
            <p className="text-[var(--text-secondary)] mb-4">&copy; 2024 CollectorPRO. All rights reserved.</p>
            <div className="flex items-center justify-center gap-6">
              <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard?wallet=demo-wallet" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Demo
              </Link>
              <a href="mailto:support@collectorpro.com" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}