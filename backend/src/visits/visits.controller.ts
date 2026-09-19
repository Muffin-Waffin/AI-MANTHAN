import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { VisitsService } from './visits.service'
import 'dotenv/config'

const ADMIN_KEY = process.env.ADMIN_KEY || ''

function requireKey(key: string | undefined) {
  if (!ADMIN_KEY) throw new UnauthorizedException('ADMIN_KEY not configured on server')
  if (key !== ADMIN_KEY) throw new UnauthorizedException('Invalid admin key')
}

/**
 * Public visitor counter.
 *   POST /api/visits/ping  → every landing counts; body carries the
 *                            client's anonymous visitorId (if any)
 *   GET  /api/visits       → current totals for the footer badge
 *   GET  /api/visits/admin → totals + 14-day daily series (admin key)
 *
 * Ping is throttled generously (3/min per IP — enough for refreshes)
 * and NEVER throws to the client: a dead DB degrades to in-memory.
 */
@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  // Counting is idempotent per session, so a generous limit is safe —
  // this only guards against scripted abuse, not real users.
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('ping')
  async ping(@Body() body: { visitorId?: string; sessionId?: string }) {
    return this.visits.recordVisit(body?.visitorId ?? '', body?.sessionId ?? '')
  }

  @Get()
  async stats() {
    return this.visits.getStats()
  }

  @Get('admin')
  async adminStats(@Headers('x-admin-key') key: string | undefined) {
    requireKey(key)
    return this.visits.getDetailedStats()
  }
}
