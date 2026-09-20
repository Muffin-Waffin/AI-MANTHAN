'use client'

import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { NeonCountdown } from '../ui/NeonCountdown'
import { hero, site } from '../../data/site'

function pad(n) {
  return String(n).padStart(2, '0')
}

/**
 * True while the preloader curtain is still up. Hero holds its
 * stagger-entrance until the 'preloader-done' event fires, so the
 * reveal choreography plays right as the page appears — never behind it.
 */
function usePreloaderGate() {
  /* Start `true` on BOTH server and client so the first client render
     matches the server HTML (no hydration mismatch). If the preloader is
     still up, the effect flips to hidden a beat later — the curtain covers
     the viewport then, so no flash is ever visible. */
  const [ready, setReady] = useState(true)

  useEffect(() => {
    if (sessionStorage.getItem('aimanthan_preloader_done') === '1') return
    setReady(false)
    const go = () => setReady(true)
    window.addEventListener('preloader-done', go)
    const fallback = setTimeout(() => setReady(true), 4000)
    return () => {
      window.removeEventListener('preloader-done', go)
      clearTimeout(fallback)
    }
  }, [])
  return ready
}

/** Real-date countdown — derives remaining time from the event target date. */
function useCountdown(targetIso) {
  const calc = () =>
    Math.max(0, Math.floor((new Date(targetIso).getTime() - Date.now()) / 1000))
  const [total, setTotal] = useState(null)

  useEffect(() => {
    const tick = () => setTotal(calc())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso])

  const t = total ?? 0
  return {
    ready: total !== null,
    days: pad(Math.floor(t / 86400)),
    hours: pad(Math.floor(t % 86400 / 3600)),
    mins: pad(Math.floor(t % 3600 / 60)),
    secs: pad(t % 60),
  }
}

function CountdownCard({ revealed = true }) {
  const { ready, days, hours, mins, secs } = useCountdown(hero.countdown.target)
  const cell = (v) => (ready ? v : '--')

  return (
    <div className={`${revealed ? 'stagger-fade-up' : 'opacity-0'} mt-16 w-full max-w-4xl`} style={{ '--stagger': 4 }}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pb-6 mb-3 text-xs font-mono text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"></span>
          {hero.countdown.caption}
        </span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline">{hero.countdown.dates}</span>
      </div>
      <NeonCountdown
        cells={[
          { value: cell(days), label: 'Days', tone: 'cyan' },
          { value: cell(hours), label: 'Hours', tone: 'violet' },
          { value: cell(mins), label: 'Minutes', tone: 'fuchsia' },
          { value: cell(secs), label: 'Seconds', tone: 'pink' },
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
    <div className="mt-10 w-full">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-zinc-300 uppercase whitespace-nowrap">
          Previous Year Stats
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-[38px]">
        {site.stats.map((stat) => (
          <div
            key={stat.label}
            className={`hud-stat relative mx-auto flex h-[135px] sm:h-[155px] md:h-[175px] w-full max-w-[293px] flex-col items-center justify-center bg-obsidian-900/80 px-3 sm:px-5 text-center ${
              stat.highlight ? 'hud-stat-highlight' : ''
            }`}
          >
            <span aria-hidden="true" className="hud-corner hud-corner-tl" />
            <span aria-hidden="true" className="hud-corner hud-corner-tr" />
            <span aria-hidden="true" className="hud-corner hud-corner-bl" />
            <span aria-hidden="true" className="hud-corner hud-corner-br" />
            <div className={`text-2xl sm:text-3xl md:text-[42px] font-extrabold tracking-tight leading-none ${stat.highlight ? 'text-cyan-300 drop-shadow-[0_0_18px_rgba(103,232,249,0.55)]' : 'text-white'}`}>
              {stat.value}
            </div>
            <div className="mt-2 sm:mt-2.5 flex items-center justify-center gap-1.5">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cyan-400/90 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
              <span className={`text-[9px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] ${stat.highlight ? 'text-cyan-300' : 'text-zinc-300'}`}>
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Ambient particles — a handful of floating purple dots. Pure CSS
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
          className="hero-particle absolute rounded-full bg-purple-300"
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

export default function Hero() {
  const preloaderDone = usePreloaderGate()
  const reveal = (i) =>
    `${preloaderDone ? 'stagger-fade-up' : 'opacity-0'}`

  return (
    <section
      id="overview"
      className="relative w-full min-h-[100svh] flex items-center overflow-hidden -mt-28 sm:-mt-36 pb-8"
    >
      {/* ── Cinematic video stage — 8% side margins, full-bleed feel
             (no frame/border, just the raw video) ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="hero-video h-[87%] w-[90%] object-contain"
          >
            <source src="/binary-fly.mp4" type="video/mp4" />
          </video>
        </div>

        {/* layered readability overlays — video stays visible */}
        <div className="absolute inset-0 bg-obsidian-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.12),transparent_62%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.8)]" />

        {/* soft moving light rays — two slow-panning gradient beams */}
        <div className="hero-ray hero-ray-a absolute -top-1/4 left-[15%] h-[150%] w-40 rotate-12 bg-gradient-to-b from-purple-400/[0.07] via-transparent to-transparent blur-2xl" />
        <div className="hero-ray hero-ray-b absolute -top-1/4 right-[20%] h-[150%] w-56 -rotate-6 bg-gradient-to-b from-sky-300/[0.05] via-transparent to-transparent blur-2xl" />

        <Particles />

        {/* bottom fade — melts into the sparkles background */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-obsidian-950" />
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="site-container relative pt-24 sm:pt-28">
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow badge */}
          <div className={`${reveal(0)} glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-9 text-xs font-medium text-zinc-300`} style={{ '--stagger': 0 }}>
            <span className="text-purple-300">●</span>
            <span className="font-mono tracking-[0.14em] uppercase">{hero.badge[0]}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-mono">{hero.badge[1]}</span>
          </div>

          {/* Headline */}
          <h1 className={`${reveal(1)} text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight text-white max-w-5xl leading-[1.04]`} style={{ '--stagger': 1 }}>
            {hero.headlineA}{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-200 to-purple-300 bg-clip-text text-transparent">
              {hero.headlineB}
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`${reveal(2)} mt-6 sm:mt-7 max-w-2xl text-sm sm:text-base lg:text-lg text-zinc-300/90 leading-relaxed`} style={{ '--stagger': 2 }}>
            {hero.body}
          </p>

          {/* CTAs */}
          <div className={`${reveal(3)} mt-10 flex flex-wrap items-center justify-center gap-3.5`} style={{ '--stagger': 3 }}>
            <Button href={hero.primaryCta.href} external icon={hero.primaryCta.icon} className="!bg-cta-gradient !shadow-[0_0_28px_rgba(168,85,247,0.5)]">
              {hero.primaryCta.label}
            </Button>
            {hero.secondaryCtas.map((cta) => (
              <Button key={cta.label} href={cta.href} variant="glass" icon={cta.icon}>
                {cta.label}
              </Button>
            ))}
          </div>

          <CountdownCard revealed={preloaderDone} />
        </div>
      </div>
    </section>
  )
}
