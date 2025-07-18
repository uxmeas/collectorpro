'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/design-system/atoms/LoadingSpinner'

export default function BillingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to subscription page after a brief delay
    const timer = setTimeout(() => {
      router.push('/subscription')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Billing & Subscription
          </CardTitle>
          <CardDescription className="text-gray-600">
            Managing your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <LoadingSpinner size="sm" />
            <span>Redirecting to subscription management...</span>
          </div>
          <Button 
            onClick={() => router.push('/subscription')}
            className="w-full"
          >
            Go to Subscription
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 