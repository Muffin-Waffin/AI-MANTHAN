'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Cinematic FULL-SCREEN preloader — the 3D logo-reveal video covers the
 * entire display (object-cover, edge to edge). The moment the video ends,
 * the curtain lifts and the real page is revealed underneath.
 * Safety nets: 20s fallback timer (slow networks / stalled decode),
 * error handler, and click/tap anywhere to skip immediately.
 */
export default function Preloader() {
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(true)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    setExiting(true)
    // Tell the page (Hero) to start its entrance as the curtain lifts.
    window.dispatchEvent(new Event('preloader-done'))
    setTimeout(() => setDone(true), 950)
  }, [])

  useEffect(() => {
    let mounted = true
    setDone(false)
    document.body.dataset.preloader = '1'

    /* safety net — video is ~3.4s; 6s covers slow loads without trapping */
    const fallback = setTimeout(() => mounted && finish(), 6_000)

    return () => {
      mounted = false
      clearTimeout(fallback)
      delete document.body.dataset.preloader
    }
  }, [finish])

  if (done) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-obsidian-950 overflow-hidden cursor-pointer ${exiting ? 'preloader-exit' : ''
        }`}
      onPointerDown={finish}
      aria-hidden="true"
      title="Click to skip"
    >
      {/* full-bleed video — covers the whole viewport */}
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/preloader.mp4" type="video/mp4" />
      </video>

      {/* darkening layers — video dims so the wordmark owns the frame */}
      <div className="absolute inset-0 bg-obsidian-950/45 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,7,10,0.8)_100%)] pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-obsidian-950 via-obsidian-950/70 to-transparent pointer-events-none"></div>

      {/* bottom overlay — big glowing wordmark + skip hint */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
        <div
          className="font-mono text-lg sm:text-2xl font-bold tracking-[0.55em] text-white uppercase pl-[0.55em]"
          style={{
            textShadow:
              '0 0 18px rgba(124,58,237,0.9), 0 0 46px rgba(124,58,237,0.5), 0 2px 16px rgba(0,0,0,0.9)',
            animation: 'preloader-zoom 4s ease-in-out infinite',
          }}
        >
          AI Manthan
        </div>
        <div className="font-mono text-[10px] tracking-[0.35em] text-white/50 uppercase pl-[0.35em] animate-pulse">
          Click to skip
        </div>
      </div>
    </div>
  )
}
