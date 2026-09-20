// ════════════════════════════════════════════════════════════════════
// OPTIONAL — Inquiry notification Edge Function (replaces RoutingService)
// ════════════════════════════════════════════════════════════════════
// The DB trigger (supabase/schema.sql) already auto-ASSIGNS every new
// inquiry to the right coordinator. This optional function adds the
// NOTIFY half of the old NestJS RoutingService:
//   • email the assigned coordinator (SMTP via secrets)
//   • email a confirmation receipt to the participant
//   • fire-and-forget POST to the coordinator's webhookUrl
//
// Deploy (one time):
//   supabase functions deploy inquiry-notify
//   supabase secrets set SMTP_HOST=... SMTP_PORT=587 SMTP_USER=... SMTP_PASS=... MAIL_FROM="AI Manthan Support <support@aimanthan.in>"
//
// Wire it (Supabase Dashboard → Database → Webhooks):
//   on table "Inquiry", event INSERT → POST https://<project>.supabase.co/functions/v1/inquiry-notify
//   (Authorization: Bearer <ANON or SERVICE key> header)
//
// Skip this entirely if email dispatch is not needed — the admin queue,
// auto-assignment and visitor counter all work without it.
// ════════════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.2/mod.ts'

const { SMTP_HOST = '', SMTP_PORT = '587', SMTP_USER = '', SMTP_PASS = '', MAIL_FROM = 'AI Manthan Support <support@aimanthan.in>' } = Deno.env.toObject()

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
  if (to === 'sender') {
    return `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
      <h2 style="color:#7c3aed;margin:0 0 4px">We received your ${title.toLowerCase()} — AI Manthan 2026</h2>
      <p style="color:#555">Ticket <code>${row.id}</code> is logged with the organizing desk. A coordinator will reply shortly.</p>
      <div style="background:#f6f4ff;border-left:3px solid #7c3aed;padding:12px 14px;border-radius:6px;white-space:pre-wrap;color:#333">${esc(String(row.message))}</div>
      <p style="color:#999;font-size:12px">— AI Manthan automatic dispatch</p></div>`
  }
  return `<div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
    <h2 style="color:#7c3aed;margin:0 0 4px">New ${title} — AI Manthan 2026</h2>
    <p style="color:#555;margin:0 0 16px">Assigned to you via auto-routing. Please connect with the participant.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#888;width:90px">Ticket</td><td><code>${row.id}</code></td></tr>
      <tr><td style="padding:6px 0;color:#888">From</td><td><a href="mailto:${esc(String(row.email))}">${esc(who)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#888">Category</td><td>${esc(String(row.category))}</td></tr>
      ${stars ? `<tr><td style="padding:6px 0;color:#888">Rating</td><td>${stars} (${row.rating}/5)</td></tr>` : ''}
    </table>
    <div style="background:#f6f4ff;border-left:3px solid #7c3aed;padding:12px 14px;margin:14px 0;border-radius:6px;white-space:pre-wrap">${esc(String(row.message))}</div>
    <p style="color:#999;font-size:12px">— AI Manthan automatic dispatch</p></div>`
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const row = payload?.record ?? payload?.new
    if (!row?.id) return new Response(JSON.stringify({ ok: false, reason: 'no record' }), { status: 400 })

    let notifiedVia = 'logged'

    // Resolve the assigned coordinator (stamped by the DB trigger)
    const { data: coordinator } = row.coordinatorId
      ? await supabase.from('Coordinator').select('*').eq('id', row.coordinatorId).maybeSingle()
      : { data: null }

    const smtpReady = SMTP_HOST && SMTP_USER && SMTP_PASS
    const client = new SmtpClient()
    if (smtpReady) {
      await client.connect({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        username: SMTP_USER,
        password: SMTP_PASS,
      })
    }

    // 1) coordinator webhook (if configured) — fire and forget, 6s cap
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
    if (smtpReady) {
      try {
        if (coordinator?.email) {
          await client.send({
            from: MAIL_FROM,
            to: coordinator.email,
            replyTo: row.email,
            subject: `[AI Manthan] ${row.kind === 'feedback' ? 'Feedback' : 'Query'} ${row.id} — ${row.category}`,
            html: mailHtml(row, 'coordinator'),
          })
          notifiedVia = notifiedVia === 'webhook' ? 'webhook' : 'email'
        }
        await client.send({
          from: MAIL_FROM,
          to: row.email,
          subject: `[AI Manthan] ${row.kind === 'feedback' ? 'Feedback' : 'Ticket'} ${row.id} received`,
          html: mailHtml(row, 'sender'),
        })
      } catch { /* never lose the stored inquiry over mail failures */ }
      await client.close()
    }

    await supabase.from('Inquiry').update({ notifiedVia }).eq('id', row.id)
    return new Response(JSON.stringify({ ok: true, notifiedVia }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500 })
  }
})
