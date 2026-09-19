'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Section from '../ui/Section'
import { timeline } from '../../data/timeline'

/**
 * THE RIPPLE — cinematic timeline, center-aligned with swipe support.
 * - ONE stage, all 5 phases visible at once
 * - every card is the SAME size (clamp-scaled), alternating above/below
 *   the wave, evenly distributed 12% → 88% across the stage
 * - nodes sit EXACTLY on the wave's crests/troughs (horizontal tangent
 *   at every node) and light up as the butterfly passes
 * - butterfly + bright line progress is driven by the stage's HORIZONTAL
 *   scroll/drag, not vertical page scroll
 * - stems are runtime-MEASURED from card edge to node with arrowheads
 * - edge fades dissolve the wave into the section background
 * - horizontal swipe/drag support on the scrollable stage
 */

const WAVE_W = 1440
const WAVE_H = 580
const LINE_Y = 290

const NODES = [0.14, 0.32, 0.5, 0.68, 0.86].map((fx, i) => ({
  x: Math.round(fx * WAVE_W),
  y: LINE_Y + (i % 2 === 0 ? -55 : 55),
}))

const NODE_GAP_PX = 40
const NODE_Y_PCT = ((LINE_Y + 34) / WAVE_H) * 100

/* Every segment is a cubic whose end tangents are HORIZONTAL, so the
   curve peaks (crest) or bottoms (trough) exactly AT each node — nodes
   never float mid-slope. 0.3 control points give a smooth, flowing
   S-turn between crests. */
function buildWave(nodes) {
  let d = `M 30 ${LINE_Y}`
  let prev = { x: 30, y: LINE_Y }
  for (const n of nodes) {
    const dx = Math.round((n.x - prev.x) * 0.3)
    d += ` C ${prev.x + dx} ${prev.y}, ${n.x - dx} ${n.y}, ${n.x} ${n.y}`
    prev = n
  }
  const tail = Math.round((1410 - prev.x) * 0.3)
  d += ` C ${prev.x + tail} ${prev.y}, 1410 ${prev.y - 12}, 1410 ${prev.y - 12}`
  return d
}

/* Watermark icon per phase — decorative, bottom-right of each card. */
const PHASE_ICONS = ['rocket_launch', 'file_upload', 'grading', 'terminal', 'emoji_events']

function PhaseCard({ phase, index }) {
  return (
    <div className="ripple-card group relative flex h-[208px] w-full flex-col overflow-hidden rounded-[20px] p-5">
      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-mono font-bold tracking-wide text-zinc-900 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
          {phase.date}
        </span>
        <span className="font-mono text-sm font-bold tracking-[0.2em] text-white/30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h4 className="relative mt-3 line-clamp-2 text-lg font-extrabold leading-tight tracking-tight text-white">
        {phase.title}
      </h4>

      {/* decorative watermark, bottom-right */}
      <span
        aria-hidden="true"
        className="material-symbols-outlined pointer-events-none absolute -bottom-2 right-2 rotate-[-14deg] text-[88px] leading-none text-white/[0.09] select-none"
      >
        {PHASE_ICONS[index % PHASE_ICONS.length]}
      </span>

      <p className="relative mt-auto line-clamp-2 text-[13px] font-medium leading-snug text-white/90">
        {phase.body}
      </p>
    </div>
  )
}

