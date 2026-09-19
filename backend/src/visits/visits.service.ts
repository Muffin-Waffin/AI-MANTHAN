import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const MAX_TOKENS_PER_KIND = 50_000

/**
 * Honest traffic accounting with analytics-standard semantics:
 *
 *   visit  = one per browsing SESSION (sessionStorage token). Refreshes,
 *            SPA navigations and same-tab reloads never re-count.
 *   unique = one per BROWSER (localStorage token, lifetime).
 *   pageView = every ping (raw page loads; admin analytics only).
 *
 * All identity tokens are random client-generated strings — no PII.
 *
 * Postgres design: dedup tokens are rows in `SeenToken` (unique index) —
 * inserting a claim is atomic, so two concurrent first-pings can never
 * double-count. Daily numbers live in `DailyStats` (one row per day).
 * Supabase down → in-memory fallback keeps the endpoints alive.
 */
@Injectable()
export class VisitsService {
  private memory = { total: 0, unique: 0, pageViews: 0 }
  private memoryVisitors = new Set<string>()
  private memorySessions = new Set<string>()

  constructor(private readonly prisma: PrismaService) {}

  private todayKey() {
    return new Date().toISOString().slice(0, 10)
  }

  async recordVisit(visitorId: string, sessionId: string) {
    const visitor = String(visitorId || '').slice(0, 64)
    const session = String(sessionId || '').slice(0, 64)
    const today = this.todayKey()

    // No usable tokens → count a raw pageview only, fabricate nothing.
    if (!visitor || !session) {
      return this.countPageViewOnly(today)
    }

    try {
      // Atomic dedup claims: INSERT wins exactly once per unique token.
      // skipDuplicates → Postgres ON CONFLICT DO NOTHING, so each returned
      // count tells us precisely whether THIS ping created that token.
      // (One combined createMany cannot tell WHICH token was new — that
      // mis-attributed sessions as uniques.)
      const [sessionClaim, visitorClaim] = await this.prisma.$transaction([
        this.prisma.seenToken.createMany({
          data: [{ token: `s:${session}`, kind: 'session' }],
          skipDuplicates: true,
        }),
        this.prisma.seenToken.createMany({
          data: [{ token: `v:${visitor}`, kind: 'visitor' }],
          skipDuplicates: true,
        }),
      ])

      const newSession = sessionClaim.count === 1
      const newVisitor = visitorClaim.count === 1
      const isNewVisit = newSession || newVisitor

      const [totals, daily] = await this.prisma.$transaction([
        this.prisma.siteVisit.upsert({
          where: { id: 'site' },
          create: {
            id: 'site',
            total: newSession ? 1 : 0,
            unique: newVisitor ? 1 : 0,
            pageViews: 1,
          },
          update: {
            pageViews: { increment: 1 },
            ...(newSession ? { total: { increment: 1 } } : {}),
            ...(newVisitor ? { unique: { increment: 1 } } : {}),
          },
        }),
        this.prisma.dailyStats.upsert({
          where: { date: today },
          create: {
            date: today,
            sessions: newSession ? 1 : 0,
            uniques: newVisitor ? 1 : 0,
            views: 1,
          },
          update: {
            views: { increment: 1 },
            ...(newSession ? { sessions: { increment: 1 } } : {}),
            ...(newVisitor ? { uniques: { increment: 1 } } : {}),
          },
        }),
      ])

      // Fire-and-forget: keep the token table bounded.
      void this.pruneTokens()

      return {
        total: totals.total,
        unique: totals.unique,
        pageViews: totals.pageViews,
        isNewVisit,
        tracked: true,
      }
    } catch (error) {
      // Counter must never break the page — degrade quietly to memory
      this.prisma.markUnavailable()
      this.memoryFallback(session, visitor)
      this.debugLog(`Prisma unavailable — in-memory fallback: ${error}`)
      return { ...this.memory, isNewVisit: false, tracked: false }
    }
  }

