import { Injectable } from '@nestjs/common'
import mongoose from 'mongoose'
import { Visit } from './visit.model'

const MAX_VISITORS = 50_000
const MAX_SESSIONS = 200_000

/**
 * Honest traffic accounting with analytics-standard semantics:
 *
 *   visit  = one per browsing SESSION (sessionStorage token). Refreshes,
 *            SPA navigations and same-tab reloads never re-count.
 *   unique = one per BROWSER (localStorage token, lifetime).
 *   pageView = every ping (raw page loads; admin analytics only).
 *
 * All identity tokens are random client-generated strings — no PII.
 * MongoDB down → in-memory fallback keeps the endpoints alive.
 */
@Injectable()
export class VisitsService {
  private memory = { total: 0, unique: 0, pageViews: 0 }
  private memoryVisitors = new Set<string>()
  private memorySessions = new Set<string>()

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

    if (mongoose.connection.readyState !== 1) {
      this.memory.pageViews += 1
      if (!this.memorySessions.has(session)) {
        this.memorySessions.add(session)
        this.memory.total += 1
      }
      if (!this.memoryVisitors.has(visitor)) {
        this.memoryVisitors.add(visitor)
        this.memory.unique += 1
      }
      return { ...this.memory, isNewVisit: !this.memorySessions.has(session), tracked: false }
    }

    try {
      const [newSession, newVisitor] = await Promise.all([
        Visit.exists({ key: 'site', seenSessions: session }).then((d) => !d),
        Visit.exists({ key: 'site', seenVisitors: visitor }).then((d) => !d),
      ])

      const update: Record<string, unknown> = {
        $inc: {
          pageViews: 1,
          [`viewsPerDay.${today}`]: 1,
          ...(newSession ? { total: 1, [`perDay.${today}`]: 1 } : {}),
          ...(newVisitor ? { unique: 1, [`uniquePerDay.${today}`]: 1 } : {}),
        },
      }
      const addToSet: Record<string, string> = {}
      if (newSession) addToSet.seenSessions = session
      if (newVisitor) addToSet.seenVisitors = visitor
      if (Object.keys(addToSet).length) update.$addToSet = addToSet

      const doc = await Visit.findOneAndUpdate(
        { key: 'site' },
        update,
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
      ).lean()

      this.pruneIdentities(doc)

      return {
        total: doc?.total ?? 0,
        unique: doc?.unique ?? 0,
        pageViews: doc?.pageViews ?? 0,
        isNewVisit: newSession,
        tracked: true,
      }
    } catch {
      // Counter must never break the page — degrade quietly
      this.memory.pageViews += 1
      return { ...this.memory, isNewVisit: false, tracked: false }
    }
  }

  /** Raw pageview when the client sends no identity (bots, private mode). */
  private async countPageViewOnly(today: string) {
    if (mongoose.connection.readyState !== 1) {
      this.memory.pageViews += 1
      return { ...this.memory, isNewVisit: false, tracked: false }
    }
    try {
      const doc = await Visit.findOneAndUpdate(
        { key: 'site' },
        { $inc: { pageViews: 1, [`viewsPerDay.${today}`]: 1 } },
        { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
      ).lean()
      return {
        total: doc?.total ?? 0,
        unique: doc?.unique ?? 0,
        pageViews: doc?.pageViews ?? 0,
        isNewVisit: false,
        tracked: true,
      }
    } catch {
      return { total: 0, unique: 0, pageViews: 0, isNewVisit: false, tracked: false }
    }
  }

  /** Keep identity lists bounded (see model caps). Fire-and-forget. */
  private async pruneIdentities(doc: Record<string, any> | null) {
    if (!doc) return
    const visitors = Array.isArray(doc.seenVisitors) ? doc.seenVisitors : []
    const sessions = Array.isArray(doc.seenSessions) ? doc.seenSessions : []
    if (visitors.length > MAX_VISITORS || sessions.length > MAX_SESSIONS) {
      Visit.updateOne(
        { key: 'site' },
        {
          $set: {
            ...(visitors.length > MAX_VISITORS
              ? { seenVisitors: visitors.slice(-MAX_VISITORS) }
              : {}),
            ...(sessions.length > MAX_SESSIONS
              ? { seenSessions: sessions.slice(-MAX_SESSIONS) }
              : {}),
          },
        },
      ).catch(() => {})
    }
  }

  async getStats() {
    if (mongoose.connection.readyState !== 1) {
      return { ...this.memory, tracked: false }
    }
    try {
      const doc = await Visit.findOne({ key: 'site' }).lean()
      return {
        total: doc?.total ?? 0,
        unique: doc?.unique ?? 0,
        pageViews: doc?.pageViews ?? 0,
        tracked: true,
      }
    } catch {
      return { total: 0, unique: 0, pageViews: 0, tracked: false }
    }
  }

  /**
   * Admin variant — totals + a 14-day daily series (sessions, uniques
   * and raw pageviews per day) for the dashboard chart.
   */
  async getDetailedStats() {
    if (mongoose.connection.readyState !== 1) {
      return {
        ...this.memory,
        tracked: false,
        daily: this.emptyDaily(),
      }
    }
    try {
      const doc = await Visit.findOne({ key: 'site' }).lean()
      const asObject = (m: unknown): Record<string, number> =>
        m instanceof Map ? Object.fromEntries(m) : ((m as Record<string, number>) || {})
      const perDay = asObject(doc?.perDay)
      const uniquePerDay = asObject(doc?.uniquePerDay)
      const viewsPerDay = asObject(doc?.viewsPerDay)

      const daily = []
      for (let i = 13; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
        daily.push({
          date,
          total: perDay[date] ?? 0,
          unique: uniquePerDay[date] ?? 0,
          pageViews: viewsPerDay[date] ?? 0,
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
      return { total: 0, unique: 0, pageViews: 0, tracked: false, daily: this.emptyDaily() }
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
