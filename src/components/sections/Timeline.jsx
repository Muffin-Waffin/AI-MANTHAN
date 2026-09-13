import Icon from '../ui/Icon'
import Section from '../ui/Section'
import { timeline } from '../../data/timeline'

const statusColors = {
  emerald: 'text-emerald-400',
  muted: 'text-zinc-500',
  white: 'text-white',
}

function PhaseCard({ phase }) {
  return (
    <div
      className={`p-5 rounded-2xl relative flex flex-col justify-between group ${
        phase.active
          ? 'glass-strong sheen ring-1 ring-brand-violet/40 shadow-[0_0_24px_rgba(124,58,237,0.12)]'
          : phase.featured
            ? 'glass sheen ring-1 ring-white/20'
            : 'glass glass-hover sheen'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span
            className={`font-mono font-semibold ${
              phase.active || phase.featured ? 'text-brand-violet' : 'text-zinc-500'
            }`}
          >
            {phase.phase}
          </span>
          {phase.active ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          ) : phase.featured ? (
            <Icon name="flag" className="text-[16px] text-brand-violet transition-transform duration-650 group-hover:scale-110" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-zinc-600 transition-all duration-650 group-hover:bg-zinc-400"></span>
          )}
        </div>
        <div className="font-mono text-xs text-zinc-400">{phase.dates}</div>
        <h4 className="text-base font-bold text-white mt-1">{phase.title}</h4>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{phase.body}</p>
      </div>
      <div
        className={`mt-6 pt-3 border-t border-white/[0.06] text-[11px] font-mono font-semibold ${
          statusColors[phase.statusColor] || 'text-zinc-500'
        }`}
      >
        {phase.status}
      </div>
    </div>
  )
}

export default function Timeline() {
  return (
    <Section id="timeline">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
          {timeline.eyebrow}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          {timeline.heading}
        </h2>
        <p className="text-zinc-400 text-sm mt-2">{timeline.body}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {timeline.phases.map((phase) => (
          <PhaseCard key={phase.phase} phase={phase} />
        ))}
      </div>
    </Section>
  )
}
