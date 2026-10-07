'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Tracks which nav section is currently in view using IntersectionObserver.
 * Returns { activeId, progress } where progress is 0..1 of the full page.
 */
export default function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]?.replace('/#', '') || '')
  const [progress, setProgress] = useState(0)
  const observerRef = useRef(null)

  const idsKey = Array.isArray(sectionIds) ? sectionIds.join(',') : ''

  useEffect(() => {
    const ids = (sectionIds || []).map((h) => h.replace('/#', ''))
    let raf = null

    // Setup IntersectionObserver for each section
    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0
        let maxId = activeId

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            maxId = entry.target.id
          }
        })

        if (maxId && maxId !== activeId) {
          setActiveId(maxId)
        }
      },
      {
        rootMargin: '-30% 0px -30% 0px', // Only count when section is in middle 40% of viewport
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    )

    // Observe all section elements
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // Scroll progress tracking (kept from original)
    const measureProgress = () => {
      raf = null
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const nextProgress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      setProgress((prev) => (Math.abs(prev - nextProgress) > 0.005 ? nextProgress : prev))
    }

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(measureProgress)
    }

    measureProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [idsKey, activeId])

  return { activeId, progress }
}