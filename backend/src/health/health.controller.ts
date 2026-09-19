import { Controller, Get } from '@nestjs/common'
import mongoose from 'mongoose'

const STARTED_AT = Date.now()

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'ai-manthan-backend',
      uptimeMs: Date.now() - STARTED_AT,
      // readyState 1 = connected; anything else → in-memory fallback active
      database: mongoose.connection.readyState === 1 ? 'connected' : 'fallback-memory',
    }
  }
}
