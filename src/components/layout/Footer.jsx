import { footer } from '../../data/site'
import Link from 'next/link'

/* ── Footer action button (ref: Manipal — rounded-rect, hairline) ──── */
function FooterAction({ icon, children, href, external = false, onClick }) {
  const cls =
    'group inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.04] px-4 sm:px-5 py-2.5 text-xs sm:text-[13px] font-semibold text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-fuchsia-400/60 hover:bg-white/[0.08] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_22px_-4px_rgba(217,70,239,0.5)] focus-visible:outline-2 focus-visible:outline-fuchsia-400/70'

  const inner = (
    <>
      <span className="material-symbols-outlined text-[15px] select-none">{icon}</span>
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

/* ── Giant ghost watermark ────────────────────────────────────────────
   Implementation note (why SVG, not font-size tricks):
   A plain <span> at 11vw/13rem can overflow the band on odd viewports
   and get clipped mid-glyph. Instead we set the wordmark inside an SVG
   viewBox and force it to exactly the viewBox width with `textLength` +
   `lengthAdjust` — the text then scales fluidly with the container and
   mathematically can never overflow. Bottom-anchored so the baseline
   kisses the footer's bottom edge (the deliberate Manipal-style crop),
   with a vertical gradient fade so it dissolves into the dark instead
   of ending on a hard line. */
function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 select-none"
    >
      {/* soft radial depth blob behind the wordmark */}
      <div className="absolute left-1/2 bottom-[-30%] -translate-x-1/2 w-[70vw] h-[40vw] max-w-[1100px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.14),transparent_65%)] blur-3xl" />

      <svg
        viewBox="0 0 1500 190"
        preserveAspectRatio="xMidYMax meet"
        className="relative block w-full h-auto"
      >
        <defs>
          {/* near-uniform wash like the ref — faint dissolve only at the very
              bottom so the band edge stays clean */}
          <linearGradient id="footer-wm-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.075" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.065" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.035" />
          </linearGradient>
        </defs>
        {/* textLength 1496/1500 → true edge-to-edge letter bleed (ref) */}
        <text
          x="750"
          y="158"
          textAnchor="middle"
          textLength="1496"
          lengthAdjust="spacingAndGlyphs"
          fontSize="176"
          fill="url(#footer-wm-fade)"
          className="font-mono font-bold"
        >
          {footer.watermark}
        </text>
      </svg>
    </div>
  )
}

/**
 * Manipal-style footer band:
 *   • Left   — logo + wordmark "AI MANTHAN // 2K26"
 *   • Center — location pin + institute address
 *   • Right  — Rulebook + Meet the Team pills
 *   • Full-bleed gradient-faded watermark hugging the bottom edge
 */
export default function Footer() {
  const openRulebook = () => window.dispatchEvent(new Event('open-rulebook-modal'))

  return (
    <footer
      id="contact"
      className="relative w-full overflow-hidden bg-obsidian-950 text-zinc-400"
    >
      {/* top hairline — violet glow leaking through the seam */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-violet/50 to-transparent" />
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-brand-violet/[0.06] to-transparent" />

      <Watermark />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="site-container relative z-10 pt-12 sm:pt-14 pb-7 sm:pb-9">
        <div className="flex flex-col items-center gap-7 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:text-left">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <span className="relative flex items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute w-9 h-9 rounded-full bg-fuchsia-600/25 blur-lg opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <img
                src="/logos/aimathan-logo.png"
                alt="AI Manthan logo"
                className="relative w-8 h-8 rounded object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="font-mono text-sm sm:text-base font-bold tracking-[0.22em] text-white whitespace-nowrap">
              {footer.brand}
              <span className="text-zinc-600"> // </span>
              <span className="text-fuchsia-300 [text-shadow:0_0_12px_rgba(232,121,249,0.5)]">
                {footer.brandAccent}
              </span>
            </span>
          </Link>

          {/* Address */}
          <div className="flex max-w-md items-start sm:items-center gap-2 text-xs sm:text-[13px] leading-relaxed text-zinc-400">
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-zinc-500 select-none shrink-0 mt-0.5 sm:mt-0">
              location_on
            </span>
            <span>{footer.address}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <FooterAction icon="download" onClick={openRulebook}>
              Rulebook
            </FooterAction>
            <FooterAction icon="group" href="/team">
              Meet the Team
            </FooterAction>
          </div>
        </div>

        {/* ── Legal strip ─────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-12 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono text-zinc-600">
          <div>{footer.legal}</div>
          <div className="flex items-center gap-3 sm:gap-4">
            {footer.meta.map((item, i) => (
              <span key={item} className="flex items-center gap-3 sm:gap-4">
                {i > 0 && <span className="text-zinc-700">•</span>}
                <span className="hover:text-zinc-400 transition-colors">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