  /** Raw pageview when the client sends no identity (bots, private mode). */
  private async countPageViewOnly(today: string) {
    try {
      const [totals, daily] = await this.prisma.$transaction([
        this.prisma.siteVisit.upsert({
          where: { id: 'site' },
          create: { id: 'site', pageViews: 1 },
          update: { pageViews: { increment: 1 } },
        }),
        this.prisma.dailyStats.upsert({
          where: { date: today },
          create: { date: today, views: 1 },
          update: { views: { increment: 1 } },
        }),
      ])
      return {
        total: totals.total,
        unique: totals.unique,
        pageViews: totals.pageViews,
        isNewVisit: false,
        tracked: true,
      }
    } catch {
      this.prisma.markUnavailable()
      this.memory.pageViews += 1
      return { ...this.memory, isNewVisit: false, tracked: false }
    }
  }

  private memoryFallback(session: string, visitor: string) {
    this.memory.pageViews += 1
    if (!this.memorySessions.has(session)) {
      this.memorySessions.add(session)
      this.memory.total += 1
    }
    if (!this.memoryVisitors.has(visitor)) {
      this.memoryVisitors.add(visitor)
      this.memory.unique += 1
    }
  }

  private debugLog(message: string) {
    // Kept minimal — counter noise on a dead DB helps nobody.
    if (process.env.NODE_ENV !== 'production') console.warn(`[visits] ${message}`)
  }

  /** Keep SeenToken bounded (oldest rows deleted past the cap). Fire-and-forget. */
  private async pruneTokens() {
    try {
      const count = await this.prisma.seenToken.count()
      if (count <= MAX_TOKENS_PER_KIND) return
      const old = await this.prisma.seenToken.findMany({
        orderBy: { createdAt: 'asc' },
        take: count - MAX_TOKENS_PER_KIND,
        select: { id: true },
      })
      await this.prisma.seenToken.deleteMany({ where: { id: { in: old.map((t) => t.id) } } })
    } catch {
      /* pruning is best-effort */
    }
  }

  async getStats() {
    try {
      const doc = await this.prisma.siteVisit.findUnique({ where: { id: 'site' } })
      return {
        total: doc?.total ?? 0,
        unique: doc?.unique ?? 0,
        pageViews: doc?.pageViews ?? 0,
        tracked: true,
      }
    } catch {
      this.prisma.markUnavailable()
      return { ...this.memory, tracked: false }
    }
  }

  /**
   * Admin variant — totals + a 14-day daily series (sessions, uniques
   * and raw pageviews per day) for the dashboard chart.
   */
  async getDetailedStats() {
    try {
      const [doc, rows] = await this.prisma.$transaction([
        this.prisma.siteVisit.findUnique({ where: { id: 'site' } }),
        this.prisma.dailyStats.findMany({
          where: { date: { gte: new Date(Date.now() - 13 * 86_400_000).toISOString().slice(0, 10) } },
          orderBy: { date: 'asc' },
        }),
      ])

      const daily = []
      for (let i = 13; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
        const row = rows.find((r) => r.date === date)
        daily.push({
          date,
          total: row?.sessions ?? 0,
          unique: row?.uniques ?? 0,
          pageViews: row?.views ?? 0,
        })
      }

      return {
        total: doc?.total ?? 0,
        unique: doc?.unique ?? 0,
        pageViews: doc?.pageViews ?? 0,
        tracked: true,
        daily,
      }
    } catch {
      this.prisma.markUnavailable()
      return {
        ...this.memory,
        tracked: false,
        daily: this.emptyDaily(),
      }
    }
  }

  private emptyDaily() {
    const daily = []
    for (let i = 13; i >= 0; i--) {
      daily.push({
        date: new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10),
        total: 0,
        unique: 0,
        pageViews: 0,
      })
    }
    return daily
  }
}
