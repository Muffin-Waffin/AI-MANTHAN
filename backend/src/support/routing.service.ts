import 'dotenv/config'
import { Injectable, Logger } from '@nestjs/common'
import type { Transporter } from 'nodemailer'
import nodemailer from 'nodemailer'
import { PrismaService } from '../prisma/prisma.service'
import type { SupportInquiryDto } from './support.dto'

const {
  SMTP_HOST = '',
  SMTP_PORT = '587',
  SMTP_USER = '',
  SMTP_PASS = '',
  MAIL_FROM = 'AI Manthan Support <support@aimanthan.in>',
} = process.env

/** Transport is null until SMTP env vars are configured. */
let transporter: Transporter | null = null
if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
}

/** Whether outbound email dispatch is configured (SMTP env present). */
export function isEmailConfigured(): boolean {
  return transporter != null
}

/** Fire-and-forget POST to the coordinator's webhook bridge, if configured. */
async function pingWebhook(url: string, payload: Record<string, unknown>) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    })
    return 'webhook'
  } catch {
    return null
  }
}

function mailHtml(dto: SupportInquiryDto & { kind?: string; rating?: number }, id: string) {
  const who = dto.name ? `${dto.name} (${dto.email})` : dto.email
  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">
    <h2 style="color:#7c3aed;margin:0 0 4px">New ${dto.kind === 'feedback' ? 'Feedback' : 'Support Query'} — AI Manthan 2026</h2>
    <p style="color:#555;margin:0 0 16px">Assigned to you via auto-routing. Please connect with the participant.</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#888;width:90px">Ticket</td><td><code>${id}</code></td></tr>
      <tr><td style="padding:6px 0;color:#888">From</td><td><a href="mailto:${dto.email}">${who.replace(/</g, '&lt;')}</a></td></tr>
      <tr><td style="padding:6px 0;color:#888">Category</td><td>${dto.category}</td></tr>
      ${dto.rating ? `<tr><td style="padding:6px 0;color:#888">Rating</td><td>${'★'.repeat(dto.rating)}${'☆'.repeat(5 - dto.rating)} (${dto.rating}/5)</td></tr>` : ''}
    </table>
    <div style="background:#f6f4ff;border-left:3px solid #7c3aed;padding:12px 14px;margin:14px 0;border-radius:6px;white-space:pre-wrap">${dto.message.replace(/</g, '&lt;')}</div>
    <p style="color:#999;font-size:12px">— AI Manthan automatic dispatch</p>
  </div>`
}

@Injectable()
export class RoutingService {
  private readonly logger = new Logger('RoutingService')

  constructor(private readonly prisma: PrismaService) {}

  /** Whether outbound email dispatch is configured (SMTP env present). */
  get emailReady(): boolean {
    return isEmailConfigured()
  }

  /**
   * Auto-assigns an inquiry to the active coordinator that handles its
   * category (fewest active tickets first = natural load balancing),
   * then notifies them on every configured channel (webhook + email).
   * Never throws — routing failures never lose the stored inquiry.
   */
  async route(dto: SupportInquiryDto & { kind?: string; rating?: number }, inquiryId: string) {
    const patch: {
      notifiedVia: 'webhook' | 'email' | 'logged'
      confirmationSent?: boolean
      coordinatorId?: string
      assignedName?: string
      assignedEmail?: string
      assignedWhatsapp?: string
    } = { notifiedVia: 'logged' }

    try {
      const coordinator = await this.prisma.coordinator.findFirst({
        where: { active: true, categories: { has: dto.category } },
        orderBy: { createdAt: 'asc' },
      })

      if (coordinator) {
        patch.coordinatorId = coordinator.id
        patch.assignedName = coordinator.name
        patch.assignedEmail = coordinator.email
        patch.assignedWhatsapp = coordinator.whatsapp

        const channels = await Promise.allSettled([
          coordinator.webhookUrl
            ? pingWebhook(coordinator.webhookUrl, {
                ticket: inquiryId,
                kind: dto.kind ?? 'participant',
                from: dto.email,
                name: dto.name ?? null,
                category: dto.category,
                rating: dto.rating ?? null,
                message: dto.message,
                coordinator: coordinator.name,
              })
            : Promise.resolve(null),
          transporter
            ? transporter.sendMail({
                from: MAIL_FROM,
                to: coordinator.email,
                replyTo: dto.email,
                subject: `[AI Manthan] ${dto.kind === 'feedback' ? 'Feedback' : 'Query'} ${inquiryId} — ${dto.category}`,
                html: mailHtml(dto, inquiryId),
              })
            : Promise.resolve(null),
        ])

        if (channels.some((c) => c.status === 'fulfilled' && c.value)) {
          patch.notifiedVia = channels[0].status === 'fulfilled' && channels[0].value
            ? 'webhook'
            : 'email'
        }
        this.logger.log(
          `Inquiry ${inquiryId} → ${coordinator.name} (notified via ${patch.notifiedVia})`,
        )
      } else {
        this.logger.warn(`No active coordinator for "${dto.category}" — admin queue only`)
      }
    } catch (error) {
      this.logger.error(`Routing failed for ${inquiryId}: ${error}`)
    }

    // Sender acknowledgement — participant ko turant receipt milti hai
    // (independent of coordinator matching). SMTP unconfigured ho toh
    // clearly warn karo, chupke skip nahi.
    if (transporter) {
      try {
        await transporter.sendMail({
          from: MAIL_FROM,
          to: dto.email,
          subject: `[AI Manthan] ${dto.kind === 'feedback' ? 'Feedback' : 'Ticket'} ${inquiryId} received`,
          html: `\n  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px">\n    <h2 style="color:#7c3aed;margin:0 0 4px">We received your ${dto.kind === 'feedback' ? 'feedback' : 'message'} — AI Manthan 2026</h2>\n    <p style="color:#555;margin:0 0 12px">Ticket <code>${inquiryId}</code> is logged with the organizing desk. A coordinator will reply to this email shortly.</p>\n    <div style="background:#f6f4ff;border-left:3px solid #7c3aed;padding:12px 14px;border-radius:6px;white-space:pre-wrap;color:#333">${dto.message.replace(/</g, '&lt;')}</div>\n    <p style="color:#999;font-size:12px">— AI Manthan automatic dispatch</p>\n  </div>`,
        })
        patch.confirmationSent = true
      } catch (error) {
        this.logger.warn(`Confirmation mail to ${dto.email} failed: ${error}`)
      }
    } else {
      this.logger.warn('SMTP unconfigured — coordinator + confirmation emails skipped (queue only)')
    }

    await this.prisma.inquiry
      .update({ where: { id: inquiryId }, data: patch })
      .catch(() => {})
    return patch.assignedName ? { ...patch } : null
  }
}
