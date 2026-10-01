/**
 * Supabase Migration -> 100% Neon PostgreSQL Database
 * All database operations are now routed to Neon PostgreSQL Serverless DB.
 */
export {
  sql,
  pingVisit,
  subscribeToSiteVisits,
  submitSupportInquiry,
  adminApi,
} from './neon'

export const supabase = null

