'use client'

import { sponsors, partnerRows } from '../../data/site'

/**
 * Sponsors & Partners — reference layout (screenshot + motion video):
 *   SPONSORS     → 4 landscape brand cards in the content grid
 *   OUR PARTNERS → 3 full-bleed rows of SMALL SQUARE tiles, tightly
 *                  packed; rows 1 & 3 slide left→right, row 2 opposite.
 * Theme stays ours (brand-tile glass); geometry is from the reference.
 */

const toneCls = {
  dark: 'text-zinc-100',
  sky: 'text-brand-cyan',
  green: 'text-emerald-400',
  red: 'text-rose-400',
  orange: 'text-amber-400',
  violet: 'text-brand-violet',
}

function SponsorCard({ item }) {
  return (
    <div className="brand-tile brand-tile-hover rounded-xl aspect-[3/2] flex flex-col items-center justify-center gap-1.5 px-4 text-center">
      <span
        className={`${toneCls[item.tone] || toneCls.dark} ${
          item.script ? 'font-script text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'
        } ${item.bold ? 'font-extrabold' : 'font-bold'} ${
          item.tracking === 'wide' ? 'tracking-[0.18em]' : ''
        } leading-none`}
      >
        {item.name}
      </span>
      {item.sub && (
        <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] text-zinc-500">
          {item.sub}
        </span>
      )}
    </div>
  )
}

function PartnerCard({ item }) {
  return (
    <div className="brand-tile rounded-lg aspect-square w-[84px] sm:w-[104px] shrink-0 flex items-center justify-center p-2 text-center transition-transform duration-650 hover:scale-[1.06]">
      <span
        className={`${toneCls[item.tone] || toneCls.dark} ${
          item.script ? 'font-script text-lg' : 'text-[10px] sm:text-[11px]'
        } ${item.bold ? 'font-extrabold' : 'font-semibold'} leading-tight break-words`}
      >
        {item.name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction, duration }) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee-fade overflow-hidden">
      <div
        className={`flex w-max items-center gap-3 sm:gap-4 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
        style={{ '--marquee-duration': duration }}
      >
        {doubled.map((item, i) => (
          <PartnerCard key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function Partners() {
  return (
    <section id="partners" className="py-20 border-t border-white/[0.06]">
      {/* Everything stays inside the site content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SPONSORS ── */}
        <h2 className="text-center text-sm sm:text-base font-bold tracking-[0.35em] text-brand-violet uppercase mb-8">
          Sponsors
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {sponsors.map((item) => (
            <SponsorCard key={item.name} item={item} />
          ))}
        </div>

        {/* ── OUR PARTNERS — square-tile marquees, inside the container ── */}
        <h2 className="text-center text-xs sm:text-sm font-bold tracking-[0.35em] text-brand-violet uppercase mb-8">
          Our Partners
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {partnerRows.map((row, i) => (
            <MarqueeRow key={i} {...row} />
          ))}
        </div>
      </div>
    </section>
  )
}
