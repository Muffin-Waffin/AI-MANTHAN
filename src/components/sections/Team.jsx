import Icon from '../ui/Icon'
import Section, { SectionHeaderRow } from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import SectionHeading from '../ui/SectionHeading'
import { team } from '../../data/people'

/**
 * Core Organizing Committee — uses the same unified card design as the
 * Jury/Mentors/Faculty groups: h-44 visual zone (gradient monogram instead
 * of photo) + role pill, then name / role / bio / footer.
 */

const roleColors = {
  violet: 'text-brand-violet',
  cyan: 'text-brand-cyan',
  emerald: 'text-emerald-400',
  amber: 'text-amber-400',
}

const zoneColors = {
  violet: 'from-brand-violet/30 via-indigo-600/15 to-transparent text-brand-violet',
  cyan: 'from-brand-cyan/30 via-sky-600/15 to-transparent text-brand-cyan',
  emerald: 'from-emerald-500/30 via-teal-600/15 to-transparent text-emerald-400',
  amber: 'from-amber-500/30 via-orange-600/15 to-transparent text-amber-400',
}

function TeamCard({ member }) {
  return (
    <div className="glass glass-hover sheen rounded-2xl overflow-hidden group flex flex-col">
      {/* Monogram zone — same geometry as the photo cards (h-44) */}
      <div
        className={`relative h-44 bg-gradient-to-br ${
          zoneColors[member.roleColor] || zoneColors.violet
        } flex items-center justify-center overflow-hidden`}
      >
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm bg-obsidian-950/60 border border-white/[0.12] text-white">
          <Icon name="groups" className="text-[13px]" />
          Committee
        </span>
        <span
          className={`font-mono text-6xl font-bold opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-650 ${
            roleColors[member.roleColor] || 'text-brand-violet'
          }`}
        >
          {member.initials}
        </span>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-obsidian-950/80 to-transparent"></div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h4 className="text-base font-bold text-white tracking-tight">{member.name}</h4>
        <p
          className={`text-xs font-semibold mt-0.5 ${
            roleColors[member.roleColor] || 'text-zinc-300'
          }`}
        >
          {member.role}
        </p>
        <p className="text-[11px] text-zinc-500 font-mono">{member.tag}</p>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed flex-1">{member.bio}</p>

        <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
          <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-zinc-300">
            {member.tag}
          </span>
          <span className="text-[10px] font-mono text-zinc-600">Acropolis</span>
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  return (
    <Section id="team">
      <SectionBackdrop variant="pillars" />
      <SectionHeaderRow
        heading={<SectionHeading eyebrow={team.eyebrow} title={team.heading} body={team.body} />}
        aside={team.aside}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {team.members.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </Section>
  )
}
