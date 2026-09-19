import Icon from '../ui/Icon'
import Section from '../ui/Section'
import { prizes, cta } from '../../data/prizes'

/**
 * THE PRIZE VAULT — controlled futuristic luxury.
 * Composition audit applied:
 *  - pulse-glow loop REMOVED on all cards (constant motion was noise)
 *  - only the champion carries accent glow; side cards stay quiet glass
 *  - elliptical floor lights make cards float without neon bloom
 *  - amounts are the loudest element inside each card
 *  - 15–20% intensity reduction across borders/glow vs previous build
 */

/* Total Prize Pool — single grand centerpiece replacing the 1st/2nd/3rd
   podium. Keeps the champion treatment: breathing violet glow ring, floor
   light, floating "ONE ARENA • ONE VAULT" badge, sheen sweep on hover. */
function PoolCard() {
  const pool = prizes.pool
  return (
    <div className="relative max-w-xl mx-auto pt-3.5">
      {/* floating badge — lives OUTSIDE the overflow-hidden card so the
          sheen layer can never clip it; straddles the card's top edge.
          pt-3.5 (not mt) prevents margin-collapse so the straddle holds. */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1 rounded-full bg-brand-violet text-white text-[9px] font-mono font-bold tracking-[0.16em] uppercase shadow-[0_6px_18px_-6px_rgba(124,58,237,0.8)] whitespace-nowrap">
        {pool.badge}
      </div>
      <div
        style={{ '--pg-color': 'rgba(168, 85, 247, 0.55)' }}
        className="prize-card prize-card-glow prize-card-champion bounty-card relative p-6 sm:p-8 text-center flex flex-col items-center"
      >

        {/* trophy with a slow breathing violet glow loop */}
        <div
          className="bounty-icon w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand-violet/15 border border-brand-violet/35 flex items-center justify-center text-brand-violet mt-1 mb-3"
          style={{ '--pg-color': 'rgba(168, 85, 247, 0.6)' }}
        >
          <Icon name="emoji_events" className="text-[24px] sm:text-[26px]" />
        </div>

        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-purple-300/90 font-semibold">
          {pool.title}
        </span>

        {/* the amount — the loudest thing on the card, gradient + glow */}
        <div className="pool-amount text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-white to-purple-300 bg-clip-text text-transparent leading-tight mt-1.5 mb-2 drop-shadow-[0_0_24px_rgba(147,51,234,0.35)]">
          {pool.amount}
        </div>

        <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed mb-4 max-w-[44ch]">
          {pool.body}
        </p>

        {/* reward chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-4">
          {pool.chips.map((chip) => (
            <span
              key={chip}
              className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.09] text-[8px] sm:text-[9px] font-mono tracking-[0.14em] text-zinc-300 transition-colors duration-300 hover:border-brand-violet/40 hover:text-purple-200"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-auto w-full py-2.5 rounded-lg bg-brand-violet/12 border border-brand-violet/30 text-[8px] sm:text-[10px] font-mono tracking-[0.14em] text-purple-200/90 font-bold">
          {pool.perk}
        </div>
      </div>

      {/* floor light beneath the hero */}
      <div
        aria-hidden="true"
        className="prize-floor"
        style={{ background: 'radial-gradient(ellipse at center, rgba(147,51,234,0.22), transparent 70%)' }}
      />
    </div>
  )
}

/* Per-bounty accent colors (RGB) — drives hover border, glow & amount tint */
const bountyAccent = {
  cyan: '56, 189, 248',
  pink: '244, 114, 182',
  emerald: '52, 211, 153',
  amber: '251, 191, 36',
  violet: '167, 139, 250',
  rose: '251, 113, 133',
  orange: '251, 146, 60',
  lime: '163, 230, 53',
  indigo: '129, 140, 248',
  sky: '56, 189, 248',
}

function BountyCard({ bounty, index }) {
  const tone = {
    cyan: 'text-sky-300/90 bg-sky-500/[0.07]',
    pink: 'text-pink-300/90 bg-pink-500/[0.07]',
    emerald: 'text-emerald-300/90 bg-emerald-500/[0.07]',
    amber: 'text-amber-300/90 bg-amber-500/[0.07]',
    violet: 'text-violet-300/90 bg-violet-500/[0.07]',
    rose: 'text-rose-300/90 bg-rose-500/[0.07]',
    orange: 'text-orange-300/90 bg-orange-500/[0.07]',
    lime: 'text-lime-300/90 bg-lime-500/[0.07]',
    indigo: 'text-indigo-300/90 bg-indigo-500/[0.07]',
    sky: 'text-sky-300/90 bg-sky-500/[0.07]',
  }[bounty.color] || 'text-zinc-300 bg-white/[0.04]'

  return (
    <div
      className="bounty-item"
      style={{ '--bi': index, '--baccent': bountyAccent[bounty.color] || '139, 92, 246' }}
    >
      <div className="bounty-card glass rounded-xl px-4 py-3.5 flex flex-col gap-3 h-full">
        <div className={`bounty-icon w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
          <Icon name={bounty.icon} className="text-[18px]" />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-zinc-600">
            {bounty.label}
          </div>
          <div className="text-[13px] font-semibold text-white leading-snug">{bounty.title}</div>
        </div>
        <div className="bounty-amount text-xs font-mono font-bold text-zinc-300 mt-auto">
          {bounty.amount}
        </div>
      </div>
    </div>
  )
}

export default function Prizes() {
  return (
    <Section id="prizes">
      {/* quiet radial stage light — single source, low opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[640px] h-[380px] rounded-full bg-purple-800/[0.12] blur-[110px]"
      />

      {/* Header — eyebrow, title with gradient accent word, divider */}
      <div className="relative text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-mono font-medium tracking-[0.28em] text-brand-violet uppercase">
          {prizes.eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-3">
          The Prize{' '}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Vault
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">{prizes.body}</p>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-brand-violet/60 to-transparent" />
      </div>

      {/* Total Prize Pool — single grand centerpiece. The wrapper's pt-3.5
          (inside PoolCard) is all the badge straddle needs — no extra gap. */}
      <div className="bounty-item mb-12 sm:mb-14" style={{ '--bi': 0 }}>
        <PoolCard />
      </div>

      {/* Special bounties — compact secondary grid, 10 grants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">
        {prizes.bounties.map((bounty, i) => (
          <BountyCard key={bounty.title} bounty={bounty} index={i} />
        ))}
      </div>

      {/* Eligibility note for special grants — highlighted callout */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div
          className="bounty-item relative flex flex-col items-center text-center gap-3 rounded-2xl border border-brand-violet/25 bg-gradient-to-r from-brand-violet/[0.09] via-brand-violet/[0.04] to-sky-500/[0.07] px-5 sm:px-7 py-5 sm:py-6 shadow-[0_0_30px_-10px_rgba(139,92,246,0.35)]"
          style={{ '--bi': prizes.bounties.length }}
        >
          <div className="bounty-icon w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-violet/15 border border-brand-violet/30 flex items-center justify-center shrink-0">
            <Icon name="verified" className="text-[22px] text-brand-violet" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.22em] text-brand-violet mb-1.5">
              Grant Eligibility
            </div>
            <p className="text-[13px] sm:text-[15px] text-zinc-200 leading-relaxed">
              {prizes.bountiesNote}
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function FinalCTA() {
  return (
    <section className="w-full py-20">
      <div className="site-container">
      <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-obsidian-900 to-obsidian-950 border border-white/[0.1] text-center flex flex-col items-center relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-violet/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-violet text-xs font-mono font-semibold mb-6">
          {cta.badge}
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
          {cta.heading}
        </h2>
        <p className="mt-4 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">{cta.body}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold shadow-[0_0_24px_rgba(255,255,255,0.3)] transition-all"
            href={cta.primary.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name={cta.primary.icon} className="text-[20px]" />
            {cta.primary.label}
          </a>
          <a
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-white text-sm font-semibold transition-all"
            href={cta.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name={cta.secondary.icon} className="text-[20px] text-emerald-400" />
            {cta.secondary.label}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-500">
          {cta.footnotes.map((note, i) => (
            <span key={note} className="flex items-center gap-4">
              {i > 0 && <span>•</span>}
              {note}
            </span>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
