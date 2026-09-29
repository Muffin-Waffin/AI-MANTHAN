'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * Site-wide smooth scrolling (lenis) — heavy inertial feel that makes
 * wheel scrolling glide (~4× the travel per flick vs raw browser steps).
 * Also drives section reveal transitions: every <section> fades/slides up
 * the first time it enters the viewport, plus a top scroll-progress bar
 * that fills as you move down the page.
 */
export default function SmoothScroll() {
  const barRef = useRef(null)

  useEffect(() => {
    // Scroll-progress bar — independent of lenis/reduced-motion below, so
    // it still works (without the inertial glide) when motion is reduced.
    const updateProgress = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? (doc.scrollTop || window.scrollY) / max : 0
      if (barRef.current) barRef.current.style.width = `${Math.min(1, Math.max(0, pct)) * 100}%`
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    /* ── Scroll memory for Back navigation ────────────────────────────
       Har cross-page internal link click pe source page ki scroll
       position save hoti hai (per-path, sessionStorage). SmartBack se
       wapas aane par exact wahi position restore hoti hai — top nahi. */
    const SAVE_PREFIX = 'aim-back:'
    const onLinkClick = (e) => {
      const a = e.target.closest?.('a[href]')
      if (!a || a.hasAttribute('data-smart-back')) return
      try {
        const url = new URL(a.href, window.location.href)
        if (url.origin !== window.location.origin) return
        if (url.pathname !== window.location.pathname) {
          sessionStorage.setItem(
            SAVE_PREFIX + window.location.pathname,
            String(Math.round(window.scrollY))
          )
          // hamara apna "internal nav" marker — SmartBack isse detect karta
          // hai ki history.back() safe hai (Next ke __NA par depend nahi).
          sessionStorage.setItem('aim-internal-nav', '1')
        }
      } catch { /* ignore */ }
    }
    document.addEventListener('click', onLinkClick, true)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      try {
        if (sessionStorage.getItem('aim-restore-now')) {
          sessionStorage.removeItem('aim-restore-now')
          const saved = sessionStorage.getItem(SAVE_PREFIX + window.location.pathname)
          if (saved != null) {
            sessionStorage.removeItem(SAVE_PREFIX + window.location.pathname)
            const y = Number(saved) || 0
            ;[0, 120, 400].forEach((d) => setTimeout(() => window.scrollTo(0, y), d))
          }
        }
      } catch { /* ignore */ }
      return () => {
        window.removeEventListener('scroll', updateProgress)
        window.removeEventListener('resize', updateProgress)
        document.removeEventListener('click', onLinkClick)
      }
    }

    /* Auto-scroll kill switch: a stale #hash (or the browser's native
       scroll restoration) must never fling a fresh visitor to a section —
       every entry lands on the hero. */
    /* Restore request? SmartBack set the flag just before history.back().
       Consume the saved offset for THIS path and prepare an instant jump. */
    let restoreY = null
    try {
      if (sessionStorage.getItem('aim-restore-now')) {
        sessionStorage.removeItem('aim-restore-now')
        const saved = sessionStorage.getItem(SAVE_PREFIX + window.location.pathname)
        if (saved != null) {
          sessionStorage.removeItem(SAVE_PREFIX + window.location.pathname)
          restoreY = Number(saved) || 0
        }
      }
    } catch { /* ignore */ }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (restoreY == null) window.scrollTo(0, 0)
    const clearStaleHash = () => {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
    clearStaleHash()

    const lenis = new Lenis({
      duration: 1.25, // glide length — the "heavy scroll" feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
    })
    lenis.on('scroll', updateProgress)

    /* Back se aaye ho toh saved offset pe instant jump (no animation).
       Next apni scroll restoration kabhi-kabhi humse baad me chalata hai,
       isliye kai ticks pe re-assert karte hain — user ka pehla scroll
       (~600ms baad) respect hota hai. */
    const jumpTimers = []
    const jumpNow = () => {
      lenis.scrollTo(restoreY, { immediate: true, force: true })
      window.scrollTo(0, restoreY)
    }
    if (restoreY != null) {
      requestAnimationFrame(() => requestAnimationFrame(jumpNow))
      jumpTimers.push(setTimeout(jumpNow, 120))
      jumpTimers.push(setTimeout(jumpNow, 400))
    }

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // anchor links route through lenis for buttery section jumps
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      const el = id && document.getElementById(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -90, duration: 1.4 })
      }
    }
    document.addEventListener('click', onClick)

    // section reveal transitions
    const sections = document.querySelectorAll('main section[id]')
    sections.forEach((s) => s.classList.add('reveal-init'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    sections.forEach((s) => io.observe(s))

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      document.removeEventListener('click', onClick)
      document.removeEventListener('click', onLinkClick)
      jumpTimers.forEach(clearTimeout)
      io.disconnect()
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[90] pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#0094ff] via-brand-cyan to-[#7df4ff] shadow-[0_0_12px_rgba(0,240,255,0.6)] transition-[width] duration-150 ease-out"
        style={{ width: '0%' }}
      />
    </div>
  )
}