function Milestone({ phase, index, node, nodeRef, slotIndex }) {
  const above = slotIndex % 2 === 0
  const cxPct = (node.x / WAVE_W) * 100
  const nodeYPct = (node.y / WAVE_H) * 100
  const wrapRef = useRef(null)
  const stemRef = useRef(null)

  useEffect(() => {
    const measure = () => {
      const stage = wrapRef.current?.closest('.ripple-stage')
      const wrap = wrapRef.current
      const stem = stemRef.current
      if (!stage || !wrap || !stem) return
      const stageH = stage.clientHeight
      const nodeY = (node.y / WAVE_H) * stageH

      /* Tuck the stem 4px under the card edge: the card's float
         animation moves ±3px, so the overlap keeps the card↔node
         joint visually closed at all times. The node end always
         reaches the node's center (disc covers the tip). */
      const OVERLAP = 4
      let stemTop, stemH
      if (above) {
        const cardBottom = wrap.offsetTop + wrap.offsetHeight
        stemTop = cardBottom - OVERLAP
        stemH = nodeY - stemTop
      } else {
        const cardTop = wrap.offsetTop
        stemTop = nodeY
        stemH = cardTop + OVERLAP - nodeY
      }

      if (stemH > 6) {
        stem.style.top = `${Math.round(stemTop)}px`
        stem.style.height = `${Math.round(stemH)}px`
        stem.style.opacity = '1'
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [above, node.y])

  const halfCard = 'clamp(90px, 11vw, 150px)'

  return (
    <div
      className="ripple-reveal absolute top-0 bottom-0 w-0"
      style={{
        left: `clamp(${halfCard}, ${cxPct}%, calc(100% - ${halfCard}))`,
        '--reveal-delay': `${slotIndex * 110}ms`,
      }}
    >
      <div
        ref={stemRef}
        aria-hidden="true"
        className="absolute left-0 opacity-0 transition-opacity duration-500"
        style={{ top: 0, height: 0 }}
      >
        <span className="absolute left-0 top-0 bottom-0 w-px bg-white/45" />
      </div>

      <div
        ref={wrapRef}
        className="absolute w-[320px] -translate-x-1/2"
        style={
          above
            ? { bottom: `calc(${(100 - nodeYPct).toFixed(2)}% + ${NODE_GAP_PX}px)` }
            : { top: `calc(${nodeYPct.toFixed(2)}% + ${NODE_GAP_PX}px)` }
        }
      >
        <div
          className="ripple-float"
          style={{
            '--float-duration': `${6.5 + (index % 3) * 1.3}s`,
            '--float-delay': `${index * 0.8}s`,
          }}
        >
          <PhaseCard phase={phase} index={index} />
        </div>
      </div>

      <span
        ref={nodeRef}
        aria-hidden="true"
        className="ripple-node absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{ top: `${nodeYPct}%` }}
      />
    </div>
  )
}

/* ── Swipe / drag hook ────────────────────────────────────────────
   Mouse drag-to-scroll (touch devices use native momentum scrolling).
   Drags over 6px suppress the following click so card links don't
   fire after a swipe, and text stays unselectable while dragging. */
const DRAG_THRESHOLD = 6

function useSwipeDrag(scrollRef) {
  const dragging = useRef(false)
  const moved = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onPointerDown = useCallback((e) => {
    // Touch/pen get native overflow scrolling — handling them here too
    // would double-move the stage. Also never hijack clicks on links.
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    if (e.target.closest('a, button')) return
    const el = scrollRef.current
    if (!el) return
    dragging.current = true
    moved.current = false
    startX.current = e.clientX
    scrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }, [scrollRef])

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return
    const el = scrollRef.current
    if (!el) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > DRAG_THRESHOLD) moved.current = true
    el.scrollLeft = scrollLeft.current - dx
  }, [scrollRef])

  const onPointerUp = useCallback(() => {
    dragging.current = false
    const el = scrollRef.current
    if (el) {
      el.style.cursor = ''
      el.style.userSelect = ''
    }
  }, [scrollRef])

  /* A click at the end of a real drag is an accident — block it once. */
  useEffect(() => {
    const onClick = (e) => {
      if (!moved.current) return
      moved.current = false
      e.preventDefault()
      e.stopPropagation()
    }
    const el = scrollRef.current
    el?.addEventListener('click', onClick, true)
    return () => el?.removeEventListener('click', onClick, true)
  }, [scrollRef])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [onPointerDown, onPointerMove, onPointerUp, scrollRef])
}

