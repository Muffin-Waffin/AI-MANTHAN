'use client'

import { useState, useEffect } from 'react'
import useScrollSpy from './useScrollSpy'
import VisitorCounter from './VisitorCounter'
import { site } from '../../data/site'

function BrandMark() {
  return (
    <a
      className="relative flex items-center gap-2 sm:gap-2.5 group shrink-0 py-0.5 transition-all duration-300 hover:scale-[1.02]"
      href="/"
    >
      {/* ambient glow behind emblem */}
      <span
        aria-hidden="true"
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-brand-cyan/25 blur-xl transition-opacity duration-500 opacity-80 group-hover:opacity-100"
      />
      <img
        src="/logos/aimathan-logo.png"
        alt="AI Manthan 2.0 logo"
        width={1599}
        height={966}
        className="relative h-8 w-12 sm:h-9 sm:w-15 lg:h-10 lg:w-[66px] object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.6)] transition-transform duration-500 group-hover:scale-105"
      />
      <span className="flex flex-col leading-tight select-none">
        <span className="flex items-baseline gap-1 sm:gap-1.5">
          <span className="text-white font-extrabold text-xs sm:text-base lg:text-lg tracking-[0.12em] lg:tracking-[0.16em] whitespace-nowrap transition-colors group-hover:text-cyan-300">
            {site.title}
          </span>
          <span className="text-[11px] sm:text-sm lg:text-base font-extrabold tracking-[0.12em] text-brand-cyan [text-shadow:0_0_14px_rgba(0,240,255,0.85)]">
            {site.titleAccent}
          </span>
        </span>
        <span className="hidden min-[420px]:block text-[7px] sm:text-[8px] lg:text-[9.5px] font-bold tracking-[0.24em] lg:tracking-[0.34em] text-cyan-200/90 mt-0.5 whitespace-nowrap">
          {site.subtitle}
        </span>
      </span>
    </a>
  )
}

