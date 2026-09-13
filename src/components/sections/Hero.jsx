'use client'

import { useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import Button from '../ui/Button'
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
  const [ready, setReady] = useState(true)
  useEffect(() => {
    // Preloader visible on this load? hold the entrance until it lifts.
    if (document.body.dataset.preloader === '1') setReady(false)
    const go = () => setReady(true)
    window.addEventListener('preloader-done', go)
    return () => window.removeEventListener('preloader-done', go)
  }, [])
  return ready
}

/**
 * Real-date countdown — derives remaining time from the event target date,
 * so it survives page reloads and shows the true time left.
 * Starts as null on the server (renders `--`) and fills on mount,
 * keeping SSR markup and client hydration consistent.
 */
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
    hours: pad(Math.floor((t % 86400) / 3600)),
    mins: pad(Math.floor((t % 3600) / 60)),
    secs: pad(t % 60),
  }
}

function TimeCell({ value, label, accent = false }) {
  return (
    <div
      className={`glass p-3 sm:p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5 ${
        accent ? 'border-brand-cyan/40 shadow-[0_0_22px_-6px_rgba(56,189,248,0.55)]' : 'hover:border-brand-violet/30'
      }`}
    >
      <div
        className={`text-2xl sm:text-4xl font-bold font-mono tracking-tight tabular-nums ${
          accent ? 'text-brand-cyan animate-sec-tick' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div
        className={`text-[11px] font-mono uppercase mt-1 ${
          accent ? 'text-cyan-300/80' : 'text-zinc-500'
        }`}
      >
        {label}
      </div>
    </div>
  )
}

function CountdownCard({ revealed = true }) {
  const { ready, days, hours, mins, secs } = useCountdown(hero.countdown.target)
  const cell = (v) => (ready ? v : '--')

  return (
    <div className="mt-14 w-full max-w-2xl">
      <div className={`glass-strong ${revealed ? 'stagger-fade-up' : 'opacity-0'} p-4 sm:p-5 rounded-2xl shadow-[0_0_60px_-12px_rgba(124,58,237,0.3)]`} style={{ '--stagger': 4 }}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {hero.countdown.caption}
          </span>
          <span>{hero.countdown.dates}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <TimeCell value={cell(days)} label="Days" />
          <TimeCell value={cell(hours)} label="Hours" />
          <TimeCell value={cell(mins)} label="Mins" />
          <TimeCell value={cell(secs)} label="Secs" accent />
        </div>
      </div>
    </div>
  )
}

function StatStrip() {
  return (
    <div className="mt-12 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/[0.06] text-left">
      {site.stats.map((stat) => (
        <div className="px-3 py-2" key={stat.value}>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stat.value}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const preloaderDone = usePreloaderGate()
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-4 md:pt-10" id="overview">
      {/* Scoped video backdrop — lives ONLY behind this overview section.
          Fades out toward the bottom so it melts into the global sparkles. */}
      <div className="mask-fade-b absolute inset-x-0 -top-28 -bottom-10 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 mix-blend-screen filter contrast-110"
        >
          <source src="/binary-fly.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="flex flex-col items-center text-center">
        {/* Live tag badge — entrance gated on preloader lift */}
    <div className={`${preloaderDone ? 'stagger-fade-up' : 'opacity-0'} glass inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8 text-xs font-medium text-zinc-300`} style={{ '--stagger': 0 }}>
          <span className="text-brand-violet">●</span>
          <span>{hero.badge[0]}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 font-mono">{hero.badge[1]}</span>
        </div>

        {/* Headline */}
        <h1 className={`${preloaderDone ? 'stagger-fade-up' : 'opacity-0'} text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.1]`} style={{ '--stagger': 1 }}>
          {hero.headlineA} <br className="hidden sm:inline" />
          <span className="animate-headline bg-gradient-to-r from-zinc-100 via-brand-violet/90 to-zinc-100 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(139,92,246,0.45)]">
            {hero.headlineB}
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`${preloaderDone ? 'stagger-fade-up' : 'opacity-0'} mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal`} style={{ '--stagger': 2 }}>
          <span className="text-zinc-200 font-medium">{hero.bodyStrong}</span> {hero.body}
        </p>

        {/* CTAs */}
        <div className={`${preloaderDone ? 'stagger-fade-up' : 'opacity-0'} mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4`} style={{ '--stagger': 3 }}>
          <Button href={hero.primaryCta.href} external icon={hero.primaryCta.icon}>
            {hero.primaryCta.label}
          </Button>
          {hero.secondaryCtas.map((cta) => (
            <Button
              key={cta.label}
              href={cta.href}
              variant="glass"
              icon={cta.icon}
              {...(cta.href.startsWith('http') ? { external: true } : {})}
            >
              {cta.label}
            </Button>
          ))}
        </div>

        <CountdownCard revealed={preloaderDone} />
        <StatStrip />

        {/* Scroll cue — gentle bobbing chevron inviting the first scroll */}
        <a
          href="#story"
          className="mt-14 inline-flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Scroll to the introduction section"
        >
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase">Scroll</span>
          <span className="material-symbols-outlined animate-bounce-subtle select-none text-[20px]">
            keyboard_arrow_down
          </span>
        </a>
      </div>
    </section>
  )
}
