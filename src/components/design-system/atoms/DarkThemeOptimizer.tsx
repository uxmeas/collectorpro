'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface DarkThemeOptimizerProps {
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

// Dark theme optimized text component
export function DarkText({ 
  children, 
  variant = 'primary',
  className,
  'data-testid': dataTestId
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'inverse'
  className?: string
  'data-testid'?: string
}) {
  const textVariants = {
    primary: 'text-white dark:text-gray-100',
    secondary: 'text-gray-300 dark:text-gray-300',
    tertiary: 'text-gray-400 dark:text-gray-500',
    inverse: 'text-gray-900 dark:text-white'
  }

  return (
    <span 
      className={cn(
        'transition-colors duration-200',
        textVariants[variant],
        className
      )}
      data-testid={dataTestId}
      data-text-variant={variant}
    >
      {children}
    </span>
  )
}

// Dark theme optimized card component
export function DarkCard({ 
  children, 
  variant = 'default',
  className,
  'data-testid': dataTestId
}: {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'subtle'
  className?: string
  'data-testid'?: string
}) {
  const cardVariants = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-lg dark:shadow-gray-900/50',
    subtle: 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
  }

  return (
    <div 
      className={cn(
        'rounded-lg border transition-all duration-200',
        cardVariants[variant],
        className
      )}
      data-testid={dataTestId}
      data-card-variant={variant}
    >
      {children}
    </div>
  )
}

// Dark theme optimized image container
export function DarkImageContainer({ 
  children, 
  className,
  'data-testid': dataTestId
}: DarkThemeOptimizerProps) {
  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-lg',
        'border border-gray-200 dark:border-gray-600',
        'bg-gray-100 dark:bg-gray-800',
        'transition-all duration-200',
        className
      )}
      data-testid={dataTestId}
      data-image-container="true"
    >
      {children}
    </div>
  )
}

// Dark theme optimized button
export function DarkButton({ 
  children, 
  variant = 'primary',
  className,
  onClick,
  disabled = false,
  'data-testid': dataTestId
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  onClick?: () => void
  disabled?: boolean
  'data-testid'?: string
}) {
  const buttonVariants = {
    primary: 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }

  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'min-h-[44px] min-w-[44px]', // Touch target compliance
        buttonVariants[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      data-testid={dataTestId}
      data-button-variant={variant}
      data-touch-target="true"
    >
      {children}
    </button>
  )
}

// Dark theme contrast checker hook
export function useDarkThemeContrast() {
  const [contrastIssues, setContrastIssues] = useState<Array<{ element: Element; issue: string }>>([])

  const checkContrast = () => {
    if (typeof window === 'undefined') return

    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div')
    const issues: Array<{ element: Element; issue: string }> = []

    textElements.forEach((element) => {
      const style = window.getComputedStyle(element)
      const color = style.color
      const backgroundColor = style.backgroundColor

      // Simplified contrast check (in production, use a proper contrast calculation library)
      if (color && backgroundColor) {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark'
        
        if (isDarkTheme) {
          // Check for potential low contrast in dark theme
          if (color.includes('rgb(156, 163, 175)') && backgroundColor.includes('rgb(17, 24, 39)')) {
            issues.push({
              element,
              issue: 'Potential low contrast in dark theme'
            })
          }
        }
      }
    })

    setContrastIssues(issues)
  }

  useEffect(() => {
    checkContrast()
    
    // Re-check when theme changes
    const observer = new MutationObserver(checkContrast)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  return { contrastIssues, checkContrast }
}

// Dark theme provider for consistent theming
export function DarkThemeProvider({ 
  children 
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemPreference
    
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <div className="dark-theme-provider" data-current-theme={theme}>
      {children}
    </div>
  )
}

// Utility for dark theme class management
export function useDarkThemeClasses() {
  return {
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300',
      tertiary: 'text-gray-500 dark:text-gray-400',
      inverse: 'text-white dark:text-gray-900'
    },
    background: {
      primary: 'bg-white dark:bg-gray-900',
      secondary: 'bg-gray-50 dark:bg-gray-800',
      tertiary: 'bg-gray-100 dark:bg-gray-700'
    },
    border: {
      primary: 'border-gray-200 dark:border-gray-700',
      secondary: 'border-gray-300 dark:border-gray-600',
      accent: 'border-blue-500 dark:border-blue-400'
    }
  }
} 