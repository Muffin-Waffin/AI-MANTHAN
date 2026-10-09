'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import useScrollSpy from '@/components/layout/useScrollSpy'
import { site } from '@/data/site'

const NAV_HREFS = ['/#overview', '/#tracks', '/#timeline', '/#prizes']

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { activeId } = useScrollSpy(NAV_HREFS)

  const isHome = pathname === '/'

  const openSupport = () => {
    window.dispatchEvent(new Event('open-support-modal'))
  }

  const openInstall = () => {
    window.dispatchEvent(new Event('open-install-prompt'))
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060a14]/95 backdrop-blur-2xl border-t border-white/10 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* 1. Arena (Overview) */}
        <Link
          href="/#overview"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-95 ${
            isHome && (!activeId || activeId === 'overview')
              ? 'text-cyan-300 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="grid h-6 w-6 place-items-center">
            <Icon name="home" className="text-[20px]" />
          </span>
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Arena</span>
          {isHome && (!activeId || activeId === 'overview') && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_6px_#00f0ff]" />
          )}
        </Link>

        {/* 2. Tracks */}
        <Link
          href="/#tracks"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-95 ${
            isHome && activeId === 'tracks'
              ? 'text-cyan-300 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="grid h-6 w-6 place-items-center">
            <Icon name="hub" className="text-[20px]" />
          </span>
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Tracks</span>
          {isHome && activeId === 'tracks' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_6px_#00f0ff]" />
          )}
        </Link>

        {/* 3. Timeline */}
        <Link
          href="/#timeline"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-95 ${
            isHome && activeId === 'timeline'
              ? 'text-cyan-300 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="grid h-6 w-6 place-items-center">
            <Icon name="timeline" className="text-[20px]" />
          </span>
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Timeline</span>
          {isHome && activeId === 'timeline' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_6px_#00f0ff]" />
          )}
        </Link>

        {/* 4. Prizes */}
        <Link
          href="/#prizes"
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all active:scale-95 ${
            isHome && activeId === 'prizes'
              ? 'text-cyan-300 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="grid h-6 w-6 place-items-center">
            <Icon name="military_tech" className="text-[20px]" />
          </span>
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Prizes</span>
          {isHome && activeId === 'prizes' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_6px_#00f0ff]" />
          )}
        </Link>

        {/* 5. Support / Desk Button */}
        <button
          onClick={openSupport}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-zinc-400 hover:text-cyan-300 active:scale-95 transition-all"
          aria-label="Open support and desk modal"
        >
          <span className="grid h-6 w-6 place-items-center">
            <Icon name="support_agent" className="text-[20px]" />
          </span>
          <span className="text-[10px] font-mono tracking-tight mt-0.5">Support</span>
        </button>
      </div>
    </nav>
  )
}
