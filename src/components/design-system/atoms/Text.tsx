import React from 'react'
import { cn } from '@/lib/utils'

export interface TextProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  as?: 'p' | 'span' | 'div'
}

export function Text({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  weight = 'normal',
  as: Component = 'p'
}: TextProps) {
  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return (
    <Component
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
    >
      {children}
    </Component>
  )
} 