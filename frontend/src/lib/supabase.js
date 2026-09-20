/**
 * Supabase — THE ONLY backend of AI Manthan 2026 (100% Supabase, 0% Render).
 *
 * Everything that used to live in the NestJS/Render API now runs here:
 *
 *   • Visitor counter  → rpc('record_visit') — atomic dedup on the server,
 *     same honest semantics the old VisitsService enforced (1 visit per
 *     browsing session, 1 unique per browser, pageViews per ping).
 *   • Support/feedback → INSERT into "Inquiry" — RLS allows anon inserts
 *     only (blind writes, tamper-proof workflow fields) and a trigger
 *     auto-assigns the category's coordinator.
 *   • Admin dashboard  → Supabase Auth session + RLS policies keyed to
 *     the `admin_users` allowlist. No shared admin key anywhere.
 *   • Realtime         → SiteVisit UPDATE events (live counter badge).
 *
 * Env vars (frontend/.env.local — public values, RLS-guarded):
 *   NEXT_PUBLIC_SUPABASE_URL=
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=
 *
 * Unconfigured Supabase → `supabase` is null and every call degrades
 * silently (counter hidden, forms show a config error, admin asks for
 * setup) — the site never crashes on a missing backend.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        realtime: { params: { eventsPerSecond: 2 } },
      })
    : null

/* ── Realtime: live visitor counter ─────────────────────────────── */

/**
 * Subscribe to SiteVisit row changes (UPDATE events from record_visit).
 * Returns an unsubscribe function. No-op when Supabase isn't configured.
 */
