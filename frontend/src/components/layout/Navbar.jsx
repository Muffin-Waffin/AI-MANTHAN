'use client'

import { useState, useEffect, useRef } from 'react'
import useScrollSpy from './useScrollSpy'
import VisitorCounter from './VisitorCounter'
import { site } from '../../data/site'

function BrandMark() {
  return (
    <a
      className="relative flex flex-col items-center justify-center group shrink-0 py-0.5 transition-all duration-300 hover:scale-[1.02]"
      href="/"
    >
      <img
        src="/logos/image.png"
        alt="AI Manthan 2.0 logo"
        width={120}
        height={120}
        className="relative h-8 sm:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
      />
      <span className="flex flex-col items-center leading-none select-none mt-0.5">
        <span className="flex items-baseline gap-1">
          <span className="text-white font-extrabold text-xs sm:text-sm tracking-[0.12em] whitespace-nowrap transition-colors group-hover:text-cyan-300">
            {site.title}
          </span>
          <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.12em] text-cyan-400">
            {site.titleAccent}
          </span>
        </span>
        <span className="hidden min-[420px]:block text-[7px] sm:text-[8px] font-bold tracking-[0.2em] text-zinc-400 mt-0.5 whitespace-nowrap">
          {site.subtitle}
        </span>
      </span>
    </a>
  )
}

function SlidingNav({ items, activeId, extraItem }) {
  const containerRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  useEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current
      if (!container) return
      const activeEl = container.querySelector(`[data-nav-id="${activeId}"]`)
      if (activeEl) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = activeEl.getBoundingClientRect()
        setIndicator({
          left: activeRect.left - containerRect.left + 4,
          width: Math.max(0, activeRect.width - 8),
          opacity: 1,
        })
      } else {
        setIndicator((prev) => ({ ...prev, opacity: 0 }))
      }
    }

    updateIndicator()
    // Small frame delay to ensure layout measurements are rendered accurately
    const timer = setTimeout(updateIndicator, 50)
    window.addEventListener('resize', updateIndicator)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeId, items])

  return (
    <div ref={containerRef} className="relative flex items-center gap-0.5 py-1">
      {items.map((item) => {
        const id = item.href.replace('/#', '')
        const active = activeId === id
        return (
          <a
            key={item.href}
            data-nav-id={id}
            href={item.href}
            className={`relative px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium whitespace-nowrap transition-colors duration-200 select-none ${
              active
                ? 'text-cyan-300 font-bold'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {item.label}
          </a>
        )
      })}
      {extraItem}

      {/* Smooth Sliding Cyan Bottom Line Indicator */}
      <span
        className="absolute bottom-[2px] h-[2.5px] rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.95)] transition-all duration-300 ease-out pointer-events-none"
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
          opacity: indicator.opacity,
        }}
      />
    </div>
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
        Border-less sleek cyber dark glass container */}
      <div
        className={`w-full max-w-[1540px] mx-auto rounded-full transition-all duration-300 px-3 sm:px-5 py-2 flex items-center justify-between gap-2 sm:gap-4 ${
          scrolled
            ? 'bg-[#080d18]/95 backdrop-blur-2xl shadow-2xl shadow-black/70'
            : 'bg-[#080d18]/85 backdrop-blur-xl shadow-xl shadow-black/50'
        }`}
      >
        {/* Left — Brand logo */}
        <div className="shrink-0 flex items-center gap-2.5 sm:gap-3">
          <BrandMark />
          <span className="hidden min-[1100px]:block h-6 w-[1px] bg-white/15" />
        </div>

        {/* Center — Desktop navigation links displaying all menu items directly */}
        <nav className="hidden lg:flex items-center shrink-1">
          <SlidingNav items={site.nav} activeId={activeId} />
        </nav>

        {/* Right — Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden xl:block h-6 w-[1px] bg-white/15" />

          {/* Live Visitor Counter */}
          <VisitorCounter variant="badge" className="hidden min-[1600px]:inline-flex" />

          {/* Rulebook button */}
          <button
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
            onClick={openRulebook}
            aria-label="Open rulebook"
            title="Rulebook"
          >
            <span className="material-symbols-outlined text-[17px] select-none text-cyan-400">menu_book</span>
            <span>Rulebook</span>
          </button>

          {/* Support icon button */}
          <button
            className="hidden sm:inline-flex items-center justify-center w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full text-zinc-200 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
            onClick={openSupport}
            aria-label="Open support"
            title="Support"
          >
            <span className="material-symbols-outlined text-[19px] select-none text-cyan-400">mail</span>
          </button>

          {/* Registration CTA button */}
          <a
            href={site.links.register}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-zinc-950 font-extrabold text-xs sm:text-sm whitespace-nowrap bg-cyan-400 hover:bg-cyan-300 transition-colors duration-200 shadow-md shadow-cyan-500/20"
          >
            <span>Registration</span>
            <span className="material-symbols-outlined text-[15px] font-extrabold transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">north_east</span>
          </a>

          {/* Hamburger toggle button (visible on screens below lg) */}
          <button
            className="lg:hidden inline-flex items-center justify-center w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full text-zinc-200 bg-white/[0.06] hover:text-white hover:bg-white/[0.12] transition-all"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined select-none text-[19px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Dropdown / Slide-over Menu for Mobile & Tablet */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="lg:hidden fixed top-[78px] right-3 sm:right-6 left-3 sm:left-auto sm:w-[380px] max-h-[calc(100svh-90px)] overflow-y-auto rounded-2xl z-50 p-4 animate-fade-up bg-[#060b16]/95 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
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
                        ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-400/40 font-bold'
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
                <span className="material-symbols-outlined text-[18px]">mail</span>
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
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-zinc-950 text-xs sm:text-sm font-bold bg-cyan-400 hover:bg-cyan-300 transition-colors"
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
