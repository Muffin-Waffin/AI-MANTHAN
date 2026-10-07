'use client'

import { useEffect, useRef, useState } from 'react'
import Section from '../ui/Section'
import { timeline } from '../../data/timeline'

/**
 * THE RIPPLE — VERTICAL scroll-driven timeline (AI MANTHAN 2.0).
 * - Single centered rail; cards alternate left/right on desktop,
 *   stack single-column on mobile (rail hugs the left edge).
 * - Progress line fills as the user scrolls through the section
 *   (rAF + scroll listener, GPU-friendly transform scaleY).
 * - Each node lights up (node-passed) when the fill passes it; the
 *   card gets a subtle emphasis (.v-active) once its node is lit.
 * - The official AI MANTHAN 2.0 logo rides the rail tip (replaces the
 *   old butterfly). Unmodified asset — object-contain, no crop/morph.
 * - No horizontal scrolling at any breakpoint.
 */

/* Fraction of the section (0..1) at which each node sits along the rail.
   Evenly spread from 8% to 92% of the measured stage. */
const NODE_FRACTIONS = [0.08, 0.33, 0.66, 0.92]

function PhaseCard({ phase, index, active }) {
  return (
    <div
      className={`v-ripple-card relative flex flex-col overflow-hidden rounded-[20px] p-5 sm:p-6 transition-shadow duration-500 ${
        active ? 'v-ripple-card-active' : ''
      }`}
    >
      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-mono font-bold tracking-wide text-zinc-900 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
          {phase.date}
        </span>
        <span className="font-mono text-sm font-bold tracking-[0.2em] text-white/30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="relative mt-3 text-lg font-extrabold leading-tight tracking-tight text-white">
        {phase.title}
      </h3>

      <p className="relative mt-2 text-[13px] font-medium leading-snug text-white/90">
        {phase.body}
      </p>

      <span
        className={`mt-4 inline-flex items-center gap-2 self-start rounded-full border px-3 py-1 font-mono text-[9px] font-bold tracking-[0.14em] uppercase ${
          phase.statusColor === 'emerald'
            ? 'border-emerald-300/50 bg-emerald-400/15 text-emerald-200'
            : phase.statusColor === 'white'
              ? 'border-white/40 bg-white/15 text-white'
              : 'border-white/25 bg-white/10 text-white/80'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            phase.statusColor === 'emerald' ? 'bg-emerald-300 animate-pulse' : 'bg-white/70'
          }`}
        />
        {phase.status}
      </span>
    </div>
  )
}

