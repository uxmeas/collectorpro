'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    question: "What is this platform?",
    answer: "Our Sports Collectibles Platform is a comprehensive analytics and management tool for digital sports collectibles across multiple blockchain platforms including NBA Top Shot, WNBA Top Shot, and other supported networks. We provide portfolio tracking, market analysis, and data visualization tools.",
    category: "General"
  },
  {
    question: "Which platforms do you support?",
    answer: "We currently support NBA Top Shot, WNBA Top Shot, and are expanding to other sports digital collectible platforms. Our multi-platform approach allows you to manage all your sports collectibles in one place.",
    category: "Platforms"
  },
  {
    question: "Is my wallet safe?",
    answer: "Yes, your wallet is completely safe. We use read-only access to display your collectible data for analytics purposes. We never store your private keys or have the ability to transfer your assets. All blockchain interactions are view-only.",
    category: "Security"
  },
  {
    question: "How do I connect my wallet?",
    answer: "You can connect your wallet through our secure integration process. We support popular wallet providers and use industry-standard authentication methods. The connection is read-only and only used to display your portfolio data.",
    category: "Getting Started"
  },
  {
    question: "What data do you collect?",
    answer: "We collect public blockchain data related to your digital collectibles, including ownership information, transaction history, and market data. We also collect basic account information you provide. We never access private keys or personal financial information.",
    category: "Privacy"
  },
  {
    question: "How accurate is the market data?",
    answer: "We aggregate market data from multiple sources to provide comprehensive pricing information. However, digital collectibles are subject to market volatility, and prices can change rapidly. We recommend using our data as one of many tools for decision-making.",
    category: "Data"
  },
  {
    question: "Do you offer portfolio analytics?",
    answer: "Yes! We provide comprehensive portfolio analytics including value tracking, performance metrics, rarity breakdowns, and market insights. Our analytics help you understand your collection's performance and market trends.",
    category: "Features"
  },
  {
    question: "Is there a mobile app?",
    answer: "Our platform is fully responsive and works great on mobile devices. You can access all features through your mobile browser. We're also developing dedicated mobile apps for enhanced experience.",
    category: "Mobile"
  },
  {
    question: "How much does it cost?",
    answer: "We offer both free and premium subscription tiers. The free tier includes basic portfolio tracking and market data. Premium features include advanced analytics, real-time alerts, and priority support. Check our pricing page for detailed information.",
    category: "Pricing"
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export your portfolio data in various formats including CSV and JSON. This includes your collectible holdings, transaction history, and analytics data for your personal records or use in other tools.",
    category: "Features"
  },
  {
    question: "What if I have technical issues?",
    answer: "We provide comprehensive customer support through multiple channels. Premium subscribers get priority support. You can also check our help documentation or community forums for common solutions.",
    category: "Support"
  },
  {
    question: "Do you support multiple wallets?",
    answer: "Yes, you can connect multiple wallets to your account. This allows you to track all your digital collectibles across different wallets and platforms in one unified dashboard.",
    category: "Features"
  },
  {
    question: "How often is data updated?",
    answer: "Market data is updated in real-time, while portfolio data is refreshed when you connect your wallet or manually refresh. Transaction data typically updates within minutes of blockchain confirmation.",
    category: "Data"
  },
  {
    question: "Can I set up alerts?",
    answer: "Premium subscribers can set up custom alerts for price changes, new listings, and market events. You can configure alerts via email or push notifications based on your preferences.",
    category: "Features"
  },
  {
    question: "Is my data shared with third parties?",
    answer: "We do not sell or share your personal data with third parties. We may share aggregated, anonymized data for research purposes. Any data sharing is clearly disclosed in our Privacy Policy.",
    category: "Privacy"
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))]

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQ = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sports Collectibles Platform
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Category Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {item.question}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {item.category}
                    </Text>
                  </div>
                  {openItems.has(index) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openItems.has(index) && (
                  <div className="px-6 pb-4">
                    <Text className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </Text>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-8">
          <CardContent className="text-center py-8">
            <Heading level={2} className="text-2xl font-semibold mb-4">
              Still Have Questions?
            </Heading>
            <Text className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                Contact Support
              </Button>
              <Button>
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 