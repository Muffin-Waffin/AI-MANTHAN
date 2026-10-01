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

/**
 * Global shell + shared state for page-level interactions.
 * Any component can open the support modal by dispatching
 * the 'open-support-modal' window event (same contract as before).
 * Rulebook modal follows the same pattern via 'open-rulebook-modal',
 * phone directory via 'open-phone-directory-modal'.
 *
 * Global background = sparkles + shooting stars + aurora orbs.
 * The binary video is scoped inside the Hero (overview) section itself.
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
      <Preloader />
      <SmoothScroll />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10 pt-28 sm:pt-36">{children}</main>
      <Footer />
      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <RulebookModal open={rulebookOpen} onClose={() => setRulebookOpen(false)} />
      <PhoneDirectoryModal open={directoryOpen} onClose={() => setDirectoryOpen(false)} />
      <UnstopEventModal />
    </div>
  )
}