function NavLink({ label, href, active }) {
  return (
    <a
      className={`relative px-2.5 py-1.5 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${
        active
          ? 'text-[#06080d] bg-gradient-to-r from-brand-cyan via-[#7df4ff] to-brand-cyan shadow-[0_0_16px_rgba(0,240,255,0.7),inset_0_1px_0_rgba(255,255,255,0.3)] font-bold'
          : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
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
  const [scrolled, setScrolled] = useState(false)
  const { activeId } = useScrollSpy(NAV_HREFS)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openSupport = () => {
    setMenuOpen(false)
    window.dispatchEvent(new Event('open-support-modal'))
  }
  const openRulebook = () => {
    setMenuOpen(false)
    window.dispatchEvent(new Event('open-rulebook-modal'))
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-6 pt-2.5 sm:pt-3 pb-1">
      {/* ── Single Unified Navbar Capsule Shell ──────
        Housing Brand Logo, Nav Links, Rulebook, Support & Registration
        ALL inside ONE continuous sleek cyber glass container! */}
      <div
        className={`w-full max-w-[1580px] mx-auto rounded-full transition-all duration-300 px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 sm:gap-4 ${
          scrolled
            ? 'bg-[#060b16]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(0,240,255,0.22)]'
            : 'bg-[#060b16]/85 border border-cyan-500/30 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(0,240,255,0.15)]'
        }`}
      >
        {/* Left — Brand logo */}
        <div className="shrink-0 flex items-center gap-3">
          <BrandMark />
          <span className="hidden min-[1100px]:block h-5 w-[1px] bg-cyan-500/20" />
        </div>

        {/* Center — Desktop navigation links (Inside the same unified container) */}
        <nav className="hidden 2xl:flex items-center gap-0.5 text-sm shrink-1">
          {site.nav.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={activeId === item.href.replace('/#', '')}
            />
          ))}
        </nav>

        {/* Compact Nav for xl screens (1280px-1535px) */}
        <nav className="hidden xl:flex 2xl:hidden items-center gap-0.5 text-xs shrink-1">
          {site.nav.slice(0, 6).map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={activeId === item.href.replace('/#', '')}
            />
          ))}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="px-2.5 py-1 rounded-full text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1 bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
          >
            More
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
        </nav>

        {/* Right — Actions Cluster (Inside the same unified container) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden xl:block h-5 w-[1px] bg-cyan-500/20" />

          {/* Live Visitor Counter */}
          <VisitorCounter variant="badge" className="hidden min-[1600px]:inline-flex" />

          {/* Rulebook button */}
          <button
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs lg:text-[13px] font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
            onClick={openRulebook}
            aria-label="Open rulebook"
            title="Rulebook"
          >
            <span className="material-symbols-outlined text-[16px] select-none text-cyan-300">menu_book</span>
            <span>Rulebook</span>
          </button>

          {/* Support icon button */}
          <button
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
            onClick={openSupport}
            aria-label="Open support"
            title="Support"
          >
            <span className="material-symbols-outlined text-[18px] select-none text-cyan-300">headset_mic</span>
          </button>

          {/* Registration CTA button */}
          <a
            href={site.links.register}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-zinc-950 font-extrabold text-xs sm:text-sm whitespace-nowrap bg-gradient-to-r from-brand-cyan via-[#7df4ff] to-brand-cyan shadow-[0_0_18px_rgba(0,240,255,0.65)] transition-all duration-300 hover:shadow-[0_0_26px_rgba(0,240,255,0.9)] hover:scale-[1.03]"
          >
            <span>Registration</span>
            <span className="material-symbols-outlined text-[15px] font-extrabold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">north_east</span>
          </a>

          {/* Hamburger toggle button (visible on screens below 2xl) */}
          <button
            className="2xl:hidden inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-zinc-200 border border-cyan-500/30 bg-white/[0.04] hover:text-white hover:border-cyan-400 transition-all"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined select-none text-[18px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Dropdown / Slide-over Menu for Mobile, Tablet & Compact Laptop */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="2xl:hidden fixed top-[78px] right-3 sm:right-6 left-3 sm:left-auto sm:w-[380px] max-h-[calc(100svh-90px)] overflow-y-auto rounded-2xl z-50 p-4 animate-fade-up bg-[#060b16]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                Navigation Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-zinc-400 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-white/[0.06]"
              >
                Close ✕
              </button>
            </div>

            <nav className="grid grid-cols-2 gap-1.5 py-1">
              {site.nav.map((item) => {
                const active = activeId === item.href.replace('/#', '')
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                      active
                        ? 'text-[#06080d] bg-gradient-to-r from-brand-cyan via-[#7df4ff] to-brand-cyan font-bold shadow-[0_0_14px_rgba(0,240,255,0.6)]'
                        : 'text-zinc-200 hover:text-white hover:bg-white/[0.08]'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {active && <span className="material-symbols-outlined text-[14px]">arrow_forward</span>}
                  </a>
                )
              })}
            </nav>

            <div className="my-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">Live Traffic</span>
              <VisitorCounter variant="badge" />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
              <button
                className="inline-flex items-center justify-center w-10 py-2.5 rounded-xl text-cyan-300 border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] transition-colors"
                onClick={openSupport}
                aria-label="Open support"
                title="Support"
              >
                <span className="material-symbols-outlined text-[18px]">headset_mic</span>
              </button>
              <button
                className="inline-flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl text-zinc-100 text-xs sm:text-sm font-semibold bg-white/[0.06] border border-white/[0.14] hover:bg-white/[0.12] transition-all"
                onClick={openRulebook}
              >
                <span className="material-symbols-outlined text-[16px] text-cyan-300">menu_book</span>
                Rulebook
              </button>
              <a
                href={site.links.register}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-zinc-950 text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-cyan to-[#7df4ff] shadow-[0_0_16px_rgba(0,240,255,0.5)] transition-all"
              >
                Registration
                <span className="material-symbols-outlined text-[15px]">north_east</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
