import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '~/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-primary px-5 py-3 text-primary-foreground shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:brightness-105',
        secondary:
          'bg-secondary px-5 py-3 text-secondary-foreground shadow-lg shadow-secondary/15 hover:-translate-y-0.5 hover:bg-secondary/90',
        ghost:
          'px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-11',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
