-- ════════════════════════════════════════════════════════════════════
-- AI MANTHAN 2026 — SUPABASE-ONLY BACKEND MIGRATION
-- ════════════════════════════════════════════════════════════════════
-- Replaces the NestJS/Render API entirely. The frontend now talks to
-- Supabase directly:
--
--   Visitor counter  → rpc record_visit()  (atomic dedup, same honest
--                      semantics as the old VisitsService)
--   Support/feedback → INSERT into "Inquiry" (RLS: anon insert-only,
--                      payload-constrained; auto-assigned to a
--                      coordinator by trigger)
--   Admin dashboard  → Supabase Auth (email+password) + admin_users
--                      allowlist; reads/updates guarded by RLS
--   Realtime counter → SiteVisit UPDATE events (already wired client-side)
--
-- SETUP (one time):
--   1. Supabase Dashboard → Authentication → Users → "Add user"
--      (email + password, auto-confirm ON).
--   2. Run:  insert into admin_users (email) values ('you@example.com');
--   3. Sign in at /admin with those credentials.
--
-- Safe to re-run (idempotent).
-- ════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────
-- 1. Admin allowlist (managed manually — never expose service keys)
-- ────────────────────────────────────────────────────────────────────
create table if not exists admin_users (
  email      text primary key,
  created_at timestamptz not null default now()
);
alter table admin_users enable row level security;

drop policy if exists "admins read own allowlist row" on admin_users;
create policy "admins read own allowlist row" on admin_users
  for select to authenticated
  using (email = auth.email());

-- ────────────────────────────────────────────────────────────────────
-- 1b. Database-level uuid defaults — Prisma's @default(uuid()) was
--     CLIENT-side only (no DB default existed). The NestJS layer used
--     to generate ids; now the DATABASE must do it.
-- ────────────────────────────────────────────────────────────────────
alter table "SeenToken"   alter column id set default gen_random_uuid();
alter table "DailyStats"  alter column id set default gen_random_uuid();
alter table "Inquiry"     alter column id set default gen_random_uuid();
alter table "Coordinator" alter column id set default gen_random_uuid();

-- @updatedAt bhi Prisma client-side tha — DB defaults zaroori hain
alter table "SiteVisit"   alter column "updatedAt" set default now();
alter table "Inquiry"     alter column "updatedAt" set default now();
alter table "Coordinator" alter column "updatedAt" set default now();

-- Parity with Prisma @updatedAt — keep the stamp honest without NestJS
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new."updatedAt" := now();
  return new;
end $$;

drop trigger if exists trg_touch_inquiry on "Inquiry";
create trigger trg_touch_inquiry before update on "Inquiry"
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_coordinator on "Coordinator";
create trigger trg_touch_coordinator before update on "Coordinator"
  for each row execute function public.touch_updated_at();

-- ────────────────────────────────────────────────────────────────────
-- 2. Row Level Security on the existing Prisma tables
--    (names preserved: "SiteVisit" | "DailyStats" | "SeenToken" |
--     "Inquiry" | "Coordinator" — the realtime client subscribes to
--     "SiteVisit", do NOT rename)
-- ────────────────────────────────────────────────────────────────────
alter table "SiteVisit"  enable row level security;
alter table "DailyStats" enable row level security;
alter table "SeenToken"  enable row level security;
alter table "Inquiry"    enable row level security;
alter table "Coordinator" enable row level security;

-- Public counter numbers — anyone may READ the aggregate
drop policy if exists "public read site visit totals" on "SiteVisit";
create policy "public read site visit totals" on "SiteVisit"
  for select to anon, authenticated using (true);

-- Daily analytics — admins only
drop policy if exists "admins read daily stats" on "DailyStats";
create policy "admins read daily stats" on "DailyStats"
  for select to authenticated
  using (exists (select 1 from admin_users a where a.email = auth.email()));

-- Dedup tokens — NO client access at all (rpc security definer only)
revoke all on "SeenToken" from anon, authenticated;

