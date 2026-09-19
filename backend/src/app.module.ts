import { Module } from '@nestjs/common'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from './prisma/prisma.module'
import { HealthController } from './health/health.controller'
import { SupportModule } from './support/support.module'
import { VisitsModule } from './visits/visits.module'

@Module({
  imports: [
    // Global Prisma client (Supabase PostgreSQL)
    PrismaModule,
    SupportModule,
    VisitsModule,
    // Global rate limit — 30 requests per minute per IP (abuse baseline).
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 30,
      },
    ]),
  ],
  controllers: [HealthController],
  providers: [
    // Apply ThrottlerGuard globally
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
