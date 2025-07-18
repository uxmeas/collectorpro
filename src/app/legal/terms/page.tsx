'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Terms of Service
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sports Collectibles Platform
            </CardDescription>
            <Text className="text-sm text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardContent className="prose prose-lg max-w-none">
            <Heading level={2} className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </Heading>
            <Text className="mb-4">
              By accessing and using this Sports Collectibles Platform ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              2. Description of Service
            </Heading>
            <Text className="mb-4">
              This Platform provides analytics, tracking, and management tools for sports digital collectibles across multiple platforms including NBA Top Shot, WNBA Top Shot, and other supported blockchain-based collectible platforms. Our services include portfolio tracking, market analysis, transaction monitoring, and data visualization.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              3. User Accounts and Registration
            </Heading>
            <Text className="mb-4">
              To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              4. Multi-Platform Integration
            </Heading>
            <Text className="mb-4">
              Our Platform integrates with multiple blockchain platforms and digital collectible services. By connecting your wallets or accounts, you authorize us to access and display your collectible data for analytical purposes. We do not store your private keys or have the ability to transfer your assets.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              5. Data and Privacy
            </Heading>
            <Text className="mb-4">
              We collect and process data as described in our Privacy Policy. By using the Platform, you consent to such processing and warrant that all data provided is accurate. We implement appropriate security measures to protect your information.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              6. Intellectual Property
            </Heading>
            <Text className="mb-4">
              The Platform and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              7. User Conduct
            </Heading>
            <Text className="mb-4">
              You agree not to use the Platform to:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Platform</li>
            </ul>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              8. Disclaimers and Limitations
            </Heading>
            <Text className="mb-4">
              The Platform is provided "as is" without warranties of any kind. We are not responsible for the accuracy of market data, pricing information, or any investment decisions made based on our analytics. Digital collectibles are subject to market volatility and risk.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              9. Subscription and Payment Terms
            </Heading>
            <Text className="mb-4">
              Premium features require a subscription. All payments are processed securely through our payment partners. Subscriptions automatically renew unless cancelled. Refunds are subject to our refund policy.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              10. Termination
            </Heading>
            <Text className="mb-4">
              We may terminate or suspend your account and access to the Platform at any time, with or without cause, with or without notice. Upon termination, your right to use the Platform will cease immediately.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              11. Governing Law
            </Heading>
            <Text className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              12. Changes to Terms
            </Heading>
            <Text className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Platform. Continued use of the Platform after changes constitutes acceptance of the new terms.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              13. Contact Information
            </Heading>
            <Text className="mb-4">
              If you have any questions about these Terms of Service, please contact us through the Platform or at our designated support channels.
            </Text>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 