'use client'

import { useEffect, useRef, useState } from 'react'
import { pingVisit, subscribeToSiteVisits } from '../../lib/supabase'
import { cn } from '../../lib/utils'

/**
 * Live visitor counter — three display variants, ONE honest number.
 *
 *   'badge'  → compact pill (Navbar / mobile drawer)
 *   'stat'   → HUD card (stats sections)
 *   'footer' → prominent widget (Footer)
 *
 * Counting contract ( enforced in lib/supabase.js via rpc record_visit ):
 *   • Exactly ONE ping per page load, no matter how many counters are
 *     mounted (module-level singleton promise).
 *   • 1 visit = 1 browsing session — refreshes/reloads never re-count.
 *   • 1 unique = 1 browser (lifetime anonymous token).
 *   • Displays ONLY server-verified numbers. If the API is down the
 *     badge simply doesn't render — no fake increments, no baselines.
 */
export default function VisitorCounter({ variant = 'footer', className = '' }) {
  /* Hydration-safe: first render matches the server (hidden), real
     numbers arrive from the ping in an effect. */
  const [stats, setStats] = useState(null)
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let alive = true
    pingVisit()
      .then((data) => {
        if (alive && data && typeof data.total === 'number') {
          setStats({ total: data.total, unique: data.unique })
        }
      })
      .catch(() => {
        /* API down — stay hidden, never fabricate numbers */
      })
    // Supabase Realtime: counter updates LIVE on every new visit —
    // no polling. Silently skipped when Supabase env is not configured.
    const unsubscribe = subscribeToSiteVisits((row) => {
      if (alive) setStats({ total: row.total, unique: row.unique })
    })
    return () => {
      alive = false
      unsubscribe()
    }
  }, [])

  // Smooth count-up: 0 → total over ~1.2s, cubic ease-out.
  // Honest numbers only — Math.max(1, …) jaisa koi forced minimum nahi:
  // real count 0 ho toh 0 hi dikhega (tooltip ke saath consistent).
  useEffect(() => {
    if (!stats) return
    const target = stats.total
    const start = performance.now()
    const dur = 1200

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(target * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(target)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stats])

  if (!stats) return null

  const formattedTotal = display.toLocaleString('en-IN')
  const formattedUnique = (stats.unique || 0).toLocaleString('en-IN')

  // 1. Badge Variant (Navbar / Mobile Drawer)
  if (variant === 'badge') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/[0.08] hover:shadow-[0_0_18px_rgba(0,240,255,0.35)]',
          className,
        )}
        title={`${stats.total.toLocaleString('en-IN')} visits (browsing sessions) • ${stats.unique.toLocaleString('en-IN')} unique visitors`}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">{formattedTotal}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400">Visits</span>
      </div>
    )
  }

  // 2. Stat Card Variant (Hero / Stats section)
  if (variant === 'stat') {
    return (
      <div
        className={cn(
          'hud-stat relative mx-auto flex h-[135px] sm:h-[155px] md:h-[175px] w-full max-w-[293px] flex-col items-center justify-center bg-obsidian-900/80 px-3 sm:px-5 text-center',
          className,
        )}
      >
        <span aria-hidden="true" className="hud-corner hud-corner-tl" />
        <span aria-hidden="true" className="hud-corner hud-corner-tr" />
        <span aria-hidden="true" className="hud-corner hud-corner-bl" />
        <span aria-hidden="true" className="hud-corner hud-corner-br" />
        <div className="text-2xl sm:text-3xl md:text-[42px] font-extrabold tracking-tight leading-none text-cyan-300 drop-shadow-[0_0_18px_rgba(103,232,249,0.55)] tabular-nums">
          {formattedTotal}
        </div>
        <div className="mt-2 sm:mt-2.5 flex items-center justify-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"
          />
          <span className="text-[9px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-cyan-300">
            Site Visits
          </span>
        </div>
      </div>
    )
  }

  // 3. Footer Variant (Prominent & High-Tech)
  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-white/[0.06] px-4 py-2 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_24px_-4px_rgba(0,240,255,0.4)]',
        className,
      )}
      title={`${stats.total.toLocaleString('en-IN')} visits (browsing sessions) • ${stats.unique.toLocaleString('en-IN')} unique visitors`}
    >
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
      </span>

      <span className="font-mono text-xs sm:text-sm font-extrabold tabular-nums text-white tracking-wide">
        {formattedTotal}
      </span>
      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">
        Visits
      </span>

      <span className="hidden sm:inline-block h-3 w-px bg-white/15" />
      <span className="hidden sm:inline-block font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
        {formattedUnique} Uniques
      </span>
    </div>
  )
}
