import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

export interface IconProps {
  icon?: LucideIcon
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'current'
}

export function Icon({ 
  icon: IconComponent, 
  name,
  size = 'md', 
  className,
  color = 'current'
}: IconProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }

  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-gray-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    current: 'text-current'
  }

  // Support both icon prop and name prop
  let Component = IconComponent
  if (name && !IconComponent) {
    const iconName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof typeof LucideIcons
    Component = LucideIcons[iconName] as LucideIcon
  }

  if (!Component) {
    console.warn(`Icon component not found for name: ${name}`)
    return null
  }

  return (
    <Component
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  )
} 