import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * NeonTimeCell — countdown.png ke exact jaisa glowing tile.
 * Dark glass tile, hair-thin cyan→cyan→cyan neon ring (mask composite),
 * soft outer bloom, glossy top-left highlight, floor reflection,
 * extrabold glowing digits + spaced uppercase label.
 *
 * Per-tile glow shift via --tile-glow (days → seconds, cyan family).
 */

const neonTileVariants = cva(
  'relative flex flex-col items-center justify-center select-none',
  {
    variants: {
      tone: {
        cyan: '[--tw-glow:56,189,248]',
        azure: '[--tw-glow:0,168,255]',
        glow: '[--tw-glow:0,240,255]',
        ice: '[--tw-glow:103,232,249]',
      },
      size: {
        default: 'rounded-2xl sm:rounded-[24px]',
        sm: 'rounded-xl sm:rounded-2xl',
      },
    },
    defaultVariants: {
      tone: 'glow',
      size: 'default',
    },
  }
)

function NeonTimeCell({ className, tone, size, value, label, style, ...props }) {
  const glow = {
    cyan: 'rgba(56,189,248,0.6)',
    azure: 'rgba(0,168,255,0.65)',
    glow: 'rgba(0,240,255,0.65)',
    ice: 'rgba(165,243,252,0.7)',
  }[tone] || 'rgba(0,240,255,0.65)'

  return (
    <div
      className={cn(neonTileVariants({ tone, size }), 'neon-tile', className)}
      style={{ '--tile-glow': glow, ...style }}
      {...props}
    >
      {/* glossy top-left highlight */}
      <span
        aria-hidden="true"
        className="absolute top-[5%] left-[10%] right-[36%] h-[28%] rounded-full bg-white/[0.10] blur-[7px] pointer-events-none"
      />
      {/* floor reflection beneath the tile */}
      <span
        aria-hidden="true"
        className="absolute -bottom-3 left-[12%] right-[12%] h-3 rounded-[50%] opacity-75 blur-[7px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${glow}, transparent 72%)`,
        }}
      />
      {/* digits */}
      <div className="neon-digit relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none font-extrabold font-mono tracking-tight tabular-nums">
        {value}
      </div>
      {/* label */}
      <div className="relative mt-3 sm:mt-4 text-[9px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.3em] text-zinc-300/90">
        {label}
      </div>
    </div>
  )
}

/* Neon colon separator — two glowing dots stacked (countdown.png jaisa) */
function NeonColon({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex flex-col items-center justify-center gap-2.5 self-center',
        className
      )}
      {...props}
    >
      {[0, 1].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(103,232,249,0.85)]"
        />
      ))}
    </div>
  )
}

/* Full countdown row — 4 tiles + 3 colons */
function NeonCountdown({ className, cells = [], ...props }) {
  return (
    <div
      className={cn(
        'flex items-stretch justify-center gap-2 sm:gap-3.5 w-full',
        className
      )}
      {...props}
    >
      {cells.map((cell, i) => (
        <React.Fragment key={cell.label}>
          {i > 0 && <NeonColon />}
          <NeonTimeCell
            value={cell.value}
            label={cell.label}
            tone={cell.tone}
            className="flex-1 max-w-[170px] sm:max-w-[230px] aspect-square"
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export { NeonTimeCell, NeonColon, NeonCountdown, neonTileVariants }
