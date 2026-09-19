/**
 * Supabase browser client — powers the LIVE visitor counter.
 *
 * Only the public anon key lives here (safe to expose: the SiteVisit
 * table is read-only for anon via RLS; all writes go through the
 * NestJS API with the service role / Prisma server-side).
 *
 * Env vars (frontend/.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=
 *
 * Unconfigured → `supabase` is null and callers skip realtime silently
 * (the counter still works via the normal API ping).
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

/**
 * Subscribe to SiteVisit row changes (UPDATE events from the backend's
 * counter writes). Returns an unsubscribe function. No-op (returns a
 * trivial cleanup) when Supabase env is not configured.
 */
export function subscribeToSiteVisits(onChange) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel('site-visits')
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
