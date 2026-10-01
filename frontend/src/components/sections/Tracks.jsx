'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Section from '../ui/Section'
import { domains } from '../../data/tracks'

const ACCENT_TONE = {
  azure:   { text: 'text-cyan-300',    bg: 'bg-cyan-500/10',    border: 'hover:border-cyan-400/40' },
  emerald: { text: 'text-emerald-300', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-400/40' },
  pink:    { text: 'text-pink-300',    bg: 'bg-pink-500/10',    border: 'hover:border-pink-400/40' },
  cyan:    { text: 'text-cyan-300',    bg: 'bg-cyan-500/10',    border: 'hover:border-cyan-400/40' },
  lime:    { text: 'text-lime-300',    bg: 'bg-lime-500/10',    border: 'hover:border-lime-400/40' },
  amber:   { text: 'text-amber-300',   bg: 'bg-amber-500/10',   border: 'hover:border-amber-400/40' },
  orange:  { text: 'text-orange-300',  bg: 'bg-orange-500/10',  border: 'hover:border-orange-400/40' },
  green:   { text: 'text-green-300',   bg: 'bg-green-500/10',   border: 'hover:border-green-400/40' },
  sky:     { text: 'text-sky-300',     bg: 'bg-sky-500/10',     border: 'hover:border-sky-400/40' },
  indigo:  { text: 'text-indigo-300',  bg: 'bg-indigo-500/10',  border: 'hover:border-indigo-400/40' },
  red:     { text: 'text-red-300',     bg: 'bg-red-500/10',     border: 'hover:border-red-400/40' },
}

/* ── Typing effect hook ── */
function useTypingEffect(text, trigger, speed = 55) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    if (!trigger) return
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [trigger, text, speed])
  return displayed
}

/* ── IntersectionObserver hook ── */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

/* ── Domain Card with slide-in direction + card-heading typing ── */
function DomainCard({ domain, index, inView }) {
  const tone = ACCENT_TONE[domain.accent] || ACCENT_TONE.cyan
  const psCount = domain.statements.length
  const fromLeft = index % 2 === 0          // even cards from left, odd from right
  const slideDelay = Math.floor(index / 2) * 120  // stagger by row

  // Each card observes itself so its h3 types as it enters viewport
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, 0.3)
  // Extra delay so typing starts after card slides in
  const typingTrigger = cardInView && inView
  const typedLabel = useTypingEffect(domain.label, typingTrigger, 65)

  return (
    <Link
      ref={cardRef}
      href={`/problem-statements#${domain.id}`}
      className={`group relative flex flex-col rounded-2xl border border-white/10 bg-[#090d14] p-3.5 sm:p-6
        transition-all duration-700 ease-out
        hover:-translate-y-1.5 hover:bg-[#0e1420] hover:border-cyan-400/40
        hover:shadow-[0_16px_36px_-12px_rgba(0,240,255,0.18)]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
        ${inView ? 'opacity-100 translate-x-0' : fromLeft ? 'opacity-0 -translate-x-16' : 'opacity-0 translate-x-16'}
      `}
      style={{ transitionDelay: inView ? `${slideDelay}ms` : '0ms' }}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span
          className={`grid h-9 w-9 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl border border-white/10 ${tone.bg} ${tone.text} transition-transform duration-300 group-hover:scale-110`}
        >
          <span className="material-symbols-outlined text-[18px] sm:text-[22px]">{domain.icon}</span>
        </span>
        <span className="font-mono text-[10px] sm:text-xs font-bold tracking-[0.2em] text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
          {domain.number}
        </span>
      </div>

      <h3 className="mt-3 sm:mt-4 text-xs sm:text-lg font-bold leading-snug tracking-tight text-white font-serif min-h-[2.5em] sm:min-h-[2.8em]">
        {typedLabel}
        {typedLabel.length < domain.label.length && typingTrigger && (
          <span className="inline-block w-[2px] h-[0.85em] bg-cyan-400 ml-0.5 align-middle animate-pulse" />
        )}
      </h3>
      <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-zinc-400 line-clamp-3 sm:line-clamp-none">
        {domain.blurb}
      </p>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 flex items-center justify-between border-t border-white/5">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-zinc-500 truncate">
          {psCount > 0 ? `${psCount} Problem${psCount > 1 ? 's' : ''}` : 'Domain'}
        </span>
        <span
          className="material-symbols-outlined text-[14px] sm:text-[16px] text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white shrink-0"
          aria-hidden="true"
        >
          arrow_forward
        </span>
      </div>
    </Link>
  )
}

export default function Tracks() {
  const headingRef = useRef(null)
  const gridRef    = useRef(null)
  const headingInView = useInView(headingRef, 0.4)
  const gridInView    = useInView(gridRef, 0.05)

  const FULL_HEADING = 'THE  9  TRACKS'
  const typed = useTypingEffect(FULL_HEADING, headingInView, 120)

  return (
    <Section id="tracks" className="!bg-[#06080d]">
      {/* ── heading row ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10" ref={headingRef}>
        <div>
          <p
            className={`text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.32em] text-cyan-400
              transition-all duration-700 ${headingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Problem Domains
          </p>
          <h2 className="mt-1.5 font-mono text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase min-h-[1.2em]">
            {typed}
            {/* blinking cursor while typing */}
            {typed.length < FULL_HEADING.length && headingInView && (
              <span className="inline-block w-[3px] h-[0.85em] bg-cyan-400 ml-1 align-middle animate-pulse" />
            )}
          </h2>
        </div>
        <p
          className={`max-w-sm text-xs sm:text-sm text-zinc-400 leading-relaxed
            transition-all duration-700 delay-300 ${headingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Pick a domain, find your problem, build something that matters. All
          domains are live for AI Manthan 2.0.
        </p>
      </div>

      {/* ── 9-domain grid ── */}
      <div
        ref={gridRef}
        className="tracks-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
      >
        {domains.map((domain, i) => (
          <DomainCard key={domain.id} domain={domain} index={i} inView={gridInView} />
        ))}
      </div>

      {/* ── View All CTA ── */}
      <div className={`mt-12 flex justify-center transition-all duration-700 delay-500 ${gridInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Link
          href="/problem-statements"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_24px_rgba(0,240,255,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          View All Problem Statements
          <span
            className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            north_east
          </span>
        </Link>
      </div>
    </Section>
  )
}
