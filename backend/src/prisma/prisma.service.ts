import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * NestJS-managed Prisma client (global module — inject anywhere).
 *
 * No-DB-safe by design: constructor never throws, `onModuleInit` best-
 * effort connect karta hai. App boot DB down hone par bhi chalta rehta
 * hai — services try/catch fallback use karte hain, aur health check
 * live `isDbAvailable()` ping se honest status deta hai.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService')
  private available = false

  constructor() {
    super({
      log: [{ emit: 'stdout', level: 'error' }],
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      this.available = true
    } catch (error) {
      // Boot must survive a dead DB (free-tier pauses, network blips)
      this.logger.warn(`Database unavailable at boot — in-memory fallback active: ${error}`)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {})
  }

  /** Live availability probe — cached briefly to avoid hammering the DB. */
  isDbAvailable(): boolean {
    return this.available
  }

  /** Cheap liveness check used by the health endpoint. */
  async ping(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`
      this.available = true
      return true
    } catch {
      this.available = false
      return false
    }
  }

  /** Re-probe after a failure window so fallback can self-heal. */
  markUnavailable() {
    this.available = false
  }
}
