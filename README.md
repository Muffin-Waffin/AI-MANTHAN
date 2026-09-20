# AI Manthan 2026 — Hackathon Platform (Next.js + Supabase)

Monorepo for the AI Manthan 2026 national AI hackathon site, hosted at
Acropolis Institute of Technology & Research, Bypass Road, Square, Manglaya Sadak, Indore.

**100% Supabase backend — no Render, no REST API server.** The frontend talks
to Supabase Postgres directly (RLS-guarded), Supabase Auth protects the admin
dashboard, and Supabase Realtime drives the live visitor counter.
Deploy target: **Vercel (frontend) + Supabase (backend) only.**

```
frontend/   Next.js 16 (React 19) + Tailwind CSS v4  → http://localhost:3000
supabase/   schema.sql (RLS + RPC + triggers) + optional Edge Function
build/      Original design reference (code.html, DESIGN.md, screen.png)

Routes:
  /                 Single-page site — all sections anchored (#overview, #tracks,
                    #faculty [Jury + Mentors + Faculty carousels], #team, …)
  /faculty/[slug]   Unified profile dossier (SSG, 13 pages — jury, mentors,
                    speakers, faculty leadership)
  /support          Dedicated support/contact page
  /team             Team roster page
  /admin            Command Desk — support queue (Supabase Auth login)
  /robots.txt       generated
  /sitemap.xml      generated (home + 13 profiles)
  404               styled not-found page (app/not-found.jsx)

Glassmorphism + motion layer:
- `glass` / `glass-strong` frosted surfaces on every card, navbar & modal
- `glass-hover` hover glow/lift + `sheen` shimmer sweep on cards
- `stagger-fade-up` hero entrance, `pulse-glow` on the prize card
- shadcn/ui Accordion powers the FAQ; Radix Dialog powers the modals
```

## Quick start

```bash
# 1. Supabase (one time) — run the schema in the SQL editor
#    Dashboard → SQL Editor → paste supabase/schema.sql → Run
#    (creates RLS policies, record_visit() rpc, coordinator auto-assign
#     trigger, realtime publication and the admin_users allowlist)

# 2. Admin user (one time)
#    Dashboard → Authentication → Users → "Add user" (auto-confirm ON)
#    SQL editor: insert into admin_users (email) values ('you@example.com');

# 3. Frontend
cd frontend
cp .env.example .env.local   # set NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
npm install
npm run dev                  # Site on http://localhost:3000
```

## Architecture

### Frontend (`frontend/src`)

```
app/
  layout.jsx          Root layout — fonts, metadata, global CSS
  page.jsx            Page composition — sections in scroll order
  admin/page.jsx      Command Desk — Supabase Auth login + support queue
components/
  seo/                EventJsonLd.jsx — schema.org Event structured data
  ui/                 Design-system primitives (reusable everywhere)
    Button.jsx          CTA token driven — change --color-cta in index.css
    Section.jsx         section shell (overflow-x-clip, site-container)
    dialog.jsx          shadcn Dialog (Radix) — powers all modals
  layout/
    AppShell.jsx        'use client' shell — background, nav, footer, modal state
    VisitorCounter.jsx  live counter (rpc record_visit + Realtime)
    SupportModal.jsx    support modal → RLS-guarded insert into "Inquiry"
  sections/             one component per page section
data/                   ALL page content lives here — edit text without touching JSX
lib/supabase.js         THE ONLY backend layer — Supabase client, rpc, admin API
styles/index.css        Tailwind v4 @theme tokens + glass utilities
                        (CTA colors: --color-cta / --color-cta-hover)
```

**Server/Client split:** only components with interactivity carry `'use client'`.
Everything else renders on the server — the page is fully static-prerendered.

### Supabase (`supabase/`)

| Piece | What it does |
| --- | --- |
| `schema.sql` | RLS policies on `"SiteVisit"`, `"DailyStats"`, `"SeenToken"`, `"Inquiry"`, `"Coordinator"` + `admin_users` allowlist |
| `record_visit(p_visitor, p_session)` | Security-definer rpc — atomic session/visitor dedup (SeenToken claims), upserts `SiteVisit` + `DailyStats`. Same honest semantics as the old API: 1 visit/session, 1 unique/browser, every ping = 1 pageview |
| `assign_inquiry_coordinator()` trigger | Auto-assigns every new inquiry to the active coordinator handling its category (oldest first) |
| Realtime publication | `SiteVisit` UPDATE events drive the live counter badge |
| `functions/inquiry-notify` (optional) | Edge Function — coordinator + sender emails (SMTP secrets) and webhook forwarding; deploy only if email dispatch is needed |

### Security model

- The **anon key is public** by design — everything it can touch is
  RLS-guarded: blind `INSERT` into `"Inquiry"` (payload constrained by
  `WITH CHECK`, workflow fields tamper-proof), `SELECT` on the aggregate
  `"SiteVisit"` row only. Dedup tokens and daily analytics are not
  client-accessible at all.
- The **admin dashboard** uses Supabase Auth (email + password). Reads and
  updates are gated by policies on the `admin_users` allowlist table —
  manage access with SQL, never shared keys:
  ```sql
  insert into admin_users (email) values ('admin@acropolis.in');
  ```
- **Never** expose `SUPABASE_SERVICE_ROLE_KEY` in the frontend or commit it.

## Deployment (Vercel + Supabase only)

| Variable | Where | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Vercel | canonical + sitemap + OG URLs — **must be the real domain** |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | from Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | public anon key (RLS-guarded) |
| `NEXT_PUBLIC_GA_ID` | Vercel | optional — GA4 loads only when set |

Checklist:

- [ ] `supabase/schema.sql` applied (re-runnable)
- [ ] Admin user created in Supabase Auth + added to `admin_users`
- [ ] Coordinators seeded in the `Coordinator` table (dashboard → Table Editor)
- [ ] Optional: `inquiry-notify` Edge Function deployed + Database Webhook wired
- [ ] Vercel env vars set → deploy → smoke test counter, support form, /admin login

### Updating content

Edit `frontend/src/data/*.js` only. **Changing the registration button color:**
edit `--color-cta` in `frontend/src/styles/index.css` (nothing else changes —
`--color-brand-violet` is the separate site-wide accent). **Adding a section:**
create `components/sections/Foo.jsx`, add data, compose in `app/page.jsx`.

### Registration & community

Registration runs on **Unstop**, community lives on the **WhatsApp Channel**.
Links are centralized in `frontend/src/data/site.js`.
