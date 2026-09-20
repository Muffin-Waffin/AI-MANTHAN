-- ════════════════════════════════════════════════════════════════════
-- ⚡ FIX-RUN-ME — Supabase Dashboard → SQL Editor → is file ka poora
--    content paste karo → RUN. (Safe to re-run, kuch delete nahi hota.)
-- ════════════════════════════════════════════════════════════════════
-- Live DB ke 3 problems fix:
--   1. SeenToken/DailyStats/Inquiry/Coordinator.id me uuid default nahi
--      tha (Prisma ka @default(uuid()) client-side tha) → counter 23502
--   2. record_visit() ka purana version live hai → naya replace hoga
--   3. Inquiry RLS insert policy ↔ assign-trigger conflict
-- ════════════════════════════════════════════════════════════════════

-- 1 ── Database-level uuid + updatedAt defaults
--    (Prisma ka @default(uuid()) aur @updatedAt dono CLIENT-side the —
--     DB me koi default nahi tha, isliye direct inserts 23502 dete the)
alter table "SeenToken"   alter column id set default gen_random_uuid();
alter table "DailyStats"  alter column id set default gen_random_uuid();
alter table "Inquiry"     alter column id set default gen_random_uuid();
alter table "Coordinator" alter column id set default gen_random_uuid();

alter table "SiteVisit"   alter column "updatedAt" set default now();
alter table "Inquiry"     alter column "updatedAt" set default now();
alter table "Coordinator" alter column "updatedAt" set default now();

-- 2 ── updatedAt stamp (Prisma @updatedAt parity)
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

-- 3 ── record_visit() — naya version (ids explicitly generate karta hai)
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
  if v_visitor = '' or v_session = '' then
    insert into "SiteVisit" (id, total, "unique", "pageViews")
    values ('site', 0, 0, 1)
    on conflict (id) do update
      set "pageViews" = "SiteVisit"."pageViews" + 1, "updatedAt" = now();
    insert into "DailyStats" (id, date, sessions, uniques, views)
    values (gen_random_uuid(), v_today, 0, 0, 1)
    on conflict (date) do update set views = "DailyStats".views + 1;

    select * into v_row from "SiteVisit" where id = 'site';
    return json_build_object(
      'total', v_row.total, 'unique', v_row."unique",
      'pageViews', v_row."pageViews", 'isNewVisit', false, 'tracked', true);
  end if;

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

-- 4 ── Inquiry auto-assign trigger (fixed: no-coordinator case me
--     client-supplied assignment fields wipe hote hain)
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

-- 5 ── Inquiry insert policy (fixed: trigger ke baad evaluate hoti hai,
--     isliye assignment fields pe is-null check nahi — sirf client-
--     controllable workflow fields guard hoti hain)
drop policy if exists "anyone can submit an inquiry" on "Inquiry";
create policy "anyone can submit an inquiry" on "Inquiry"
  for insert to anon, authenticated
  with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and char_length(message) between 10 and 2000
    and char_length(coalesce(name, '')) <= 80
    and char_length(category) <= 80
    and kind in ('participant', 'feedback')
    and (rating is null or rating between 1 and 5)
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

-- ════════════════════════════════════════════════════════════════════
-- ✅ SELF-TEST — Run dabane ke baad RESULTS me ye json row dikhni chahiye:
--    {"total": ..., "unique": ..., "pageViews": ..., "isNewVisit": true, "tracked": true}
--    (ye ek test visit +1 karta hai — smoke tokens baad me prune ho jayenge)
-- ════════════════════════════════════════════════════════════════════
select public.record_visit('smoke-test-v', 'smoke-test-s') as counter_check;
