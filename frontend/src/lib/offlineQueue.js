/**
 * Robust IndexedDB Offline Action Queue for AI Manthan 2.0 PWA
 * Safely persists inquiries and feedback submitted while offline or during
 * network dropouts, and automatically synchronizes when connectivity restores.
 */

const DB_NAME = 'aim_pwa_db'
const DB_VERSION = 1
const STORE_NAME = 'inquiry_queue'

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'))
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Enqueues a support inquiry or feedback submission into IndexedDB.
 */
export async function enqueueOfflineInquiry(payload) {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    const entry = {
      payload,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    }

    await new Promise((resolve, reject) => {
      const req = store.add(entry)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('aim-offline-queue-changed'))
      // Try to register background sync if available
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready
          .then((reg) => reg.sync.register('sync-inquiries'))
          .catch(() => {})
      }
    }

    return { ok: true, queued: true }
  } catch (err) {
    console.error('Failed to enqueue offline inquiry:', err)
    return { ok: false, error: err.message }
  }
}

/**
 * Returns the count of pending offline submissions.
 */
export async function getPendingInquiriesCount() {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve) => {
      const countReq = store.count()
      countReq.onsuccess = () => resolve(countReq.result || 0)
      countReq.onerror = () => resolve(0)
    })
  } catch {
    return 0
  }
}

/**
 * Returns all pending items.
 */
export async function getPendingInquiries() {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve) => {
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => resolve([])
    })
  } catch {
    return []
  }
}

/**
 * Removes an item by ID after successful sync.
 */
export async function removePendingInquiry(id) {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    return new Promise((resolve) => {
      const req = store.delete(id)
      req.onsuccess = () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('aim-offline-queue-changed'))
        }
        resolve(true)
      }
      req.onerror = () => resolve(false)
    })
  } catch {
    return false
  }
}

/**
 * Synchronizes all pending items by submitting them via the provided runner function.
 */
export async function synchronizePendingInquiries(submitRunner) {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { synced: 0 }
  }

  const items = await getPendingInquiries()
  if (!items || items.length === 0) return { synced: 0 }

  let syncedCount = 0

  for (const item of items) {
    try {
      await submitRunner(item.payload)
      await removePendingInquiry(item.id)
      syncedCount++
    } catch (err) {
      console.warn(`Sync failed for item ${item.id}:`, err)
      // Increment retry count
      try {
        const db = await openDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        item.retryCount = (item.retryCount || 0) + 1
        store.put(item)
      } catch {}
    }
  }

  if (syncedCount > 0 && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('aim-offline-sync-complete', {
        detail: { count: syncedCount },
      })
    )
  }

  return { synced: syncedCount }
}
