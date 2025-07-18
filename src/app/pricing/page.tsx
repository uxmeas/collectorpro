'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Check, 
  Star, 
  Search,
  Menu,
  Shield,
  Clock,
  TrendingUp,
  Users,
  ChevronDown
} from 'lucide-react'

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="w-full h-14 bg-black border-b border-zinc-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-500 rounded flex items-center justify-center">
              <div className="w-8 h-6 bg-white rounded-sm"></div>
            </div>
            <span className="text-zinc-100 text-lg font-medium">CollectorPRO</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-zinc-100 text-sm font-medium hover:text-blue-400 transition-colors">Features</Link>
            <Link href="#" className="text-zinc-100 text-sm font-medium hover:text-blue-400 transition-colors">Community</Link>
            <Link href="#" className="text-zinc-100 text-sm font-medium hover:text-blue-400 transition-colors">Resources</Link>
            <Link href="#" className="text-zinc-100 text-sm font-medium hover:text-blue-400 transition-colors">About Us</Link>
            <Link href="#" className="text-zinc-100 text-sm font-medium hover:text-blue-400 transition-colors">Contact</Link>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search CollectorPRO..."
                className="w-64 h-9 bg-black border border-zinc-700 rounded-md pl-10 pr-4 text-sm text-stone-400 placeholder-stone-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="h-9 px-3 text-zinc-100 hover:bg-zinc-800">
              Sign In
            </Button>
            <Button className="h-9 px-6 bg-blue-500 hover:bg-blue-600 text-white">
              Get Started
            </Button>
            <div className="flex items-center space-x-2">
              <Menu className="w-5 h-5 text-stone-400" />
              <div className="w-8 h-8 bg-teal-100 rounded-full border border-teal-400 overflow-hidden">
                <img src="https://placehold.co/32x32" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full bg-zinc-900 py-20 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold text-zinc-100 mb-4 leading-tight">
            Pricing that grows with your success
          </h1>
          <p className="text-xl text-stone-400 mb-8 max-w-2xl mx-auto">
            Save $100+ per year while finding deals worth thousands
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <div className="bg-gray-800 rounded-full p-1.5 border border-zinc-700 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-lg font-normal transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-gray-700 text-white shadow-sm' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full text-lg font-normal transition-all ${
                  billingCycle === 'annual' 
                    ? 'bg-gray-700 text-white shadow-sm' 
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Annual
              </button>
            </div>
            <span className="text-zinc-100 text-base font-medium bg-blue-500 px-3 py-1 rounded-full">
              Save 36%
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <Card className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow">
              <div className="border-b border-zinc-700 pb-6 mb-6">
                <h3 className="text-3xl font-bold text-zinc-100 text-center mb-6">Starter</h3>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-zinc-100 mb-2">Free Forever</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Basic Collection Tools</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Community Support Access</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Standard Reporting</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Up to 50 Items Managed</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-700">
                <Button className="w-full h-10 bg-gray-800 hover:bg-gray-700 text-white text-lg">
                  Get Started Free
                </Button>
              </div>
            </Card>

            {/* Pro Plan - Most Popular */}
            <Card className="relative bg-zinc-900 border-2 border-blue-500 rounded-xl p-6 h-full shadow-xl scale-105 hover:scale-[1.02] transition-transform">
              {/* Popular Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full border border-white">
                  Most Popular
                </span>
              </div>

              <div className="border-b border-zinc-700 pb-6 mb-6">
                <h3 className="text-3xl font-bold text-zinc-100 text-center mb-6">Pro</h3>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-zinc-100 mb-2">$99/year</div>
                  <div className="text-lg text-stone-400 line-through mb-2">$155.88/year</div>
                  <div className="text-base font-medium text-zinc-100">Save $56 (36% off)</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Advanced Valuation Tools</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Priority Email Support</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Detailed Market Insights</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Unlimited Items Managed</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Secure Cloud Storage</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Customizable Dashboards</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-700">
                <Button className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white text-lg">
                  Start Free Trial
                </Button>
              </div>
            </Card>

            {/* Elite Plan */}
            <Card className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow">
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-white text-xs font-medium px-3 py-1 rounded-full border border-white">
                  Best Value
                </span>
              </div>

              <div className="border-b border-zinc-700 pb-6 mb-6">
                <h3 className="text-3xl font-bold text-zinc-100 text-center mb-6">Elite</h3>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-zinc-100 mb-2">$199/year</div>
                  <div className="text-lg text-stone-400 line-through mb-2">$299.88/year</div>
                  <div className="text-base font-medium text-zinc-100">Save $100 (33% off)</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">AI-Powered Deal Finder</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Dedicated Account Manager</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Premium Analytics Suite</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Exclusive Investor Network</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Advanced Security Features</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Early Access to New Features</span>
                </div>
                <div className="flex items-center">
                  <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                  <span className="text-lg text-zinc-100">Personalized Collection Strategy</span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-700">
                <Button className="w-full h-10 bg-yellow-400 hover:bg-yellow-500 text-lime-950 text-lg font-medium">
                  Start Free Trial
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-900 border-t border-zinc-700">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-zinc-100 text-center mb-12">What Our Collectors Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-zinc-900 rounded-full border border-gray-700 overflow-hidden">
                <img src="https://placehold.co/80x80" alt="Mark C." className="w-full h-full object-cover" />
              </div>
              
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-lg text-zinc-100 mb-6 leading-relaxed">
                "CollectorPRO transformed how I manage my inventory. The AI deal finder is a game-changer and has paid for itself tenfold!"
              </p>
              
              <div className="text-blue-500 text-base font-medium">Mark C.</div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-rose-200 rounded-full border border-red-400 overflow-hidden">
                <img src="https://placehold.co/80x80" alt="Sarah J." className="w-full h-full object-cover" />
              </div>
              
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-lg text-zinc-100 mb-6 leading-relaxed">
                "The detailed market insights are incredible. I can now make informed decisions and build my collection strategically. Highly recommend!"
              </p>
              
              <div className="text-blue-500 text-base font-medium">Sarah J.</div>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-teal-100 rounded-full border border-teal-400 overflow-hidden">
                <img src="https://placehold.co/80x80" alt="David R." className="w-full h-full object-cover" />
              </div>
              
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-lg text-zinc-100 mb-6 leading-relaxed">
                "Before CollectorPRO, managing my collection was a headache. Now, it's streamlined, secure, and I'm finding deals I never thought possible."
              </p>
              
              <div className="text-blue-500 text-base font-medium">David R.</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-zinc-100 text-center mb-12">Why CollectorPRO? Our Promises</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-base font-medium text-zinc-100">30-Day Guarantee</h3>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-base font-medium text-zinc-100">7-Day Free Trial</h3>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-base font-medium text-zinc-100">Proven ROI</h3>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-base font-medium text-zinc-100">5,000+ Collectors</h3>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-zinc-900 border-t border-zinc-700">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-zinc-100 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="border-b border-zinc-700 py-4 hover:bg-zinc-800 rounded cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-zinc-100">What is CollectorPRO and who is it for?</h3>
                  <ChevronDown className="w-4 h-4 text-zinc-100" />
                </div>
              </div>
              
              <div className="border-b border-zinc-700 py-4 hover:bg-zinc-800 rounded cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-zinc-100">How does the AI-Powered Deal Finder work?</h3>
                  <ChevronDown className="w-4 h-4 text-zinc-100" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="border-b border-zinc-700 py-4 hover:bg-zinc-800 rounded cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-zinc-100">Can I import my existing collection data?</h3>
                  <ChevronDown className="w-4 h-4 text-zinc-100" />
                </div>
              </div>
              
              <div className="border-b border-zinc-700 py-4 hover:bg-zinc-800 rounded cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg text-zinc-100">What kind of support can I expect?</h3>
                  <ChevronDown className="w-4 h-4 text-zinc-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 rounded-t-3xl py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Ready to level up your collection?</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="w-60 h-10 bg-yellow-400 hover:bg-yellow-500 text-lime-950 text-lg font-normal rounded-lg">
              Start Your Free Trial
            </Button>
            <Button variant="outline" className="w-48 h-10 bg-black hover:bg-gray-800 text-white border border-white rounded-lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-700 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-stone-400 text-xs">
            © 2023 CollectorPRO. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 text-stone-400 hover:text-white cursor-pointer">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="w-4 h-4 text-stone-400 hover:text-white cursor-pointer">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </div>
            <div className="w-4 h-4 text-stone-400 hover:text-white cursor-pointer">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PricingPage 