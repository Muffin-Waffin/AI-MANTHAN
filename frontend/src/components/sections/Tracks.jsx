'use client'

import Link from 'next/link'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import { domains } from '../../data/tracks'

/* ── TRACKS — clean 12-domain selection grid ─────────────────────────
   The main Tracks section presents ONLY the 12 confirmed domains.
   Problem statements live on the dedicated /problem-statements page
   (data-driven; renders real PS automatically once added to
   data/tracks.js). No bounties or prize values are shown here.

   Accent → tone map (static classes so Tailwind can see every variant;
   no dynamic class-name construction — that was a bug class in the old
   pager, where accents were interpolated into class strings). */
const ACCENT_TONE = {
  azure: { text: 'text-brand-cyan', bg: 'bg-brand-cyan/[0.07]', border: 'hover:border-brand-cyan/40' },
  emerald: { text: 'text-emerald-300', bg: 'bg-emerald-500/[0.07]', border: 'hover:border-emerald-400/40' },
  pink: { text: 'text-pink-300', bg: 'bg-pink-500/[0.07]', border: 'hover:border-pink-400/40' },
  cyan: { text: 'text-cyan-300', bg: 'bg-cyan-500/[0.07]', border: 'hover:border-cyan-400/40' },
  lime: { text: 'text-lime-300', bg: 'bg-lime-500/[0.07]', border: 'hover:border-lime-400/40' },
  amber: { text: 'text-amber-300', bg: 'bg-amber-500/[0.07]', border: 'hover:border-amber-400/40' },
  orange: { text: 'text-orange-300', bg: 'bg-orange-500/[0.07]', border: 'hover:border-orange-400/40' },
  green: { text: 'text-green-300', bg: 'bg-green-500/[0.07]', border: 'hover:border-green-400/40' },
  sky: { text: 'text-sky-300', bg: 'bg-sky-500/[0.07]', border: 'hover:border-sky-400/40' },
  indigo: { text: 'text-indigo-300', bg: 'bg-indigo-500/[0.07]', border: 'hover:border-indigo-400/40' },
  red: { text: 'text-red-300', bg: 'bg-red-500/[0.07]', border: 'hover:border-red-400/40' },
}

function DomainCard({ domain, index }) {
  const tone = ACCENT_TONE[domain.accent] || ACCENT_TONE.cyan
  const psCount = domain.statements.length

  return (
    <Link
      href={`/problem-statements#${domain.id}`}
      className="group relative flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
      style={{ '--di': index }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.09] ${tone.bg} ${tone.text} transition-transform duration-300 group-hover:scale-110`}
        >
          <span className="material-symbols-outlined text-[20px]">{domain.icon}</span>
        </span>
        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
          {domain.number}
        </span>
      </div>

      <h3 className="mt-3.5 text-sm sm:text-[15px] font-bold leading-snug tracking-tight text-white">
        {domain.label}
      </h3>
      <p className="mt-1.5 text-[11px] sm:text-xs leading-relaxed text-zinc-500">
        {domain.blurb}
      </p>

      <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-white/[0.05]">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">
          {psCount > 0 ? `${psCount} Problem Statement${psCount > 1 ? 's' : ''}` : 'Domain'}
        </span>
        <span
          className={`material-symbols-outlined text-[15px] text-zinc-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:${tone.text.replace('text-', 'text-')}`}
          aria-hidden="true"
        >
          arrow_forward
        </span>
      </div>
    </Link>
  )
}

export default function Tracks() {
  return (
    <Section id="tracks">
      <SectionBackdrop variant="circuit" />

      {/* ── heading row ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.32em] text-brand-cyan">
            Problem Domains
          </p>
          <h2 className="mt-1.5 font-mono text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase">
            The 12{' '}
            <span className="text-titanium">Tracks</span>
          </h2>
        </div>
        <p className="max-w-sm text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Pick a domain, find your problem, build something that matters. All
          domains are live for AI Manthan 2.0.
        </p>
      </div>

      {/* ── 12-domain grid: 1 / 2 / 3 / 4 columns ── */}
      <div className="tracks-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {domains.map((domain, i) => (
          <DomainCard key={domain.id} domain={domain} index={i} />
        ))}
      </div>

      {/* ── View All Problem Statements CTA ── */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/problem-statements"
          className="group inline-flex items-center gap-2.5 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-cyan/70 hover:bg-brand-cyan/20 hover:shadow-[0_0_28px_-6px_rgba(0,168,255,0.65)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          View All Problem Statements
          <span
            className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            north_east
          </span>
        </Link>
      </div>
    </Section>
  )
}
