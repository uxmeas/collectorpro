import React from 'react'
import { cn } from '@/lib/utils'

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

export function Heading({ 
  level, 
  children, 
  className,
  variant = 'primary',
  size 
}: HeadingProps) {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements

  const defaultSizes = {
    1: 'text-4xl md:text-6xl',
    2: 'text-3xl md:text-5xl',
    3: 'text-2xl md:text-4xl',
    4: 'text-xl md:text-2xl',
    5: 'text-lg md:text-xl',
    6: 'text-base md:text-lg'
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  }

  const variantClasses = {
    primary: 'text-white font-bold',
    secondary: 'text-gray-300 font-semibold',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold'
  }

  return React.createElement(
    Component,
    {
      className: cn(
        'tracking-tight',
        size ? sizeClasses[size] : defaultSizes[level],
        variantClasses[variant],
        className
      )
    },
    children
  )
} 