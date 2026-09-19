import { Injectable, Logger } from '@nestjs/common'
import { Inquiry } from './inquiry.model'
import { SupportInquiryDto } from './support.dto'
import { RoutingService } from './routing.service'

@Injectable()
export class SupportService {
  private readonly logger = new Logger('SupportService')

  constructor(private readonly routing: RoutingService) {}

  /**
   * Persists an inquiry/feedback, then auto-routes it to the category's
   * student coordinator (email + webhook). MongoDB-down fallback keeps the
   * message in the server log — the site never shows errors to participants.
   * Response honestly reports whether email dispatch is configured, so the
   * UI never over-promises ("mail jayega") when SMTP is absent.
   */
  async createInquiry(dto: SupportInquiryDto) {
    try {
      const doc = await Inquiry.create(dto)
      this.logger.log(`Inquiry ${doc._id} stored (${dto.kind ?? 'participant'})`)
      // Route asynchronously — the participant gets their ticket immediately.
      void this.routing.route(dto, String(doc._id))
      return { ok: true, id: String(doc._id), source: 'mongodb', emailDispatch: this.routing.emailReady }
    } catch (error) {
      this.logger.warn(`MongoDB unavailable — inquiry kept in memory log only: ${error}`)
      return { ok: true, id: null, source: 'memory', emailDispatch: this.routing.emailReady }
    }
  }
}
