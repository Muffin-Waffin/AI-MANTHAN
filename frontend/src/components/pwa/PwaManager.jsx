'use client'

import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import {
  getPendingInquiriesCount,
  synchronizePendingInquiries,
} from '@/lib/offlineQueue'
import { submitSupportInquiry } from '@/lib/supabase'

export default function PwaManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatusToast, setShowStatusToast] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [pendingCount, setPendingCount] = useState(0)
  const [waitingWorker, setWaitingWorker] = useState(null)
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)

  // 1. Service Worker Registration & Update Handling
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // In development mode, NEVER register the service worker, and proactively unregister any
    // active workers and clean cache storage to avoid stale-bundle hydration mismatches.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
        }
      })
      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key)
          }
        })
      }
      return
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Check if there is an update waiting
        if (reg.waiting) {
          setWaitingWorker(reg.waiting)
          setShowUpdatePrompt(true)
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setWaitingWorker(newWorker)
                setShowUpdatePrompt(true)
              }
            })
          }
        })
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err)
      })

    // Listen for controllerchange to reload smoothly
    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true
        window.location.reload()
      }
    })
  }, [])

  // 2. Online / Offline Connectivity & Sync
  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsOnline(navigator.onLine)

    // Check offline queue count
    const updateQueueCount = async () => {
      const count = await getPendingInquiriesCount()
      setPendingCount(count)
    }
    updateQueueCount()

    const handleOnline = async () => {
      setIsOnline(true)
      setStatusMessage('Connection restored · Online')
      setShowStatusToast(true)
      setTimeout(() => setShowStatusToast(false), 4000)

      // Automatically trigger sync for any pending offline items
      try {
        const { synced } = await synchronizePendingInquiries(submitSupportInquiry)
        if (synced > 0) {
          setStatusMessage(`Synced ${synced} pending inquiry${synced > 1 ? 's' : ''} to organizing desk!`)
          setShowStatusToast(true)
          setTimeout(() => setShowStatusToast(false), 5000)
        }
      } catch (err) {
        console.warn('Sync failed:', err)
      }
      updateQueueCount()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setStatusMessage('Offline · Viewing cached data. Inquiries will auto-sync.')
      setShowStatusToast(true)
    }

    const handleQueueChanged = () => {
      updateQueueCount()
    }

    const handleSyncComplete = (e) => {
      const synced = e?.detail?.count || 1
      setStatusMessage(`Synced ${synced} pending submission${synced > 1 ? 's' : ''}!`)
      setShowStatusToast(true)
      setTimeout(() => setShowStatusToast(false), 5000)
      updateQueueCount()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('aim-offline-queue-changed', handleQueueChanged)
    window.addEventListener('aim-offline-sync-complete', handleSyncComplete)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('aim-offline-queue-changed', handleQueueChanged)
      window.removeEventListener('aim-offline-sync-complete', handleSyncComplete)
    }
  }, [])

  const handleApplyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowUpdatePrompt(false)
    }
  }

  return (
    <>
      {/* ── Offline Banner / Toast ── */}
      {(!isOnline || showStatusToast) && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-18 sm:top-20 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300"
        >
          <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-[#090d16]/95 backdrop-blur-xl shadow-2xl text-xs font-mono">
            {isOnline ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-zinc-200">{statusMessage}</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" />
                <span className="text-amber-200">
                  {statusMessage || 'Offline — changes will sync automatically'}
                </span>
                {pendingCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                    {pendingCount} queued
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── PWA Update Available Floating Prompt ── */}
      {showUpdatePrompt && (
        <div
          role="alert"
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-3 sm:left-6 z-50 animate-fade-up"
        >
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#090f1d] border border-cyan-400/40 text-white shadow-2xl backdrop-blur-xl">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
              <Icon name="system_update" className="text-lg" />
            </div>
            <div className="text-xs">
              <div className="font-bold font-mono">New Version Available</div>
              <div className="text-zinc-400 text-[11px]">Refresh to load the newest arena updates.</div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-zinc-400 hover:text-white"
              >
                Later
              </button>
              <button
                onClick={handleApplyUpdate}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#06080d] font-bold text-xs font-mono transition-colors shadow-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
