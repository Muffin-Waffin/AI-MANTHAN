'use client'

import SmartImage from '@/components/ui/SmartImage'
import { teamAccents } from '@/data/team'

/* ── Portrait card — tall rectangle: photo/monogram in a 3:4 frame,
   centered name + role + socials below the card. ── */
function TeamCard({ member }) {
  return (
    <div className="group flex flex-col items-center w-full max-w-[280px]">
      <div className="relative w-full aspect-[3/4] rounded-[1.25rem] border border-white/[0.1] bg-obsidian-900/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_40px_-14px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-hover:border-brand-cyan/60 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_30px_-6px_rgba(0,240,255,0.5),0_22px_44px_-14px_rgba(0,0,0,0.85)] shrink-0">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-11 h-1 rounded-full bg-white/[0.14] z-10" />

        <div className="absolute inset-0 overflow-hidden">
          {member.photo ? (
            <SmartImage
              alt={member.name}
              src={member.photo}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br flex items-center justify-center ${
                teamAccents[member.accent] || teamAccents.cyan
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute font-mono text-[7rem] font-bold text-white/[0.05] select-none leading-none"
              >
                {member.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </span>
              <span className="relative font-mono text-6xl font-bold tracking-tight text-white/90 transition-transform duration-500 group-hover:scale-105">
                {member.name
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-obsidian-950/75 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent" />
        </div>
      </div>

      <h3 className="mt-4 text-base font-bold text-white tracking-tight text-center">
        {member.name}
      </h3>
      <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
        {member.role}
      </p>
      <div className="mt-2.5 flex items-center gap-3.5">
        {member.instagram && (
          <a
            href={member.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on Instagram`}
            className="text-zinc-500 transition-all duration-300 hover:text-white hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.35-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.35-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.35 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" />
            </svg>
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="text-zinc-500 transition-all duration-300 hover:text-white hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46ZM5.34 7.43a2.06 2.06 0 1 1 2.06-2.06 2.06 2.06 0 0 1-2.06 2.06ZM7.12 20.45H3.56V9h3.56ZM22.22 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54A1.75 1.75 0 0 0 1.77 24h20.45A1.75 1.75 0 0 0 24 22.27V1.73A1.75 1.75 0 0 0 22.22 0Z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}

function TeamGroup({ group }) {
  return (
    <section className="mb-14 last:mb-0">
      {/* Group heading */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h2 className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-zinc-300 uppercase shrink-0">
          {group.title}
        </h2>
        <span className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[11px] font-mono text-zinc-600 shrink-0">
          {group.members.length} MEMBERS
        </span>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {group.members.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  )
}

export default function TeamRoster({ groups }) {
  return (
    <>
      {groups.map((group) => (
        <TeamGroup key={group.id} group={group} />
      ))}
    </>
  )
}
