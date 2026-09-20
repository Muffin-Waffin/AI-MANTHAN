'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import SmartImage from '../ui/SmartImage'
import Link from 'next/link'
import Icon from '../ui/Icon'
import Section, { SectionHeaderRow } from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import SectionHeading from '../ui/SectionHeading'
import { peopleByGroup } from '../../data/facultyDirectory'

/* ------------------------------------------------------------------ */
/* Universal card — identical format for Jury, Mentors & Faculty:      */
/* photo/monogram (h-44) + pill → name, title, org, bio → View Profile */
/* ------------------------------------------------------------------ */

const groupAccents = {
  jury: {
    pill: 'bg-pink-500/15 border border-pink-500/40 text-pink-400',
    title: 'text-pink-400',
    hover: 'hover:border-pink-500/40',
    icon: 'emoji_events',
    dot: 'bg-pink-400',
    label: 'Jury',
  },
  mentors: {
    pill: 'bg-brand-violet/15 border border-brand-violet/40 text-brand-violet',
    title: 'text-brand-violet',
    hover: 'hover:border-brand-violet/40',
    icon: 'school',
    dot: 'bg-brand-violet',
    label: 'Mentor',
  },
  faculty: {
    pill: 'bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan',
    title: 'text-brand-cyan',
    hover: 'hover:border-brand-cyan/40',
    icon: 'account_balance',
    dot: 'bg-brand-cyan',
    label: 'Faculty',
  },
}