export default function Timeline() {
  const stageRef = useRef(null)
  const scrollRef = useRef(null)
  const pathRef = useRef(null)
  const litRef = useRef(null)
  const flyRef = useRef(null)
  const nodeRefs = useRef([])
  const revealedRef = useRef(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const waveD = buildWave(NODES)

  /* hook up drag-to-scroll on the scrollable wrapper */
  useSwipeDrag(scrollRef)

  /* check scroll arrow visibility */
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  /* Start at the wave's beginning — with horizontal-scroll-driven
     progress, the left edge is the natural start of the journey. */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => {
      el.scrollLeft = 0
      updateScrollState()
    })
    return () => cancelAnimationFrame(raf)
  }, [updateScrollState])

  const scrollBy = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.4), behavior: 'smooth' })
  }, [])

  /* Butterfly rides the wave; the bright line + nodes follow its progress. */
  useEffect(() => {
    const stage = stageRef.current
    const path = pathRef.current
    const lit = litRef.current
    const fly = flyRef.current
    if (!stage || !path || !fly) return

    const len = path.getTotalLength()

    /* The wave is monotonic in x — binary-search the arc length whose
       point.x matches the drag fraction. This makes the butterfly and
       the lit fill advance strictly LEFT-TO-RIGHT in lockstep with the
       horizontal drag (no more racing up/down the steep curve parts). */
    const X_MIN = 30
    const X_MAX = 1410
    const xToLen = (fx) => {
      const targetX = X_MIN + fx * (X_MAX - X_MIN)
      let lo = 0
      let hi = len
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2
        if (path.getPointAtLength(mid).x < targetX) lo = mid
        else hi = mid
      }
      return (lo + hi) / 2
    }

    let raf = null
    const update = () => {
      raf = null
      /* Progress is driven by the stage's HORIZONTAL scroll (drag or
         arrows) — never vertical page scroll. */
      const scroller = scrollRef.current
      const max = scroller ? scroller.scrollWidth - scroller.clientWidth : 0
      const p = max > 0 ? Math.min(1, Math.max(0, scroller.scrollLeft / max)) : 0

      const lenAtX = xToLen(p)
      const pt = path.getPointAtLength(lenAtX)
      const ahead = path.getPointAtLength(Math.min(len, lenAtX + 2))
      const ang = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI

      fly.style.left = `${(pt.x / WAVE_W) * 100}%`
      fly.style.top = `${(pt.y / WAVE_H) * 100}%`
      fly.style.transform = `translate(-50%, -55%) rotate(${ang}deg)`

      if (lit) lit.style.strokeDashoffset = `${1 - lenAtX / len}`

      nodeRefs.current.forEach((el, i) => {
        if (el) el.classList.toggle('node-passed', pt.x >= NODES[i].x - 2)
      })
    }
    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update)
    }

    update()
    const scroller = scrollRef.current
    scroller?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      scroller?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  /* Scroll reveal — cards stagger in when the stage scrolls into view. */
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let raf = null
    const show = () => {
      raf = requestAnimationFrame(() => {
        stage.querySelectorAll('.ripple-reveal').forEach((el) => el.classList.add('is-inview'))
      })
    }
    if (revealedRef.current) {
      show()
      return () => raf && cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          revealedRef.current = true
          io.disconnect()
          show()
        }
      },
      { threshold: 0.18 },
    )
    io.observe(stage)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Section id="timeline" className="overflow-hidden scroll-mt-[72px]">
      {/* ── background ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="ripple-grid absolute -inset-x-40 -top-24 bottom-0 opacity-[0.07]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[560px] w-[900px] rounded-full bg-purple-800/15 blur-[120px]" />
      </div>

      {/* ── heading ── */}
      <div className="relative text-center max-w-3xl mx-auto mb-2.5">
        <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.32em] text-brand-violet">
          Event Journey
        </p>
        <h2 className="mt-1 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-white">
          THE&nbsp;<span className="text-blue-400">RIPPLE</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1.5">{timeline.body}</p>
      </div>

      {/* ── Desktop: centered, horizontally scrollable wave stage ── */}
      <div className="relative hidden md:block">
        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="ripple-scroll-arrow ripple-scroll-arrow-left"
            aria-label="Scroll timeline left"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="ripple-scroll-arrow ripple-scroll-arrow-right"
            aria-label="Scroll timeline right"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        )}

        {/* Scrollable container — centered, grabs on drag */}
        <div
          ref={scrollRef}
          className="overflow-x-auto no-scrollbar cursor-grab"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
        >
          <div
            ref={stageRef}
            className="ripple-stage relative mx-auto h-[calc(100svh-145px)] min-h-[730px] max-h-[790px] w-[155vw]"
          >
            {/* wave svg */}
            <svg
              viewBox={`0 0 ${WAVE_W} ${WAVE_H}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="rippleFade" x1="0" y1="0" x2={WAVE_W} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="rgba(255,255,255,0.06)" />
                  <stop offset="0.1" stopColor="rgba(255,255,255,0.22)" />
                  <stop offset="0.9" stopColor="rgba(255,255,255,0.22)" />
                  <stop offset="1" stopColor="rgba(255,255,255,0.08)" />
                </linearGradient>
                <linearGradient id="rippleLit" x1="0" y1="0" x2={WAVE_W} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="rgba(232,121,249,0.9)" />
                  <stop offset="0.5" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="1" stopColor="rgba(192,132,252,0.95)" />
                </linearGradient>
              </defs>

              <path ref={pathRef} d={waveD} stroke="url(#rippleFade)" strokeWidth="1.4" strokeLinecap="round" />
              <path
                ref={litRef}
                d={waveD}
                stroke="url(#rippleLit)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{ filter: 'drop-shadow(0 0 6px rgba(217,70,239,0.55))' }}
              />
              <path
                d={waveD}
                stroke="rgba(216,180,254,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
                pathLength="1"
                className="ripple-flow"
              />
            </svg>

            {/* edge fades */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-20 lg:w-28 bg-gradient-to-r from-obsidian-950 to-transparent z-10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-20 lg:w-28 bg-gradient-to-l from-obsidian-950 to-transparent z-10"
            />

            {/* milestones */}
            {timeline.phases.map((phase, i) => (
              <Milestone
                key={phase.phase}
                phase={phase}
                index={i}
                node={NODES[i]}
                nodeRef={(el) => (nodeRefs.current[i] = el)}
                slotIndex={i}
              />
            ))}

            {/* travelling butterfly — halo behind it keeps it visible
                against any background, glow pulses so it never reads
                as "gone" even at rest. */}
            <div className="pointer-events-none absolute z-10" style={{ left: '2%', top: `${(NODES[0].y / WAVE_H) * 100}%` }}>
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-fuchsia-500/25 blur-2xl animate-pulse"
              />
            </div>
            <img
              ref={flyRef}
              src="/logos/butterfly.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute z-20 w-14 lg:w-20 drop-shadow-[0_0_22px_rgba(217,70,239,0.95)]"
              style={{ left: '2%', top: `${(NODES[0].y / WAVE_H) * 100}%`, transform: 'translate(-50%, -55%)' }}
            />
          </div>
        </div>

        {/* Swipe hint — subtle, fades after first interaction */}
        <div className="ripple-swipe-hint pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-zinc-500 text-[11px] font-mono tracking-wider uppercase">
          <span className="material-symbols-outlined text-sm animate-bounce-subtle">swipe</span>
          Swipe to explore
        </div>
      </div>

      {/* ── mobile: vertical rail (same content, stacked) ── */}
      <div className="md:hidden relative pl-10 sm:pl-12 space-y-6 sm:space-y-8 pb-4">
        {/* Glowing rail line */}
        <span
          aria-hidden="true"
          className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-500/20 via-fuchsia-400/80 to-purple-500/20 shadow-[0_0_12px_rgba(217,70,239,0.8)]"
        />
        {timeline.phases.map((phase, i) => (
          <div key={phase.phase} className="relative group">
            {/* Perfectly centered milestone beacon on the rail */}
            <div
              aria-hidden="true"
              className="absolute -left-10 sm:-left-12 top-5 flex items-center justify-center w-[35px] z-10 pointer-events-none"
            >
              <span className="relative flex h-4 w-4 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-tr from-purple-500 to-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.9)] border-2 border-white" />
              </span>
            </div>
            <PhaseCard phase={phase} index={i} />
          </div>
        ))}
      </div>
    </Section>
  )
}
