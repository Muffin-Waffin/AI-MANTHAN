import mongoose from 'mongoose'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aimanthan'

/**
 * Connects to MongoDB (MERN). The API is designed to stay up even when
 * MongoDB is not running: callers get a graceful in-memory fallback.
 * Returns true when a real database connection was established.
 */
export async function connectDatabase(): Promise<boolean> {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000, // fail fast when Mongo isn't running
    })
    console.log(`[db] MongoDB connected → ${mongoose.connection.host}`)
    return true
  } catch (error) {
    console.warn(
      `[db] MongoDB unavailable (${error}) — running with in-memory fallback`,
    )
    return false
  }
}