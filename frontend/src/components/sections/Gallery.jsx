'use client'

import Section from '../ui/Section'
import { memories } from '../../data/memories'

/**
 * PAST AI MANTHAN — UNIFIED EVENT MEMORIES SHOWCASE
 * All 9 past photos fitted inside a single clean container box grid.
 * Small thumbnail sizes, non-clickable with smooth zoom hover effect (`cursor-zoom-in`).
 */

export default function Gallery() {
  const allMedia = memories.allPhotos || []

  return (
    <Section id="gallery" className="!bg-[#06080d]">
      {/* ── header ── */}
      <div className="relative text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-mono font-medium tracking-[0.28em] text-cyan-400 uppercase">
          {memories.eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-2 leading-tight">
          {memories.heading}
          <span className="block text-lg sm:text-xl md:text-2xl font-bold text-zinc-300 mt-1">
            {memories.subheading}
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">{memories.body}</p>
      </div>

      {/* ── SINGLE UNIFIED CONTAINER BOX FOR ALL IMAGES ── */}
      <div className="gallery-main-box relative w-full overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#090d16] p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Box Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md border border-cyan-400/40 bg-cyan-500/10 font-mono text-[10px] uppercase tracking-[0.16em] font-semibold text-cyan-300">
              Archives 2023–2025
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-zinc-400">
              Acropolis Arena • Indore
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/90 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">zoom_in</span>
            Hover to zoom • {allMedia.length} Photos
          </span>
        </div>

        {/* Compact Image Grid inside the Single Box (Non-clickable, Cursor Zoom-in) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {allMedia.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-obsidian-900 cursor-zoom-in transition-all duration-300 hover:border-cyan-400/70 hover:shadow-[0_10px_25px_rgba(0,240,255,0.2)]"
            >
              {/* Image with rich smooth hover zoom effect */}
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-125 pointer-events-none"
                loading="lazy"
              />

              {/* Hover gradient overlay & Title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity pointer-events-none" />
              
              <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 flex items-end justify-between gap-2 pointer-events-none">
                <div className="min-w-0">
                  <h4 className="text-[11px] sm:text-xs font-bold text-white tracking-tight truncate group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[9px] text-zinc-400 line-clamp-1 hidden sm:block">
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── achievements / highlights ── */}
      <div className="mt-12 sm:mt-14">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-amber-300">
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
          </span>
          <h3 className="text-sm font-mono font-bold tracking-[0.22em] text-white uppercase">
            Achievements & Highlights
          </h3>
          <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {memories.achievements.map((a) => (
            <div
              key={a.title}
              className="group flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl border border-white/10 bg-[#090d14] p-3.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-[#0e1420] hover:shadow-[0_12px_28px_rgba(0,240,255,0.12)]"
            >
              <span className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-cyan-500/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-[16px] sm:text-[20px]">{a.icon}</span>
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-base font-bold text-white tracking-tight leading-snug font-serif">{a.title}</h4>
                <p className="mt-1 text-[11px] sm:text-xs text-zinc-400 leading-relaxed line-clamp-3 sm:line-clamp-none">{a.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── archive note ── */}
      <p className="text-center text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-600 mt-12">
        Archives 2023 – 2025 • AI Manthan, Acropolis Indore
      </p>
    </Section>
  )
}
