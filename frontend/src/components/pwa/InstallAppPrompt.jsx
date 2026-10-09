'use client'

import { useState, useEffect } from 'react'
import Icon from '@/components/ui/Icon'

const DISMISS_KEY = 'aim_install_prompt_dismissed_at'
const DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000 // 3 days

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // 1. Detect if already installed/standalone
    const standaloneCheck =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')

    if (standaloneCheck) {
      setIsStandalone(true)
      return
    }

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !window.MSStream
    setIsIOS(isIosDevice)

    // 3. Listen for Chrome / Edge / Android install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Check if previously dismissed recently
      const lastDismissed = localStorage.getItem(DISMISS_KEY)
      if (!lastDismissed || Date.now() - Number(lastDismissed) > DISMISS_DURATION_MS) {
        // Subtle delay before showing so it doesn't immediately pop up on entrance
        const timer = setTimeout(() => setShowPrompt(true), 3500)
        return () => clearTimeout(timer)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }
    window.addEventListener('appinstalled', handleAppInstalled)

    // 4. Global trigger listener so any button in the app can trigger installation
    const handleManualTrigger = () => {
      if (deferredPrompt) {
        triggerInstall()
      } else if (isIosDevice) {
        setShowIOSModal(true)
      } else {
        setShowPrompt(true)
      }
    }
    window.addEventListener('open-install-prompt', handleManualTrigger)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('open-install-prompt', handleManualTrigger)
    }
  }, [deferredPrompt])

  const triggerInstall = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSModal(true)
      }
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setInstalled(true)
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    } catch (err) {
      console.warn('Install prompt failed:', err)
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {}
  }

  if (isStandalone || installed) {
    return null
  }

  return (
    <>
      {/* Floating Bottom-Right or Mobile Bottom Banner */}
      {showPrompt && (
        <div
          role="dialog"
          aria-label="Install App"
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-3 sm:right-6 left-3 sm:left-auto sm:max-w-md z-50 animate-fade-up"
        >
          <div className="relative rounded-2xl border border-cyan-400/40 bg-[#080d18]/95 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,240,255,0.18)]">
            {/* Top Cyan Accent */}
            <span
              aria-hidden="true"
              className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />

            <div className="flex items-start gap-3.5">
              <div className="relative h-12 w-12 shrink-0 rounded-xl border border-cyan-400/30 bg-[#06080d] p-1.5 shadow-md">
                <img
                  src="/icons/icon-192x192.png"
                  alt="AI Manthan icon"
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-wider truncate">
                    AI Manthan 2.0
                  </h3>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    PWA
                  </span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs text-zinc-300 leading-snug">
                  Install for fast offline access, instant schedule updates, and a native app experience.
                </p>
              </div>

              {/* Close / Dismiss */}
              <button
                onClick={dismissPrompt}
                aria-label="Dismiss installation prompt"
                className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-end gap-2.5">
              <button
                onClick={dismissPrompt}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                Maybe later
              </button>
              <button
                onClick={deferredPrompt ? triggerInstall : () => (isIOS ? setShowIOSModal(true) : null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06080d] text-xs font-bold font-mono tracking-wider transition-all shadow-[0_0_16px_rgba(0,240,255,0.4)]"
              >
                <Icon name="download" className="text-[16px]" />
                Install App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#090d16] p-6 text-center shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-4">
              <Icon name="install_mobile" className="text-2xl" />
            </div>

            <h3 className="text-lg font-bold text-white font-mono uppercase">
              Install on iOS
            </h3>

            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              To install AI Manthan on your iPhone or iPad:
            </p>

            <ol className="mt-4 text-left space-y-3 text-xs text-zinc-300 bg-white/[0.03] p-4 rounded-xl border border-white/10">
              <li className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button in Safari's bottom toolbar.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                  2
                </span>
                <span>
                  Scroll down and choose <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Add</strong> in the top-right corner.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#06080d] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
