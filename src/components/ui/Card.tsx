import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const cardVariants = cva(
  "bg-[var(--bg-card)] border border-[var(--border-primary)] transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-sm hover:shadow-md",
        elevated: "shadow-md hover:shadow-lg",
        interactive: "shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        flat: "shadow-none"
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
        xl: "p-8"
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default"
    }
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, rounded, asChild, ...props }, ref) => {
    const Comp = asChild ? "span" : "div"
    
    return (
      <Comp
        ref={ref}
        className={cn(cardVariants({ variant, size, rounded, className }))}
        {...props}
      />
    )
  }
)

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-3", className)}
    {...props}
  />
))

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-[var(--text-primary)]", className)}
    {...props}
  />
))

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
))

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-3", className)}
    {...props}
  />
))

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} 