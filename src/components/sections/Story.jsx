import Icon from '../ui/Icon'
import LogoRevealVideo from '../ui/LogoRevealVideo'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import { story } from '../../data/site'

const textTone = {
  violet: 'text-brand-violet',
  cyan: 'text-brand-cyan',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
  pink: 'text-pink-400',
}

function PillarCard({ pillar }) {
  return (
    <div className="glass glass-hover sheen p-6 rounded-2xl flex flex-col justify-between group/pillar">
      <div>
        <div
          className={`w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-4 transition-all duration-650 group-hover/pillar:scale-110 group-hover/pillar:border-white/20 ${
            textTone[pillar.color] || 'text-brand-violet'
          }`}
        >
          <Icon name={pillar.icon} className="text-[22px]" />
        </div>
        <h3 className="text-lg font-semibold text-white tracking-tight">{pillar.title}</h3>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{pillar.body}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-white/[0.05] font-mono text-[11px] text-zinc-500">
        {pillar.footnote}
      </div>
    </div>
  )
}

export default function Story() {
  return (
    <Section id="story">
      <SectionBackdrop variant="churn" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:items-center gap-8 lg:gap-10 mb-12">
        <div className="max-w-2xl">
          <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
            {story.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
            {story.heading}
          </h2>
          <p className="text-zinc-400 mt-3 text-base leading-relaxed">{story.body}</p>
        </div>
        {/* Right rail — big 3D logo-reveal stage + quote beneath it.
            Animated conic glow-border orbits the frame continuously. */}
        <div className="w-full flex flex-col gap-4">
          <div className="story-video relative w-full">
            <div className="absolute inset-0 rounded-2xl overflow-hidden" aria-hidden="true">
              <div className="absolute inset-[-120%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(124,58,237,0.9)_100deg,rgba(56,189,248,0.9)_190deg,transparent_280deg)] animate-[spin_6s_linear_infinite]"></div>
            </div>
            <div className="relative m-[1.5px] glass rounded-2xl p-2.5 overflow-hidden shadow-[0_0_54px_-8px_rgba(124,58,237,0.55)]">
              <LogoRevealVideo />
            </div>
          </div>
          <div className="glass p-4 rounded-xl text-xs font-mono text-zinc-400">
            <div className="text-zinc-200 font-semibold mb-1">{story.quote.text}</div>
            {story.quote.author}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {story.pillars.map((pillar) => (
          <PillarCard key={pillar.title} pillar={pillar} />
        ))}
      </div>
    </Section>
  )
}
