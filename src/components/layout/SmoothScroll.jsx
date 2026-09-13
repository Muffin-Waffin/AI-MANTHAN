'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Site-wide smooth scrolling (lenis) — heavy inertial feel that makes
 * wheel scrolling glide (~4× the travel per flick vs raw browser steps).
 * Also drives section reveal transitions: every <section> fades/slides up
 * the first time it enters the viewport.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

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
      document.removeEventListener('click', onClick)
      io.disconnect()
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
