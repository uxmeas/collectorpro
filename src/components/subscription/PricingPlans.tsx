'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface PricingPlan {
  id: string
  name: string
  price: number
  annualPrice: number
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    annualPrice: 0,
    description: 'Perfect for getting started with NBA Top Shot',
    features: [
      'Basic market overview',
      'Recent transactions (last 24h)',
      'Up to 5 moment watchlist',
      'Email alerts',
      'Community support'
    ],
    cta: 'Get Started Free'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    annualPrice: 99,
    description: 'Advanced analytics for serious collectors',
    features: [
      'Everything in Free',
      'Advanced portfolio analytics',
      'Historical price data (1 year)',
      'Unlimited watchlist',
      'Real-time alerts',
      'Rarity insights',
      'Market trend analysis',
      'Priority support'
    ],
    popular: true,
    cta: 'Start 7-Day Free Trial'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 24,
    annualPrice: 199,
    description: 'Professional tools for traders and investors',
    features: [
      'Everything in Pro',
      'Advanced trading signals',
      'Portfolio optimization',
      'API access (1000 calls/month)',
      'Custom alerts & webhooks',
      'Advanced market research',
      'Detailed transaction history',
      'White-glove onboarding',
      'Dedicated support'
    ],
    cta: 'Go Premium'
  }
]

export function PricingPlans() {
  const [isAnnual, setIsAnnual] = useState(true)

  const getPrice = (plan: PricingPlan) => {
    if (plan.price === 0) return '$0'
    return isAnnual ? `$${plan.annualPrice}` : `$${plan.price}`
  }

  const getPeriod = (plan: PricingPlan) => {
    if (plan.price === 0) return 'forever'
    return isAnnual ? '/year' : '/month'
  }

  const getSavings = (plan: PricingPlan) => {
    if (plan.price === 0) return null
    const monthlyCost = plan.price * 12
    const savings = monthlyCost - plan.annualPrice
    const percentage = Math.round((savings / monthlyCost) * 100)
    return { amount: savings, percentage }
  }

  return (
    <div className="bg-[#0a0a0a] text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your NBA Top Shot Analytics Plan
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Professional tools for serious NBA Top Shot collectors and traders
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 px-2 py-1 text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-md">
                Save up to 30%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const savings = getSavings(plan)
            
            return (
              <Card
                key={plan.id}
                className={`relative p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50'
                    : 'bg-[#1a1a1a] border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{getPrice(plan)}</span>
                    <span className="text-gray-400 ml-1">{getPeriod(plan)}</span>
                  </div>

                  {savings && isAnnual && (
                    <div className="text-sm text-green-400 mb-4">
                      Save ${savings.amount}/year ({savings.percentage}% off)
                    </div>
                  )}

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Everything included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <svg
                            className="w-3 h-3 text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-white mb-2">
                How does the free trial work?
              </h4>
              <p className="text-gray-400 text-sm">
                Start with a 7-day free trial of Pro features. No credit card required. 
                Cancel anytime during the trial period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-gray-400 text-sm">
                Yes! Upgrade or downgrade your plan at any time. Changes take effect 
                immediately with prorated billing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-400 text-sm">
                We accept all major credit cards, PayPal, and cryptocurrency payments 
                for annual subscriptions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                Is there a refund policy?
              </h4>
              <p className="text-gray-400 text-sm">
                30-day money-back guarantee for annual plans. Monthly plans can be 
                canceled anytime with no penalty.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Need Enterprise Features?
          </h3>
          <p className="text-gray-300 mb-6">
            Custom integrations, dedicated support, and unlimited API access for teams and institutions.
          </p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  )
} 