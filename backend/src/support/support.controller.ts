import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { SupportService } from './support.service'
import { SupportInquiryDto } from './support.dto'
import { Coordinator } from './coordinator.model'
import { Inquiry } from './inquiry.model'
import mongoose from 'mongoose'
import 'dotenv/config'

const ADMIN_KEY = process.env.ADMIN_KEY || ''

function requireKey(key: string | undefined) {
  if (!ADMIN_KEY) throw new UnauthorizedException('ADMIN_KEY not configured on server')
  if (key !== ADMIN_KEY) throw new UnauthorizedException('Invalid admin key')
}

/** Admin/data routes answer 503 instead of hanging when MongoDB is down. */
function requireDb() {
  if (mongoose.connection.readyState !== 1) {
    throw new ServiceUnavailableException('Database unavailable')
  }
}

@Controller()
export class SupportController {
  constructor(private readonly support: SupportService) {}

  /** Public — stricter per-endpoint limit: 5 submissions per minute per IP. */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('support')
  async create(@Body() dto: SupportInquiryDto) {
    return this.support.createInquiry(dto)
  }

  /** Public — live count badges for the dashboard. */
  @Get('support/stats')
  async stats() {
    requireDb()
    const [open, inProgress, resolved, feedback, avg] = await Promise.all([
      Inquiry.countDocuments({ kind: 'participant' }),
      Inquiry.countDocuments({ status: 'in-progress' }),
      Inquiry.countDocuments({ status: 'resolved' }),
      Inquiry.countDocuments({ kind: 'feedback' }),
      Inquiry.aggregate([
        { $match: { kind: 'feedback', rating: { $ne: null } } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    ])
    return {
      queries: open,
      inProgress,
      resolved,
      feedback,
      avgRating: avg[0]?.avg ? Math.round(avg[0].avg * 10) / 10 : null,
    }
  }

  /** Admin — queue (filterable). */
  @Get('admin/inquiries')
  async list(
    @Headers('x-admin-key') key: string | undefined,
    @Query('status') status?: string,
    @Query('kind') kind?: string,
  ) {
    requireKey(key)
    requireDb()
    const filter: Record<string, string> = {}
    if (status) filter.status = status
    if (kind) filter.kind = kind
    return Inquiry.find(filter).sort({ createdAt: -1 }).limit(200)
  }

  /** Admin — resolve / progress a ticket. */
  @Patch('admin/inquiries/:id')
  async update(
    @Headers('x-admin-key') key: string | undefined,
    @Param('id') id: string,
    @Body() body: { status?: 'open' | 'in-progress' | 'resolved'; resolutionNote?: string },
  ) {
    requireKey(key)
    requireDb()
    const patch: Record<string, unknown> = {}
    if (body.status) patch.status = body.status
    if (typeof body.resolutionNote === 'string') patch.resolutionNote = body.resolutionNote.slice(0, 1000)
    return Inquiry.findByIdAndUpdate(id, patch, { returnDocument: 'after' })
  }

  /** Admin — coordinator directory CRUD. */
  @Get('admin/coordinators')
  async coordinators(@Headers('x-admin-key') key: string | undefined) {
    requireKey(key)
    requireDb()
    return Coordinator.find().sort({ createdAt: 1 })
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('admin/coordinators')
  async addCoordinator(@Headers('x-admin-key') key: string | undefined, @Body() body: Record<string, unknown>) {
    requireKey(key)
    requireDb()
    return Coordinator.create({
      name: String(body.name ?? '').slice(0, 80),
      email: String(body.email ?? '').toLowerCase().slice(0, 120),
      whatsapp: String(body.whatsapp ?? '').slice(0, 20),
      categories: Array.isArray(body.categories) ? body.categories.map(String) : [],
      webhookUrl: typeof body.webhookUrl === 'string' ? body.webhookUrl.slice(0, 300) : '',
    })
  }
}
