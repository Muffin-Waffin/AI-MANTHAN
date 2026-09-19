-- ─────────────────────────────────────────────────────────────────────────────
-- AI Manthan 2026 — Supabase Realtime setup for the live visitor counter
-- Run ONCE: Supabase Dashboard → SQL Editor → paste → RUN
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Stream row changes of the counter table to all Realtime clients
ALTER PUBLICATION supabase_realtime ADD TABLE "SiteVisit";

-- 2) RLS: the counter is public data — anyone may READ, nobody writes
--    directly (all writes happen server-side via Prisma / service role).
ALTER TABLE "SiteVisit" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read site visits" ON "SiteVisit";
CREATE POLICY "public read site visits"
  ON "SiteVisit"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 3) Housekeeping: when the singleton row is deleted, republish cleanly.
--    (Not expected in normal operation — safety net only.)

-- Verify (optional):
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
