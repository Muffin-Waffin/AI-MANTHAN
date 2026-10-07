import SmartImage from '@/components/ui/SmartImage'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Icon from '@/components/ui/Icon'
import AppShell from '@/components/layout/AppShell'
import SmartBack from '@/components/ui/SmartBack'
import { peopleDirectory, getPersonBySlug } from '@/data/facultyDirectory'

const groupAccents = {
  guest: {
    text: 'text-amber-400',
    chip: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    mono: 'text-amber-400',
    zone: 'from-amber-500/30 via-orange-600/15 to-transparent text-amber-400',
    icon: 'workspace_premium',
  },
  jury: {
    text: 'text-pink-400',
    chip: 'bg-pink-500/15 border-pink-500/40 text-pink-400',
    mono: 'text-pink-400',
    zone: 'from-pink-500/30 via-rose-600/15 to-transparent text-pink-400',
    icon: 'emoji_events',
  },
  mentors: {
    text: 'text-brand-cyan',
    chip: 'bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan',
    mono: 'text-brand-cyan',
    zone: 'from-brand-cyan/30 via-sky-700/15 to-transparent text-brand-cyan',
    icon: 'school',
  },
  faculty: {
    text: 'text-brand-cyan',
    chip: 'bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan',
    mono: 'text-brand-cyan',
    zone: 'from-brand-cyan/30 via-sky-600/15 to-transparent text-brand-cyan',
    icon: 'account_balance',
  },
}

const initialsOf = (name) =>
  name
    .replace(/^(Dr\.|Prof\.|Cdr\.|Mr\.|Ms\.)\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export function generateStaticParams() {
  return peopleDirectory.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const member = getPersonBySlug(slug)
  if (!member) return {}
  return {
    title: `${member.name} — ${member.title}`,
    description: `${member.name}, ${member.title} and ${member.role} at AI Manthan 2026. ${member.bio}`,
  }
}

function MetadataRow({ icon, children }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="w-8 h-8 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan flex items-center justify-center shrink-0">
        <Icon name={icon} className="text-[16px]" />
      </span>
      <span className="font-medium text-zinc-300 text-sm">{children}</span>
    </div>
  )
}

