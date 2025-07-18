import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  "flex w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        search: "pl-10",
        filter: "bg-[var(--bg-secondary)]"
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-10",
        lg: "h-12 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, leftIcon, rightIcon, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant, size }),
              error && "border-[var(--error-500)] focus:ring-[var(--error-500)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && (
          <p className={cn(
            "mt-1 text-xs",
            error ? "text-[var(--error-500)]" : "text-[var(--text-tertiary)]"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

// Search Input Component
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'variant'> {
  onClear?: () => void
  showClear?: boolean
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClear, value, ...props }, ref) => {
    const hasValue = value && value.toString().length > 0

    return (
      <Input
        ref={ref}
        variant="search"
        value={value}
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        }
        rightIcon={
          showClear && hasValue ? (
            <button
              type="button"
              onClick={onClear}
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          ) : null
        }
        {...props}
      />
    )
  }
)

SearchInput.displayName = "SearchInput"

export { Input, SearchInput } 