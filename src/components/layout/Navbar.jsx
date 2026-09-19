'use client'

import { useState } from 'react'
import useScrollSpy from './useScrollSpy'
import { site } from '../../data/site'

/* ── Brand: butterfly mark + neon wordmark — a standalone floating
   piece pinned to the left edge (no shared shell with the nav) ── */
function BrandMark() {
  return (
    <a
      className="neon-brand relative flex items-center gap-3 group shrink-0 rounded-full pl-2 pr-4 py-1.5"
      href="#"
    >
      {/* ambient glow behind the butterfly */}
      <span
        aria-hidden="true"
        className="absolute -left-1 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-fuchsia-600/25 blur-xl transition-opacity duration-500 opacity-80 group-hover:opacity-100"
      />
      <img
        src="/logos/butterfly.png"
        alt="AI Manthan butterfly logo"
        className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 object-contain drop-shadow-[0_0_12px_rgba(217,70,239,0.65)] transition-transform duration-500 group-hover:scale-110"
      />
      <span className="flex flex-col leading-none">
        <span className="flex items-baseline gap-1.5">
          <span className="text-white font-extrabold text-sm sm:text-base lg:text-lg tracking-[0.14em] lg:tracking-[0.18em] whitespace-nowrap transition-colors group-hover:text-zinc-100">
            {site.title}
          </span>
          <span className="text-xs sm:text-sm lg:text-base font-extrabold tracking-[0.14em] text-fuchsia-400 [text-shadow:0_0_14px_rgba(232,121,249,0.8)]">
            {site.titleAccent}
          </span>
        </span>
        <span className="hidden min-[400px]:block text-[7px] sm:text-[8px] lg:text-[9px] font-semibold tracking-[0.32em] lg:tracking-[0.42em] text-zinc-400 mt-1 whitespace-nowrap">
          {site.subtitle}
        </span>
      </span>
    </a>
  )
}

/* Scroll-spy active state: a filled neon gradient pill that glides to the
   section you're in. Hover only brightens inactive labels. */
function NavLink({ label, href, active }) {
  return (
    <a
      className={`relative px-3.5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-400 ${
        active
          ? 'text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 shadow-[0_0_18px_rgba(168,85,247,0.65),inset_0_1px_0_rgba(255,255,255,0.22)]'
          : 'text-zinc-300 hover:text-white'
      }`}
      href={href}
      aria-current={active ? 'true' : undefined}
    >
      {label}
    </a>
  )
}

const NAV_HREFS = site.nav.map((n) => n.href)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeId } = useScrollSpy(NAV_HREFS)
  const openSupport = () => {
    setMenuOpen(false)
    window.dispatchEvent(new Event('open-support-modal'))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* ── Three independent floating pieces on a shared grid ──────
        Brand (left) · nav pill (dead-center) · actions (right).
        No full-width shell — each piece carries its own glass card
        look, so there is no connected "pipe" behind them. The
        absolute-centered nav is guaranteed optically central even
        when the brand and the action cluster differ in width. */}
      <div className="relative flex items-center justify-between px-3 sm:px-5 lg:px-7 pt-3 sm:pt-4 h-[70px] sm:h-[78px] lg:h-[84px]">
        {/* Left — brand card */}
        <div className="relative z-10 pointer-events-auto">
          <BrandMark />
        </div>

        {/* Center — the nav pill, absolutely dead-center regardless of
            sibling widths (brand and buttons can never push it aside) */}
        <nav className="nav-inner-pill hidden xl:flex items-center gap-0.5 rounded-full px-1.5 py-1.5 text-sm pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {site.nav.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={activeId === item.href.replace('/#', '')}
            />
          ))}
        </nav>

        {/* Right — support + registration cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pointer-events-auto">
          {/* Support — quiet icon button, keeps the modal one click away */}
          <button
            className="neon-brand hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-300 hover:text-white transition-all duration-300"
            onClick={openSupport}
            aria-label="Open support"
            title="Support"
          >
            <span className="material-symbols-outlined text-[18px] select-none">headset_mic</span>
          </button>

          <a
            href={site.links.register}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden min-[480px]:inline-flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-full text-zinc-100 text-xs sm:text-sm font-semibold whitespace-nowrap bg-white/[0.06] border border-white/[0.14] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.12] hover:border-violet-400/40 hover:text-white hover:shadow-[0_0_24px_-6px_rgba(168,85,247,0.5)]"
          >
            Registration
            <span className="material-symbols-outlined text-[16px] text-violet-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">north_east</span>
          </a>

          {/* Mobile hamburger — shows below xl (nav fits till 1280px) */}
          <button
            className="xl:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-zinc-200 border border-white/10 bg-white/[0.04] hover:text-white hover:border-fuchsia-400/50 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined select-none">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown — same treatment, vertical */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="neon-pill xl:hidden mx-3 sm:mx-5 mt-2 w-auto max-h-[calc(100svh-100px)] overflow-y-auto rounded-2xl pointer-events-auto animate-fade-up"
        >
          <nav className="flex flex-col p-3 text-sm font-semibold gap-0.5">
            {site.nav.map((item) => {
              const active = activeId === item.href.replace('/#', '')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2.5 rounded-xl transition-all ${
                    active
                      ? 'text-white bg-gradient-to-r from-purple-600/80 via-fuchsia-600/80 to-purple-600/80 shadow-[0_0_16px_rgba(168,85,247,0.5)]'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="flex items-center gap-2 px-3 pb-3 pt-2 border-t border-white/[0.07]">
            <button
              className="inline-flex items-center justify-center w-10 py-2.5 rounded-full text-zinc-200 border border-white/10 bg-white/[0.04] transition-colors"
              onClick={openSupport}
              aria-label="Open support"
            >
              <span className="material-symbols-outlined text-[18px] select-none">headset_mic</span>
            </button>
            <a
              href={site.links.register}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full text-zinc-100 text-sm font-semibold bg-white/[0.06] border border-white/[0.14] transition-all hover:bg-white/[0.12] hover:border-violet-400/40"
            >
              Registration
              <span className="material-symbols-outlined text-[16px] text-violet-300">north_east</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
