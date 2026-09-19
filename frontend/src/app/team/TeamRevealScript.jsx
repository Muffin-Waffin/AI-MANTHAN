'use client'

import { useEffect } from 'react'

/** Flips .is-inview on .team-reveal sections as they enter the viewport.
    One observer, stagger comes from CSS transition order. */
export default function TeamRevealScript() {
  useEffect(() => {
    const items = document.querySelectorAll('.team-reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return null
}
