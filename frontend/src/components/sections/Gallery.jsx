'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Section from '../ui/Section'
import { memories } from '../../data/memories'

/**
 * PAST AI MANTHAN — EVENT MEMORIES
 * Premium memory experience: featured memory → themed collections →
 * previous-year stats → achievements. Data-driven from data/memories.js;
 * collections render only when media exists (no fabricated photos).
 * Lightbox: keyboard (Esc/←/→), focus trap-ish, body scroll locked.
 */

const ACCENT = {
  azure: 'text-brand-cyan bg-brand-cyan/[0.08] border-brand-cyan/30',
  cyan: 'text-cyan-300 bg-cyan-500/[0.08] border-cyan-400/30',
  amber: 'text-amber-300 bg-amber-500/[0.08] border-amber-400/30',
  pink: 'text-pink-300 bg-pink-500/[0.08] border-pink-400/30',
  emerald: 'text-emerald-300 bg-emerald-500/[0.08] border-emerald-400/30',
}

/* All currently viewable media (featured + collections), for lightbox nav. */
function useMediaIndex() {
  const featured = memories.featured.img || memories.featured.video
  const items = []
  if (featured) items.push(memories.featured)
  for (const c of memories.collections) {
    for (const it of c.items) items.push({ ...it, tag: c.title })
  }
  return items
}

export default function Gallery() {
  const collectionsWithMedia = memories.collections.filter((c) => c.items.length > 0)
  const hasFeatured = !!(memories.featured.img || memories.featured.video)

  /* ── lightbox state ── */
  const allMedia = useMediaIndex()
  const [lightbox, setLightbox] = useState(null) // index into allMedia
  const lastFocus = useRef(null)

  const openLightbox = useCallback((idx) => {
    if (idx < 0 || idx >= allMedia.length) return
    lastFocus.current = document.activeElement
    setLightbox(idx)
  }, [allMedia.length])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    /* restore focus + scroll position (body scroll-lock removal) */
    if (lastFocus.current?.focus) lastFocus.current.focus()
  }, [])

  const step = useCallback((dir) => {
    setLightbox((cur) => {
      if (cur == null) return cur
      const next = (cur + dir + allMedia.length) % allMedia.length
      return next
    })
  }, [allMedia.length])

  /* keyboard + scroll lock while the lightbox is open */
  useEffect(() => {
    if (lightbox == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightbox, closeLightbox, step])

  const current = lightbox != null ? allMedia[lightbox] : null

  return (
    <Section id="gallery" className="!bg-[#06080d]">
      {/* ── header ── */}
      <div className="relative text-center max-w-2xl mx-auto mb-9 sm:mb-12">
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

      {/* ── featured memory ── */}
      {hasFeatured ? (
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="gallery-frame group relative block w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-obsidian-900 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan"
          aria-label={`Open featured memory: ${memories.featured.title}`}
        >
          <div className="gallery-ambient relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            {memories.featured.video ? (
              <video
                src={memories.featured.video}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={memories.featured.img}
                alt={memories.featured.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/90 via-obsidian-950/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded border border-brand-cyan/50 bg-brand-cyan/25 font-mono text-[9px] uppercase tracking-[0.14em] font-semibold text-white backdrop-blur-sm">
                {memories.featured.tag}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-zinc-400">
                {memories.featured.meta}
              </span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
              {memories.featured.title}
            </h3>
            <p className="mt-1.5 max-w-xl text-[11px] sm:text-sm text-zinc-300/90 leading-relaxed">
              {memories.featured.body}
            </p>
          </div>
        </button>
      ) : (
        /* Featured placeholder — honest state until real media lands */
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-white/[0.015]">
          <div className="aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center text-center px-6">
            <img
              src="/logos/aimathan-logo.png"
              alt=""
              aria-hidden="true"
              className="h-16 w-24 sm:h-20 sm:w-32 object-contain opacity-70 mb-4"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              Event photographs & videos coming soon
            </p>
            <p className="mt-2 max-w-md text-xs text-zinc-500 leading-relaxed">
              {memories.featured.body}
            </p>
          </div>
        </div>
      )}

      {/* ── themed collections (render only when media exists) ── */}
      {collectionsWithMedia.length > 0 && (
        <div className="mt-10 space-y-12">
          {collectionsWithMedia.map((col) => (
            <div key={col.id}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg border ${ACCENT[col.accent] || ACCENT.cyan}`}
                >
                  <span className="material-symbols-outlined text-[16px]">{col.icon}</span>
                </span>
                <h3 className="text-sm font-mono font-bold tracking-[0.22em] text-white uppercase">
                  {col.title}
                </h3>
                <span className="h-px flex-1 bg-white/[0.07]" />
                <span className="font-mono text-[10px] text-zinc-600">
                  {col.items.length} ITEMS
                </span>
              </div>
              <div className="memories-grid grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
                {col.items.map((item, i) => {
                  const idx = allMedia.findIndex(
                    (m) => m.title === item.title && m.img === item.img,
                  )
                  return (
                    <button
                      key={`${item.title}-${i}`}
                      type="button"
                      onClick={() => openLightbox(idx)}
                      className="gallery-frame group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-obsidian-900 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
                      aria-label={`Open memory: ${item.title}`}
                    >
                      <div className="gallery-ambient relative aspect-[4/3] overflow-hidden">
                        {item.video ? (
                          <video
                            src={item.video}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={item.img}
                            alt={item.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                        <div className="text-[8px] sm:text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-zinc-400 mb-0.5 sm:mb-1 truncate">
                          {col.title}
                        </div>
                        <h4 className="gallery-title inline-block text-xs sm:text-sm font-bold text-white tracking-tight leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}



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

      {/* ── lightbox ── */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Memory viewer: ${current.title}`}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-obsidian-950/95 backdrop-blur-md p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full border border-white/[0.14] bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] transition-colors"
            aria-label="Close memory viewer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {allMedia.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                className="absolute left-3 sm:left-6 grid h-10 w-10 place-items-center rounded-full border border-white/[0.14] bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] transition-colors"
                aria-label="Previous memory"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                className="absolute right-3 sm:right-6 grid h-10 w-10 place-items-center rounded-full border border-white/[0.14] bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12] transition-colors"
                aria-label="Next memory"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </>
          )}

          <figure
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {current.video ? (
              <video
                src={current.video}
                className="max-h-[76vh] w-full rounded-2xl object-contain bg-black"
                autoPlay
                controls
                playsInline
              />
            ) : (
              <img
                src={current.img}
                alt={current.title}
                className="max-h-[76vh] w-full rounded-2xl object-contain"
              />
            )}
            <figcaption className="mt-3 text-center">
              <div className="text-sm font-bold text-white">{current.title}</div>
              {current.body && (
                <div className="mt-1 text-xs text-zinc-400">{current.body}</div>
              )}
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                {(lightbox ?? 0) + 1} / {allMedia.length}
              </div>
            </figcaption>
          </figure>
        </div>
      )}
    </Section>
  )
}
