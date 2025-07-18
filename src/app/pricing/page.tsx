'use client'

import React, { useState, useEffect } from 'react'
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
  ChevronDown,
  CreditCard,
  Zap,
  Crown,
  ArrowRight
} from 'lucide-react'
import { SUBSCRIPTION_PLANS, formatPrice, TRIAL_CONFIG } from '@/lib/stripe'

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Handle checkout for a specific plan
  const handleCheckout = async (planId: string) => {
    setLoading(planId)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          trialDays: TRIAL_CONFIG.enabled ? TRIAL_CONFIG.duration : undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }

    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setLoading(null)
    }
  }

  // Handle trial activation
  const handleTrial = async (planId: string) => {
    setLoading(`trial-${planId}`)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          trialDays: TRIAL_CONFIG.duration
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start trial')
      }

      // Redirect to Stripe checkout for trial
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No trial URL received')
      }

    } catch (err) {
      console.error('Trial error:', err)
      setError(err instanceof Error ? err.message : 'Trial activation failed')
    } finally {
      setLoading(null)
    }
  }

  // Calculate pricing based on billing cycle
  const getPlanPrice = (plan: any) => {
    if (billingCycle === 'annual') {
      return {
        price: plan.price * 12 * 0.75, // 25% discount for annual
        originalPrice: plan.price * 12,
        savings: plan.price * 12 * 0.25
      }
    }
    return {
      price: plan.price,
      originalPrice: plan.price,
      savings: 0
    }
  }

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
            {billingCycle === 'annual' && (
              <span className="text-zinc-100 text-base font-medium bg-blue-500 px-3 py-1 rounded-full">
                Save 25%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Error/Success Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-6 mt-6">
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 text-green-200">
            {success}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Starter Plan */}
            <Card className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow">
              <div className="border-b border-zinc-700 pb-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-3xl font-bold text-zinc-100">Starter</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-zinc-100 mb-2">
                    {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.STARTER).price)}
                    <span className="text-lg text-stone-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-lg text-stone-400 line-through mb-2">
                      {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.STARTER).originalPrice)}/year
                    </div>
                  )}
                  {billingCycle === 'annual' && (
                    <div className="text-base font-medium text-zinc-100">
                      Save {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.STARTER).savings)}/year
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {SUBSCRIPTION_PLANS.STARTER.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                    <span className="text-lg text-zinc-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-700">
                <Button 
                  className="w-full h-12 bg-gray-800 hover:bg-gray-700 text-white text-lg"
                  data-testid="checkout-starter"
                  data-plan="starter"
                  onClick={() => handleCheckout('starter')}
                  disabled={loading === 'starter'}
                >
                  {loading === 'starter' ? 'Processing...' : 'Get Started'}
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
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-yellow-400 mr-3" />
                  <h3 className="text-3xl font-bold text-zinc-100">Pro</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-zinc-100 mb-2">
                    {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.PRO).price)}
                    <span className="text-lg text-stone-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-lg text-stone-400 line-through mb-2">
                      {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.PRO).originalPrice)}/year
                    </div>
                  )}
                  {billingCycle === 'annual' && (
                    <div className="text-base font-medium text-zinc-100">
                      Save {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.PRO).savings)}/year
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {SUBSCRIPTION_PLANS.PRO.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                    <span className="text-lg text-zinc-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-700 space-y-3">
                <Button 
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-lg"
                  data-testid="checkout-pro"
                  data-plan="pro"
                  onClick={() => handleCheckout('pro')}
                  disabled={loading === 'pro'}
                >
                  {loading === 'pro' ? 'Processing...' : 'Start Free Trial'}
                </Button>
                <div className="text-center text-sm text-stone-400">
                  {TRIAL_CONFIG.duration}-day free trial • No credit card required
                </div>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow">
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-white text-xs font-medium px-3 py-1 rounded-full border border-white">
                  Best Value
                </span>
              </div>

              <div className="border-b border-zinc-700 pb-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-3xl font-bold text-zinc-100">Enterprise</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-zinc-100 mb-2">
                    {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.ENTERPRISE).price)}
                    <span className="text-lg text-stone-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-lg text-stone-400 line-through mb-2">
                      {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.ENTERPRISE).originalPrice)}/year
                    </div>
                  )}
                  {billingCycle === 'annual' && (
                    <div className="text-base font-medium text-zinc-100">
                      Save {formatPrice(getPlanPrice(SUBSCRIPTION_PLANS.ENTERPRISE).savings)}/year
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {SUBSCRIPTION_PLANS.ENTERPRISE.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-6 h-6 text-zinc-100 mr-4 flex-shrink-0" />
                    <span className="text-lg text-zinc-100">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-700">
                <Button 
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white text-lg"
                  data-testid="checkout-enterprise"
                  data-plan="enterprise"
                  onClick={() => handleCheckout('enterprise')}
                  disabled={loading === 'enterprise'}
                >
                  {loading === 'enterprise' ? 'Processing...' : 'Contact Sales'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-zinc-900 border-t border-zinc-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">
              Trusted by thousands of collectors
            </h2>
            <p className="text-lg text-stone-400">
              Join the community of serious NBA Top Shot collectors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">Secure Payments</h3>
              <p className="text-stone-400">Bank-level security with Stripe</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">7-Day Trial</h3>
              <p className="text-stone-400">Try before you buy, no commitment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">24/7 Support</h3>
              <p className="text-stone-400">Expert help when you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-zinc-100 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-stone-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                What happens after my trial ends?
              </h3>
              <p className="text-stone-400">
                After your 7-day trial, your subscription will automatically start. You can cancel anytime before the trial ends to avoid charges.
              </p>
            </div>
            
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-stone-400">
                Yes, you can change your plan at any time. Upgrades take effect immediately, downgrades take effect at the next billing cycle.
              </p>
            </div>
            
            <div className="bg-zinc-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-stone-400">
                Absolutely. We use Stripe for all payments, which is PCI DSS compliant and trusted by millions of businesses worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage 