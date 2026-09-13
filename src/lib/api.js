const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

/** Admin key lives in sessionStorage — entered once on /admin. */
function adminHeaders() {
  return { 'x-admin-key': sessionStorage.getItem('admin-key') || '' }
}

/**
 * Single integration point between the frontend and the NestJS backend.
 * The support modal + admin dashboard are the wired mutations — add more
 * calls here as the API grows (registration, team management, etc.).
 */
export async function submitSupportInquiry({ email, category, message, kind = 'participant', rating = null }) {
  const res = await fetch(`${API_BASE}/support`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, category, message, kind, ...(rating ? { rating } : {}) }),
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
}
