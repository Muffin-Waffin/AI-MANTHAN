import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * NeonCountdown — responsive countdown tiles
 *  Mobile  (< sm): 2 × 2 grid — Days/Hours top row, Minutes/Seconds bottom row
 *  Desktop (≥ sm): single row with colon separators
 */

function NeonTimeCell({ className, value, label, ...props }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center select-none rounded-xl bg-[#0b1322]/90 border border-white/12 backdrop-blur-xl shadow-lg transition-all duration-200 hover:border-cyan-400/50 p-2.5 sm:p-3.5 md:p-4',
        className
      )}
      {...props}
    >
      {/* Top subtle cyan accent bar */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-all duration-300 group-hover:w-16 group-hover:via-cyan-400"
      />

      {/* Pure WHITE Digits */}
      <div
        suppressHydrationWarning
        className="relative text-2xl sm:text-4xl md:text-5xl leading-none font-extrabold font-mono tracking-tight tabular-nums text-white"
      >
        {value}
      </div>

      {/* Label */}
      <div className="relative mt-1 sm:mt-2 text-[8px] sm:text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
        {label}
      </div>
    </div>
  )
}

/* Colon separator — hidden on mobile */
function NeonColon({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'hidden sm:flex flex-col items-center justify-center gap-1.5 sm:gap-2 self-center px-1 sm:px-1.5',
        className
      )}
      {...props}
    >
      {[0, 1].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400/80"
        />
      ))}
    </div>
  )
}

/* Full Countdown Container */
function NeonCountdown({ className, cells = [], ...props }) {
  return (
    <>
      {/* ── Mobile: 2×2 grid ── */}
      <div
        className={cn(
          'sm:hidden grid grid-cols-2 gap-2.5 w-full max-w-[240px] mx-auto',
          className
        )}
        {...props}
      >
        {cells.map((cell) => (
          <NeonTimeCell
            key={cell.label}
            value={cell.value}
            label={cell.label}
            className="aspect-square"
          />
        ))}
      </div>

      {/* ── Desktop: single row with colons ── */}
      <div
        className={cn(
          'hidden sm:flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 w-full',
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
              className="flex-1 max-w-[85px] sm:max-w-[105px] md:max-w-[125px] aspect-square"
            />
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export { NeonTimeCell, NeonColon, NeonCountdown }
