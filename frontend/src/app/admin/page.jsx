'use client'

import { useCallback, useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { adminApi, supabase } from '@/lib/supabase'

const STATUS_STYLES = {
  open: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'in-progress': 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30',
  resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
}

const NEXT_STATUS = {
  open: 'in-progress',
  'in-progress': 'resolved',
}

function timeAgo(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

/* ── Supabase Auth gate — email + password, RLS does the rest ──────
   No shared admin key anywhere: the allowlist table `admin_users`
   (managed in the Supabase dashboard) decides who gets in. */
function AuthGate({ onSignedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setError('Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      return
    }
    setBusy(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)
    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Invalid email or password — try again'
        : authError.message)
      return
    }
    onSignedIn(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={submit} className="glass-strong p-8 rounded-2xl w-full max-w-sm text-center">
        <div className="w-12 h-12 mx-auto rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan mb-4">
          <Icon name="admin_panel_settings" className="text-[26px]" />
        </div>
        <h1 className="text-lg font-bold text-white">Command Desk</h1>
        <p className="text-xs font-mono text-zinc-400 mt-1 mb-6">AI Manthan admin access</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin email"
          autoComplete="username"
          required
          className="w-full text-xs px-3 py-2.5 rounded-lg glass text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-cyan/60 transition-all mb-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          autoComplete="current-password"
          required
          className="w-full text-xs px-3 py-2.5 rounded-lg glass text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-cyan/60 transition-all"
        />
        {error && <p className="text-[11px] font-mono text-red-400 mt-2">{error}</p>}
        <button
          className="w-full mt-4 py-2.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#06080d] text-xs font-semibold tracking-wide transition-all hover:-translate-y-0.5 disabled:opacity-60"
          type="submit"
          disabled={busy}
        >
          {busy ? 'Signing in…' : 'Unlock Dashboard'}
        </button>
      </form>
    </div>
  )
}

function StatCard({ icon, value, label, tone }) {
  return (
    <div className="glass glass-hover p-4 rounded-2xl flex items-center gap-3.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone}`}>
        <Icon name={icon} className="text-[20px]" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
        <div className="text-[11px] font-mono text-zinc-400 uppercase">{label}</div>
      </div>
    </div>
  )
}

/* ── Visits panel — totals + 14-day traffic sparkline ──────────── */
function VisitsPanel({ visits }) {
  const max = Math.max(1, ...visits.daily.map((d) => d.total))
  const last7 = visits.daily.slice(-7)
  const prev7 = visits.daily.slice(0, 7)
  const sum = (arr) => arr.reduce((acc, d) => acc + d.total, 0)
  const trend = sum(last7) - sum(prev7)

  return (
    <details className="glass mt-8 rounded-2xl overflow-hidden" open>
      <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-white flex items-center gap-2">
        <Icon name="visibility" className="text-[18px] text-brand-cyan" />
        Site Traffic
        {!visits.tracked && (
          <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[9px] font-mono uppercase">
            memory fallback
          </span>
        )}
      </summary>
      <div className="px-5 pb-5">
        {/* totals */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="glass p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sky-400 bg-sky-400/10">
              <Icon name="pageview" className="text-[20px]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {visits.total.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Total Visits</div>
            </div>
          </div>
          <div className="glass p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-cyan bg-brand-cyan/10">
              <Icon name="person" className="text-[20px]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {visits.unique.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Unique Visitors</div>
            </div>
          </div>
        </div>

        {/* 14-day bar chart */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">
            Last 14 days
          </span>
          <span
            className={`text-[10px] font-mono ${
              trend > 0 ? 'text-emerald-400' : trend < 0 ? 'text-red-400' : 'text-zinc-500'
            }`}
          >
            {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toLocaleString('en-IN')} vs prev week
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-24">
          {visits.daily.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* tooltip */}
              <div className="pointer-events-none absolute bottom-full mb-1 hidden group-hover:block z-10 px-2 py-1 rounded-lg bg-obsidian-900 border border-white/[0.12] text-[9px] font-mono text-zinc-200 whitespace-nowrap">
                {d.date}: {d.total} visits · {d.unique} unique
              </div>
              <div
                className="w-full rounded-t bg-gradient-to-t from-brand-cyan/40 to-brand-cyan/70 transition-all duration-300 hover:from-brand-cyan/60 hover:to-brand-cyan"
                style={{ height: `${Math.max(4, (d.total / max) * 76)}px` }}
              />
              <span className="text-[8px] font-mono text-zinc-600">{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
        {visits.daily.every((d) => d.total === 0) && (
          <p className="text-[11px] font-mono text-zinc-500 mt-3">
            No visits recorded yet — the footer badge counts live traffic.
          </p>
        )}
      </div>
    </details>
  )
}

function Ticket({ t, onAdvance }) {
  return (
    <div className="glass glass-hover p-4 rounded-2xl">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase ${STATUS_STYLES[t.status] || ''}`}>
            {t.status}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-zinc-300">
            {t.kind === 'feedback' ? 'FEEDBACK' : 'QUERY'}
          </span>
          <span className="text-[11px] font-mono text-zinc-500">{t.category}</span>
          {t.rating && <span className="text-[11px] text-amber-400">{'★'.repeat(t.rating)}</span>}
        </div>
        <span className="text-[10px] font-mono text-zinc-500 shrink-0">{timeAgo(t.createdAt)}</span>
      </div>
      <p className="text-xs text-zinc-300 leading-relaxed">{t.message}</p>
      <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-white/[0.06]">
        <div className="text-[11px] font-mono text-zinc-500 truncate">
          <a href={`mailto:${t.email}`} className="text-brand-cyan hover:text-white transition-colors">
            {t.email}
          </a>
          {t.assignedName && (
            <span className="ml-2 text-zinc-400">
              → {t.assignedName} <span className="text-zinc-600">({t.notifiedVia || 'logged'})</span>
            </span>
          )}
        </div>
        {t.status !== 'resolved' && (
          <button
            onClick={() => onAdvance(t)}
            className="shrink-0 text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-zinc-300 hover:text-white hover:border-brand-cyan/50 transition-all"
          >
            → {NEXT_STATUS[t.status]}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [signedIn, setSignedIn] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const [coordinators, setCoordinators] = useState([])
  const [visits, setVisits] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [kindFilter, setKindFilter] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!signedIn) return
    setLoading(true)
    setError('')
    try {
      const [s, list, coords, v] = await Promise.all([
        adminApi.stats(),
        adminApi.inquiries({ status: statusFilter, kind: kindFilter }),
        adminApi.coordinators(),
        adminApi.visits().catch(() => null), // counter is optional — never blocks the queue
      ])
      setStats(s)
      setTickets(list || [])
      setCoordinators(coords || [])
      if (v) setVisits(v)
    } catch (e) {
      if (e.message === 'INVALID_KEY') {
        // session expired / access revoked → back to the login gate
        await supabase?.auth.signOut()
        setSignedIn(false)
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }, [signedIn, statusFilter, kindFilter])

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data?.session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setSignedIn(false)
      if (event === 'SIGNED_IN') setSignedIn(true)
    })
    return () => sub?.subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!signedIn) return
    refresh()
    const id = setInterval(refresh, 30_000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, statusFilter, kindFilter])

  const signOut = async () => {
    await supabase?.auth.signOut()
    setSignedIn(false)
    setStats(null)
    setTickets([])
    setCoordinators([])
    setVisits(null)
  }

  const advance = async (t) => {
    const next = NEXT_STATUS[t.status]
    const note = next === 'resolved' ? window.prompt('Resolution note (optional):') || '' : ''
    try {
      await adminApi.updateInquiry(t.id, { status: next, resolutionNote: note })
      refresh()
    } catch (e) {
      setError(e.message)
    }
  }

  if (!authReady) return null
  if (!signedIn) return <AuthGate onSignedIn={setSignedIn} />

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
            <Icon name="admin_panel_settings" className="text-[22px]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Command Desk</h1>
            <p className="text-[11px] font-mono text-zinc-400">AI Manthan · support & feedback pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="w-9 h-9 rounded-lg glass text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Refresh"
          >
            <Icon name="refresh" className={`text-[18px] ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={signOut}
            className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 rounded-lg glass transition-colors"
            title="Sign out"
          >
            Sign out
          </button>
          <a
            href="/"
            className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            ← Site
          </a>
        </div>
      </div>

      {error && (
        <div className="glass p-3 rounded-xl text-xs font-mono text-red-400 mb-4">{error}</div>
      )}

      {/* stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <StatCard icon="mark_email_unread" value={stats.queries} label="Queries" tone="text-amber-400 bg-amber-400/10" />
          <StatCard icon="pending" value={stats.inProgress} label="In Progress" tone="text-brand-cyan bg-brand-cyan/10" />
          <StatCard icon="task_alt" value={stats.resolved} label="Resolved" tone="text-emerald-400 bg-emerald-400/10" />
          <StatCard
            icon="reviews"
            value={stats.avgRating ? `${stats.avgRating}★` : '—'}
            label={`${stats.feedback} feedbacks`}
            tone="text-brand-cyan bg-brand-cyan/10"
          />
        </div>
      )}

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {[
          { v: '', label: 'All' },
          { v: 'open', label: 'Open' },
          { v: 'in-progress', label: 'In Progress' },
          { v: 'resolved', label: 'Resolved' },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setStatusFilter(f.v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === f.v
                ? 'bg-brand-cyan/25 border border-brand-cyan/50 text-white'
                : 'glass text-zinc-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="mx-2 w-px h-5 bg-white/[0.08]"></span>
        {[
          { v: '', label: 'Both' },
          { v: 'participant', label: 'Queries' },
          { v: 'feedback', label: 'Feedback' },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setKindFilter(f.v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              kindFilter === f.v
                ? 'bg-brand-cyan/20 border border-brand-cyan/40 text-white'
                : 'glass text-zinc-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* queue */}
      <div className="space-y-3">
        {tickets.length === 0 && !loading && (
          <div className="glass p-10 rounded-2xl text-center text-xs font-mono text-zinc-500">
            Queue empty — new queries land here automatically.
          </div>
        )}
        {tickets.map((t) => (
          <Ticket key={t.id} t={t} onAdvance={advance} />
        ))}
      </div>

      {/* site traffic — visitor counter */}
      {visits && <VisitsPanel visits={visits} />}

      {/* coordinators */}
      <details className="glass mt-8 rounded-2xl overflow-hidden">
        <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-white flex items-center gap-2">
          <Icon name="groups" className="text-[18px] text-brand-cyan" />
          Coordinators ({coordinators.length})
        </summary>
        <div className="px-5 pb-5 space-y-2">
          {coordinators.map((c) => (
            <div key={c.id} className="glass p-3 rounded-xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white">{c.name}</div>
                <div className="text-[11px] font-mono text-zinc-500">{c.email}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono text-zinc-400">+{c.whatsapp}</div>
                <div className="text-[10px] font-mono text-zinc-600">{(c.categories || []).join(' · ')}</div>
              </div>
            </div>
          ))}
          {coordinators.length === 0 && (
            <p className="text-xs font-mono text-zinc-500 py-3">
              None yet — add coordinators from the Supabase dashboard (table “Coordinator”).
            </p>
          )}
        </div>
      </details>
    </div>
  )
}
