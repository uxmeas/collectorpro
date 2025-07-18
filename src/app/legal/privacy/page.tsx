'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Heading } from '@/components/design-system/atoms/Heading'
import { Text } from '@/components/design-system/atoms/Text'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Privacy Policy
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
              1. Information We Collect
            </Heading>
            <Text className="mb-4">
              We collect information you provide directly to us, such as when you create an account, connect your wallet, or use our services. This may include:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Account information (email, username, profile details)</li>
              <li>Wallet addresses and blockchain transaction data</li>
              <li>Digital collectible holdings and portfolio information</li>
              <li>Usage data and analytics preferences</li>
              <li>Communication preferences and support requests</li>
            </ul>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              2. How We Use Your Information
            </Heading>
            <Text className="mb-4">
              We use the information we collect to:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Analyze your portfolio and provide insights</li>
              <li>Track market data and trends</li>
              <li>Improve our platform and user experience</li>
              <li>Send important updates and notifications</li>
              <li>Provide customer support</li>
            </ul>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              3. Multi-Platform Data Integration
            </Heading>
            <Text className="mb-4">
              Our platform integrates with multiple blockchain networks and digital collectible platforms. When you connect your wallets or accounts, we may access:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Public blockchain transaction data</li>
              <li>Digital collectible ownership information</li>
              <li>Market activity and pricing data</li>
              <li>Platform-specific metadata and attributes</li>
            </ul>
            <Text className="mb-4">
              We do not store private keys or have the ability to transfer your assets. All blockchain interactions are read-only for analytical purposes.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              4. Data Sharing and Disclosure
            </Heading>
            <Text className="mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in platform operations</li>
              <li>For aggregated, anonymized analytics and research</li>
            </ul>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              5. Data Security
            </Heading>
            <Text className="mb-4">
              We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. This includes:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Secure hosting and infrastructure</li>
            </ul>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              6. Data Retention
            </Heading>
            <Text className="mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time, subject to our legal retention requirements.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              7. Your Rights and Choices
            </Heading>
            <Text className="mb-4">
              You have the right to:
            </Text>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access and review your personal information</li>
              <li>Update or correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Control your privacy settings and preferences</li>
            </ul>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              8. Cookies and Tracking Technologies
            </Heading>
            <Text className="mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              9. Third-Party Services
            </Heading>
            <Text className="mb-4">
              Our platform may integrate with third-party services for analytics, payment processing, and blockchain data. These services have their own privacy policies, and we encourage you to review them.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              10. International Data Transfers
            </Heading>
            <Text className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              11. Children's Privacy
            </Heading>
            <Text className="mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              12. Changes to This Policy
            </Heading>
            <Text className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date.
            </Text>

            <Heading level={2} className="text-2xl font-semibold mb-4 mt-8">
              13. Contact Us
            </Heading>
            <Text className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us through the platform or at our designated support channels.
            </Text>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 