export function subscribeToSiteVisits(onChange) {
  if (!supabase) return () => {}
  // Unique name per subscription — supabase-js returns the SAME channel
  // instance for identical names, so a second counter (navbar + footer)
  // would otherwise add callbacks to an already-subscribed channel.
  const channel = supabase
    .channel(`site-visits-${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'SiteVisit' },
      (payload) => {
        const row = payload?.new
        if (row && typeof row.total === 'number') {
          onChange({ total: row.total, unique: row.unique ?? 0, pageViews: row.pageViews ?? 0 })
        }
      },
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}

/* ── Visitor counter (public) ───────────────────────────────────── */

/** Anonymous lifetime id for this browser — the "unique" unit. */
function getVisitorId() {
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

/** Anonymous per-browsing-session id — the "visit" unit. */
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

/** Read-only totals — graceful fallback when the rpc isn't available yet. */
async function readTotals() {
  const { data, error } = await supabase
    .from('SiteVisit')
    .select('total,unique,pageViews')
    .eq('id', 'site')
    .maybeSingle()
  if (error) throw new Error(error.message)
  return {
    total: data?.total ?? 0,
    unique: data?.unique ?? 0,
    pageViews: data?.pageViews ?? 0,
    isNewVisit: false,
    tracked: false,
  }
}

/**
 * Record this page load ONCE (singleton) and return the live totals.
 * Never throws — callers degrade silently when Supabase is down.
 * If the record_visit rpc is unavailable (migration SQL not applied yet),
 * falls back to read-only totals so the badge still shows honest numbers.
 */
export function pingVisit() {
  if (!supabase) return Promise.reject(new Error('Supabase not configured'))
  if (pingPromise) return pingPromise
  pingPromise = supabase
    .rpc('record_visit', { p_visitor: getVisitorId(), p_session: getSessionId() })
    .then(({ data, error }) => {
      if (error) throw new Error(error.message)
      return {
        total: data?.total ?? 0,
        unique: data?.unique ?? 0,
        pageViews: data?.pageViews ?? 0,
        isNewVisit: !!data?.isNewVisit,
        tracked: data?.tracked ?? false,
      }
    })
    .catch(() => readTotals()) // rpc down → read-only (badge still shows)
  return pingPromise
}

/* ── Support & feedback (public, RLS-guarded insert) ────────────── */

const SUPPORT_CATEGORIES = [
  'Travel Assistance & Hostel Booking',
  'Problem Statement Clarification',
  'Sponsorship & Bounty Inquiry',
  'Other / General Support',
]
const FEEDBACK_CATEGORIES = ['General', 'Venue & Logistics', 'Judging & Rounds', 'Suggestion']
const ALLOWED_CATEGORIES = ['General', ...SUPPORT_CATEGORIES, ...FEEDBACK_CATEGORIES]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Mirror of the old SupportInquiryDto validation (NestJS class-validator):
 * same fields, same limits, same defaults — enforced client-side now,
 * re-enforced by RLS WITH CHECK on the server. Never trust the client.
 */
export async function submitSupportInquiry({
  email,
  name,
  category,
  message,
  kind = 'participant',
  rating = null,
}) {
  if (!supabase) throw new Error('Backend not configured — try the WhatsApp community.')

  const clean = {
    email: String(email || '').trim(),
    name: String(name || '').trim().slice(0, 80),
    category: String(category || 'General').trim(),
    message: String(message || '').trim(),
    kind: kind === 'feedback' ? 'feedback' : 'participant',
    rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null,
  }

  if (!EMAIL_RE.test(clean.email)) throw new Error('A valid email is required.')
  if (clean.message.length < 10) throw new Error('Message must be at least 10 characters.')
  if (clean.message.length > 2000) throw new Error('Message must be at most 2000 characters.')
  if (!ALLOWED_CATEGORIES.includes(clean.category)) throw new Error('Unknown inquiry category.')

  /* NOTE: no `.select()` here — INSERT ... RETURNING requires the row to
     also pass the SELECT policy, which anon intentionally lacks (they must
     never read the inquiry queue). Plain insert + RLS WITH CHECK is enough. */
  const { error } = await supabase
    .from('Inquiry')
    .insert(clean)

  if (error) throw new Error(error.message || 'Something went wrong. Try the WhatsApp community.')
  return { ok: true, id: null, source: 'supabase', emailDispatch: false }
}

/* ── Admin dashboard (Supabase Auth + RLS) ──────────────────────── */

/** Map RLS/permission failures to the INVALID_KEY contract the UI knows. */
function unwrap({ data, error }) {
  if (!error) return data
  const denied =
    error.code === '42501' ||
    error.status === 401 ||
    error.status === 403 ||
    /JWT|row-level security|permission/i.test(error.message || '')
  throw new Error(denied ? 'INVALID_KEY' : error.message)
}

function requireSession() {
  if (!supabase) throw new Error('INVALID_KEY')
  return supabase
}

/**
 * Same shapes the old adminApi returned, now served straight from
 * Supabase with RLS doing the authz (no x-admin-key header anywhere).
 */
export const adminApi = {
  /** Live badges — aggregated client-side from the (RLS-filtered) rows. */
  async stats() {
    const sb = requireSession()
    const { data, error } = await sb
      .from('Inquiry')
      .select('kind,status,rating')
      .limit(1000)
    unwrap({ error })
    const rows = data || []
    const rated = rows.filter((r) => r.kind === 'feedback' && r.rating != null)
    const avg = rated.length
      ? Math.round((rated.reduce((a, r) => a + (r.rating || 0), 0) / rated.length) * 10) / 10
      : null
    return {
      queries: rows.filter((r) => r.kind === 'participant').length,
      inProgress: rows.filter((r) => r.status === 'in-progress').length,
      resolved: rows.filter((r) => r.status === 'resolved').length,
      feedback: rows.filter((r) => r.kind === 'feedback').length,
      avgRating: avg,
    }
  },

  /** Queue (filterable) — latest 200, newest first. */
  async inquiries(filter = {}) {
    const sb = requireSession()
    let q = sb.from('Inquiry').select('*').order('createdAt', { ascending: false }).limit(200)
    if (filter.status) q = q.eq('status', filter.status)
    if (filter.kind) q = q.eq('kind', filter.kind)
    return unwrap(await q)
  },

  /** Resolve / progress a ticket. Unknown id → null (old Prisma semantics). */
  async updateInquiry(id, patch = {}) {
    const sb = requireSession()
    const data = {}
    if (patch.status) data.status = patch.status
    if (typeof patch.resolutionNote === 'string') data.resolutionNote = patch.resolutionNote.slice(0, 1000)
    if (!Object.keys(data).length) return null
    const { data: row, error } = await sb
      .from('Inquiry')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null // no matching row
      return unwrap({ error })
    }
    return row
  },

  /** Coordinator directory (read; add/edit from the Supabase dashboard). */
  async coordinators() {
    const sb = requireSession()
    return unwrap(
      await sb.from('Coordinator').select('*').order('createdAt', { ascending: true }),
    )
  },

  /** Visitor counter — totals + 14-day daily series for the chart. */
  async visits() {
    const sb = requireSession()
    const since = new Date(Date.now() - 13 * 86_400_000).toISOString().slice(0, 10)
    const [totalsRes, dailyRes] = await Promise.all([
      sb.from('SiteVisit').select('total,unique,pageViews').eq('id', 'site').maybeSingle(),
      sb.from('DailyStats').select('date,sessions,uniques,views').gte('date', since).order('date', { ascending: true }),
    ])
    const totals = unwrap(totalsRes)
    const rows = unwrap(dailyRes) || []

    const daily = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
      const row = rows.find((r) => r.date === date)
      daily.push({
        date,
        total: row?.sessions ?? 0,
        unique: row?.uniques ?? 0,
        pageViews: row?.views ?? 0,
      })
    }
    return {
      total: totals?.total ?? 0,
      unique: totals?.unique ?? 0,
      pageViews: totals?.pageViews ?? 0,
      tracked: true,
      daily,
    }
  },
}