-- Inquiries: world can SUBMIT (blind), admins can read & work the queue.
-- NOTE: the auto-assign BEFORE trigger runs before this WITH CHECK is
-- evaluated, so it stamps notifiedVia='logged' + assignment fields on
-- every row — the policy therefore guards only the CLIENT-controllable
-- workflow fields (status / resolutionNote / rating / lengths).
drop policy if exists "anyone can submit an inquiry" on "Inquiry";
create policy "anyone can submit an inquiry" on "Inquiry"
  for insert to anon, authenticated
  with check (
    email ~* '(^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$)'
    and char_length(message) between 5 and 2000
    and char_length(coalesce(name, '')) <= 80
    and char_length(category) <= 80
    and kind in ('participant', 'feedback', 'visitor')
    and (rating is null or rating between 1 and 5)
    -- tamper-proofing: clients cannot pre-resolve or pre-stage tickets
    and status = 'open'
    and coalesce("resolutionNote", '') = ''
    and category in (
      'General',
      'Travel Assistance & Hostel Booking',
      'Problem Statement Clarification',
      'Sponsorship & Bounty Inquiry',
      'Other / General Support',
      'Venue & Logistics',
      'Judging & Rounds',
      'Suggestion'
    )
  );

drop policy if exists "admins read inquiries" on "Inquiry";
create policy "admins read inquiries" on "Inquiry"
  for select to authenticated
  using (exists (select 1 from admin_users a where a.email = auth.email()));

drop policy if exists "admins update inquiries" on "Inquiry";
create policy "admins update inquiries" on "Inquiry"
  for update to authenticated
  using (exists (select 1 from admin_users a where a.email = auth.email()))
  with check (exists (select 1 from admin_users a where a.email = auth.email()));

-- Coordinators directory — admins manage
drop policy if exists "admins read coordinators" on "Coordinator";
create policy "admins read coordinators" on "Coordinator"
  for select to authenticated
  using (exists (select 1 from admin_users a where a.email = auth.email()));

drop policy if exists "admins insert coordinators" on "Coordinator";
create policy "admins insert coordinators" on "Coordinator"
  for insert to authenticated
  with check (exists (select 1 from admin_users a where a.email = auth.email()));

drop policy if exists "admins update coordinators" on "Coordinator";
create policy "admins update coordinators" on "Coordinator"
  for update to authenticated
  using (exists (select 1 from admin_users a where a.email = auth.email()))
  with check (exists (select 1 from admin_users a where a.email = auth.email()));

drop policy if exists "admins delete coordinators" on "Coordinator";
create policy "admins delete coordinators" on "Coordinator"
  for delete to authenticated
  using (exists (select 1 from admin_users a where a.email = auth.email()));

-- Table privileges (RLS sits on top of these)
grant select on "SiteVisit" to anon, authenticated;
grant select on "DailyStats" to authenticated;
grant insert on "Inquiry" to anon, authenticated;
grant select, update on "Inquiry" to authenticated;
grant select, insert, update, delete on "Coordinator" to authenticated;
grant select on admin_users to authenticated;

