import Icon from '../ui/Icon'
import Section from '../ui/Section'
import { prizes, cta } from '../../data/prizes'

const accentText = {
  cyan: 'text-brand-cyan',
  pink: 'text-pink-400',
  emerald: 'text-emerald-400',
}

function PodiumCard({ prize }) {
  if (prize.champion) {
    return (
      <div className="order-1 md:order-2 glass-strong animate-pulse-glow p-8 rounded-2xl border-2 border-brand-violet/70 text-center flex flex-col items-center relative -translate-y-2">
        <div className="absolute -top-3 px-3.5 py-1 rounded-full bg-brand-violet text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-md">
          OVERALL CHAMPION
        </div>
        <div className="w-14 h-14 rounded-2xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-violet mb-3 mt-2">
          <Icon name="emoji_events" className="text-[28px]" />
        </div>
        <span className="text-xs font-mono uppercase tracking-wider text-brand-violet font-semibold">
          {prize.title}
        </span>
        <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight my-2">
          {prize.amount}
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 mb-6 leading-relaxed">{prize.body}</p>
        <div className="w-full py-2.5 rounded-xl bg-brand-violet/15 border border-brand-violet/30 text-xs font-mono text-brand-violet font-bold">
          {prize.perk}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`glass glass-hover sheen animate-pulse-glow p-6 rounded-2xl text-center flex flex-col items-center group/prize ${
        prize.place === '02' ? 'order-2 md:order-1' : 'order-3'
      } ${prize.ring === 'zinc' ? 'border-zinc-500/20' : 'border-amber-600/20'}`}
    >
      <div
        className={`w-10 h-10 rounded-full bg-zinc-800 border flex items-center justify-center font-mono font-bold text-sm mb-3 transition-all duration-650 group-hover/prize:scale-110 group-hover/prize:border-amber-500/50 ${
          prize.place === '02'
            ? 'border-zinc-600/30 text-zinc-300'
            : 'border-amber-600/30 text-amber-500'
        }`}
      >
        {prize.place}
      </div>
      <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">{prize.title}</span>
      <div className="text-3xl font-extrabold text-white tracking-tight my-2">{prize.amount}</div>
      <p className="text-xs text-zinc-400 mb-6 leading-relaxed">{prize.body}</p>
      <div className="w-full py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-zinc-400">
        {prize.perk}
      </div>
    </div>
  )
}

function BountyCard({ bounty }) {
  return (
    <div className="glass p-4 rounded-xl flex items-center gap-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]">
      <div
        className={`w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 ${
          accentText[bounty.color]
        }`}
      >
        <Icon name={bounty.icon} className="text-[20px]" />
      </div>
      <div>
        <div className="text-xs text-zinc-400">{bounty.label}</div>
        <div className="text-sm font-semibold text-white">{bounty.title}</div>
        <div className={`text-xs font-mono font-bold ${accentText[bounty.color]}`}>
          {bounty.amount}
        </div>
      </div>
    </div>
  )
}

export default function Prizes() {
  return (
    <Section id="prizes">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
          {prizes.eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          {prizes.heading}
        </h2>
        <p className="text-zinc-400 text-sm mt-2">{prizes.body}</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-12">
        {prizes.podium.map((prize) => (
          <PodiumCard key={prize.title} prize={prize} />
        ))}
      </div>

      {/* Special bounties */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {prizes.bounties.map((bounty) => (
          <BountyCard key={bounty.title} bounty={bounty} />
        ))}
      </div>


    </Section>
  )
}

export function FinalCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
    </section>
  )
}
