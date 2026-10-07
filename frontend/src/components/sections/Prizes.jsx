import Icon from '../ui/Icon'
import Section from '../ui/Section'
import { prizes } from '../../data/prizes'

/* Total Prize Pool — Grand Centerpiece Card */
function PoolCard() {
  const pool = prizes.pool
  return (
    <div className="relative max-w-3xl mx-auto pt-4">
      {/* Floating Status Badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0f1d] border border-white/20 text-white text-[10px] font-mono font-bold tracking-[0.2em] uppercase backdrop-blur-xl whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        {pool.badge}
      </div>

      <div className="relative p-8 sm:p-12 text-center flex flex-col items-center bg-gradient-to-b from-[#0e1424] via-[#090d18] to-[#06080d] border border-white/15 rounded-[2rem] shadow-2xl overflow-hidden">
        {/* Top hairline edge */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Centerpiece Emblem Badge */}
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mt-2 mb-4 shadow-lg">
          <Icon name="military_tech" className="text-[34px]" />
        </div>

        <span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400 font-bold">
          {pool.title}
        </span>

        {/* Grand Prize Amount — Pure White */}
        <div className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-none my-4">
          {pool.amount}
        </div>

        <p className="text-xs sm:text-base text-zinc-300/90 leading-relaxed mb-8 max-w-xl font-sans">
          {pool.body}
        </p>

        {/* 3 Pillar Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
          {pool.chips.map((chip) => (
            <div
              key={chip}
              className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider text-white"
            >
              <Icon name="check_circle" className="text-sm text-cyan-400" />
              <span>{chip}</span>
            </div>
          ))}
        </div>

        </div>
    </div>
  )
}

function BountyCard({ bounty }) {
  return (
    <div className="group relative bg-[#080c16] hover:bg-[#0d1424] border border-white/10 hover:border-white/25 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="space-y-2 sm:space-y-3">
        {/* Icon & Label Header */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shrink-0">
            <Icon name={bounty.icon} className="text-[17px] sm:text-[20px]" />
          </div>
          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.16em] sm:tracking-[0.2em] text-zinc-400 font-bold truncate">
            {bounty.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug pt-1 line-clamp-2">
          {bounty.title}
        </h4>
      </div>

      {/* Grant Amount Pill */}
      <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] sm:text-xs font-mono font-bold text-white truncate max-w-[85%]">
          {bounty.amount}
        </span>
      </div>
    </div>
  )
}

export default function Prizes() {
  return (
    <Section id="prizes" className="bg-[#06080d] py-16 sm:py-24">
      {/* Header — Pure White Text, No Glow */}
      <div className="relative text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="text-xs font-mono font-bold tracking-[0.28em] text-zinc-400 uppercase">
          {prizes.eyebrow}
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3">
          The Prize Vault
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
          {prizes.body}
        </p>
        <div className="mx-auto mt-6 h-px w-20 bg-white/20" />
      </div>

      {/* Total Prize Pool Centerpiece */}
      <div className="mb-14 sm:mb-16">
        <PoolCard />
      </div>

      {/* Special Bounties Grid — 10 Grant Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 max-w-7xl mx-auto">
        {prizes.bounties.map((bounty) => (
          <BountyCard key={bounty.title} bounty={bounty} />
        ))}
      </div>
    </Section>
  )
}
