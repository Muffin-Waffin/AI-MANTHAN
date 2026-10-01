'use client'

import { useState, useEffect } from 'react'

const UNSTOP_URL =
  'https://unstop.com/hackathons/ai-manthan-20-acropolis-institute-of-technology-and-research-indore-1751106'

/**
 * UnstopEventModal
 * Auto-popup on page load has been disabled so the site loads cleanly
 * without any intrusive modal popups jumping up when opening the URL.
 */
export default function UnstopEventModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-unstop-modal', handleOpen)
    return () => window.removeEventListener('open-unstop-modal', handleOpen)
  }, [])

  if (!open) return null

  const handleClose = () => {
    setOpen(false)
  }

  const handleBannerClick = () => {
    window.open(UNSTOP_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl rounded-2xl sm:rounded-3xl bg-[#060a14] border border-cyan-500/40 shadow-[0_0_80px_rgba(0,240,255,0.35)] overflow-hidden z-10 flex flex-col my-auto transition-transform duration-300 scale-100">
        
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 bg-[#0a1120] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-sm sm:text-base font-mono font-bold tracking-widest text-cyan-300 uppercase">
              Official Hackathon Registration
            </span>
          </div>

          {/* Close Cross Icon Button */}
          <button
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close announcement"
            title="Close"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">close</span>
          </button>
        </div>

        {/* Clickable Banner Image Section */}
        <div
          onClick={handleBannerClick}
          className="relative group cursor-pointer overflow-hidden bg-black/40 min-h-[260px] sm:min-h-[340px] md:min-h-[420px]"
        >
          <img
            src="/banners/unstop-event-banner.png"
            alt="AI मंथन 2.0 Unstop Banner"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.015]"
          />

          {/* Hover Overlay Spotlight Cue */}
          <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-300 flex items-center justify-center pointer-events-none">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full border border-cyan-400/50 flex items-center gap-2 text-cyan-300 text-xs sm:text-sm font-bold shadow-lg">
              <span>Click to Register on Unstop</span>
              <span className="material-symbols-outlined text-base">north_east</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 bg-[#0a1120] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">24 HRS HACKATHON</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">₹1 LAKH+ PRIZE POOL</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handleClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
            <a
              href={UNSTOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md shadow-cyan-500/20"
            >
              <span>Register Now on Unstop</span>
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                north_east
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
