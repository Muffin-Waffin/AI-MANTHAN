'use client'

import { useRef, useState, useEffect } from 'react'
import SmartImage from '../ui/SmartImage'
import Icon from '../ui/Icon'
import Section, { SectionHeaderRow } from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import SectionHeading from '../ui/SectionHeading'
import { peopleByGroup } from '../../data/facultyDirectory'

/* ------------------------------------------------------------------ */
/* Interactive Card: Full tall image background + top-sliding hover    */
/* overlay with full member details & clean profile link.               */
/* ------------------------------------------------------------------ */

const groupAccents = {
  guest: {
    pill: 'bg-amber-500/15 border border-amber-500/40 text-amber-400',
    title: 'text-amber-400',
    hover: 'hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    icon: 'workspace_premium',
    label: 'Guest of Honor',
  },
  jury: {
    pill: 'bg-pink-500/15 border border-pink-500/40 text-pink-400',
    title: 'text-pink-400',
    hover: 'hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]',
    icon: 'emoji_events',
    label: 'Jury',
  },
  mentors: {
    pill: 'bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan',
    title: 'text-brand-cyan',
    hover: 'hover:border-brand-cyan/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.25)]',
    icon: 'school',
    label: 'Mentor',
  },
  faculty: {
    pill: 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400',
    title: 'text-emerald-400',
    hover: 'hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    icon: 'account_balance',
    label: 'Faculty',
  },
}

const zoneColors = {
  azure:   'from-brand-cyan/10 via-sky-900/10 to-[#06080d] text-brand-cyan',
  cyan:    'from-brand-cyan/10 via-sky-900/10 to-[#06080d] text-brand-cyan',
  emerald: 'from-emerald-900/20 via-[#06080d] to-[#06080d] text-emerald-400',
  amber:   'from-amber-900/20 via-[#06080d] to-[#06080d] text-amber-400',
  pink:    'from-pink-900/20 via-[#06080d] to-[#06080d] text-pink-400',
}

