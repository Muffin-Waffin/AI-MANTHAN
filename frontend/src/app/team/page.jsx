import AppShell from '@/components/layout/AppShell'
import SmartBack from '@/components/ui/SmartBack'
import { teamGroups } from '@/data/team'
import TeamRevealScript from './TeamRevealScript'
import TeamRoster from './TeamRoster'

export const metadata = {
  title: 'Meet the Team — Community Organizing Crew',
  description:
    'The community organizing team behind AI Manthan 2.0 — core leads, technical crew, SMGD, outreach and volunteers at Acropolis Institute of Technology & Research, Indore.',
}

export default function TeamPage() {
  return (
    <AppShell>
      <TeamRevealScript />
      {/* ═══ CINEMATIC VIDEO HERO — opening scene of the story ═════════ */}
      <section className="relative h-[62vh] min-h-[460px] sm:h-[58vh] md:h-[62vh] w-full overflow-hidden -mt-28 sm:-mt-36">
        {/* background video — muted, looping, slow drift.
            NOTE: the team-specific clip (/media/team-hero.mp4) is not in
            the repo — reuse the official hero video so the page never
            renders a dead video element. Restore the dedicated clip by
            dropping it at /public/media/team-hero.mp4 and switching src. */}
        <video
          className="hero-video absolute inset-0 h-full w-full object-cover"
          src="/binary-fly.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        {/* layered cinematic overlay — readable behind text, video stays visible */}
        <div className="absolute inset-0 bg-obsidian-950/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.14),transparent_60%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.75)]" />
        {/* stronger readability band behind the title */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 bg-obsidian-950/25 blur-2xl" />

        {/* hero content — vertically+horizontally centered */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <span className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.32em] text-cyan-300/90 uppercase animate-fade-in">
            AI Manthan 2.0
          </span>
          <h1 className="mt-4 font-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.02] animate-fade-up">
            <span className="bg-gradient-to-b from-white via-white to-cyan-300 bg-clip-text text-transparent [text-shadow:none]">
              AI Manthan Team
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base text-zinc-300/90 leading-relaxed animate-fade-up [animation-delay:120ms]">
            Meet the minds, builders, leaders and visionaries behind AI Manthan 2.0.
          </p>
        </div>

        {/* soft fade into page background — no hard edge */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 bg-gradient-to-b from-transparent via-obsidian-950/70 to-obsidian-950" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[70vw] h-28 rounded-full bg-cyan-800/[0.14] blur-[90px]" />
      </section>

      {/* ═══ TEAM ROSTERS ═════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] max-w-[1100px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.08),transparent_65%)] blur-3xl"
        />

        <div className="site-container relative z-10 pb-20">
          {/* Back link — history-aware, exact scroll restore */}
          <SmartBack
            href="/"
            label="Back to AI Manthan"
            className="team-reveal inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors mb-10 sm:mb-14"
          />

          <TeamRoster groups={teamGroups} />
        </div>
      </div>
    </AppShell>
  )
}
