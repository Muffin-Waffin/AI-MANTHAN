'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks which nav section is currently in view + overall scroll progress.
 * Returns { activeId, progress } where progress is 0..1 of the full page.
 * rAF-throttled scroll listener; section pick uses a center-line heuristic.
 */
export default function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]?.replace('/#', '') || '')
  const [progress, setProgress] = useState(0)

  const idsKey = Array.isArray(sectionIds) ? sectionIds.join(',') : ''

  useEffect(() => {
    const ids = (sectionIds || []).map((h) => h.replace('/#', ''))
    let raf = null

    const measure = () => {
      raf = null
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const nextProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      setProgress((prev) => (Math.abs(prev - nextProgress) > 0.005 ? nextProgress : prev))

      // section whose band contains the viewport center line wins
      const line = window.scrollY + window.innerHeight * 0.35
      let current = ids[0] || ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= line) current = id
      }
      // bottom of page → last section
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        current = ids[ids.length - 1] || current
      }
      setActiveId((prev) => (prev !== current ? current : prev))
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [idsKey])

  return { activeId, progress }
}
