'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'

/**
 * Cinematic FULL-SCREEN preloader — the 3D logo-reveal video covers the
 * entire display (object-cover, edge to edge). The moment the video ends,
 * the curtain lifts and the real page is revealed underneath.
 * Safety nets: 20s fallback timer (slow networks / stalled decode),
 * error handler, and click/tap anywhere to skip immediately.
 *
 * IMPORTANT: Preloader ONLY shows on the very first page load.
 * It is skipped on client-side navigation (e.g. clicking "View Profile"
 * from the home page to /faculty/[slug]). This is tracked via a sessionStorage
 * flag so the preloader never replays during the same browsing session.
 *
 * `done` starts `false` (not `true`) so the very first HTML paint — server
 * render included — already contains the curtain. Starting `true` and
 * flipping it in an effect let the real page flash on screen for a beat
 * before the preloader caught up; identical initial state on server and
 * client here means no hydration mismatch either.
 */export default function Preloader() {
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)
  const [muted, setMuted] = useState(false)
  const finished = useRef(false)
  const audioRef = useRef(null)

  // Session-level flag — preloader should only play ONCE per tab session.
  // On subsequent navigations within the same tab, skip it entirely.
  const isFirstLoad = useRef(true)

  useEffect(() => {
    // Check sessionStorage: if we already showed the preloader in this tab,
    // skip it now.
    const alreadyShown = sessionStorage.getItem('aimanthan_preloader_done')
    if (alreadyShown === '1') {
      isFirstLoad.current = false
      setDone(true) // immediately skipped — no preloader curtain
      document.body.dataset.preloader = '0'
    } else {
      isFirstLoad.current = true
      document.body.dataset.preloader = '1'
    }
  }, [])

  const finish = useCallback(() => {
    if (finished.current) return
    if (!isFirstLoad.current) return // never finish if it's a navigation (already skipped)
    finished.current = true
    setExiting(true)
    // Mark in sessionStorage so future navigations skip this preloader
    sessionStorage.setItem('aimanthan_preloader_done', '1')
    const audio = audioRef.current
    if (audio && !audio.paused) {
      // fade the chime out over the same beat as the curtain lift
      const fade = setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.12)
        if (audio.volume <= 0.01) {
          audio.pause()
          clearInterval(fade)
        }
      }, 90)
    }
    // Tell the page (Hero) to start its entrance as the curtain lifts.
    window.dispatchEvent(new Event('preloader-done'))
    setTimeout(() => setDone(true), 950)
  }, [])

  // If this is NOT the first load (i.e. navigation within the app),
  // skip preloader entirely — no video, no curtain, no delay.
  useEffect(() => {
    if (!isFirstLoad.current) {
      setDone(true)
    }
  }, [])

  // Skip preloader setup entirely on navigation — no audio, no event listeners
  useEffect(() => {
    if (!isFirstLoad.current) return

    let mounted = true

    // Browsers block audio-with-sound until a user gesture. Try right away
    // (works when autoplay is permitted); otherwise catch the first tap,
    // click or key press anywhere on the page and retry once.
    const tryPlay = () => {
      const audio = audioRef.current
      if (!audio || finished.current) return
      audio.volume = 0.55
      // A gesture that unlocks audio can be the same click that skips the
      // preloader (finish() runs synchronously right after, in the same
      // dispatch) — play() only resolves later, so re-check and bail so
      // the chime doesn't start under the already-revealed page.
      audio.play().then(() => {
        if (finished.current) audio.pause()
      }).catch(() => {})
    }
    tryPlay()
    const onFirstGesture = () => tryPlay()
    window.addEventListener('pointerdown', onFirstGesture, { once: true, capture: true })
    window.addEventListener('keydown', onFirstGesture, { once: true, capture: true })

    /* safety net — video is ~3.4s; 6s covers slow loads without trapping */
    const fallback = setTimeout(() => mounted && finish(), 6_000)

    return () => {
      mounted = false
      clearTimeout(fallback)
      window.removeEventListener('pointerdown', onFirstGesture, { capture: true })
      window.removeEventListener('keydown', onFirstGesture, { capture: true })
      delete document.body.dataset.preloader
    }
  }, [finish])

  const toggleMute = useCallback((e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    if (audio.muted) {
      audio.muted = false
      audio.volume = 0.55
      audio.play().catch(() => {})
    } else {
      audio.muted = true
    }
    setMuted(audio.muted)
  }, [])

  // If preloader already done/skipped, render nothing
  if (done) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-obsidian-950 overflow-hidden cursor-pointer ${exiting ? 'preloader-exit' : ''
        }`}
      onPointerDown={isFirstLoad.current ? finish : undefined}
      aria-hidden="true"
      title="Click to skip"
    >
      {/* procedural chime — no external asset, see scripts/gen-preloader-sound.py */}
      <audio ref={audioRef} preload="auto" playsInline>
        <source src="/media/preloader-chime.wav" type="audio/wav" />
      </audio>

      <button
        type="button"
        onPointerDown={toggleMute}
        className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors"
        title={muted ? 'Unmute' : 'Mute'}
      >
        <Icon name={muted ? 'volume_off' : 'volume_up'} className="text-[18px]" />
      </button>

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
