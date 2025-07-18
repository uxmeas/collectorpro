import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--primary-blue)] hover:bg-[var(--primary-blue-hover)] text-white shadow-sm focus-visible:ring-[var(--primary-blue)]",
        secondary: "bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] shadow-sm",
        outline: "border-2 border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[var(--primary-blue)] hover:text-white",
        ghost: "text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
        success: "bg-[var(--success-500)] hover:bg-[var(--success-600)] text-white shadow-sm",
        destructive: "bg-[var(--error-500)] hover:bg-[var(--error-600)] text-white shadow-sm",
        link: "text-[var(--text-link)] underline-offset-4 hover:underline hover:text-[var(--text-link-hover)]"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-11 px-8 text-base",
        xl: "h-12 px-10 text-lg",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    asChild = false,
    ...props 
  }, ref) => {
    const buttonClasses = cn(buttonVariants({ variant, size, className }))

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        className: cn(buttonClasses, children.props.className),
        ref,
      } as any)
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        )}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = "Button"

export { buttonVariants } 