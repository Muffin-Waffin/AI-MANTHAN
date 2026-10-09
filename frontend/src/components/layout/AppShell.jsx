'use client'

import { useEffect, useState } from 'react'
import ParticleBackground from './ParticleBackground'
import Navbar from './Navbar'
import Footer from './Footer'
import SupportModal from './SupportModal'
import RulebookModal from './RulebookModal'
import PhoneDirectoryModal from './PhoneDirectoryModal'
import UnstopEventModal from './UnstopEventModal'
import SmoothScroll from './SmoothScroll'
import Preloader from './Preloader'
import PwaManager from '@/components/pwa/PwaManager'
import InstallAppPrompt from '@/components/pwa/InstallAppPrompt'
import MobileBottomNav from '@/components/pwa/MobileBottomNav'

/**
 * Global shell + shared state for page-level interactions.
 * Includes PWA service worker lifecycle manager, install prompt,
 * and mobile bottom navigation with safe-area spacing.
 */
export default function AppShell({ children }) {
  const [supportOpen, setSupportOpen] = useState(false)
  const [rulebookOpen, setRulebookOpen] = useState(false)
  const [directoryOpen, setDirectoryOpen] = useState(false)

  useEffect(() => {
    const openSupport = () => setSupportOpen(true)
    const openRulebook = () => setRulebookOpen(true)
    const openDirectory = () => setDirectoryOpen(true)
    window.addEventListener('open-support-modal', openSupport)
    window.addEventListener('open-rulebook-modal', openRulebook)
    window.addEventListener('open-phone-directory-modal', openDirectory)
    return () => {
      window.removeEventListener('open-support-modal', openSupport)
      window.removeEventListener('open-rulebook-modal', openRulebook)
      window.removeEventListener('open-phone-directory-modal', openDirectory)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-obsidian-950 font-sans text-zinc-100 selection:bg-brand-cyan/30 selection:text-white">
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 bg-cyan-400 text-[#06080d] font-bold rounded-lg shadow-xl"
      >
        Skip to main content
      </a>

      {/* PWA Lifecycle and Install Promotion */}
      <PwaManager />
      <InstallAppPrompt />

      <Preloader />
      <SmoothScroll />
      <ParticleBackground />
      <Navbar />

      <main id="main-content" className="relative z-10 pt-28 sm:pt-36 pb-20 md:pb-0">
        {children}
      </main>

      <Footer />

      {/* Mobile-first bottom app navigation */}
      <MobileBottomNav />

      {/* Modals */}
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <RulebookModal open={rulebookOpen} onClose={() => setRulebookOpen(false)} />
      <PhoneDirectoryModal open={directoryOpen} onClose={() => setDirectoryOpen(false)} />
      <UnstopEventModal />
    </div>
  )
}