const zoneColors = {
  violet: 'from-brand-violet/30 via-indigo-600/15 to-transparent text-brand-violet',
  cyan: 'from-brand-cyan/30 via-sky-600/15 to-transparent text-brand-cyan',
  emerald: 'from-emerald-500/30 via-teal-600/15 to-transparent text-emerald-400',
  amber: 'from-amber-500/30 via-orange-600/15 to-transparent text-amber-400',
  pink: 'from-pink-500/30 via-rose-600/15 to-transparent text-pink-400',
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
  const accent = groupAccents[member.group]
  const zoneTone = member.group === 'jury' ? 'pink' : member.group === 'mentors' ? 'violet' : 'cyan'

  return (
    <div
      className={`glass glass-hover sheen w-[calc(100vw-3.5rem)] sm:w-[calc((100vw-6rem)/2)] lg:w-[292px] shrink-0 snap-start rounded-2xl overflow-hidden group flex flex-col ${accent.hover}`}
    >
      {/* Visual zone — photo when available, gradient monogram otherwise */}
      <div
        className={`relative h-32 sm:h-36 md:h-44 overflow-hidden ${
          member.img
            ? ''
            : `bg-gradient-to-br ${zoneColors[zoneTone]} flex items-center justify-center`
        }`}
      >
        {member.img ? (
          <SmartImage
            alt={member.name}
            draggable={false}
            className="object-cover object-top opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-650"
            src={member.img}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
          />
        ) : (
          <span
            className={`font-mono text-6xl font-bold opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-650 ${
              zoneColors[zoneTone].split(' ').pop()
            }`}
          >
            {member.initials || initialsOf(member.name)}
          </span>
        )}
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
            member.img ? 'bg-obsidian-950/60 border border-white/[0.12] text-white' : accent.pill
          }`}
        >
          <Icon name={accent.icon} className="text-[13px]" />
          {member.role}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent"></div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
        <h4 className="text-sm sm:text-base md:text-base font-bold text-white tracking-tight leading-tight">{member.name}</h4>
        <p className={`text-[10px] sm:text-xs font-semibold mt-0.5 ${accent.title}`}>{member.title}</p>
        {member.tag && (
          <p className="text-[10px] text-zinc-500 font-mono">{member.tag}</p>
        )}
        <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 sm:mt-2 leading-relaxed flex-1 line-clamp-3">{member.bio}</p>

        {/* Universal footer — same on every card */}
        <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-2.5 md:pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white/[0.04] text-[9px] sm:text-[10px] font-mono text-zinc-300">
            {member.badge}
          </span>
          <Link
            href={`/faculty/${member.slug}`}
            className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-white hover:text-brand-violet transition-colors"
          >
            View Profile
            <Icon name="arrow_forward" className="text-[11px] sm:text-[14px]" />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Carousel row: mobile pe horizontal swipeable carousel,              */
/* md: pe responsive grid (auto-fill). Dots + See More sirf mobile pe. */
/* ------------------------------------------------------------------ */

function CarouselRow({ title, members }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [maxIndex, setMaxIndex] = useState(0)

  const stepOf = () => {
    const track = trackRef.current
    if (!track) return 320
    const card = track.querySelector('[data-card]')
    return card ? card.offsetWidth + 20 : 320
  }

  /* how many scroll positions exist (cards - visible + 1, min 1) */
  const recompute = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('[data-card]')
    if (!card) return
    const step = card.offsetWidth + 20
    const visible = Math.max(1, Math.round(track.clientWidth / step))
    const pages = Math.max(1, members.length - visible + 1)
    setMaxIndex(pages - 1)
    setIndex((i) => Math.min(i, pages - 1))
  }, [members.length])

  useEffect(() => {
    recompute()
    window.addEventListener('resize', recompute)
    return () => {
      window.removeEventListener('resize', recompute)
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    }
  }, [recompute])

  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(i, maxIndex))
    setIndex(clamped)
    trackRef.current?.scrollTo({ left: clamped * stepOf(), behavior: 'smooth' })
  }

  const scrollByCard = (dir) => {
    goTo(index + dir)
  }

  /* sync dots when user drags/swipes — rAF-throttled to avoid re-render storms */
  const scrollRaf = useRef(null)
  const onScroll = () => {
    if (scrollRaf.current) return
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = null
      const track = trackRef.current
      if (!track) return
      setIndex(Math.round(track.scrollLeft / stepOf()))
    })
  }

  /* ── Drag-to-slide — mouse se pakad ke dhire-dhire slide karo ──────
     Touch pe native swipe already best hai, isliye sirf mouse handle.
     4px ke baad capture: pehle 4px tak normal click, links na toote. */
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false, id: null })

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const track = trackRef.current
    if (!track) return
    drag.current = { active: true, startX: e.clientX, startLeft: track.scrollLeft, moved: false, id: e.pointerId }
    track.style.scrollBehavior = 'auto' /* CSS smooth-scroll drag ko laggy banata hai */
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active || e.pointerId !== d.id) return
    const track = trackRef.current
    if (!track) return
    const dx = e.clientX - d.startX
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      try { track.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    }
    if (d.moved) track.scrollLeft = d.startLeft - dx
  }

  const endDrag = (e) => {
    const d = drag.current
    d.active = false
    const track = trackRef.current
    if (track) {
      track.style.scrollBehavior = ''
      const pid = e?.pointerId
      if (pid != null && track.hasPointerCapture?.(pid)) track.releasePointerCapture(pid)
    }
    /* click drag ke turant baad hi aata hai — uske baad flag clear */
    setTimeout(() => { drag.current.moved = false }, 0)
  }

  /* drag ke dauran accidental link-clicks suppress karo */
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="mb-14 last:mb-0">
      {/* Group heading — dots + count; slides drag/swipe se browse hote hain */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h3 className="text-xs font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase shrink-0">
          {title}
        </h3>
        <span className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[11px] font-mono text-zinc-600 shrink-0">
          {members.length} MEMBERS
        </span>

        {/* Dots — position indicator (drag/swipe ke saath sync) */}
        <div className="flex items-center gap-1.5 shrink-0" role="tablist" aria-label={`${title} position`}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={index === i}
                  aria-label={`Go to position ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === i
                      ? `w-5 ${groupAccents[members[0].group].dot}`
                      : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  onClick={() => goTo(i)}
                />
              ))}
        </div>
      </div>

      {/* Track — horizontal swipe/drag carousel. Viewport lg+ pe exactly
          4 cards tak capped (4×292px + 3×20px gaps = 1228px) — baaki
          cards drag/arrows se aate hain, aadha peek nahi dikhta. */}
      <div className="group/track relative max-w-[1228px] mx-auto">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onClickCapture}
          className="cursor-grab select-none overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 snap-x snap-mandatory scroll-smooth active:cursor-grabbing"
        >
          <div className="flex gap-4 sm:gap-5">
            {members.map((member) => (
              <div data-card key={member.slug} className="flex">
                <PeopleCard member={member} />
              </div>
            ))}
          </div>
        </div>

        {/* Edge arrows — left/right swipe affordance */}
        <>
            <button
              className="glass-strong absolute -left-3 sm:left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:scale-110 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-all duration-300 shadow-lg disabled:opacity-0 disabled:pointer-events-none"
              onClick={() => scrollByCard(-1)}
              disabled={index <= 0}
              aria-label={`Scroll ${title} left`}
              tabIndex={index <= 0 ? -1 : 0}
            >
              <Icon name="chevron_left" className="text-[18px]" />
            </button>
            <button
              className="glass-strong absolute -right-3 sm:right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:scale-110 flex items-center justify-center opacity-0 group-hover/track:opacity-100 transition-all duration-300 shadow-lg disabled:opacity-0 disabled:pointer-events-none"
              onClick={() => scrollByCard(1)}
              disabled={index >= maxIndex}
              aria-label={`Scroll ${title} right`}
              tabIndex={index >= maxIndex ? -1 : 0}
            >
              <Icon name="chevron_right" className="text-[18px]" />
            </button>
        </>
      </div>
    </div>
  )
}

/* ---------- Section ---------- */

const groups = [
  { id: 'jury', title: 'Industry Jury' },
  { id: 'mentors', title: 'Hackathon Mentors & Speakers' },
  { id: 'faculty', title: 'Faculty Advisory & Leadership' },
]

export default function Mentors() {
  return (
    <Section id="faculty" className="group/section">
      <SectionBackdrop variant="aurora" />
      <SectionHeaderRow
        heading={
          <SectionHeading
            eyebrow="Evaluated & Guided by Builders"
            title="Jury, Mentors & Faculty"
            body="Industry jury scrutinizing code quality, hackathon mentors reviewing architecture across midnight check-ins, and faculty leadership steering academic rigor. Drag to browse each roster — every profile opens in full."
          />
        }
        aside="Frontier AI • Systems • Web3"
      />

      {groups.map((group) => (
        <CarouselRow key={group.id} title={group.title} members={peopleByGroup(group.id)} />
      ))}
    </Section>
  )
}
