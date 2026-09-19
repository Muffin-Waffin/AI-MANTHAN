/**
 * Enable Supabase Realtime for the live visitor counter — idempotent.
 *
 *   npm run realtime:enable
 *
 * Replaces the manual "Dashboard → SQL Editor → paste" step. Safe to
 * re-run any time: publication membership is checked before altering,
 * RLS enable is a no-op when already on, and the policy is dropped and
 * recreated. Runs over the same Prisma connection the app already uses.
 */
const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    // 1) Stream "SiteVisit" row changes to all Realtime clients
    const inPub = await prisma.$queryRawUnsafe(
      `SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND tablename = 'SiteVisit' LIMIT 1`,
    )
    if (inPub.length === 0) {
      await prisma.$executeRawUnsafe(
        `ALTER PUBLICATION supabase_realtime ADD TABLE "SiteVisit"`,
      )
      console.log('[realtime] added "SiteVisit" to supabase_realtime publication')
    } else {
      console.log('[realtime] "SiteVisit" already in publication — skip')
    }

    // 2) RLS: counter is public data — anon may READ, nobody writes
    //    directly (all writes are server-side via Prisma / service role).
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "SiteVisit" ENABLE ROW LEVEL SECURITY`,
    )
    console.log('[realtime] RLS enabled on "SiteVisit"')

    // 3) Read-only policy for anon/authenticated (idempotent recreate)
    await prisma.$executeRawUnsafe(
      `DROP POLICY IF EXISTS "public read site visits" ON "SiteVisit"`,
    )
    await prisma.$executeRawUnsafe(
      `CREATE POLICY "public read site visits" ON "SiteVisit"
       FOR SELECT TO anon, authenticated USING (true)`,
    )
    console.log('[realtime] read-only policy ensured')

    // Verify — print the actual DB state so the output is proof, not a promise
    const pub = await prisma.$queryRawUnsafe(
      `SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime'`,
    )
    const pol = await prisma.$queryRawUnsafe(
      `SELECT policyname, cmd FROM pg_policies WHERE tablename = 'SiteVisit'`,
    )
    const rls = await prisma.$queryRawUnsafe(
      `SELECT relrowsecurity FROM pg_class WHERE relname = 'SiteVisit'`,
    )
    console.log('[verify] publication tables:', pub.map((r) => r.tablename).join(', '))
    console.log('[verify] policies:', JSON.stringify(pol))
    console.log('[verify] RLS on:', rls[0]?.relrowsecurity)
    console.log('[done] Realtime ready for the live counter')
    await prisma.$disconnect()
  } catch (error) {
    console.error('[error]', error.message)
    process.exitCode = 1
    try {
      await prisma.$disconnect()
    } catch {
      /* ignore */
    }
  }
}

main()
