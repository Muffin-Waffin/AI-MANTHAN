'use client'

import Link from 'next/link'
import Icon from '@/components/ui/Icon'

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-100 flex flex-col justify-between p-6 sm:p-10 selection:bg-cyan-400/30 selection:text-white">
      {/* Background ambient radial aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06),transparent_65%)]"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/logos/image.png"
            alt="AI Manthan 2.0"
            width={40}
            height={40}
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
            AI Manthan <span className="text-cyan-400">2.0</span>
          </span>
        </Link>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Offline Mode
        </span>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-lg mx-auto w-full my-auto text-center py-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.18)] mb-6">
          <Icon name="wifi_off" className="text-3xl sm:text-4xl" />
        </div>

        <p className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-cyan-400 mb-2">
          Offline Protocol Engaged
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          No Internet Connection
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
          You are currently browsing offline. Previously viewed hackathon details, rules, tracks,
          and cached resources remain available on this device.
        </p>

        {/* Feature status strip */}
        <div className="my-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-zinc-300">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Cached pages & schedule can still be viewed</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-300">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Support tickets and feedback are saved offline & synced automatically</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-400">
            <span className="text-amber-400 font-bold">!</span>
            <span>Live server updates resume when your connection restores</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06080d] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <Icon name="refresh" className="text-[16px]" />
            Retry Connection
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs transition-colors"
          >
            <Icon name="home" className="text-[16px]" />
            Return to Arena
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[10px] font-mono text-zinc-600">
        AI Manthan 2.0 PWA Shell · Service Worker Cached Storage
      </footer>
    </div>
  )
}
