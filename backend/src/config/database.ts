import mongoose from 'mongoose'
import 'dotenv/config'

const isProd = process.env.NODE_ENV === 'production'

/**
 * MongoDB connection string.
 * - Production (Render): MONGODB_URI env var MUST be set — no silent
 *   localhost fallback, the app fails fast with a clear error instead.
 * - Local development: falls back to the standard local Mongo; a
 *   `.env.local` (or plain `.env`) can override it.
 */
const MONGODB_URI = process.env.MONGODB_URI || (isProd ? '' : 'mongodb://127.0.0.1:27017/aimanthan')

if (!MONGODB_URI) {
  console.error(
    '[db] FATAL: MONGODB_URI is not set. In production this must point to your MongoDB Atlas cluster (see .env.example).',
  )
  process.exit(1)
}

/**
 * Connects to MongoDB (Atlas in production, local Mongo in development).
 * The API is designed to stay up even when the database is unreachable:
 * callers get a graceful in-memory fallback (health endpoint reports it).
 * Returns true when a real database connection was established.
 */
export async function connectDatabase(): Promise<boolean> {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Atlas can be slow on cold start / free tier — be patient but bounded
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
      // Free-tier friendly pool; Render free instances handle little load
      maxPoolSize: 10,
    })
    // Never log the URI (contains credentials) — host only
    console.log(`[db] MongoDB connected → ${mongoose.connection.host}`)
    return true
  } catch (error) {
    console.warn(
      `[db] MongoDB unavailable (${error instanceof Error ? error.message : error}) — running with in-memory fallback`,
    )
    return false
  }
}
