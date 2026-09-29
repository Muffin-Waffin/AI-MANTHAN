import * as React from 'react'
import { cva } from 'class-variance-authority'
import Icon from './Icon'
import { cn } from '@/lib/utils'

/**
 * Design-system button — pill shape, animated lift + glow on hover.
 * Variants: default (electric cyan), white, glass, ghost.
 * Renders an <a> when `href` is provided (`external` opens a new tab).
 */
const buttonVariants = cva(
  'group/btn inline-flex items-center justify-center gap-2 font-semibold rounded-full whitespace-nowrap cursor-pointer select-none transition-all duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        /* Primary Cyber (DESIGN.md): luminous cyan body + dark navy
           text + cyan glow. CTA token (--color-cta) stays decoupled
           from --color-brand-cyan so the two can be tuned apart. */
        default:
          'bg-cta text-[#06080d] shadow-[0_8px_24px_-6px_rgba(0,240,255,0.55)] hover:bg-cta-hover hover:shadow-[0_12px_34px_-6px_rgba(0,240,255,0.8)] hover:-translate-y-0.5',
        white:
          'bg-white text-zinc-950 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.35)] hover:bg-zinc-100 hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.55)] hover:-translate-y-0.5',
        glass:
          'glass text-white hover:border-brand-cyan/60 hover:shadow-[0_12px_34px_-10px_rgba(0,240,255,0.55)] hover:-translate-y-0.5',
        ghost: 'text-zinc-300 hover:text-white hover:bg-white/[0.06]',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export default function Button({
  variant = 'default',
  size = 'default',
  href,
  external = false,
  icon,
  className,
  children,
  ...props
}) {
  const classes = cn(buttonVariants({ variant, size }), className)
  const inner = (
    <>
      {children}
      {icon && (
        <Icon
          name={icon}
          className="text-[16px] transition-transform duration-300 group-hover/btn:translate-x-1"
        />
      )}
    </>
  )

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {inner}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {inner}
    </button>
  )
}

export { Button, buttonVariants }
