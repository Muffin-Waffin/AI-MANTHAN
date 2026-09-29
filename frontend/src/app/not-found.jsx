import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

export const metadata = {
  title: '404 — Signal Lost',
}

export default function NotFound() {
  return (
    <AppShell>
      <section className="w-full max-w-none px-4 sm:px-6 lg:px-10 2xl:px-14 py-32 text-center">
        <p className="text-xs font-mono font-bold tracking-[0.35em] text-brand-cyan uppercase mb-4">
          ERROR 404
        </p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
          Signal lost in the void.
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          The page you’re looking for doesn’t exist or has been moved. Head back to the main arena.
        </p>
        <Link
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#06080d] text-sm font-semibold shadow-[0_0_24px_rgba(0,168,255,0.45)] transition-all"
          href="/"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Base
        </Link>
      </section>
    </AppShell>
  )
}
