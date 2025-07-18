'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  className?: string
  text?: string
  showText?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const variantClasses = {
  default: 'text-gray-400',
  primary: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500'
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className,
  text,
  showText = false
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative">
        {/* NBA TopShot themed spinner */}
        <div className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          variantClasses[variant]
        )}>
          <span className="sr-only">Loading...</span>
        </div>
        
        {/* Optional inner dot for basketball effect */}
        {size === 'lg' || size === 'xl' ? (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            variantClasses[variant]
          )}>
            <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
          </div>
        ) : null}
      </div>
      
      {showText && text && (
        <p className="mt-2 text-sm text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// Full page loading component
export function FullPageLoader({ 
  text = 'Loading NBA TopShot data...',
  variant = 'primary'
}: { text?: string; variant?: LoadingSpinnerProps['variant'] }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner 
          size="xl" 
          variant={variant}
          text={text}
          showText={true}
        />
        <div className="mt-4 text-xs text-gray-500">
          CollectorPRO v10.1
        </div>
      </div>
    </div>
  )
}

// Skeleton loading component
export function SkeletonLoader({ 
  className,
  lines = 1,
  height = 'h-4'
}: { 
  className?: string
  lines?: number
  height?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-700 rounded animate-pulse',
            height
          )}
        />
      ))}
    </div>
  )
}

// Table row skeleton
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-800">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-700 rounded animate-pulse',
            i === 0 ? 'w-32 h-12' : 'w-20 h-4'
          )}
        />
      ))}
    </div>
  )
}

// Card skeleton
export function CardSkeleton({ 
  className,
  showImage = true,
  showTitle = true,
  showContent = true
}: {
  className?: string
  showImage?: boolean
  showTitle?: boolean
  showContent?: boolean
}) {
  return (
    <div className={cn('bg-gray-800 rounded-lg p-4', className)}>
      {showImage && (
        <div className="w-full h-32 bg-gray-700 rounded-lg animate-pulse mb-4" />
      )}
      {showTitle && (
        <div className="w-3/4 h-6 bg-gray-700 rounded animate-pulse mb-2" />
      )}
      {showContent && (
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
          <div className="w-2/3 h-4 bg-gray-700 rounded animate-pulse" />
        </div>
      )}
    </div>
  )
} 