const initialsOf = (name) =>
  name
    .replace(/^(Dr\.|Prof\.|Cdr\.|Mr\.|Ms\.)\s*/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

function PeopleCard({ member }) {
  const accent = groupAccents[member.group] || groupAccents.mentors
  const zoneTone = member.group === 'guest' ? 'amber' : member.group === 'jury' ? 'pink' : member.group === 'faculty' ? 'emerald' : 'cyan'

  return (
    <div
      className={`relative h-[260px] sm:h-[380px] w-full rounded-2xl overflow-hidden group block transition-all duration-300 border border-white/[0.08] bg-[#090d14] ${accent.hover}`}
    >
      {/* Background Visual Zone — Full Card Image / Monogram */}
      <div
        className={`absolute inset-0 w-full h-full ${
          member.img
            ? 'bg-obsidian-950'
            : `bg-gradient-to-br ${zoneColors[zoneTone]} flex items-center justify-center`
        }`}
      >
        {member.img ? (
          <SmartImage
            alt={member.name}
            draggable={false}
            className="object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
            src={member.img}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <span
            className={`font-mono text-5xl sm:text-8xl font-bold opacity-45 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ${
              zoneColors[zoneTone].split(' ').pop()
            }`}
          >
            {member.initials || initialsOf(member.name)}
          </span>
        )}

        {/* Dark gradient for front text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent"></div>
      </div>

      {/* Default Card Front Overlay (visible when NOT hovered) */}
      <div className="absolute inset-0 p-3 sm:p-5 flex flex-col justify-between z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
        {/* Top Role Badge */}
        <div>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold backdrop-blur-md shadow-lg ${
              member.img ? 'bg-obsidian-950/80 border border-white/20 text-white' : accent.pill
            }`}
          >
            <Icon name={accent.icon} className="text-[11px] sm:text-[13px]" />
            {member.role}
          </span>
        </div>

        {/* Bottom Name & Title */}
        <div className="space-y-0.5 sm:space-y-1">
          <h4 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight drop-shadow-md line-clamp-1 sm:line-clamp-2">
            {member.name}
          </h4>
          <p className={`text-[10px] sm:text-xs font-semibold ${accent.title} drop-shadow line-clamp-1`}>
            {member.title}
          </p>
        </div>
      </div>

      {/* Hover Top Slider Overlay — Slides down from top of card on hover */}
      <div className="absolute inset-0 bg-[#06080d]/92 backdrop-blur-xl p-3.5 sm:p-5 flex flex-col justify-between transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 border-b-2 border-brand-cyan/50 shadow-2xl">
        <div className="space-y-2 sm:space-y-3 overflow-y-auto no-scrollbar">
          {/* Header pill */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold ${accent.pill}`}
            >
              <Icon name={accent.icon} className="text-[11px] sm:text-[13px]" />
              {member.role}
            </span>
          </div>

          {/* Name & Title */}
          <div>
            <h4 className="text-sm sm:text-lg font-bold text-white tracking-tight leading-tight">
              {member.name}
            </h4>
            <p className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${accent.title}`}>
              {member.title}
            </p>
            {member.tag && (
              <p className="text-[9px] sm:text-[10px] text-zinc-400 font-mono mt-0.5 sm:mt-1">{member.tag}</p>
            )}
          </div>

          {/* Bio text */}
          <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed pt-1 sm:pt-1.5 border-t border-white/10 line-clamp-5 sm:line-clamp-7">
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  )
}

function ConvenerCard({ member }) {
  return (
    <div className="col-span-full relative w-full overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-[#0b1220] via-[#080c16] to-[#0d1627] p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-6 sm:mb-8 group hover:border-cyan-400/60 transition-all duration-500">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
        {/* Left Side: Photo Frame Box */}
        <div className="lg:col-span-3 flex justify-center lg:justify-start">
          <div className="relative w-48 h-56 sm:w-56 sm:h-64 shrink-0 rounded-2xl overflow-hidden border-2 border-cyan-400/40 bg-obsidian-950 shadow-2xl">
            <SmartImage
              alt={member.name}
              src={member.img}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 192px, 224px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-2 inset-x-2 text-center text-[10px] font-mono uppercase tracking-[0.16em] font-bold text-cyan-300 bg-black/85 py-1 rounded backdrop-blur-sm border border-cyan-400/30">
              CONVENER
            </span>
          </div>
        </div>

        {/* Middle Side: Name, Designation & Intro */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-md">
              <Icon name="stars" className="text-sm text-cyan-400" />
              CONVENER and HOD
            </span>
            <span className="text-xs font-mono text-zinc-400">AI Manthan 2.0</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {member.name}
            </h3>
            <p className="text-sm sm:text-base font-semibold text-cyan-400 mt-1">
              {member.title}
            </p>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              {member.org}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {member.bio}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-mono font-semibold text-cyan-300">
              HOD: IT & Data Science
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-[11px] font-mono text-zinc-300">
              Convener: AI Manthan 2.0
            </span>
          </div>
        </div>

        {/* Right Side: Quote & Leadership Highlights Box */}
        <div className="lg:col-span-4 w-full">
          <div className="relative rounded-2xl border border-cyan-400/30 bg-[#060a12]/80 p-5 backdrop-blur-md shadow-xl space-y-4">
            {/* Quote Icon */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                <Icon name="format_quote" className="text-lg text-cyan-400" />
                Leadership Message
              </span>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>

            {/* Quote Text */}
            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "{member.quote || 'Transforming curiosity into innovation through AI & Data Science excellence.'}"
            </p>

            {/* Department Pillars & Stats Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Department</div>
                <div className="text-xs font-bold text-cyan-300 mt-0.5">IT & Data Science</div>
              </div>
              <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">Institution</div>
                <div className="text-xs font-bold text-white mt-0.5">AITR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrollableCardGroup({ title, members }) {
  const scrollRef = useRef(null)
  const [scrollPos, setScrollPos] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    setScrollPos(scrollLeft)
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })
  }
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })
  }

  return (
    <div className="mb-12 sm:mb-14 last:mb-0">
      {/* Group heading with scroll controls */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase shrink-0">
          {title}
        </h3>
        <span className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[11px] font-mono text-zinc-500 shrink-0">
          {members.length} MEMBERS
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Scroll left"
          >
            <Icon name="chevron_left" className="text-[16px]" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-zinc-400 hover:text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Scroll right"
          >
            <Icon name="chevron_right" className="text-[16px]" />
          </button>
        </div>
      </div>

      {/* Horizontal scrollable track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 pb-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {members.map((member) => (
          <div
            key={member.slug}
            className="snap-start shrink-0 w-[280px] sm:w-[300px] lg:w-[320px]"
          >
            <PeopleCard member={member} />
          </div>
        ))}
      </div>

      {/* Scroll indicator dots */}
      {members.length > 4 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {Array.from({ length: Math.ceil(members.length / 4) }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollRef.current?.scrollTo({ left: i * 1280, behavior: 'smooth' })}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                scrollPos >= i * 1280 - 160 && scrollPos < (i + 1) * 1280 - 160
                  ? 'bg-brand-cyan w-6'
                  : 'bg-white/[0.15] hover:bg-white/[0.3]'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ConvenerGroup({ title, members }) {
  const convener = members.find((m) => m.isConvener)

  if (!convener) return null

  return (
    <div className="mb-12 sm:mb-14 last:mb-0">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase shrink-0">
          {title}
        </h3>
        <span className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <ConvenerCard member={convener} />
    </div>
  )
}

/* ---------- Section ---------- */

const scrollableGroups = [
  { id: 'guest', title: 'Guests of Honor' },
  { id: 'mentors', title: 'Mentors' },
]

const convenerGroup = { id: 'faculty', title: 'Convener' }

export default function Mentors() {
  return (
    <Section id="faculty" className="!bg-[#06080d]">
      <SectionHeaderRow
        heading={
          <SectionHeading
            eyebrow="Evaluated & Guided by Leaders"
            title="Guests of Honor & Mentors"
          />
        }
      />

      {scrollableGroups.map((group) => (
        <ScrollableCardGroup key={group.id} title={group.title} members={peopleByGroup(group.id)} />
      ))}

      <ConvenerGroup key={convenerGroup.id} title={convenerGroup.title} members={peopleByGroup(convenerGroup.id)} />
    </Section>
  )
}

