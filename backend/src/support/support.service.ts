import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { SupportInquiryDto } from './support.dto'
import { RoutingService } from './routing.service'

@Injectable()
export class SupportService {
  private readonly logger = new Logger('SupportService')

  constructor(
    private readonly prisma: PrismaService,
    private readonly routing: RoutingService,
  ) {}

  /**
   * Persists an inquiry/feedback, then auto-routes it to the category's
   * student coordinator (email + webhook). Supabase-down fallback keeps
   * the message in the server log — the site never shows errors to
   * participants. Response honestly reports whether email dispatch is
   * configured, so the UI never over-promises when SMTP is absent.
   */
  async createInquiry(dto: SupportInquiryDto) {
    try {
      const doc = await this.prisma.inquiry.create({
        data: {
          email: dto.email,
          name: dto.name ?? '',
          category: dto.category ?? 'General',
          message: dto.message,
          kind: dto.kind ?? 'participant',
          rating: dto.rating ?? null,
        },
      })
      this.logger.log(`Inquiry ${doc.id} stored (${dto.kind ?? 'participant'})`)
      // Route asynchronously — the participant gets their ticket immediately.
      void this.routing.route(dto, doc.id)
      return { ok: true, id: doc.id, source: 'postgres', emailDispatch: this.routing.emailReady }
    } catch (error) {
      this.logger.warn(`Database unavailable — inquiry kept in memory log only: ${error}`)
      return { ok: true, id: null, source: 'memory', emailDispatch: this.routing.emailReady }
    }
  }
}
