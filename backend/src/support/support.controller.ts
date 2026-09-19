import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UnauthorizedException, ServiceUnavailableException } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { PrismaService } from '../prisma/prisma.service'
import { SupportService } from './support.service'
import { SupportInquiryDto } from './support.dto'
import 'dotenv/config'

const ADMIN_KEY = process.env.ADMIN_KEY || ''

function requireKey(key: string | undefined) {
  if (!ADMIN_KEY) throw new UnauthorizedException('ADMIN_KEY not configured on server')
  if (key !== ADMIN_KEY) throw new UnauthorizedException('Invalid admin key')
}

/** Admin/data routes answer 503 instead of hanging when Supabase is down. */
async function requireDb(prisma: PrismaService) {
  if (!(await prisma.ping())) {
    throw new ServiceUnavailableException('Database unavailable')
  }
}

@Controller()
export class SupportController {
  constructor(
    private readonly support: SupportService,
    private readonly prisma: PrismaService,
  ) {}

  /** Public — stricter per-endpoint limit: 5 submissions per minute per IP. */
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('support')
  async create(@Body() dto: SupportInquiryDto) {
    return this.support.createInquiry(dto)
  }

  /** Public — live count badges for the dashboard. */
  @Get('support/stats')
  async stats() {
    await requireDb(this.prisma)
    const [open, inProgress, resolved, feedback, agg] = await Promise.all([
      this.prisma.inquiry.count({ where: { kind: 'participant' } }),
      this.prisma.inquiry.count({ where: { status: 'in-progress' } }),
      this.prisma.inquiry.count({ where: { status: 'resolved' } }),
      this.prisma.inquiry.count({ where: { kind: 'feedback' } }),
      this.prisma.inquiry.aggregate({
        where: { kind: 'feedback', rating: { not: null } },
        _avg: { rating: true },
      }),
    ])
    return {
      queries: open,
      inProgress,
      resolved,
      feedback,
      avgRating: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
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
    await requireDb(this.prisma)
    const where: Record<string, string> = {}
    if (status) where.status = status
    if (kind) where.kind = kind
    return this.prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
  }

  /** Admin — resolve / progress a ticket. */
  @Patch('admin/inquiries/:id')
  async update(
    @Headers('x-admin-key') key: string | undefined,
    @Param('id') id: string,
    @Body() body: { status?: 'open' | 'in-progress' | 'resolved'; resolutionNote?: string },
  ) {
    requireKey(key)
    await requireDb(this.prisma)
    const data: { status?: string; resolutionNote?: string } = {}
    if (body.status) data.status = body.status
    if (typeof body.resolutionNote === 'string') data.resolutionNote = body.resolutionNote.slice(0, 1000)
    // Mirror the old findByIdAndUpdate semantics: unknown id → null, not a 500.
    return this.prisma.inquiry.update({ where: { id }, data }).catch((error) => {
      if (error?.code === 'P2025') return null
      throw error
    })
  }

  /** Admin — coordinator directory CRUD. */
  @Get('admin/coordinators')
  async coordinators(@Headers('x-admin-key') key: string | undefined) {
    requireKey(key)
    await requireDb(this.prisma)
    return this.prisma.coordinator.findMany({ orderBy: { createdAt: 'asc' } })
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('admin/coordinators')
  async addCoordinator(@Headers('x-admin-key') key: string | undefined, @Body() body: Record<string, unknown>) {
    requireKey(key)
    await requireDb(this.prisma)
    return this.prisma.coordinator.create({
      data: {
        name: String(body.name ?? '').slice(0, 80),
        email: String(body.email ?? '').toLowerCase().slice(0, 120),
        whatsapp: String(body.whatsapp ?? '').slice(0, 20),
        categories: Array.isArray(body.categories) ? body.categories.map(String) : [],
        webhookUrl: typeof body.webhookUrl === 'string' ? body.webhookUrl.slice(0, 300) : '',
      },
    })
  }
}
