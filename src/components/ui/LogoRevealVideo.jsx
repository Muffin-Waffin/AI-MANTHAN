'use client'

import { useEffect, useRef } from 'react'

/**
 * Intro logo-reveal video — guaranteed continuous loop.
 * `loop` covers normal playback; the `ended` listener force-restarts after
 * decoder stalls, and `visibilitychange` resumes playback when the user
 * returns to the tab (browsers sometimes pause muted videos in background).
 */
export default function LogoRevealVideo({
  className = 'w-full aspect-video object-cover rounded-xl',
}) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return

    const restart = () => {
      v.currentTime = 0
      v.play().catch(() => {})
    }
    const onVisible = () => {
      if (!document.hidden && v.paused) restart()
    }

    v.addEventListener('ended', restart)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      v.removeEventListener('ended', restart)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className={className}
      aria-label="AI Manthan 3D logo reveal animation"
    >
      <source src="/media/logo-reveal.mp4" type="video/mp4" />
    </video>
  )
}
