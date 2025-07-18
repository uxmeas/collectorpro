'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TouchTargetProps {
  children: React.ReactNode
  minSize?: number
  className?: string
  onClick?: () => void
  disabled?: boolean
  'data-testid'?: string
}

/**
 * TouchTarget component ensures minimum 44px touch target size for mobile accessibility
 * Wraps any interactive element to meet WCAG guidelines
 */
export function TouchTarget({ 
  children, 
  minSize = 44,
  className,
  onClick,
  disabled = false,
  'data-testid': dataTestId
}: TouchTargetProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'active:scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer hover:scale-105',
        className
      )}
      style={{
        minWidth: `${minSize}px`,
        minHeight: `${minSize}px`
      }}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      data-testid={dataTestId}
      data-touch-target="true"
      data-min-size={minSize}
    >
      {children}
    </div>
  )
}

// Specialized touch target for CTAs
export function CTATouchTarget({ 
  children, 
  className,
  onClick,
  disabled = false,
  'data-testid': dataTestId
}: Omit<TouchTargetProps, 'minSize'>) {
  return (
    <TouchTarget
      minSize={48} // Recommended 48px for CTAs
      className={cn(
        'bg-gradient-to-r from-orange-500 to-orange-600',
        'hover:from-orange-600 hover:to-orange-700',
        'text-white font-semibold rounded-lg',
        'shadow-lg hover:shadow-xl',
        'border-0',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </TouchTarget>
  )
}

// Touch target for navigation items
export function NavTouchTarget({ 
  children, 
  className,
  onClick,
  disabled = false,
  'data-testid': dataTestId
}: Omit<TouchTargetProps, 'minSize'>) {
  return (
    <TouchTarget
      minSize={44}
      className={cn(
        'text-gray-300 hover:text-white',
        'transition-colors duration-200',
        'rounded-md',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </TouchTarget>
  )
}

// Touch target for form elements
export function FormTouchTarget({ 
  children, 
  className,
  onClick,
  disabled = false,
  'data-testid': dataTestId
}: Omit<TouchTargetProps, 'minSize'>) {
  return (
    <TouchTarget
      minSize={44}
      className={cn(
        'border border-gray-600',
        'hover:border-gray-500',
        'focus:border-blue-500',
        'bg-gray-800',
        'rounded-md',
        'transition-colors duration-200',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </TouchTarget>
  )
}

// Utility hook for touch target validation
export function useTouchTargetValidation() {
  const validateTouchTargets = () => {
    if (typeof window === 'undefined') return { valid: true, issues: [] }
    
    const touchElements = document.querySelectorAll('[data-touch-target="true"]')
    const issues: Array<{ element: Element; issue: string }> = []
    
    touchElements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const minSize = parseInt(element.getAttribute('data-min-size') || '44')
      
      if (rect.width < minSize || rect.height < minSize) {
        issues.push({
          element,
          issue: `Touch target too small: ${rect.width}x${rect.height}px (minimum: ${minSize}x${minSize}px)`
        })
      }
    })
    
    return {
      valid: issues.length === 0,
      issues,
      totalElements: touchElements.length
    }
  }
  
  return { validateTouchTargets }
} 