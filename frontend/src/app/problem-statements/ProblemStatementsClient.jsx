'use client'

import AppShell from '@/components/layout/AppShell'

/* ── PROBLEM STATEMENTS — dedicated, data-driven page ────────────────
   Renders the 12 confirmed domains from data/tracks.js. Real problem
   statements are NOT provided yet — nothing is fabricated. When PS
   content is added to a domain's `statements` array in data/tracks.js,
   it renders here automatically (no component change needed).

   A domain with zero statements shows a quiet "announcing soon" note;
   a domain with statements lists each one as a full card. */

function StatementCard({ statement, index }) {
  return (
    <article className="stmt-card rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-cyan/15 border border-brand-cyan/30 font-mono text-[10px] font-bold text-brand-cyan">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">
          Problem Statement
        </span>
      </div>
      <h4 className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
        {statement.title}
      </h4>
      {statement.description && (
        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-400">
          {statement.description}
        </p>
      )}
    </article>
  )
}

export default function ProblemStatementsClient({ totalPS, domains }) {

  const handleBackToTracks = () => {
    window.location.href = '/#tracks'
  }

  return (
    <AppShell>
      <section className="relative w-full overflow-x-clip py-16 sm:py-20">
        {/* ambient glow — scoped, pointer-events-none */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[640px] h-[380px] rounded-full bg-cyan-800/[0.1] blur-[110px]"
        />

        <div className="site-container relative z-10">
          {/* ── header ── */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <button
              onClick={handleBackToTracks}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors mb-6"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              Back to Tracks
            </button>
            <p className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.32em] text-brand-cyan">
              AI Manthan 2.0
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Problem{' '}
              <span className="text-titanium">Statements</span>
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {totalPS > 0
                ? 'Browse every official problem statement across the 12 confirmed domains.'
                : 'The 12 confirmed challenge domains. Official problem statements for each domain will be published here — watch this space.'}
            </p>
          </div>

          {/* ── domains, one section each (anchor per domain) ── */}
          <div className="space-y-12 sm:space-y-16">
            {domains.map((domain) => {
              const has = domain.statements.length > 0
              return (
                <div key={domain.id} id={domain.id} className="scroll-mt-28">
                  {/* domain header */}
                  <div className="flex items-center gap-3.5 mb-4 sm:mb-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-brand-cyan">
                      <span className="material-symbols-outlined text-[20px]">{domain.icon}</span>
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-zinc-600">
                          {domain.number}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                          {domain.label}
                        </h2>
                      </div>
                      <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5">{domain.blurb}</p>
                    </div>
                  </div>

                  {/* statements / placeholder */}
                  {has ? (
                    <div className="grid gap-3.5 sm:gap-4 md:grid-cols-2">
                      {domain.statements.map((s, i) => (
                        <StatementCard key={s.title} statement={s} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] px-5 py-4">
                      <span className="material-symbols-outlined text-[18px] text-zinc-600" aria-hidden="true">
                        hourglass_top
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                        Problem statements for this domain will be announced soon.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── footer CTA ── */}
          <div className="mt-14 flex flex-col items-center gap-4 text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-600">
              Problem statements are published by the AI Manthan 2.0 organizing team
            </p>
            <a
              href="https://unstop.com/p/ai-manthan-2k26-acropolis-institute-of-technology-and-research-indore-1751106"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand-cyan px-7 py-3.5 text-sm font-semibold text-[#06080d] shadow-[0_0_28px_-6px_rgba(0,168,255,0.7)] transition-all duration-300 hover:bg-brand-cyan-hover hover:shadow-[0_0_36px_-6px_rgba(0,168,255,0.9)]"
            >
              Register on Unstop
              <span
                className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                north_east
              </span>
            </a>
          </div>
        </div>
      </section>
    </AppShell>
  )
}