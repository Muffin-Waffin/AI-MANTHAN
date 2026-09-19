# AI Manthan 2026 — Hackathon Platform (MERN)

Monorepo for the AI Manthan 2026 national AI hackathon site, hosted at
Acropolis Institute of Technology & Research, Bypass Road, Square, Manglaya Sadak, Indore:

```
frontend/   Next.js 16 (React 19) + Tailwind CSS v4  → http://localhost:3000
backend/    NestJS 12 + Mongoose 9 (MongoDB)         → http://localhost:4000/api
build/      Original design reference (code.html, DESIGN.md, screen.png)

Routes:
  /                 Single-page site — all sections anchored (#overview, #tracks,
                    #faculty [Jury + Mentors + Faculty carousels], #team, …)
  /faculty/[slug]   Unified profile dossier (SSG, 13 pages — jury, mentors,
                    speakers, faculty leadership)
  /robots.txt       generated
  /sitemap.xml      generated (home + 13 profiles)
  404               styled not-found page (app/not-found.jsx)

People section (#faculty):
- Universal card design: photo/monogram zone + role pill + View Profile
- Horizontal carousels, 4 cards per row (desktop)
- See More advances one card, auto-disables ("End") at the last position
- Dots indicator shows current position; dots are clickable
- Left/right edge arrows, disabled at ends; drag/swipe with snap

Glassmorphism + motion layer:
- `glass` / `glass-strong` frosted surfaces on every card, navbar & modal
- `glass-hover` hover glow/lift + `sheen` shimmer sweep on cards
- `stagger-fade-up` hero entrance, `pulse-glow` on the prize card, animated nav underlines
- shadcn/ui Accordion powers the FAQ; Dialog scaffold available
```

The design is a **pixel-faithful port of `build/code.html`** — same Tailwind tokens
(brand violet `#7c3aed`, obsidian surfaces), same fonts (Plus Jakarta Sans + Space Mono),
same sections, spacing, and interactions.

## Quick start

```bash
# 1. Backend (terminal 1)
cd backend
cp .env.example .env        # optional — defaults work without MongoDB
npm install
npm run dev                 # API on http://localhost:4000/api

# 2. Frontend (terminal 2)
cd frontend
npm install
npm run dev                 # Site on http://localhost:3000
```

> **MongoDB optional:** the API runs fine without a local Mongo — inquiries fall back
> to in-memory logging (`source: "memory"`). Point `MONGODB_URI` in `backend/.env`
> at any MongoDB instance (local, Atlas, Docker) for real persistence.

## Architecture

### Frontend (`frontend/src`)

```
app/
  layout.jsx          Root layout — fonts, metadata, global CSS
  page.jsx            Page composition — sections in scroll order
components/
  seo/                EventJsonLd.jsx — schema.org Event structured data
  ui/                 Design-system primitives (reusable everywhere)
    Icon.jsx            Material Symbols wrapper
    Button.jsx          polymorphic a/button — primary | glass | white | ghost
    Badge.jsx           accent chips + accent color lookup
    accordion.jsx       shadcn Accordion (Radix) — used by FAQ
    card.jsx / dialog.jsx  shadcn scaffolds (Radix)
    Section.jsx         section shell + header row
    SectionHeading.jsx  eyebrow + title + body block
  layout/
    AppShell.jsx        'use client' shell — background, nav, footer, modal state
    Navbar.jsx          floating frosted nav
    Footer.jsx          link columns + contact
    ParticleBackground.jsx  canvas particle field (mouse-reactive) + glow orbs
    SupportModal.jsx    support modal → POSTs to NestJS /api/support
  sections/             one component per page section (Hero, Tracks, Timeline,
                        Gallery, Prizes, Mentors, Faculty, Team, VenueFaq, …)
data/                   ALL page content lives here — edit text without touching JSX
  facultyDirectory.js     8 faculty members (drives /faculty + /faculty/[slug])
lib/api.js              single fetch layer to the backend
styles/index.css        Tailwind v4 @theme tokens (exact original values) + glass
                        utilities (glass, glass-strong, glass-hover, sheen) and
                        animation utilities (stagger-fade-up, pulse-glow, fade-up)
```

**Server/Client split:** only components with interactivity carry `'use client'`
(AppShell, Navbar, Hero countdown, Tracks filters, Mentors carousels, SupportModal).
Everything else renders on the server — the page is fully static-prerendered.

### SEO (built in)

- **Metadata API** — title templates, description, keywords, canonical URL,
  Open Graph + Twitter cards (`src/app/layout.jsx`)
- **`robots.txt`** and **`sitemap.xml`** — generated from `src/app/robots.js`
  and `src/app/sitemap.js`
- **JSON-LD Event schema** — rich results (dates, venue, organizer) via
  `components/seo/EventJsonLd.jsx`
- **next/image** — gallery & mentor photos are lazy-loaded, responsive, and
  served as WebP/AVIF automatically (`next.config.mjs` allows the remote host)
- Set `NEXT_PUBLIC_SITE_URL` to the production domain so canonical/OG/sitemap
  URLs resolve correctly.

### Responsiveness

The layout ships mobile-first and is verified at 3 breakpoints:

- **Mobile (< 768px)** — 4-col rhythm, single-column cards, hamburger menu in
  the navbar, stat strip in 2 columns, countdown grid intact
- **Tablet (768–1279px)** — 2-col card matrices, expanded gallery spans
- **Desktop (≥ 1280px)** — full 12-col HUD grid, inline nav links

Breakpoint tokens live in the Tailwind defaults; component grids use
`grid-cols-1 md:grid-cols-* lg:grid-cols-*` consistently.

