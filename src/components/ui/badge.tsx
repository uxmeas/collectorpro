import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

export function Badge({ 
  className, 
  variant = 'default', 
  size = 'default',
  ...props 
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variants = {
    default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
    secondary: "border-transparent bg-gray-500/20 text-gray-300 hover:bg-gray-500/30",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "border-gray-700 text-gray-300 hover:bg-gray-800"
  }

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    default: "text-xs px-2.5 py-0.5", 
    lg: "text-sm px-3 py-1"
  }

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
} 