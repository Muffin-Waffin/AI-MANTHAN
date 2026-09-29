import Icon from '../ui/Icon'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import { story } from '../../data/site'

const textTone = {
  azure: 'text-brand-cyan',
  cyan: 'text-brand-cyan',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  pink: 'text-pink-400',
}

function PillarCard({ pillar }) {
  return (
    <div className="glass glass-hover sheen p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col justify-between group/pillar">
      <div>
        <div
          className={`w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-2.5 sm:mb-4 transition-all duration-650 group-hover/pillar:scale-110 group-hover/pillar:border-white/20 ${
            textTone[pillar.color] || 'text-brand-cyan'
          }`}
        >
          <Icon name={pillar.icon} className="text-[18px] sm:text-[22px]" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">{pillar.title}</h3>
        <p className="text-[10px] sm:text-xs text-zinc-400 mt-1.5 sm:mt-2 leading-relaxed">{pillar.body}</p>
      </div>
      <div className="mt-3 sm:mt-3.5 pt-2 sm:pt-3 border-t border-white/[0.05] font-mono text-[9px] sm:text-[11px] text-zinc-500">
        {pillar.footnote}
      </div>
    </div>
  )
}

export default function Story() {
  return (
    <Section id="story" className="!py-10 sm:!py-12">
      <SectionBackdrop variant="churn" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:items-start gap-6 sm:gap-8 lg:gap-8 mb-6 sm:mb-8">
        <div className="max-w-2xl pl-[3%]">
          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wider text-brand-cyan uppercase">
            {story.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mt-1.5 leading-tight">
            {story.heading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-zinc-400 mt-2 sm:mt-3 leading-relaxed">{story.body}</p>
        </div>
        {/* Right rail — official AI MANTHAN 2.0 logo key-visual + quote
            beneath it. No frame/border — the emblem floats free with a
            soft glow. Subtle float only — the logo is never morphed. */}
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <div className="story-video relative w-full flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-8 bg-cyan-600/20 blur-[70px] rounded-full pointer-events-none"
            />
            <img
              src="/logos/aimathan-logo.png"
              alt="AI Manthan 2.0 — official event logo"
              width={1599}
              height={966}
              className="relative w-full max-w-[460px] h-auto object-contain animate-logo-float drop-shadow-[0_0_50px_rgba(0,240,255,0.5)]"
            />
          </div>
          <div className="glass p-3 sm:p-3.5 rounded-xl text-[10px] sm:text-xs font-mono text-zinc-400">
            <div className="text-zinc-200 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{story.quote.text}</div>
            <div className="text-[10px] sm:text-xs text-zinc-500">{story.quote.author}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {story.pillars.map((pillar) => (
          <PillarCard key={pillar.title} pillar={pillar} />
        ))}
      </div>
    </Section>
  )
}