export default async function ProfilePage({ params }) {
  const { slug } = await params
  const member = getPersonBySlug(slug)
  if (!member) notFound()

  const accent = groupAccents[member.group] || groupAccents.mentors
  const motto = member.motto || ['Innovate', 'Build', 'Deliver']
  const idx = peopleDirectory.findIndex((f) => f.slug === member.slug)
  const prev = peopleDirectory[(idx - 1 + peopleDirectory.length) % peopleDirectory.length]
  const next = peopleDirectory[(idx + 1) % peopleDirectory.length]

  return (
    <AppShell>
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-10 2xl:px-14 py-8">
        {/* Sub-navigation */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <SmartBack
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan hover:text-zinc-200 transition-colors"
            href="/#faculty"
            label="Back to Jury, Mentors & Faculty"
          />
          <div className="flex items-center gap-3">
            <Link
              className="glass px-4 py-1.5 rounded-lg text-zinc-300 text-sm font-medium hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              href={`/faculty/${prev.slug}`}
            >
              <Icon name="chevron_left" className="text-[16px] text-zinc-500" />
              Previous
            </Link>
            <Link
              className="glass px-4 py-1.5 rounded-lg text-zinc-300 text-sm font-medium hover:text-white hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              href={`/faculty/${next.slug}`}
            >
              Next
              <Icon name="chevron_right" className="text-[16px] text-zinc-500" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass glass-hover sheen rounded-2xl p-6">
              {/* Portrait / monogram */}
              <div
                className={`relative w-full aspect-[4/3.8] rounded-xl overflow-hidden flex items-center justify-center mb-6 bg-gradient-to-tr ${
                  member.img ? '' : accent.zone
                }`}
              >
                {member.img ? (
                  <SmartImage
                    alt={`${member.name} portrait`}
                    className="w-full h-full object-cover object-top opacity-80"
                    src={member.img}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <span className={`font-mono text-8xl font-bold opacity-70 ${accent.mono}`}>
                    {member.initials || initialsOf(member.name)}
                  </span>
                )}
                <div className="absolute right-3 top-1/2 -translate-y-8 z-10 select-none pointer-events-none text-right">
                  <div className={`font-script text-xl leading-tight -rotate-12 ${accent.text}`}>
                    {motto.map((line, i) => (
                      <span key={line} className="block">
                        {line}
                        {i < motto.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & role */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">{member.name}</h1>
                <p className={`text-base font-semibold ${accent.text}`}>{member.role}</p>
                <p className="text-sm text-zinc-500 font-mono">{member.title}</p>
              </div>

              {/* Socials (only when links exist) */}
              {(member.linkedin || member.email) && (
                <div className="flex items-center gap-3 my-5">
                  {member.linkedin && (
                    <a
                      className="w-9 h-9 rounded-full bg-[#0066c8] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Icon name="arrow_outward" className="text-[16px]" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      className="w-9 h-9 rounded-full bg-brand-cyan text-[#06080d] flex items-center justify-center hover:opacity-90 transition-opacity"
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                    >
                      <Icon name="mail" className="text-[16px]" />
                    </a>
                  )}
                </div>
              )}

              <div className="h-px bg-white/[0.06] my-4"></div>

              {/* Metadata */}
              <div className="space-y-4">
                <MetadataRow icon="location_on">{member.location}</MetadataRow>
                <MetadataRow icon="account_balance">AITR, Indore</MetadataRow>
                <MetadataRow icon="workspace_premium">{member.badge}</MetadataRow>
                <MetadataRow icon="military_tech">{member.hackathons}</MetadataRow>
              </div>

              {/* Connect CTA */}
              {member.email && (
                <a
                  className="w-full mt-6 bg-gradient-to-r from-brand-cyan to-sky-600 text-[#06080d] py-3 rounded-xl font-semibold shadow-[0_0_24px_rgba(0,168,255,0.35)] flex items-center justify-center gap-2 text-sm hover:opacity-95 transition-all"
                  href={`mailto:${member.email}`}
                >
                  <Icon name="mail" className="text-[16px]" />
                  Connect with {member.name.split(' ').slice(-1)[0]}
                </a>
              )}
            </div>

            {/* Quote */}
            {member.quote && (
              <div className="rounded-2xl bg-brand-cyan/[0.07] border border-brand-cyan/25 p-6 relative">
                <div className="text-brand-cyan mb-2">
                  <Icon name="format_quote" className="text-[32px] opacity-70" />
                </div>
                <blockquote className="text-zinc-300 italic text-sm leading-relaxed mb-4">
                  {member.quote}
                </blockquote>
                <div className="text-xs font-semibold text-zinc-400 flex items-center gap-2 font-mono">
                  <span className="w-4 h-0.5 bg-zinc-600"></span>
                  {member.name}
                </div>
              </div>
            )}

            {/* Watermark */}
            <div className="pt-4 px-2 select-none opacity-40">
              <div className="text-[11px] font-bold tracking-[0.25em] text-zinc-600 leading-relaxed uppercase font-mono">
                PEOPLE
                <br />
                IDEAS
                <br />
                TECHNOLOGY
                <br />
                A BRIGHTER TOMORROW
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-8 space-y-8">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">About Me</h2>
              <p className="text-zinc-400 leading-relaxed text-sm">{member.about}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {member.expertise.map((skill) => (
                  <div
                    key={skill}
                    className="glass inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-zinc-200 text-sm font-medium hover:border-brand-cyan/40 hover:-translate-y-0.5 transition-all"
                  >
                    <Icon name="bolt" className="text-[16px] text-brand-cyan" />
                    {skill}
                  </div>
                ))}
              </div>
            </section>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {member.stats && (
                <div className="glass glass-hover sheen rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan flex items-center justify-center">
                      <Icon name="work" className="text-[18px]" />
                    </span>
                    <h3 className="text-xl font-bold text-white">Experience</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {member.stats.map((stat) => (
                      <div className="text-center" key={stat.label}>
                        <div className="text-3xl font-extrabold text-brand-cyan">{stat.value}</div>
                        <div className="text-xs text-zinc-500 mt-1 font-medium leading-tight">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {member.education && (
                <div className="glass glass-hover sheen rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan flex items-center justify-center">
                      <Icon name="school" className="text-[18px]" />
                    </span>
                    <h3 className="text-xl font-bold text-white">Education</h3>
                  </div>
                  <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-brand-cyan/30">
                    {member.education.map((edu) => (
                      <div className="relative" key={edu.degree}>
                        <span className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand-cyan ring-4 ring-obsidian-900"></span>
                        <p className="text-sm font-semibold text-zinc-200">{edu.degree}</p>
                        <p className="text-xs text-zinc-500 font-mono">{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notable work */}
            {member.notableWork && (
              <div className="glass glass-hover sheen rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan flex items-center justify-center">
                    <Icon name="description" className="text-[18px]" />
                  </span>
                  <h3 className="text-xl font-bold text-white">Notable Work</h3>
                </div>
                <ul className="space-y-3 pt-1 text-sm text-zinc-300">
                  {member.notableWork.map((item) => (
                    <li className="flex items-start gap-3" key={item}>
                      <span className="w-5 h-5 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="check" className="text-[14px]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advisory bullets (faculty leaders) */}
            {member.bullets && (
              <div className="glass glass-hover sheen rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan flex items-center justify-center">
                    <Icon name="verified" className="text-[18px]" />
                  </span>
                  <h3 className="text-xl font-bold text-white">Credentials</h3>
                </div>
                <ul className="space-y-2 text-sm text-zinc-300 font-mono text-[13px]">
                  {member.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-cyan/15 via-sky-700/10 to-brand-cyan/10 p-6 lg:p-7 border border-brand-cyan/25 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4 z-10">
                <span className="w-10 h-10 rounded-full bg-brand-cyan text-[#06080d] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,168,255,0.4)]">
                  <Icon name="tips_and_updates" className="text-[20px]" />
                </span>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Let’s Build Something Meaningful</h3>
                  <p className="text-xs lg:text-sm text-zinc-400 max-w-lg leading-relaxed">
                    Open to mentoring passionate teams and supporting innovative ideas that solve
                    real-world problems.
                  </p>
                </div>
              </div>
              <a
                className="shrink-0 z-10 bg-gradient-to-r from-brand-cyan to-sky-600 text-[#06080d] px-6 py-2.5 rounded-full text-sm font-semibold shadow-[0_0_20px_rgba(0,168,255,0.35)] flex items-center gap-2 hover:opacity-95 transition-all"
                href={`mailto:${member.email}`}
              >
                Reach Out
                <Icon name="arrow_forward" className="text-[16px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
