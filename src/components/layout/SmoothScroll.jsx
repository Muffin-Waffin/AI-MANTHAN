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

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      return () => {
        window.removeEventListener('scroll', updateProgress)
        window.removeEventListener('resize', updateProgress)
      }
    }

    /* Auto-scroll kill switch: a stale #hash (or the browser's native
       scroll restoration) must never fling a fresh visitor to a section —
       every entry lands on the hero. */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
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
      io.disconnect()
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[90] pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-emerald shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-[width] duration-150 ease-out"
        style={{ width: '0%' }}
      />
    </div>
  )
}
