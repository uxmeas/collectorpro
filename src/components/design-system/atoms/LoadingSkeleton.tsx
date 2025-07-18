import React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
}

export function LoadingSkeleton({ 
  width,
  height,
  className,
  variant = 'rectangular'
}: LoadingSkeletonProps) {
  const variantClasses = {
    text: 'h-4',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-700/50',
        variantClasses[variant],
        className
      )}
      style={style}
      role="status"
      aria-label="Loading content"
    />
  )
} 