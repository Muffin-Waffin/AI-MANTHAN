'use client'

import { useEffect, useState, useRef } from 'react'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { NeonCountdown } from '../ui/NeonCountdown'
import { hero, site } from '../../data/site'

function pad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Animated count up transition — runs ONCE on page load / scroll into view.
 */
function CountUpNumber({ targetValue, duration = 1800 }) {
  const [currentVal, setCurrentVal] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef(null)

  const strVal = String(targetValue)
  const numericStr = strVal.replace(/[^0-9]/g, '')
  const targetNum = numericStr ? parseInt(numericStr, 10) : 0

  const hasComma = strVal.includes(',')
  const hasPlus = strVal.includes('+')

  useEffect(() => {
    const node = elementRef.current
    if (!node || hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return

    let startTime = null
    let animationFrameId

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(easedProgress * targetNum)

      setCurrentVal(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setCurrentVal(targetNum)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [hasAnimated, targetNum, duration])

  const formattedNum = hasComma ? currentVal.toLocaleString('en-US') : currentVal

  return (
    <span ref={elementRef} className="inline-block transition-all duration-300">
      {hasAnimated ? formattedNum : 0}
      {hasPlus && '+'}
    </span>
  )
}

/**
 * True while the preloader curtain is still up. Hero holds its
 * stagger-entrance until the 'preloader-done' event fires, so the
 * reveal choreography plays right as the page appears — never behind it.
 */
function usePreloaderGate() {
  // Preloader removed — always ready immediately
  return true
}

/** Real-date countdown — derives remaining time from the event target date. */
function useCountdown(targetIso) {
  const calc = () =>
    Math.max(0, Math.floor((new Date(targetIso).getTime() - Date.now()) / 1000))
  // Init with computed value so countdown shows instantly (no "--" flash)
  const [total, setTotal] = useState(() => calc())

  useEffect(() => {
    const id = setInterval(() => setTotal(calc()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso])

  const t = total
  return {
    ready: true,
    days: pad(Math.floor(t / 86400)),
    hours: pad(Math.floor(t % 86400 / 3600)),
    mins: pad(Math.floor(t % 3600 / 60)),
    secs: pad(t % 60),
  }
}

function CountdownCard() {
  const { days, hours, mins, secs } = useCountdown(hero.countdown.target)

  return (
    <div className="stagger-fade-up w-full max-w-[280px] sm:max-w-2xl flex flex-col items-center px-2 sm:px-0" style={{ '--stagger': 4 }}>
      {/* Date Header */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs font-mono text-zinc-400 mb-3 sm:mb-5 text-center">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="text-zinc-200 tracking-wider uppercase font-bold">{hero.countdown.caption}</span>
        <span className="text-cyan-500/60 hidden sm:inline">•</span>
        <span className="text-cyan-300 font-bold tracking-wider w-full sm:w-auto text-center sm:text-left">{hero.countdown.dates}</span>
      </div>

      <NeonCountdown
        cells={[
          { value: days,  label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: mins,  label: 'Minutes' },
          { value: secs,  label: 'Seconds' },
        ]}
      />
    </div>
  )
}

/* Previous-year stats — HUD-style framed cards (cyan corner brackets,
   dark glass body, tiny dot before the label). Last card = prize pool
   highlight with a glowing cyan frame. Rendered standalone between
   Hero and the Story section via StatsStrip. */
export function StatStrip() {
  return (
    <div className="mt-8 sm:mt-12 w-full">
      {/* Sleek Cyber Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.9)]"></span>
          </span>
          <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-white uppercase">
            Previous Year Stats
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20">
            AI MANTHAN 1.0
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Icon name="verified" className="text-cyan-400 text-sm" />
          <span>HISTORICAL BENCHMARKS</span>
        </div>
      </div>

      {/* 4 Cyber Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {site.stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="group relative p-3.5 sm:p-6 rounded-2xl flex flex-col justify-between overflow-hidden bg-[#090d14]"
          >

            {/* Subtle background icon watermark */}
            {stat.icon && (
              <div className="absolute -right-3 -bottom-3 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none text-white">
                <Icon name={stat.icon} className="text-6xl sm:text-8xl" />
              </div>
            )}

            {/* Header: Icon + Sublabel Badge */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:border-cyan-400/60 transition-all duration-300">
                <Icon name={stat.icon || 'star'} className="text-base sm:text-xl" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono font-medium tracking-wider text-cyan-400/90 bg-cyan-950/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-cyan-500/20 truncate max-w-[100px] sm:max-w-none">
                {stat.sublabel || 'AI-MANTHAN'}
              </span>
            </div>

            {/* Metric Value */}
            <div className="my-1">
              <div className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-white leading-none font-mono group-hover:text-cyan-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <CountUpNumber targetValue={stat.value} duration={1600 + idx * 200} />
              </div>
            </div>

            {/* Stat Label */}
            <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs text-zinc-300">
              <span className="font-medium tracking-wide text-zinc-200 group-hover:text-white transition-colors truncate">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Ambient particles — a handful of floating cyan dots. Pure CSS
   animation, GPU-friendly, tiny count (restrained on purpose). ────── */
function Particles() {
  const dots = [
    { left: '12%', size: 3, delay: 0, dur: 11 },
    { left: '24%', size: 2, delay: 3.2, dur: 14 },
    { left: '38%', size: 4, delay: 6.1, dur: 12 },
    { left: '55%', size: 2, delay: 1.7, dur: 15 },
    { left: '67%', size: 3, delay: 8.4, dur: 10 },
    { left: '78%', size: 2, delay: 4.6, dur: 13 },
    { left: '88%', size: 3, delay: 2.3, dur: 16 },
  ]
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="hero-particle absolute rounded-full bg-cyan-300"
          style={{
            left: d.left,
            width: d.size,
            height: d.size,
            '--p-delay': `${d.delay}s`,
            '--p-dur': `${d.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Large background logo centerpiece with dynamic real-time cursor reflection,
 * 3D parallax tilt, and interactive spotlight glare.
 */
/**
 * Interactive Torch Light Cursor Reflection:
 * Creates a focused flashlight beam spotlight that follows mouse movement strictly
 * within the Hero section bounds, deactivating automatically when the cursor leaves!
 */
function TorchCursorReflection({ heroRef }) {
  const [torch, setTorch] = useState({ x: -500, y: -500, active: false })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const hero = heroRef?.current || document.getElementById('overview')
      if (!hero) return

      const rect = hero.getBoundingClientRect()
      const isInsideHero =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (isInsideHero) {
        setTorch({
          x: e.clientX,
          y: e.clientY,
          active: true,
        })
      } else {
        setTorch((prev) => (prev.active ? { ...prev, active: false } : prev))
      }
    }

    const handleMouseLeave = () => {
      setTorch((prev) => ({ ...prev, active: false }))
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [heroRef])

  return (
    <>
      {/* Compact Focused Torch Beam Light Overlay (220px radius) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: torch.active ? 1 : 0,
          background: `radial-gradient(220px circle at ${torch.x}px ${torch.y}px, rgba(0, 240, 255, 0.28) 0%, rgba(0, 168, 255, 0.12) 40%, transparent 70%)`,
        }}
      />

      {/* Illuminated Logo Layer Revealed under Torch Light (190px radius) */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0 transition-opacity duration-300"
        style={{
          opacity: torch.active ? 1 : 0,
          WebkitMaskImage: `radial-gradient(190px circle at ${torch.x}px ${torch.y}px, black 30%, transparent 80%)`,
          maskImage: `radial-gradient(190px circle at ${torch.x}px ${torch.y}px, black 30%, transparent 80%)`,
        }}
      >
        <div className="relative w-[560px] sm:w-[780px] md:w-[940px] lg:w-[1100px] max-w-[96vw] h-auto flex items-center justify-center mt-20 sm:mt-30">
          <img
            src="/logos/aimathan-logo.png"
            alt="AI मंथन 2.0 Illuminated Emblem"
            width={1599}
            height={966}
            className="w-full h-auto object-contain opacity-85 filter drop-shadow-[0_0_55px_rgba(0,240,255,0.65)]"
          />
        </div>
      </div>
    </>
  )
}

function BackgroundLogoWithReflection() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
      {/* Base Dim Logo Watermark (Idle state) */}
      <div className="relative w-[560px] sm:w-[780px] md:w-[940px] lg:w-[1100px] max-w-[96vw] h-auto flex items-center justify-center mt-32 sm:mt-40">
        <img
          src="/logos/aimathan-logo.png"
          alt="AI मंथन 2.0 Background Emblem"
          width={1599}
          height={966}
          className="w-full h-auto object-contain opacity-[0.08] sm:opacity-[0.10] filter blur-[0.5px]"
        />
      </div>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)

  return (
    <section
      id="overview"
      ref={heroRef}
      className="relative w-full min-h-[100svh] flex items-center overflow-hidden -mt-28 sm:-mt-36 pb-8"
    >
      {/* ── Background Stage with Large Logo & Torch Cursor Reflection ──── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-obsidian-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06),transparent_65%)]" />

        {/* Base Watermark Logo */}
        <BackgroundLogoWithReflection />

        {/* Interactive Torch Cursor Reflection Spotlight (Hero Scoped) */}
        <TorchCursorReflection heroRef={heroRef} />

        {/* soft moving light rays */}
        <div className="hero-ray hero-ray-a absolute -top-1/4 left-[15%] h-[150%] w-40 rotate-12 bg-gradient-to-b from-cyan-400/[0.05] via-transparent to-transparent blur-2xl" />
        <div className="hero-ray hero-ray-b absolute -top-1/4 right-[20%] h-[150%] w-56 -rotate-6 bg-gradient-to-b from-sky-300/[0.04] via-transparent to-transparent blur-2xl" />

        <Particles />

        {/* bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-obsidian-950" />
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="site-container relative z-10 pt-28 sm:pt-32 sm:pb-52">
        <div className="flex flex-col items-center text-center">

          {/* Headline */}
          <h1 className="stagger-fade-up font-serif font-light text-titanium text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight max-w-5xl leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]" style={{ '--stagger': 1 }}>
            {hero.headlineA}{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-white to-brand-cyan bg-clip-text text-transparent italic font-serif">
              {hero.headlineB}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="stagger-fade-up mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-200 leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]" style={{ '--stagger': 2 }}>
            {hero.body}
          </p>

          {/* CTAs */}
          <div className="stagger-fade-up mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3.5" style={{ '--stagger': 3 }}>
            <Button href={hero.primaryCta.href} external icon={hero.primaryCta.icon} className="!bg-cyan-400 !text-[#06080d] hover:!bg-cyan-300 font-bold">
              {hero.primaryCta.label}
            </Button>
            {hero.secondaryCtas.map((cta) => (
              <Button key={cta.label} href={cta.href} variant="glass" icon={cta.icon}>
                {cta.label}
              </Button>
            ))}
          </div>

          {/* ── Countdown: inline below CTAs on mobile ── */}
          <div className="sm:hidden mt-8 w-full flex justify-center px-2 pb-10">
            <CountdownCard />
          </div>
        </div>
      </div>

      {/* ── Countdown pinned to the bottom on desktop ── */}
      <div className="hidden sm:flex absolute bottom-10 sm:bottom-14 inset-x-0 z-10 justify-center px-4">
        <CountdownCard />
      </div>
    </section>
  )
}
