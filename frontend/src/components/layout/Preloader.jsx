'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'

/**
 * Cinematic FULL-SCREEN preloader — high-tech Cyberpunk HUD with 3D video reveal.
 * Features:
 * - Edge-to-edge full-bleed video with radial darkening and subtle cyber grid.
 * - Dynamic progress bar (0% -> 100%) tracking video decode or smooth fallback ticker.
 * - Live cyber status readout (mission logs) cycling through initialization steps.
 * - Tactile Skip button (44px touch target) + click/tap anywhere safety.
 * - Mute/Unmute audio toggle with procedural chime sound.
 * - Clean session-level gating so it plays only once per tab session.
 * - Smooth curtain-lift exit synchronized with Hero entrance.
 */
export default function Preloader() {
  const [exiting, setExiting] = useState(false)
  const [done, setDone] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('INITIALIZING NEURAL SYSTEMS...')
  const finished = useRef(false)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const isFirstLoad = useRef(true)

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('aimanthan_preloader_done')
    if (alreadyShown === '1') {
      isFirstLoad.current = false
      setDone(true)
      document.body.dataset.preloader = '0'
    } else {
      isFirstLoad.current = true
      document.body.dataset.preloader = '1'
    }
  }, [])

  const finish = useCallback(() => {
    if (finished.current) return
    if (!isFirstLoad.current) return
    finished.current = true
    setExiting(true)
    sessionStorage.setItem('aimanthan_preloader_done', '1')

    const audio = audioRef.current
    if (audio && !audio.paused) {
      const fade = setInterval(() => {
        audio.volume = Math.max(0, audio.volume - 0.12)
        if (audio.volume <= 0.01) {
          audio.pause()
          clearInterval(fade)
        }
      }, 70)
    }

    window.dispatchEvent(new Event('preloader-done'))
    setTimeout(() => {
      setDone(true)
      delete document.body.dataset.preloader
    }, 850)
  }, [])

  useEffect(() => {
    if (!isFirstLoad.current) return

    let mounted = true

    // Audio unlock on gesture
    const tryPlay = () => {
      const audio = audioRef.current
      if (!audio || finished.current) return
      audio.volume = 0.55
      audio.play().then(() => {
        if (finished.current) audio.pause()
      }).catch(() => {})
    }
    tryPlay()
    const onFirstGesture = () => tryPlay()
    window.addEventListener('pointerdown', onFirstGesture, { once: true, capture: true })
    window.addEventListener('keydown', onFirstGesture, { once: true, capture: true })

    // Progress timer & status ticker fallback (covers video stalls / no-autoplay on mobile)
    const startTime = Date.now()
    const TARGET_DURATION = 3200 // 3.2s smooth reveal

    const progressInterval = setInterval(() => {
      if (!mounted || finished.current) {
        clearInterval(progressInterval)
        return
      }

      const elapsed = Date.now() - startTime
      const pct = Math.min(100, Math.round((elapsed / TARGET_DURATION) * 100))
      setProgress((prev) => Math.max(prev, pct))

      if (pct < 28) {
        setStatusText('INITIALIZING NEURAL NETWORKS...')
      } else if (pct < 56) {
        setStatusText('SYNCHRONIZING 6 CHALLENGE TRACKS...')
      } else if (pct < 84) {
        setStatusText('CALIBRATING PRIZE VAULT...')
      } else if (pct < 99) {
        setStatusText('QUANTUM PROTOCOLS ONLINE // READY')
      } else {
        setStatusText('INITIALIZATION COMPLETE')
        clearInterval(progressInterval)
        setTimeout(() => mounted && finish(), 250)
      }
    }, 40)

    // Hard fallback safety net: 4.8s max
    const fallback = setTimeout(() => mounted && finish(), 4800)

    return () => {
      mounted = false
      clearInterval(progressInterval)
      clearTimeout(fallback)
      window.removeEventListener('pointerdown', onFirstGesture, { capture: true })
      window.removeEventListener('keydown', onFirstGesture, { capture: true })
      delete document.body.dataset.preloader
    }
  }, [finish])

  const handleVideoTimeUpdate = () => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const vidPct = Math.min(100, Math.round((v.currentTime / v.duration) * 100))
    setProgress((prev) => Math.max(prev, vidPct))
  }

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

  const handleSkipClick = (e) => {
    e.stopPropagation()
    finish()
  }

  if (done) return null

  return (
    <div
      className={`fixed inset-0 z-[100] bg-obsidian-950 overflow-hidden select-none cursor-pointer ${
        exiting ? 'preloader-exit' : ''
      }`}
      onPointerDown={isFirstLoad.current ? finish : undefined}
      aria-label="Loading AI Manthan 2026"
    >
      {/* Procedural sound chime */}
      <audio ref={audioRef} preload="auto" playsInline>
        <source src="/media/preloader-chime.wav" type="audio/wav" />
      </audio>

      {/* Top HUD Controls Bar */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between pointer-events-none">
        {/* System status beacon */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          </span>
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-300 uppercase">
            AI MANTHAN // CORE OS
          </span>
        </div>

        {/* Action buttons (Mute + Skip) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={toggleMute}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-zinc-300 hover:text-white bg-black/40 hover:bg-white/[0.15] border border-white/15 backdrop-blur-md transition-all"
            title={muted ? 'Unmute sound' : 'Mute sound'}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          >
            <Icon name={muted ? 'volume_off' : 'volume_up'} className="text-[18px]" />
          </button>

          <button
            type="button"
            onClick={handleSkipClick}
            className="flex items-center gap-1.5 h-9 sm:h-10 px-3.5 sm:px-4 rounded-full text-zinc-200 hover:text-white bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 backdrop-blur-md text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_18px_rgba(147,51,234,0.3)] hover:shadow-[0_0_24px_rgba(147,51,234,0.6)]"
          >
            <span>Skip</span>
            <Icon name="fast_forward" className="text-[15px] text-fuchsia-300" />
          </button>
        </div>
      </div>

      {/* Full-bleed video reveal */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={finish}
        onError={finish}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/media/preloader.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric depth & readability layers */}
      <div className="absolute inset-0 bg-obsidian-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(4,5,8,0.85)_100%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-transparent pointer-events-none" />

      {/* Center cyber branding overlay */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="relative mb-3 sm:mb-4 flex items-center justify-center">
          <div className="absolute w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-brand-violet/30 blur-2xl animate-pulse" />
          <img
            src="/logos/butterfly.png"
            alt=""
            className="relative w-11 h-11 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_25px_rgba(217,70,239,0.8)] animate-butterfly-hover"
          />
        </div>

        <h1
          className="font-mono text-lg sm:text-4xl md:text-5xl font-extrabold tracking-[0.22em] sm:tracking-[0.45em] text-white uppercase pl-[0.22em] sm:pl-[0.45em]"
          style={{
            textShadow:
              '0 0 20px rgba(168,85,247,0.85), 0 0 45px rgba(124,58,237,0.45), 0 2px 14px rgba(0,0,0,0.95)',
          }}
        >
          AI MANTHAN
        </h1>

        <p className="mt-2 font-mono text-[9px] sm:text-xs tracking-[0.18em] sm:tracking-[0.32em] text-fuchsia-300/80 uppercase">
          CENTRAL INDIA'S LARGEST AI HACKATHON
        </p>
      </div>

      {/* Bottom Cyber Progress HUD */}
      <div className="absolute bottom-8 sm:bottom-12 inset-x-4 sm:inset-x-0 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-sm sm:max-w-md px-4">
          {/* Status ticker + percentage */}
          <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px] sm:text-[11px] tracking-wider text-zinc-400">
            <span className="truncate text-fuchsia-300 font-semibold">{statusText}</span>
            <span className="shrink-0 text-white font-bold tabular-nums">[{progress}%]</span>
          </div>

          {/* Progress bar outer rail */}
          <div className="relative h-1.5 sm:h-2 w-full rounded-full bg-white/[0.08] border border-white/[0.12] overflow-hidden backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
            {/* Progress bar glowing gradient track */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 transition-all duration-100 ease-out shadow-[0_0_14px_rgba(217,70,239,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Hint text */}
          <div className="mt-3 text-center font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-zinc-500 uppercase animate-pulse">
            Tap anywhere to enter
          </div>
        </div>
      </div>
    </div>
  )
}

