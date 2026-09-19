import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const STARTED_AT = Date.now()

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async health() {
    // Live DB ping — honest status, no cached state
    const connected = await this.prisma.ping()
    return {
      status: 'ok',
      service: 'ai-manthan-backend',
      uptimeMs: Date.now() - STARTED_AT,
      database: connected ? 'connected' : 'fallback-memory',
    }
  }
}