-- ────────────────────────────────────────────────────────────────────
-- 3. record_visit(p_visitor, p_session) — the entire visitor counter.
--    Port of backend/src/visits/visits.service.ts (same semantics):
--      visit   = one per SESSION token      (refreshes never re-count)
--      unique  = one per VISITOR token      (one per browser, lifetime)
--      pageView= every ping
--    Atomic single-statement claim: two concurrent first-pings can
--    never double-count (unique index on SeenToken.token).
-- ────────────────────────────────────────────────────────────────────
create or replace function public.record_visit(p_visitor text, p_session text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_visitor text := left(coalesce(p_visitor, ''), 64);
  v_session text := left(coalesce(p_session, ''), 64);
  v_today   text := to_char(now() at time zone 'UTC', 'YYYY-MM-DD');
  v_row          "SiteVisit"%rowtype;
  v_new_session  int;
  v_new_visitor  int;
begin
  -- No usable identity (bots, private mode) → count a raw pageview only
  if v_visitor = '' or v_session = '' then
    insert into "SiteVisit" (id, total, "unique", "pageViews")
    values ('site', 0, 0, 1)
    on conflict (id) do update
      set "pageViews" = "SiteVisit"."pageViews" + 1, "updatedAt" = now();
    insert into "DailyStats" (date, sessions, uniques, views)
    values (v_today, 0, 0, 1)
    on conflict (date) do update set views = "DailyStats".views + 1;

    select * into v_row from "SiteVisit" where id = 'site';
    return json_build_object(
      'total', v_row.total, 'unique', v_row."unique",
      'pageViews', v_row."pageViews", 'isNewVisit', false, 'tracked', true);
  end if;

  -- Step 1 — atomic dedup claims (unique index → each ping knows exactly
  -- which tokens IT created, even under concurrency). ids supplied
  -- explicitly (gen_random_uuid) so the function is self-sufficient.
  with s as (
    insert into "SeenToken" (id, token, kind)
    values (gen_random_uuid(), 's:' || v_session, 'session')
    on conflict (token) do nothing
    returning 1
  ), v as (
    insert into "SeenToken" (id, token, kind)
    values (gen_random_uuid(), 'v:' || v_visitor, 'visitor')
    on conflict (token) do nothing
    returning 1
  )
  select (select count(*) from s), (select count(*) from v)
  into v_new_session, v_new_visitor;

  -- Step 2 — counter upserts, incremented by THIS ping's own claims
  insert into "SiteVisit" (id, total, "unique", "pageViews")
  values ('site', v_new_session, v_new_visitor, 1)
  on conflict (id) do update
    set "pageViews" = "SiteVisit"."pageViews" + excluded."pageViews",
        total       = "SiteVisit".total       + excluded.total,
        "unique"    = "SiteVisit"."unique"    + excluded."unique",
        "updatedAt" = now()
  returning * into v_row;

  insert into "DailyStats" (id, date, sessions, uniques, views)
  values (gen_random_uuid(), v_today, v_new_session, v_new_visitor, 1)
  on conflict (date) do update
    set views    = "DailyStats".views    + excluded.views,
        sessions = "DailyStats".sessions + excluded.sessions,
        uniques  = "DailyStats".uniques  + excluded.uniques;

  -- Keep the token table bounded (best-effort, ~1% of pings)
  if random() < 0.01 then
    delete from "SeenToken" t
    where t.id in (select id from "SeenToken" order by "createdAt" asc offset 50000);
  end if;

  return json_build_object(
    'total', v_row.total, 'unique', v_row."unique",
    'pageViews', v_row."pageViews",
    'isNewVisit', v_new_session > 0 or v_new_visitor > 0,
    'tracked', true);
end;
$$;

grant execute on function public.record_visit(text, text) to anon, authenticated;

-- ────────────────────────────────────────────────────────────────────
-- 4. Inquiry auto-routing — assign the active coordinator that handles
--    the category (oldest first, exactly like RoutingService.findFirst).
--    Email/webhook dispatch moved to an optional Edge Function
--    (supabase/functions/inquiry-notify) — the DB assignment itself is
--    handled here so the admin queue stays fully functional.
-- ────────────────────────────────────────────────────────────────────
create or replace function public.assign_inquiry_coordinator()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  c "Coordinator"%rowtype;
begin
  select * into c
  from "Coordinator"
  where active = true and new.category = any(categories)
  order by "createdAt" asc
  limit 1;

  if found then
    new."coordinatorId"    := c.id;
    new."assignedName"     := c.name;
    new."assignedEmail"    := c.email;
    new."assignedWhatsapp" := c.whatsapp;
  else
    -- no matching coordinator → wipe anything a client tried to pre-set
    new."coordinatorId"    := null;
    new."assignedName"     := null;
    new."assignedEmail"    := null;
    new."assignedWhatsapp" := null;
  end if;
  new."notifiedVia" := 'logged';
  return new;
end;
$$;

drop trigger if exists trg_assign_inquiry_coordinator on "Inquiry";
create trigger trg_assign_inquiry_coordinator
  before insert on "Inquiry"
  for each row execute function public.assign_inquiry_coordinator();

-- ────────────────────────────────────────────────────────────────────
-- 5. Realtime — SiteVisit UPDATE events drive the live counter badge
-- ────────────────────────────────────────────────────────────────────
do $$
begin
  alter publication supabase_realtime add table "SiteVisit";
exception
  when duplicate_object then null;  -- already in publication
  when undefined_object then null;  -- publication missing (realtime off)
end $$;
