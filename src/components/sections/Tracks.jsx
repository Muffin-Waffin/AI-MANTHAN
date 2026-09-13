'use client'

import { useState } from 'react'
import Icon from '../ui/Icon'
import Section from '../ui/Section'
import Badge from '../ui/Badge'
import { trackFilters, tracks } from '../../data/tracks'

function FilterPill({ label, active, onClick }) {
  const cls = active
    ? 'bg-white text-zinc-950 font-semibold shadow-[0_0_18px_-4px_rgba(255,255,255,0.45)]'
    : 'glass text-zinc-400 hover:text-white hover:-translate-y-0.5'
  return (
    <button
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${cls}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function TrackCard({ track }) {
  return (
    <div className="glass glass-hover sheen p-6 rounded-2xl flex flex-col justify-between group/track">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-mono font-bold text-zinc-400 transition-colors duration-650 group-hover/track:text-white">{track.number}</span>
          <Badge accent={track.accent}>{track.bounty}</Badge>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">{track.title}</h3>
        <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">{track.body}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-white/[0.06]">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {track.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-white/[0.04] text-[11px] text-zinc-300 font-mono transition-colors duration-650 group-hover/track:bg-white/[0.08] group-hover/track:text-zinc-100"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500">
          <Icon name="lock" className="text-[14px]" />
          Problem statements unlock Sep 15
        </span>
      </div>
    </div>
  )
}

export default function Tracks() {
  const [active, setActive] = useState('all')
  const visible = tracks.filter((t) => active === 'all' || t.id === active)

  return (
    <Section id="tracks">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
            Engineering Arenas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            Challenge Tracks &amp; Problem Statements
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-xl">
            Choose a challenge vector to solve. Each track features dedicated mentor review,
            specific judging rubrics, and independent bounty vaults.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-500">
          Showing {visible.length} Verified Tracks
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap mb-10">
        {trackFilters.map((f) => (
          <FilterPill
            key={f.id}
            label={f.label}
            active={active === f.id}
            onClick={() => setActive(f.id)}
          />
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </Section>
  )
}
