const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

/** Admin key lives in sessionStorage — entered once on /admin. */
function adminHeaders() {
  return { 'x-admin-key': sessionStorage.getItem('admin-key') || '' }
}

/* ── Visitor counter ────────────────────────────────────────── */

/* Analytics-standard semantics, all tokens random & anonymous (no PII):

   visitorId  → localStorage, lifetime. One unique visitor per browser.
   sessionId  → sessionStorage, per browsing session. One "visit" per
                session — refreshes, SPA navigations and same-tab
                reloads never re-count. New tab / new session = 1 visit.

   The ping is a module-level singleton promise: Navbar badge + Footer
   widget + Stat card all share ONE ping per page load. */

/** Anonymous lifetime id for this browser. */
export function getVisitorId() {
  try {
    let id = localStorage.getItem('aim-visitor-id')
    if (!id) {
      id = crypto.randomUUID?.() || `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem('aim-visitor-id', id)
    }
    return id
  } catch {
    return ''
  }
}

/** Anonymous per-browsing-session id — the "one visit" unit. */
function getSessionId() {
  try {
    let id = sessionStorage.getItem('aim-session-id')
    if (!id) {
      id = crypto.randomUUID?.() || `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      sessionStorage.setItem('aim-session-id', id)
    }
    return id
  } catch {
    return ''
  }
}

let pingPromise = null

/**
 * Record this page load ONCE (singleton) and return the live totals.
 * Never throws — callers degrade silently when the API is down.
 */
export function pingVisit() {
  if (pingPromise) return pingPromise
  pingPromise = fetch(`${API_BASE}/visits/ping`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId: getVisitorId(), sessionId: getSessionId() }),
  })
    .then((res) => {
      if (!res.ok) throw new Error('ping failed')
      return res.json()
    })
    .catch((err) => {
      pingPromise = null // allow a retry on the next navigation
      throw err
    })
  return pingPromise
}

/**
 * Single integration point between the frontend and the NestJS backend.
 * The support modal + admin dashboard are the wired mutations — add more
 * calls here as the API grows (registration, team management, etc.).
 */
export async function submitSupportInquiry({ email, name, category, message, kind = 'participant', rating = null }) {
  const res = await fetch(`${API_BASE}/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      ...(name ? { name } : {}),
      category: category || 'General',
      message,
      kind,
      ...(rating ? { rating } : {}),
    }),
  })

  if (!res.ok) {
    let detail = 'Request failed'
    try {
      const body = await res.json()
      if (Array.isArray(body.message)) detail = body.message.join(' ')
      else if (body.message) detail = body.message
    } catch {
      /* keep default */
    }
    throw new Error(detail)
  }
  return res.json()
}

/* ── Admin dashboard APIs (key-protected) ─────────────────────── */

async function adminFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...adminHeaders(), ...(options.headers || {}) },
  })
  if (res.status === 401) throw new Error('INVALID_KEY')
  if (!res.ok) {
    let detail = 'Request failed'
    try {
      const body = await res.json()
      if (Array.isArray(body.message)) detail = body.message.join(' ')
      else if (body.message) detail = body.message
    } catch {
      /* keep default */
    }
    throw new Error(detail)
  }
  return res.json()
}

export const adminApi = {
  stats: () => adminFetch('/support/stats'),
  inquiries: (filter = {}) => {
    const q = new URLSearchParams(Object.entries(filter).filter(([, v]) => v)).toString()
    return adminFetch(`/admin/inquiries${q ? `?${q}` : ''}`)
  },
  updateInquiry: (id, patch) =>
    adminFetch(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  coordinators: () => adminFetch('/admin/coordinators'),
  /** Visitor counter — totals + 14-day daily series. */
  visits: () => adminFetch('/visits/admin'),
}