export default function Timeline() {
  const sectionRef = useRef(null)
  const railRef = useRef(null)
  const fillRef = useRef(null)
  const logoRef = useRef(null)
  const nodeRefs = useRef([])
  const [passed, setPassed] = useState(() => timeline.phases.map(() => false))

  /* Progressive card reveal — each phase card rises in individually as it
     enters the viewport (own IO per card, so mid-timeline cards are not
     visible before the user reaches them). */
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.v-reveal')
    if (!items?.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* Scroll-driven progression: one rAF-batched scroll handler computes the
     fill fraction from the section's position in the viewport and updates
     the fill bar, the riding logo and the lit nodes imperatively (no
     per-scroll React re-render — only node state changes are committed). */
  useEffect(() => {
    const section = sectionRef.current
    const fill = fillRef.current
    const logo = logoRef.current
    if (!section || !fill || !logo) return

    let raf = null
    let lastFrac = -1

    const update = () => {
      raf = null
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.height <= 0) return

      /* Progress: 0 when the section top reaches 80% of the viewport,
         1 when the section bottom reaches 45% — a natural reading band. */
      const start = vh * 0.8
      const end = vh * 0.45
      const total = rect.height + (start - end)
      const scrolled = start - rect.top
      const frac = Math.min(1, Math.max(0, scrolled / total))
      if (Math.abs(frac - lastFrac) < 0.0015) return
      lastFrac = frac

      fill.style.transform = `scaleY(${frac})`

      /* logo rides the tip of the fill, inside the rail column */
      const rail = railRef.current
      if (rail) {
        const railH = rail.clientHeight
        const y = Math.min(railH, Math.max(0, frac * railH))
        logo.style.top = `${y}px`
      }

      /* nodes light up as the fill passes them */
      const railRect = rail?.getBoundingClientRect()
      if (railRect) {
        const fillY = railRect.top + frac * railRect.height
        const nextPassed = nodeRefs.current.map((el) => {
          if (!el) return false
          const r = el.getBoundingClientRect()
          return r.top + r.height / 2 <= fillY + 8
        })
        setPassed((prev) =>
          prev.some((v, i) => v !== nextPassed[i]) ? nextPassed : prev,
        )
      }
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Section id="timeline" className="scroll-mt-[72px] !bg-[#06080d]">

      {/* ── heading ── */}
      <div className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.32em] text-brand-cyan">
          Event Journey
        </p>
        <h2 className="mt-1 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
          THE&nbsp;<span className="text-blue-400">RIPPLE</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1.5">{timeline.body}</p>
      </div>

      {/* ── vertical stage ── */}
      <div ref={sectionRef} className="relative mx-auto max-w-4xl">
        {/* the rail */}
        <div
          ref={railRef}
          aria-hidden="true"
          className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 top-2 bottom-2 w-[3px] rounded-full"
        >
          {/* dim track */}
          <div className="absolute inset-0 rounded-full bg-white/[0.08]" />
          {/* glowing fill — scaleY grows as the user scrolls */}
          <div
            ref={fillRef}
            className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-[#0094ff] via-brand-cyan to-[#7df4ff] shadow-[0_0_12px_rgba(0,240,255,0.8)]"
            style={{ transform: 'scaleY(0)' }}
          />
        </div>

        {/* the riding logo — official AI MANTHAN 2.0 mark, unmodified.
            Landscape asset (1599×966) → height-led sizing, object-contain,
            circular glass bezel keeps it legible over the rail. */}
        <div
          ref={logoRef}
          aria-hidden="true"
          className="absolute left-[18px] sm:left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ top: 0 }}
        >
          <span className="absolute inset-0 rounded-full bg-brand-cyan/25 blur-xl animate-pulse" />
          <span className="relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-obsidian-950/90 border border-brand-cyan/40 shadow-[0_0_22px_rgba(0,240,255,0.6)]">
            <img
              src="/logos/aimathan-logo.png"
              alt=""
              className="h-7 w-10 sm:h-8 sm:w-12 object-contain"
            />
          </span>
        </div>

        {/* phases */}
        <ol className="relative space-y-8 sm:space-y-12 pl-14 sm:pl-0">
          {timeline.phases.map((phase, i) => {
            const isPassed = passed[i]
            const leftSide = i % 2 === 0
            return (
              <li
                key={phase.phase}
                className={`v-reveal relative sm:grid sm:grid-cols-[1fr_84px_1fr] sm:items-center ${
                  leftSide ? '' : ''
                }`}
              >
                {/* node on the rail — position owned by vertical-timeline.css
                    (mobile: left rail at 18px → node left -44px relative to
                    the pl-14 list; desktop: centered rail → left 50%) */}
                <span
                  ref={(el) => (nodeRefs.current[i] = el)}
                  aria-hidden="true"
                  className={`v-node absolute top-6 sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 z-10 grid h-4 w-4 place-items-center rounded-full border-2 transition-all duration-500 ${
                    isPassed
                      ? 'v-node-passed border-white bg-brand-cyan shadow-[0_0_14px_rgba(0,240,255,0.9)]'
                      : 'border-white/50 bg-obsidian-900'
                  }`}
                />

                {/* card placement: mobile → all right of rail; desktop → alternate */}
                <div
                  className={`${
                    leftSide
                      ? 'sm:col-start-1 sm:pr-2 sm:text-right'
                      : 'sm:col-start-3 sm:pl-2'
                  }`}
                >
                  <PhaseCard phase={phase} index={i} active={isPassed} />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
