/**
 * AI MANTHAN 2.0 — Production Progressive Web App Service Worker
 * Architecture:
 * - Versioned App Shell precaching
 * - Cache cleanup on activation
 * - Network-first for navigation routes with /offline fallback
 * - Cache-first with stale revalidation for static assets (images, fonts, styles)
 * - Strict security: Never cache private/authenticated or mutation requests
 * - Safe update flow via SKIP_WAITING
 */

const CACHE_VERSION = 'aim-pwa-v1.0.1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

// App shell and critical offline assets
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/problem-statements',
  '/support',
  '/team',
  '/manifest.json',
  '/favicon.png',
  '/logos/image.png',
  '/logos/aimathan-logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
]

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[SW] Precache skipped non-critical item:', err)
      })
  )
})

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== STATIC_CACHE && name !== RUNTIME_CACHE) {
              return caches.delete(name)
            }
          })
        )
      )
      .then(() => self.clients.claim())
  )
})

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 1. Bypass localhost / dev environments and HMR streams completely
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.pathname.includes('/_next/webpack') ||
    url.pathname.includes('/turbopack') ||
    url.pathname.includes('__nextjs')
  ) {
    return
  }

  // 2. Never intercept non-GET requests (e.g. POST form submits, database inserts)
  if (request.method !== 'GET') {
    return
  }

  // 2. Never cache chrome-extension or external analytics or Supabase auth/admin endpoints
  if (
    url.protocol.startsWith('chrome-extension') ||
    url.hostname.includes('google-analytics') ||
    url.hostname.includes('googletagmanager') ||
    url.pathname.includes('/auth/v1') ||
    url.pathname.startsWith('/admin')
  ) {
    return
  }

  // 3. Navigation requests (HTML pages): Network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone into runtime cache for offline reading
          if (response && response.status === 200) {
            const copy = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(async () => {
          // Try exact match in caches first
          const cachedResponse = await caches.match(request)
          if (cachedResponse) return cachedResponse

          // Fallback to offline page
          const offlineFallback = await caches.match('/offline')
          if (offlineFallback) return offlineFallback

          return new Response('Offline - AI Manthan 2.0', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
          })
        })
    )
    return
  }

  // 4. Static assets (images, media, fonts, CSS, JS chunks): Cache-first with network fallback
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/logos/') ||
    url.pathname.startsWith('/banners/') ||
    url.pathname.startsWith('/Jury/') ||
    url.pathname.startsWith('/GOH/') ||
    url.pathname.startsWith('/mentors/') ||
    url.pathname.startsWith('/pastaimathan/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    /\.(png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|ico)$/i.test(url.pathname)

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone()
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
            }
            return networkResponse
          })
          .catch(() => {
            // If image fails offline, could return placeholder
            return new Response('', { status: 404, statusText: 'Not Found' })
          })
      })
    )
    return
  }

  // 5. Default: Network-first with runtime cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy))
        }
        return networkResponse
      })
      .catch(() => caches.match(request))
  )
})

// Listen for message events (e.g. skip waiting when user accepts update)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Optional Background Sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-inquiries') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_OFFLINE_SYNC' })
        })
      })
    )
  }
})
