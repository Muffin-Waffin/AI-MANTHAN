'use client'

import { useState } from 'react'
import Link from 'next/link'
import Icon from '@/components/ui/Icon'
import AppShell from '@/components/layout/AppShell'
import SmartBack from '@/components/ui/SmartBack'
import { submitSupportInquiry } from '@/lib/supabase'
import { site } from '@/data/site'

/**
 * SUPPORT TICKET — dedicated contact page (opened from "Email us").
 * Design: the site's obsidian + cyan system, deliberately restrained —
 * one soft cyan aura behind the card, hairline borders, mono eyebrow.
 * Submits straight to Supabase (RLS-guarded insert into "Inquiry");
 * a DB trigger auto-assigns the routing coordinator on file.
 */

const inputCls =
  'w-full rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-cyan/50 transition-colors duration-300'

const labelCls =
  'block text-[10px] font-mono font-medium tracking-[0.18em] text-zinc-500 uppercase mb-2'

export default function SupportPage() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('sending')
    setError('')
    try {
      const res = await submitSupportInquiry({
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone'),
        message: data.get('message'),
      })
      // SMTP dispatch (Edge Function) live hai — coordinator ko ticket
      // email jaata hai aur participant ko confirmation receipt.
      setStatus('sent')
      form.reset()
    } catch (err) {
      /* Network-level failure (backend down / unreachable) — gracefully
         degrade to the participant's email client instead of a dead end. */
      const offline =
        err instanceof TypeError ||
        /failed to fetch|networkerror|load failed/i.test(err?.message || '')
      if (offline) {
        const subject = encodeURIComponent(`AI Manthan Support — ${data.get('name') || ''}`)
        const body = encodeURIComponent(
          `${data.get('message') || ''}\n\n— ${data.get('name') || ''} (${data.get('email') || ''})`,
        )
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
        setError('Desk API unreachable — opened your email app with the message pre-filled. Hit send there.')
        setStatus('error')
        return
      }
      setError(err.message || 'Something went wrong — try again in a moment.')
      setStatus('error')
    }
  }

  return (
    <AppShell>
      <div className="relative min-h-[60vh] w-full overflow-hidden">
        {/* single soft aura — restrained, no neon overload */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-30%] -translate-x-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,168,255,0.09),transparent_65%)] blur-3xl"
        />

        <div className="site-container relative z-10 py-7 sm:py-9">
          <div className="mx-auto max-w-xl">
            {/* Back — history-aware, exact scroll restore */}
            <SmartBack
              href="/"
              label="Back"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
            />

            {/* Header — compact for one-view fit */}
            <div className="mt-4 mb-5">
              <span className="text-[11px] font-mono font-medium tracking-[0.28em] text-brand-cyan uppercase">
                Support Ticket
              </span>
              <h1 className="mt-1.5 font-mono text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
                Send Message
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Write to the organizing desk — your ticket lands directly with a
                coordinator and we usually reply within a day.
              </p>
            </div>

            {/* Card */}
            <div className="relative rounded-2xl border border-white/[0.08] bg-obsidian-900/60 backdrop-blur-sm p-5 sm:p-6">
              {status === 'sent' ? (
                <div className="py-10 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                    <Icon name="check" className="text-[22px]" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Message sent</h2>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Your mail has been sent successfully. Our team will contact you
                    as soon as possible within working days — keep an eye on your
                    inbox for the confirmation.
                  </p>
                  <Link
                    href="/"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-zinc-200 transition-all duration-300 hover:border-brand-cyan/50 hover:text-white"
                  >
                    Back to home
                    <Icon name="arrow_forward" className="text-[14px]" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className={labelCls} htmlFor="sp-name">
                      Your Name
                    </label>
                    <input
                      id="sp-name"
                      name="name"
                      className={inputCls}
                      placeholder="What should we call you?"
                      type="text"
                      maxLength={80}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="sp-email">
                      Your Email Address
                    </label>
                    <input
                      id="sp-email"
                      name="email"
                      className={inputCls}
                      placeholder="you@college.edu"
                      type="email"
                      maxLength={120}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="sp-phone">
                      Mobile Number <span className="text-zinc-600 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="sp-phone"
                      name="phone"
                      className={inputCls}
                      placeholder="+91 98765 43210"
                      type="tel"
                      maxLength={20}
                    />
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="sp-message">
                      How can we help you?
                    </label>
                    <textarea
                      id="sp-message"
                      name="message"
                      className={`${inputCls} resize-none min-h-[104px]`}
                      placeholder="Tell us briefly — registration, travel, problem statements, sponsorship..."
                      rows={4}
                      minLength={10}
                      maxLength={2000}
                      required
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-xs font-mono text-red-400 leading-relaxed">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-cyan py-3 text-sm font-semibold text-[#06080d] transition-all duration-300 hover:bg-brand-cyan-hover disabled:opacity-60"
                  >
                    <Icon
                      name={status === 'sending' ? 'refresh' : 'send'}
                      className={`text-[16px] ${status === 'sending' ? 'animate-spin' : 'transition-transform duration-300 group-hover:translate-x-0.5'}`}
                    />
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>

                  <p className="text-center text-[11px] font-mono text-zinc-600">
                    Prefer email? Write to{' '}
                    <a href={`mailto:${site.email}`} className="text-zinc-400 hover:text-white transition-colors">
                      {site.email}
                    </a>
                    {' · '}
                    <a href={`tel:${site.emergencyPhone.replace(/[^+0-9]/g, '')}`} className="text-zinc-400 hover:text-white transition-colors">
                      {site.emergencyPhone}
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
