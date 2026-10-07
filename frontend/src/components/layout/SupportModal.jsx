'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import Icon from '../ui/Icon'
import { site } from '../../data/site'
import { submitSupportInquiry } from '@/lib/supabase'

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-mono text-zinc-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full text-xs px-3 py-2 rounded-lg glass text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-cyan/60 focus:shadow-[0_0_0_3px_rgba(0,168,255,0.15)] transition-all'

/**
 * Support modal — Radix Dialog under the hood: focus is trapped while open,
 * ESC closes it, background scroll locks, and screen readers announce it.
 */
const QUERY_CATEGORIES = [
  'Travel Assistance & Hostel Booking',
  'Problem Statement Clarification',
  'Sponsorship & Bounty Inquiry',
  'Other / General Support',
]
const FEEDBACK_CATEGORIES = ['General', 'Venue & Logistics', 'Judging & Rounds', 'Suggestion']

export default function SupportModal({ open, onClose }) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  /** tab: 'query' = talk to a coordinator, 'feedback' = rate the experience */
  const [tab, setTab] = useState('query')
  const [rating, setRating] = useState(0)

  const copyEmail = () => {
    navigator.clipboard
      .writeText(site.email)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {
        /* clipboard permission denied — email is visible right above */
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    setError('')
    try {
      await submitSupportInquiry({
        email: data.get('email'),
        category: data.get('category'),
        message: data.get('message'),
        kind: tab,
        ...(tab === 'feedback' && rating ? { rating } : {}),
      })
      setStatus('sent')
      window.dispatchEvent(new Event('support-submitted'))
      form.reset()
      setRating(0)
    } catch (err) {
      setError(err.message || 'Something went wrong. Try the WhatsApp community.')
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-lenis-prevent
        className="glass-strong max-w-lg max-h-[85vh] gap-0 rounded-2xl p-6 overflow-y-auto overscroll-contain shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,168,255,0.15)] data-[state=open]:animate-fade-up"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Participant Command &amp; Support</DialogTitle>
          <DialogDescription>
            Contact the AITR organizing desk for travel, problem-statement or sponsorship
            support.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Icon name="mail" className="text-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Participant Command &amp; Support
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">AITR Organizing Desk</p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            onClick={onClose}
            aria-label="Close support modal"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Direct channels */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
          <div className="glass p-3 rounded-xl flex flex-col justify-between transition-all duration-300 hover:border-brand-cyan/30">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">OFFICIAL EMAIL</div>
            <div className="font-sans text-zinc-200 text-xs mt-1 truncate">{site.email}</div>
            <a
              className="mt-2 text-[11px] text-brand-cyan hover:text-white flex items-center gap-1 font-medium transition-colors"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${site.email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="mail" className="text-[14px]" />
              Open in Gmail
            </a>
          </div>
          <div className="glass p-3 rounded-xl flex flex-col justify-between transition-all duration-300 hover:border-brand-cyan/30">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">
              WHATSAPP COMMUNITY
            </div>
            <div className="font-mono text-zinc-200 text-xs mt-1">Instant help channel</div>
            <a
              className="mt-2 text-[11px] text-emerald-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
              href={site.community.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="forum" className="text-[14px]" />
              {site.community.label}
            </a>
          </div>
        </div>

        {/* Inquiry form — RLS-guarded insert into Supabase "Inquiry" */}
        {status === 'sent' ? (
          <div className="text-center text-xs font-mono text-emerald-400 py-6">
            {tab === 'feedback'
              ? '✓ Feedback logged. Thank you — this shapes the next edition.'
              : '✓ Dispatch logged. Your coordinator will connect shortly.'}
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* mode switch */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              {[
                { id: 'query', label: 'Ask for Help', icon: 'support_agent' },
                { id: 'feedback', label: 'Give Feedback', icon: 'rate_review' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    tab === t.id
                      ? 'bg-brand-cyan/25 border border-brand-cyan/50 text-white shadow-[0_0_18px_-4px_rgba(0,168,255,0.6)]'
                      : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon name={t.icon} className="text-[15px]" />
                  {t.label}
                </button>
              ))}
            </div>

            <Field label="YOUR EMAIL OR UNSTOP ID">
              <input
                className={inputCls}
                placeholder="builder@college.edu"
                type="email"
                name="email"
                required
              />
            </Field>

            {tab === 'feedback' && (
              <Field label="RATE YOUR EXPERIENCE">
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      className={`text-[22px] leading-none transition-all duration-300 hover:scale-125 ${
                        n <= rating ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]' : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 font-mono text-[11px] text-zinc-400">{rating}/5</span>
                  )}
                </div>
              </Field>
            )}

            <Field label={tab === 'feedback' ? 'FEEDBACK CATEGORY' : 'INQUIRY CATEGORY'}>
              <select
                className={`${inputCls} text-zinc-300`}
                name="category"
                defaultValue=""
                key={tab}
              >
                <option value="" disabled hidden>
                  Select a category
                </option>
                {(tab === 'feedback' ? FEEDBACK_CATEGORIES : QUERY_CATEGORIES).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label={tab === 'feedback' ? 'YOUR THOUGHTS' : 'MESSAGE / QUESTION'}>
              <textarea
                className={`${inputCls} resize-none`}
                placeholder={
                  tab === 'feedback'
                    ? 'What worked, what did not, what should change next time...'
                    : 'Briefly describe what you need help with...'
                }
                rows="2"
                name="message"
                required
                maxLength={2000}
              />
            </Field>
            {status === 'error' && (
              <div className="text-[11px] font-mono text-red-400">{error}</div>
            )}
            <button
              className="w-full py-2.5 rounded-xl bg-brand-cyan hover:bg-brand-cyan-hover text-[#06080d] text-xs font-semibold tracking-wide shadow-[0_8px_24px_-6px_rgba(0,168,255,0.55)] hover:shadow-[0_12px_34px_-6px_rgba(0,168,255,0.8)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:hover:translate-y-0"
              type="submit"
              disabled={status === 'sending'}
            >
              <Icon
                name={status === 'sending' ? 'refresh' : 'send'}
                className={`text-[16px] ${status === 'sending' ? 'animate-spin' : ''}`}
              />
              {status === 'sending'
                ? 'Logging Ingress...'
                : tab === 'feedback'
                  ? 'Submit Feedback'
                  : 'Dispatch Query to Organizing Leads'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
