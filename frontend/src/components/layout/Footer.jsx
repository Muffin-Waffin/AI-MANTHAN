import { site, footer } from '../../data/site'
import Link from 'next/link'
import VisitorCounter from './VisitorCounter'
import Icon from '../ui/Icon'

/* ── Sleek Action Button ──── */
function FooterAction({ icon, children, href, external = false, onClick, download }) {
  const cls =
    'group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white/40'

  const inner = (
    <>
      <Icon name={icon} className="text-[16px] text-zinc-400 group-hover:text-white transition-colors" />
      {children}
    </>
  )

  if (onClick) {
    return (
      <button className={cls} onClick={onClick}>
        {inner}
      </button>
    )
  }

  if (download) {
    return (
      <a
        className={cls}
        href={href}
        download={download}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link
      className={cls}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </Link>
  )
}

/* ── Crisp, large background watermark ──── */
function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none z-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1500 220"
        preserveAspectRatio="xMidYMid meet"
        className="relative block w-full h-auto opacity-60"
      >
        <text
          x="750"
          y="150"
          textAnchor="middle"
          textLength="1496"
          lengthAdjust="spacingAndGlyphs"
          fontSize="220"
          fill="#ffffff"
          fillOpacity="0.04"
          className="font-mono font-bold"
        >
          {footer.watermark}
        </text>
      </svg>
    </div>
  )
}

export default function Footer() {
  const openRulebook = () => window.dispatchEvent(new Event('open-rulebook-modal'))

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-[#06080d] text-zinc-400 py-12 sm:py-16 border-t border-white/10"
    >
      <Watermark />

      <div className="site-container relative z-10 space-y-12">
        {/* Top Section — 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src="/logos/aimathan-logo.png"
                alt="AI Manthan 2.0"
                width={1599}
                height={966}
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm">
              The flagship national AI hackathon at Acropolis Institute of Technology & Research, Indore — bringing together builders, innovators and creators for a 24-hour sprint.
            </p>
            {/* Social & Contact */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${site.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-sans text-zinc-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors"
              >
                <Icon name="mail" className="text-sm text-cyan-400" />
                {site.email}
              </a>
              <a
                href={site.community.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-mono text-zinc-300 hover:text-emerald-300 hover:border-emerald-400/40 transition-colors"
              >
                <Icon name="forum" className="text-sm text-emerald-400" />
                Community
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-medium text-zinc-400">
              {site.nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-cyan-300 transition-colors inline-block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Highlights */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">
              Highlights
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                24-Hour Sprint
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                9 AI Domains
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                ₹1,00,000+ Prizes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                AITR Indore
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Actions & Location */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">
              Quick Actions & Venue
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <FooterAction icon="download" href="/RuleBook/AI_Manthan_2.0_Round1_Rulebook.pdf" download="AI-Manthan-2.0-Round1-Rulebook.pdf">
                Rulebook
              </FooterAction>
              <FooterAction icon="group" href="/team">
                Meet Team
              </FooterAction>
            </div>
            <div className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed pt-1">
              <Icon name="location_on" className="text-base text-cyan-400 shrink-0 mt-0.5" />
              <span>{footer.address}</span>
            </div>
          </div>
        </div>

        {/* Giant Edge-to-Edge Typography Banner (matching screenshot style) */}
        <div className="w-full py-6 sm:py-8 border-t border-white/[0.08] overflow-hidden select-none">
          <h2 className="text-[7.5vw] md:text-[8.5vw] font-black uppercase tracking-[0.16em] text-center leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/35 via-white/15 to-white/5 drop-shadow-sm whitespace-nowrap">
            AI MANTHAN 2.0
          </h2>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>{footer.legal}</div>
          <div className="flex items-center gap-4 sm:gap-5">
            <VisitorCounter />
            {footer.meta.map((item, i) => (
              <span key={item} className="flex items-center gap-4 sm:gap-5">
                {i > 0 && <span className="text-zinc-700">•</span>}
                <span className="hover:text-zinc-300 transition-colors">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
