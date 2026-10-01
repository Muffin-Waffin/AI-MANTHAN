import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * High-End Cyber Glass Countdown Tile
 * Features crisp pure WHITE digits, glowing cyan micro accents,
 * dark glass cards with cyan rim highlights and hover response.
 */

function NeonTimeCell({ className, value, label, ...props }) {
  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center select-none rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 min-w-[75px] sm:min-w-[130px] md:min-w-[160px] bg-[#070d18]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12),0_0_20px_rgba(0,240,255,0.12)] transition-all duration-300 hover:border-cyan-400/70 hover:shadow-[0_0_35px_rgba(0,240,255,0.35)] hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {/* Top subtle cyan accent bar */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 sm:w-16 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent transition-all duration-300 group-hover:w-24 group-hover:via-cyan-300"
      />

      {/* Pure WHITE Digits */}
      <div className="relative text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none font-extrabold font-mono tracking-tight tabular-nums text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.75)] group-hover:scale-105 transition-transform duration-300">
        {value}
      </div>

      {/* Spaced Label */}
      <div className="relative mt-2 sm:mt-3.5 text-[9px] sm:text-xs font-mono font-bold uppercase tracking-[0.28em] text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
        {label}
      </div>

      {/* Subtle bottom glow indicator */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan-400/30 blur-sm group-hover:bg-cyan-400/60 transition-all duration-300"
      />
    </div>
  )
}

/* Glowing Colon Separator */
function NeonColon({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'flex flex-col items-center justify-center gap-2 sm:gap-3.5 self-center px-0.5 sm:px-2',
        className
      )}
      {...props}
    >
      {[0, 1].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_2px_rgba(0,240,255,0.9)] animate-pulse"
        />
      ))}
    </div>
  )
}

/* Full Countdown Container */
function NeonCountdown({ className, cells = [], ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1.5 sm:gap-3 lg:gap-4 w-full',
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
            className="flex-1 max-w-[130px] sm:max-w-[200px] aspect-square"
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export { NeonTimeCell, NeonColon, NeonCountdown }
