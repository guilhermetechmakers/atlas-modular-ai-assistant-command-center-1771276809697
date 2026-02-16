import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] min-h-[40px] min-w-[40px] px-4 py-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-glow hover:scale-[1.02]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-glow-cyan hover:scale-[1.02]',
        outline:
          'border border-outline bg-transparent hover:bg-muted hover:border-primary/50 hover:scale-[1.02]',
        ghost: 'hover:bg-muted hover:scale-[1.02]',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, asChild, children, disabled, ...props }, ref) => {
    const computedClassName = cn(buttonVariants({ variant, size, className }))
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string; ref?: React.Ref<unknown> }>, {
        className: cn(computedClassName, (children as React.ReactElement<{ className?: string }>).props?.className),
        ref,
      })
    }
    return (
      <button
        ref={ref}
        className={computedClassName}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
