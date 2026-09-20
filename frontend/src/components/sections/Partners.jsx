'use client'

import { platinumSponsors, goldSponsors, partnerRows } from '../../data/site'
import SectionBackdrop from '../ui/SectionBackdrop'

/**
 * Sponsors & Partners — reference layout (screenshot + motion video):
 *   PLATINUM SPONSORS → one moving marquee row of 4 large landscape cards
 *   GOLD SPONSORS     → one moving marquee row of 5 compact cards, opposite dir
 *   OUR PARTNERS      → 3 full-bleed rows of SMALL SQUARE tiles, tightly
 *                       packed; rows 1 & 3 slide left→right, row 2 opposite.
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

/* Shared heading style so all three tier titles line up identically. */
const tierHeading =
  'text-center text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.35em] text-brand-violet uppercase mb-4 sm:mb-6 md:mb-8'

function SponsorCard({ item, compact = false }) {
  const nameCls = item.script
    ? `font-script ${compact ? 'text-[13px] sm:text-lg md:text-xl' : 'text-lg sm:text-2xl md:text-3xl'}`
    : `${compact ? 'text-[10px] sm:text-sm md:text-base' : 'text-sm sm:text-lg md:text-2xl'} ${
        item.tracking === 'wide' ? 'tracking-[0.18em]' : ''
      }`

  return (
    <div
      className={`brand-tile brand-tile-hover rounded-xl flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 text-center min-w-0 shrink-0 ${
        compact
          ? 'h-[165px] w-[230px] max-w-[78vw]'
          : 'aspect-[3/2] w-[190px] sm:w-[260px] md:w-[320px]'
      }`}
    >
      <span
        className={`${toneCls[item.tone] || toneCls.dark} ${nameCls} ${
          item.bold ? 'font-extrabold' : 'font-bold'
        } leading-tight sm:leading-none break-words`}
      >
        {item.name}
      </span>
      {item.sub && (
        <span className="text-[6px] sm:text-[9px] font-semibold tracking-[0.2em] text-zinc-500">
          {item.sub}
        </span>
      )}
    </div>
  )
}

function PartnerCard({ item }) {
  return (
    <div className="brand-tile rounded-lg aspect-square w-[clamp(84px,8.5vw,240px)] shrink-0 flex items-center justify-center p-2 sm:p-2.5 text-center transition-transform duration-650 hover:scale-[1.06]">
      <span
        className={`${toneCls[item.tone] || toneCls.dark} ${
          item.script ? 'font-script text-[13px] sm:text-xl' : 'text-[10px] sm:text-xs md:text-sm'
        } ${item.bold ? 'font-extrabold' : 'font-semibold'} leading-tight break-words`}
      >
        {item.name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction, duration, variant = 'square' }) {
  // Few items per row (sponsors) → repeat 4× so the belt never shows a gap;
  // even count keeps the two halves identical for the -50% loop.
  const repeated = variant === 'square' ? [...items, ...items] : [...items, ...items, ...items, ...items]
  return (
    <div className="marquee-fade overflow-hidden">
      <div
        className={`flex w-max items-center gap-4 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        }`}
        style={{ '--marquee-duration': duration }}
      >
        {repeated.map((item, i) =>
          variant === 'square' ? (
            <PartnerCard key={`${item.name}-${i}`} item={item} />
          ) : (
            <SponsorCard key={`${item.name}-${i}`} item={item} compact={variant === 'gold'} />
          )
        )}
      </div>
    </div>
  )
}

export default function Partners() {
  return (
    <section id="partners" className="relative w-full overflow-x-clip py-20 border-t border-white/[0.06]">
      <SectionBackdrop variant="flow" />
      {/* Everything stays inside the site content container */}
      <div className="site-container">
        {/* ── PLATINUM SPONSORS — one moving row (partners-style marquee) ── */}
        <h2 className={tierHeading}>Platinum Sponsors</h2>
        <MarqueeRow items={platinumSponsors} direction="left" duration="24s" variant="platinum" />

        {/* ── GOLD SPONSORS — one moving row, opposite direction ── */}
        <h2 className={`${tierHeading} mt-10 sm:mt-12 md:mt-16`}>
          Gold Sponsors
        </h2>
        <MarqueeRow items={goldSponsors} direction="right" duration="26s" variant="gold" />

        {/* ── OUR PARTNERS — square-tile marquees, inside the container ── */}
        <h2 className={`${tierHeading} mt-10 sm:mt-12 md:mt-16`}>
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
