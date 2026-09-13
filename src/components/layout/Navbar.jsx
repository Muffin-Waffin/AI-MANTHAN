'use client'

import { useState } from 'react'
import Button from '../ui/Button'
import useScrollSpy from './useScrollSpy'
import { site } from '../../data/site'

function BrandMark() {
  return (
    <a className="flex items-center gap-2.5 group" href="#">
      <img
        src="/logos/aimathan-logo.png"
        alt="AI Manthan logo"
        className="w-9 h-9 rounded-lg object-cover shadow-[0_0_16px_rgba(124,58,237,0.4)] transition-transform duration-500 group-hover:scale-110"
      />
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
          {site.title}
        </span>
        <span className="text-[10px] text-zinc-400 font-mono hidden sm:block">{site.subtitle}</span>
      </div>
    </a>
  )
}

function LiveBadge() {
  return (
    <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      Round 1 Open
    </span>
  )
}

/* Scroll-spy indicator: the underline + glow live ONLY on the section
   you're currently in — as you scroll, it automatically moves to the
   active link. No hover-underline; hover just brightens the label. */
function NavLink({ label, href, active }) {
  return (
    <a
      className={`relative px-2.5 py-1.5 rounded-lg transition-all duration-500 after:content-[''] after:absolute after:left-2.5 after:right-2.5 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-gradient-to-r after:from-brand-violet after:to-brand-cyan after:shadow-[0_0_12px_rgba(139,92,246,0.8)] after:origin-left after:transition-transform after:duration-500 ${
        active
          ? 'text-white bg-white/[0.06] after:scale-x-100'
          : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] after:scale-x-0'
      }`}
      href={href}
      aria-current={active ? 'true' : undefined}
    >
      {label}
    </a>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { activeId } = useScrollSpy(site.nav.map((n) => n.href))
  const openSupport = () => {
    setMenuOpen(false)
    window.dispatchEvent(new Event('open-support-modal'))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
      <div className="glass-strong max-w-7xl mx-auto rounded-2xl sm:rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] px-4 sm:px-6 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 h-16">
          <BrandMark />
          <LiveBadge />
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {site.nav.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={activeId === item.href.replace('/#', '')}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 h-16">
          <button
            className="hidden sm:inline-flex items-center text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            onClick={openSupport}
          >
            Support
          </button>
          <div className="hidden sm:block">
            <Button
              variant="white"
              size="sm"
              href={site.links.register}
              external
              icon="arrow_forward"
            >
              Register on Unstop
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors"
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="glass-strong lg:hidden mt-2 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.6)] pointer-events-auto overflow-hidden animate-fade-up"
        >
          <nav className="flex flex-col p-3 text-sm font-medium">
            {site.nav.map((item) => {
              const active = activeId === item.href.replace('/#', '')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 rounded-lg transition-all ${
                    active
                      ? 'text-white bg-brand-violet/15 border-l-2 border-brand-violet'
                      : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="flex items-center gap-2 px-3 pb-3 sm:hidden">
            <Button
              variant="white"
              size="sm"
              href={site.links.register}
              external
              icon="arrow_forward"
              className="flex-1"
            >
              Register
            </Button>
            <Button variant="glass" size="sm" onClick={openSupport} className="flex-1">
              Support
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
