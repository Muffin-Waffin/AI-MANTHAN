'use client'

import { useEffect, useState } from 'react'
import ParticleBackground from './ParticleBackground'
import Navbar from './Navbar'
import Footer from './Footer'
import SupportModal from './SupportModal'
import SmoothScroll from './SmoothScroll'
import Preloader from './Preloader'

/**
 * Global shell + shared state for page-level interactions.
 * Any component can open the support modal by dispatching
 * the 'open-support-modal' window event (same contract as before).
 *
 * Global background = sparkles + shooting stars + aurora orbs.
 * The binary video is scoped inside the Hero (overview) section itself.
 */
export default function AppShell({ children }) {
  const [supportOpen, setSupportOpen] = useState(false)

  useEffect(() => {
    const open = () => setSupportOpen(true)
    window.addEventListener('open-support-modal', open)
    return () => window.removeEventListener('open-support-modal', open)
  }, [])

  return (
    <div className="relative min-h-screen bg-obsidian-950 font-sans text-zinc-100 selection:bg-brand-violet/30 selection:text-white">
      <Preloader />
      <SmoothScroll />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-28 sm:pt-36">{children}</main>
      <Footer />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  )
}
