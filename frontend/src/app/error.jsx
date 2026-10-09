'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-5 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
        <Icon name="error" className="text-3xl" />
      </div>

      <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-red-400">
        System Disruption
      </span>

      <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Something unexpected occurred
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
        {error?.message && !error.message.includes('fetch')
          ? error.message
          : 'An unexpected runtime state occurred. Try resetting the current view or return to base.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06080d] font-bold text-xs uppercase tracking-wider transition-all"
        >
          <Icon name="refresh" className="text-[16px]" />
          Retry
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-xs transition-colors"
        >
          <Icon name="home" className="text-[16px]" />
          Return to Arena
        </Link>
      </div>
    </div>
  )
}
