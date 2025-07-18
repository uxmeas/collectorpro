import React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '../atoms'
import { Icon } from '../atoms/Icon'
import { cn } from '@/lib/utils'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className,
  size = 'default',
  disabled = false
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleClear = () => {
    onChange('')
    onClear?.()
  }

  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <Icon icon={Search} size={size === 'sm' ? 'xs' : 'sm'} color="secondary" />
      </div>
      
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        className={cn(
          'pl-10',
          value && onClear && 'pr-10'
        )}
      />

      {value && onClear && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-white transition-colors"
          disabled={disabled}
        >
          <Icon icon={X} size={size === 'sm' ? 'xs' : 'sm'} color="secondary" />
        </button>
      )}
    </div>
  )
} 