**Updating content:** edit `src/data/*.js` only. **Changing theme:** edit the
`@theme` block in `src/styles/index.css`. **Adding a section:** create
`components/sections/Foo.jsx`, add data to `src/data/`, compose it in `app/page.jsx`.

### Backend (`backend/src`)

```
main.ts                    bootstrap — CORS, global /api prefix, validation pipe
app.module.ts              root module
config/database.ts         graceful Mongo connection (fail-fast, never crashes)
health/health.controller   GET /api/health
support/
  support.controller       POST /api/support + stats + admin queue/coordinator APIs
  support.dto              class-validator rules (query + feedback kinds, rating)
  support.service          persists to MongoDB (inquiry.model) with fallback
  routing.service          auto-assigns each inquiry to the category's student
                           coordinator → email (SMTP/nodemailer) + webhook,
                           then stamps the assignment on the ticket
  coordinator.model        category-wise student coordinator directory
  inquiry.model            tickets: kind (query/feedback), rating, assignment,
                           status workflow (open → in-progress → resolved)
scripts/seed-coordinators.js  idempotent coordinator seed (npm run seed:coordinators)
```

Endpoints:

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | — | liveness + DB status |
| POST | `/api/support` | — | query/feedback submit (auto-routed to coordinator) |
| GET | `/api/support/stats` | — | live open/in-progress/resolved/avg-rating counts |
| GET | `/api/admin/inquiries` | x-admin-key | queue (filter by status/kind) |
| PATCH | `/api/admin/inquiries/:id` | x-admin-key | status + resolution note |
| GET | `/api/admin/coordinators` | x-admin-key | coordinator directory |
| POST | `/api/admin/coordinators` | x-admin-key | add coordinator |

**How routing works:** each inquiry is matched against active coordinators that
handle its category → the coordinator gets an **email** (SMTP configured) and/or
a **webhook POST** (WhatsApp/Slack bridge) with the full ticket, and the stored
ticket records who it went to (`assignedTo` + `notifiedVia`). Routing failure
never loses the ticket — it stays in the admin queue.

The frontend talks to the API via `NEXT_PUBLIC_API_URL` (default
`http://localhost:4000/api`); CORS is pre-configured for `localhost:3000`.

## Deployment

### Required environment variables (production)

| Variable | Where | Why |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | frontend | canonical + sitemap + OG URLs — **must be the real domain** |
| `NEXT_PUBLIC_API_URL` | frontend | API base (e.g. `https://api.your-domain.com/api`) |
| `NEXT_PUBLIC_GA_ID` | frontend | optional — GA4 loads only when set |
| `CORS_ORIGINS` | backend | your frontend domain (comma-separated) |
| `MONGODB_URI` | backend | real Mongo (Atlas) — **in-memory fallback loses inquiries on restart** |
| `ADMIN_KEY` | backend | long random string — unlocks admin queue/coordinator APIs |
| `SMTP_HOST` | backend | e.g. `smtp.gmail.com` — coordinator email dispatch |
| `SMTP_PORT` | backend | `587` (STARTTLS) or `465` (implicit TLS) |
| `SMTP_USER` / `SMTP_PASS` | backend | mailbox credentials — **use an app password, never the real one** |
| `MAIL_FROM` | backend | `AI Manthan Support <support@your-domain>` |

#### Pre-deploy env checklist

- [ ] `NEXT_PUBLIC_SITE_URL=https://<real-domain>` set on the frontend host
- [ ] `NEXT_PUBLIC_API_URL` points at the API domain (https)
- [ ] `MONGODB_URI` → Atlas SRV URI; `GET /api/health` then reports `"database":"connected"`
- [ ] `ADMIN_KEY` generated (`openssl rand -hex 24`) and stored in the team vault
- [ ] `SMTP_*` set; test mail delivered by submitting one query per category
- [ ] Coordinators seeded with **real names/emails/WhatsApp**: `npm run seed:coordinators`
      (edit `backend/scripts/seed-coordinators.js` first — placeholders ship by default)
- [ ] `CORS_ORIGINS` lists only the real frontend domain
- [ ] `NEXT_PUBLIC_GA_ID` set if analytics wanted
- [ ] Smoke test green: `BASE_URL=... API_URL=... bash frontend/scripts/smoke-test.sh`

### Hardening included

- Security headers on every route (X-Frame-Options DENY, nosniff, HSTS,
  Referrer-Policy, Permissions-Policy) — `next.config.mjs`
- Rate limiting: 30 req/min global, 5 req/min on `POST /api/support`
  (`@nestjs/throttler`) + 16 KB body cap + `@MaxLength(2000)` on messages
- `GET /api/health` reports `database: connected | fallback-memory`
  — wire this into uptime monitoring

### Registration & community

Registration runs on **Unstop**, community lives on the **WhatsApp Channel**.
Links are centralized in `frontend/src/data/site.js`:

- `site.links.register` — Unstop listing (⚠️ verify the listing URL is live)
- `site.community.href` — WhatsApp channel (`whatsapp.com/channel/0029Vb…` — already wired)
- Sponsor/partner names are on the reference board; drop real logos into
  `frontend/public/logos/` and set `logo: '/logos/<brand>.png'` per item to
  upgrade wordmark cards to logo cards

### After deploying

```bash
BASE_URL=https://your-domain.com API_URL=https://api.your-domain.com/api \
  bash frontend/scripts/smoke-test.sh
```

Then: submit sitemap in Google Search Console, verify the WhatsApp/Twitter
link preview, and confirm inquiries land in MongoDB.
