// ════════════════════════════════════════════════════════════════════
// inquiry-notify — Edge Function (replaces the old NestJS RoutingService)
// ════════════════════════════════════════════════════════════════════
// The DB trigger (supabase/schema.sql) already auto-ASSIGNS every new
// inquiry to the right coordinator. This function adds the NOTIFY half:
//   • email the assigned coordinator (SMTP via secrets)
//   • email a confirmation receipt to the participant
//   • fire-and-forget POST to the coordinator's webhookUrl
//
// Invoked automatically by the pg_net trigger (trg_notify_inquiry_edge)
// on every INSERT into "Inquiry". Requires the x-notify-secret header.
//
// Secrets (supabase secrets set):
//   NOTIFY_SECRET  — shared secret the DB webhook must send
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / MAIL_FROM — optional;
//   without them the function only tracks webhooks + notifiedVia='logged'.
// ════════════════════════════════════════════════════════════════════

import { createClient } from 'npm:@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6'

const {
  SMTP_HOST = '',
  SMTP_PORT = '587',
  SMTP_USER = '',
  SMTP_PASS = '',
  MAIL_FROM = 'AI Manthan Support <support@aimanthan.in>',
} = Deno.env.toObject()

// Shared secret required on every invocation (x-notify-secret header).
// The DB webhook (pg_net trigger) sends it; random internet scanners can't.
const NOTIFY_SECRET = Deno.env.get('NOTIFY_SECRET') ?? ''

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // server-only, never shipped to the browser
)

function esc(s: string) {
  return (s || '').replace(/</g, '&lt;')
}

function mailHtml(row: Record<string, unknown>, to: 'coordinator' | 'sender') {
  const who = row.name ? `${row.name} (${row.email})` : (row.email as string)
  const stars = row.rating ? `${'★'.repeat(Number(row.rating))}${'☆'.repeat(5 - Number(row.rating))}` : ''
  const title = row.kind === 'feedback' ? 'Feedback' : 'Support Query'
  const phoneRow = row.phone
    ? `<tr><td style="padding:6px 0;color:#888">Mobile</td><td><a href="tel:${esc(String(row.phone))}">${esc(String(row.phone))}</a></td></tr>`
    : ''
  if (to === 'sender') {
    return `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
      <h2 style="color:#7c3aed;margin:0 0 4px">We received your ${title.toLowerCase()} — AI Manthan 2026</h2>
      <p style="color:#555">Your mail has been sent successfully. Our team will contact you as soon as possible within working days — ticket <code>${row.id}</code> is logged with the organizing desk.</p>
      <div style="background:#f6f4ff;border-left:3px solid #7c3aed;padding:12px 14px;border-radius:6px;white-space:pre-wrap;color:#333">${esc(String(row.message))}</div>
      <p style="color:#999;font-size:12px">— AI Manthan automatic dispatch</p></div>`
  }
  return `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
    <h2 style="color:#7c3aed;margin:0 0 4px">New ${title} — AI Manthan 2026</h2>
    <p style="color:#555;margin:0 0 16px">Assigned to you via auto-routing. Please connect with the participant.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#888;width:90px">Ticket</td><td><code>${row.id}</code></td></tr>
      <tr><td style="padding:6px 0;color:#888">From</td><td><a href="mailto:${esc(String(row.email))}">${esc(who)}</a></td></tr>
      ${phoneRow}
      <tr><td style="padding:6px 0;color:#888">Category</td><td>${esc(String(row.category))}</td></tr>
      ${stars ? `<tr><td style="padding:6px 0;color:#888">Rating</td><td>${stars} (${row.rating}/5)</td></tr>` : ''}
    </table>
    <div style="background:#f6f4ff;border-left:3px solid #7c3aed;padding:12px 14px;margin:14px 0;border-radius:6px;white-space:pre-wrap">${esc(String(row.message))}</div>
    <p style="color:#999;font-size:12px">— AI Manthan automatic dispatch</p></div>`
}

Deno.serve(async (req) => {
  try {
    if (NOTIFY_SECRET && req.headers.get('x-notify-secret') !== NOTIFY_SECRET) {
      return new Response(JSON.stringify({ ok: false, reason: 'unauthorized' }), { status: 401 })
    }

    const payload = await req.json()
    const row = payload?.record ?? payload?.new
    if (!row?.id) return new Response(JSON.stringify({ ok: false, reason: 'no record' }), { status: 400 })

    let notifiedVia = 'logged'
    let smtpError: string | null = null

    // Resolve the assigned coordinator (stamped by the DB trigger)
    const { data: coordinator } = row.coordinatorId
      ? await supabase.from('Coordinator').select('*').eq('id', row.coordinatorId).maybeSingle()
      : { data: null }

    const smtpReady = SMTP_HOST && SMTP_USER && SMTP_PASS
    const transport = smtpReady
      ? nodemailer.createTransport({
          host: SMTP_HOST,
          port: Number(SMTP_PORT),
          secure: Number(SMTP_PORT) === 465,
          auth: { user: SMTP_USER, pass: SMTP_PASS },
        })
      : null

    // 1) coordinator webhook (if configured) — best-effort, 6s cap
    if (coordinator?.webhookUrl) {
      try {
        await fetch(coordinator.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticket: row.id, kind: row.kind, from: row.email, name: row.name || null,
            category: row.category, rating: row.rating ?? null, message: row.message,
            coordinator: coordinator.name,
          }),
          signal: AbortSignal.timeout(6000),
        })
        notifiedVia = 'webhook'
      } catch { /* best-effort */ }
    }

    // 2) coordinator + sender emails (if SMTP configured)
    if (transport) {
      try {
        if (coordinator?.email) {
          await transport.sendMail({
            from: MAIL_FROM,
            to: coordinator.email,
            replyTo: row.email,
            subject: `[AI Manthan] ${row.kind === 'feedback' ? 'Feedback' : 'Query'} ${row.id} — ${row.category}`,
            html: mailHtml(row, 'coordinator'),
          })
          notifiedVia = notifiedVia === 'webhook' ? 'webhook' : 'email'
        }
        await transport.sendMail({
          from: MAIL_FROM,
          to: row.email,
          subject: `[AI Manthan] ${row.kind === 'feedback' ? 'Feedback' : 'Ticket'} ${row.id} received`,
          html: mailHtml(row, 'sender'),
        })
      } catch (mailErr) {
        // never lose the stored inquiry over mail failures — but surface the error
        smtpError = mailErr?.message ?? String(mailErr)
        console.error('SMTP_ERROR:', smtpError)
      }
    }

    await supabase.from('Inquiry').update({ notifiedVia }).eq('id', row.id)
    return new Response(JSON.stringify({ ok: true, notifiedVia, smtpError }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 })
  }
})
