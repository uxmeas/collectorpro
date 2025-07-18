import React, { useState, useEffect } from 'react'
import { featureFlags, FeatureFlags } from '@/lib/feature-flags'

// React hook for feature flags
export function useFeatureFlag(flagKey: keyof FeatureFlags, userId?: string) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [variant, setVariant] = useState<string | null>(null)

  useEffect(() => {
    setIsEnabled(featureFlags.isEnabled(flagKey, userId))
    setVariant(featureFlags.getVariant(flagKey, userId))
  }, [flagKey, userId])

  return { isEnabled, variant }
}

// Higher-order component for feature flags
export function withFeatureFlag<T extends object>(
  flagKey: keyof FeatureFlags,
  Component: React.ComponentType<T>,
  FallbackComponent?: React.ComponentType<T>
) {
  return function FeatureFlaggedComponent(props: T & { userId?: string }) {
    const { userId, ...componentProps } = props
    const { isEnabled } = useFeatureFlag(flagKey, userId)

    if (!isEnabled) {
      return FallbackComponent ? <FallbackComponent {...(componentProps as T)} /> : null
    }

    return <Component {...(componentProps as T)} />
  }
} 