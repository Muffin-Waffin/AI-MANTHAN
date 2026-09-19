import mongoose from 'mongoose'

/**
 * Site-wide traffic counter — a single document (singleton, key: 'site').
 *
 * Three honest counters, analytics-standard semantics:
 *   total     → unique browsing SESSIONS (one "visit" per session;
 *               refreshes/navigations inside a session never re-count)
 *   unique    → unique visitors (one per browser, lifetime)
 *   pageViews → raw pings (every page load; admin analytics only)
 *
 * Daily series (maps of YYYY-MM-DD → n):
 *   perDay       → sessions first seen that day
 *   uniquePerDay → visitors first seen that day
 *   viewsPerDay  → raw pings that day
 *
 * Identity is anonymous: the client sends random tokens stored in
 * sessionStorage (session) and localStorage (visitor). No PII ever.
 */
const visitSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'site' },
    total: { type: Number, default: 0 },
    unique: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    perDay: { type: Map, of: Number, default: {} },
    uniquePerDay: { type: Map, of: Number, default: {} },
    viewsPerDay: { type: Map, of: Number, default: {} },
    /** visitor tokens already counted in `unique` */
    seenVisitors: { type: [String], default: [] },
    /** session tokens already counted in `total` */
    seenSessions: { type: [String], default: [] },
  },
  { timestamps: true },
)

// Hard-cap the identity lists: beyond the cap we stop tracking new
// uniques/sessions precisely instead of growing the document forever.
// (50k visitors / 200k sessions is far beyond this site's needs.)
visitSchema.pre('validate', function capSeen() {
  if (this.seenVisitors && this.seenVisitors.length > 50_000) {
    this.seenVisitors = this.seenVisitors.slice(-50_000)
  }
  if (this.seenSessions && this.seenSessions.length > 200_000) {
    this.seenSessions = this.seenSessions.slice(-200_000)
  }
})

export const Visit =
  mongoose.models.Visit || mongoose.model('Visit', visitSchema)
