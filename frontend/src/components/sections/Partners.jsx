'use client'

import { platinumSponsors, goldSponsors, partnerRows } from '../../data/site'

/**
 * Sponsors & Partners
 *  - Dark solid background (#06080d), no glows
 *  - Platinum  → slow marquee left→right
 *  - Gold      → slow marquee right→left
 *  - Partners  → 3 rows: row1 left, row2 right, row3 left
 *  - Cards pause on hover, no box-shadow glow
 */

const toneCls = {
  dark:   'text-zinc-100',
  azure:  'text-cyan-300',
  sky:    'text-sky-300',
  green:  'text-emerald-400',
  red:    'text-rose-400',
  orange: 'text-amber-400',
  cyan:   'text-cyan-300',
}

const tierHeading =
  'text-center text-[10px] sm:text-xs font-bold tracking-[0.35em] text-zinc-400 uppercase mb-6 sm:mb-8'

/* ── Platinum sponsor card ── */
function PlatinumCard({ item }) {
  const nameCls = item.script
    ? 'font-script text-2xl sm:text-3xl md:text-4xl'
    : 'text-base sm:text-2xl md:text-3xl font-extrabold' +
      (item.tracking === 'wide' ? ' tracking-[0.18em]' : '')

  return (
    <div
      className="group shrink-0 flex flex-col items-center justify-center gap-1.5
        bg-[#0c1018] border border-white/[0.08] rounded-2xl
        aspect-[3/2] w-[200px] sm:w-[280px] md:w-[340px] px-4
        transition-all duration-400 hover:bg-[#111820] hover:border-white/20
        hover:[animation-play-state:paused]"
    >
      <span className={`${toneCls[item.tone] || toneCls.dark} ${nameCls} leading-tight text-center break-words`}>
        {item.name}
      </span>
      {item.sub && (
        <span className="text-[7px] sm:text-[9px] font-semibold tracking-[0.22em] text-zinc-500 text-center">
          {item.sub}
        </span>
      )}
    </div>
  )
}

/* ── Gold sponsor card ── */
function GoldCard({ item }) {
  const nameCls = item.script
    ? 'font-script text-base sm:text-xl md:text-2xl'
    : 'text-xs sm:text-sm md:text-base font-bold' +
      (item.tracking === 'wide' ? ' tracking-[0.14em]' : '')

  return (
    <div
      className="group shrink-0 flex flex-col items-center justify-center gap-1
        bg-[#0c1018] border border-white/[0.08] rounded-xl
        h-[140px] sm:h-[160px] w-[190px] sm:w-[230px] px-3
        transition-all duration-400 hover:bg-[#111820] hover:border-white/20"
    >
      <span className={`${toneCls[item.tone] || toneCls.dark} ${nameCls} leading-tight text-center break-words`}>
        {item.name}
      </span>
      {item.sub && (
        <span className="text-[6px] sm:text-[8px] font-semibold tracking-[0.2em] text-zinc-500 text-center">
          {item.sub}
        </span>
      )}
    </div>
  )
}

/* ── Partner square tile ── */
function PartnerCard({ item }) {
  return (
    <div
      className="shrink-0 flex items-center justify-center
        bg-[#0c1018] border border-white/[0.07] rounded-lg
        aspect-square w-[clamp(80px,8vw,160px)] p-2 text-center
        transition-all duration-300 hover:bg-[#111820] hover:border-white/15"
    >
      <span
        className={`${toneCls[item.tone] || toneCls.dark} ${
          item.script ? 'font-script text-sm sm:text-lg' : 'text-[9px] sm:text-xs'
        } ${item.bold ? 'font-extrabold' : 'font-semibold'} leading-tight break-words`}
      >
        {item.name}
      </span>
    </div>
  )
}

/* ── Marquee row — pauses whole belt on hover ── */
function MarqueeRow({ items, direction = 'left', duration = '40s', variant = 'square' }) {
  const repeated =
    variant === 'square'
      ? [...items, ...items]
      : [...items, ...items, ...items, ...items]

  const animClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  const CardComponent =
    variant === 'platinum' ? PlatinumCard
    : variant === 'gold'    ? GoldCard
    :                         PartnerCard

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`flex w-max items-center gap-3 sm:gap-4 ${animClass} hover:[animation-play-state:paused]`}
        style={{ '--marquee-duration': duration }}
      >
        {repeated.map((item, i) => (
          <CardComponent key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function Partners() {
  return (
    <section
      id="partners"
      className="relative w-full overflow-x-clip bg-[#06080d] py-20 sm:py-24 border-t border-white/[0.06]"
    >
      <div className="site-container space-y-14 sm:space-y-18">

        {/* ── PLATINUM SPONSORS → left ── */}
        <div>
          <p className={tierHeading}>Platinum Sponsors</p>
          <MarqueeRow items={platinumSponsors} direction="left" duration="50s" variant="platinum" />
        </div>

        {/* ── GOLD SPONSORS → right ── */}
        <div>
          <p className={tierHeading}>Gold Sponsors</p>
          <MarqueeRow items={goldSponsors} direction="right" duration="45s" variant="gold" />
        </div>

        {/* ── OUR PARTNERS → alternating per row ── */}
        <div>
          <p className={tierHeading}>Our Partners</p>
          <div className="space-y-3 sm:space-y-4">
            {partnerRows.map((row, i) => (
              <MarqueeRow
                key={i}
                items={row.items}
                direction={i % 2 === 0 ? 'left' : 'right'}
                duration={`${55 + i * 5}s`}
                variant="square"
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
