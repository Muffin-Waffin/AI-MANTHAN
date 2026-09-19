'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import { tracks } from '../../data/tracks'

/* ── EMBRACE THE CHAOS — tracks as a two-pane explorer ──────────────
   Left: track selector (the arenas). Right: pager through that track's
   problem statements. "Download Rulebook" opens the global modal via
   the shared window event. */

/* Keyword highlighting — tech/domain terms inside the description get
   a subtle accent treatment so scanners can spot the stack fast. */
const KEYWORDS = [
  'AI', 'machine learning', 'LLMs', 'diffusion', 'CV', 'ONNX',
  'LoRa', 'BLE', 'CRDTs', 'P2P', 'IoT', 'telemetry', 'CV depth',
  'zero-knowledge', 'ZK', 'EZKL', 'Halo2', 'cryptographic', 'attestation',
  'ledger', 'quadratic voting', 'tamper-evident', 'UPI', 'SMS',
  'Graph Neural', 'Account Aggregators', 'FHIR', 'edge algorithms',
  'offline-first', 'few-shot', 'open-weight', 'Speech', 'dashboard',
]

function HighlightedText({ text }) {
  const pattern = new RegExp(
    `(${KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'g',
  )
  const parts = text.split(pattern)
  return (
    <>
      {parts.map((part, i) =>
        pattern.test(part) && KEYWORDS.some((k) => k === part) ? (
          <mark
            key={i}
            className="rounded bg-brand-violet/20 px-1 py-0.5 font-semibold text-violet-200"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}export default function Tracks() {
  const [activeId, setActiveId] = useState(tracks[0].id)
  const [stmtIdx, setStmtIdx] = useState(0)
  const sectionRef = useRef(null)

  const track = useMemo(() => tracks.find((t) => t.id === activeId), [activeId])
  const stmt = track.statements[Math.min(stmtIdx, track.statements.length - 1)]

  /* Keyboard paging — ←/→ arrows (when the section is in view) jump
     between statements without leaving the keyboard. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const sec = sectionRef.current
      if (!sec) return
      const r = sec.getBoundingClientRect()
      const inView = r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3
      if (!inView) return
      const target = document.activeElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      e.preventDefault()
      if (e.key === 'ArrowLeft') setStmtIdx((i) => Math.max(0, i - 1))
      else setStmtIdx((i) => Math.min(track.statements.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [track.statements.length])

  /* Per-accent glow color for the reader frame (Tailwind can't do
     dynamic class names, so we map accents to raw rgba values). */
  const ACCENT_RGB = {
    violet: '147, 51, 234',
    emerald: '16, 185, 129',
    cyan: '34, 211, 238',
    pink: '236, 72, 153',
    amber: '245, 158, 11',
  }
  const accentRgb = ACCENT_RGB[track.accent] || ACCENT_RGB.violet

  const selectTrack = (id) => {
    setActiveId(id)
    setStmtIdx(0)
  }

  return (
    <Section id="tracks" ref={sectionRef} className="!pt-20 sm:!pt-24 !pb-12 !px-4 sm:!px-6 lg:!px-[8%]">
      <SectionBackdrop variant="circuit" />

      {/* ── heading row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <h2 className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
          Embrace the{' '}
          <span className="text-brand-violet" style={{ fontFamily: 'var(--font-display), monospace' }}>
            Chaos
          </span>
        </h2>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-rulebook-modal'))}
          className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-white/[0.09] hover:border-white/[0.25]"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download Rulebook
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr] items-stretch">
        {/* ── left: track list ── */}
        <div className="flex flex-col gap-2.5">
          {tracks.map((t) => {
            const active = t.id === activeId
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTrack(t.id)}
                className={`group flex items-center gap-3.5 rounded-2xl px-4 py-4 text-left transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-[0_10px_34px_-10px_rgba(147,51,234,0.75)]'
                    : 'bg-zinc-900/80 hover:bg-zinc-800/80'
                }`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors ${
                    active ? 'bg-white/[0.16] text-white' : 'bg-white/[0.05] text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate font-mono text-[13px] font-bold tracking-[0.12em] uppercase ${
                      active ? 'text-white' : 'text-zinc-300'
                    }`}
                  >
                    {t.label}
                  </span>
                  <span className={`block text-[11px] truncate ${active ? 'text-white/75' : 'text-zinc-500'}`}>
                    {t.bounty} bounty · {t.statements.length} statements
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* ── right: statement pager + reader ── */}
        <div className="min-w-0">
          {/* pager bar */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-zinc-900/60 p-2">
            <button
              type="button"
              onClick={() => setStmtIdx((i) => Math.max(0, i - 1))}
              disabled={stmtIdx === 0}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-zinc-400 transition-all enabled:hover:text-white disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[15px]">chevron_left</span>
              Prev
            </button>
            <span className="shrink-0 font-mono text-[11px] font-bold tracking-[0.22em] text-white">
              {stmtIdx + 1} <span className="text-zinc-500">of</span> {track.statements.length}
            </span>
            <button
              type="button"
              onClick={() => setStmtIdx((i) => Math.min(track.statements.length - 1, i + 1))}
              disabled={stmtIdx >= track.statements.length - 1}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-white transition-all enabled:hover:bg-white/[0.1] disabled:opacity-30"
            >
              Next
              <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </button>
          </div>

          {/* reader card — border + glow follow the active track's accent.
              Inner scroller needs min-h-0, otherwise the flex child grows
              to content height and overflow-y never kicks in. */}
          <div
            key={track.id + stmtIdx}
            className="stmt-swap relative flex max-h-[600px] min-h-0 flex-col overflow-hidden rounded-2xl bg-zinc-900/70"
            style={{
              border: `1px solid rgba(${accentRgb}, 0.35)`,
              boxShadow: `0 0 34px -10px rgba(${accentRgb}, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            <div
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-7 sm:p-9"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">
                  {track.label}
                </span>
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-brand-violet uppercase">
                  Statement {String(stmtIdx + 1).padStart(2, '0')} / {String(track.statements.length).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white">
                {stmt.title}
              </h3>

              {stmt.sdg && (
                <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.04] px-3.5 py-2.5">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-[13px] font-black text-white"
                    style={{ backgroundColor: stmt.sdg.color }}
                  >
                    {stmt.sdg.n}
                  </span>
                  <span className="text-sm font-semibold text-zinc-200">{stmt.sdg.label}</span>
                </div>
              )}

              <p className="mt-7 font-mono text-[11px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                Problem Description
              </p>
              <p className="mt-3 text-[15px] leading-[1.8] text-zinc-300">
                <HighlightedText text={stmt.description} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
